/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - GEOLOCATION POPUP & PAIRING
   ========================================================== */

class TwinLocationManager {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.userCoords = null; // { lat, lng }
    this.nearestData = null;

    this.modal = document.getElementById('locationModal');
    this.banner = document.getElementById('locationBanner');
    this.badge = document.getElementById('locationBadge');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkStoredLocation();
  }

  bindEvents() {
    // Buttons to open location popup modal
    const openBtn = document.getElementById('btnEnableLocation');
    const badgeBtn = document.getElementById('locationBadge');
    const bannerBtn = document.getElementById('btnBannerPairLocation');
    const closeBtn = document.getElementById('closeLocationModal');
    const dismissBtn = document.getElementById('btnDismissLocation');
    const gpsBtn = document.getElementById('btnRequestGps');
    const presetSelect = document.getElementById('selectPresetZone');

    if (openBtn) openBtn.addEventListener('click', () => this.showModal());
    if (badgeBtn) badgeBtn.addEventListener('click', () => this.showModal());
    if (bannerBtn) bannerBtn.addEventListener('click', () => this.showModal());
    if (closeBtn) closeBtn.addEventListener('click', () => this.hideModal());
    if (dismissBtn) dismissBtn.addEventListener('click', () => this.hideModal());

    if (gpsBtn) {
      gpsBtn.addEventListener('click', () => this.requestBrowserGeolocation());
    }

    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          const [lat, lng] = e.target.value.split(',').map(Number);
          this.applyCoordinates(lat, lng, 'Preset Digital Twin Zone');
        }
      });
    }

    // Modal click outside to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.hideModal();
      });
    }
  }

  showModal() {
    if (this.modal) {
      this.modal.classList.add('open');
      const radar = document.getElementById('modalRadarBeam');
      if (radar) radar.style.animationPlayState = 'running';
    }
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.remove('open');
    }
  }

  checkStoredLocation() {
    const saved = localStorage.getItem('twin_user_coords');
    if (saved) {
      try {
        const { lat, lng, name } = JSON.parse(saved);
        this.applyCoordinates(lat, lng, name || 'Stored Device Coordinates', false);
      } catch (e) {
        // Show modal on initial visit if no location stored
        setTimeout(() => this.showModal(), 800);
      }
    } else {
      // Auto pop on screen after 800ms
      setTimeout(() => this.showModal(), 800);
    }
  }

  requestBrowserGeolocation() {
    const statusMsg = document.getElementById('locationStatusMsg');
    if (statusMsg) {
      statusMsg.innerHTML = '<span style="color:var(--cyan-bright)">Locating device via GPS sensors...</span>';
    }

    if (!navigator.geolocation) {
      if (statusMsg) {
        statusMsg.innerHTML = '<span style="color:var(--rose)">Geolocation is not supported by your browser. Using simulated zone.</span>';
      }
      this.applyCoordinates(28.6139, 77.2090, 'Default Metro Core');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.applyCoordinates(lat, lng, 'Device GPS Coordinates');
      },
      (error) => {
        console.warn('Geolocation prompt error or denied:', error.message);
        if (statusMsg) {
          statusMsg.innerHTML = `<span style="color:var(--amber)">GPS permission unavailable (${error.message}). Falling back to Metro Zone.</span>`;
        }
        // Fallback gracefully so digital twin works seamlessly
        setTimeout(() => {
          this.applyCoordinates(28.6139, 77.2090, 'Simulated Metro Hub');
        }, 1200);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  async applyCoordinates(lat, lng, label = 'Local Coordinates', showToast = true) {
    this.userCoords = { lat, lng, label };
    localStorage.setItem('twin_user_coords', JSON.stringify({ lat, lng, name: label }));

    try {
      // 1. Fetch nearest station from backend
      const res = await fetch(`${this.apiBaseUrl}/api/stations/nearest?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        this.nearestData = data;

        // 2. Update UI
        this.updateUiWithNearest(data);

        // 3. Dispatch global event for Canvas & Dashboard
        window.dispatchEvent(new CustomEvent('userLocationUpdated', {
          detail: {
            coords: this.userCoords,
            nearest: data
          }
        }));

        if (showToast && window.TwinApp) {
          window.TwinApp.showToast(`Location Synchronized! Paired with ${data.stationTelemetry.stationName} (${data.distanceFormatted} away)`, 'success');
        }

        // 4. Also inform backend user profile if token available
        const token = localStorage.getItem('twin_auth_token');
        if (token) {
          fetch(`${this.apiBaseUrl}/api/auth/update-location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ latitude: lat, longitude: lng })
          }).catch(() => {});
        }

        this.hideModal();
      }
    } catch (err) {
      console.error('Failed to sync nearest station:', err);
    }
  }

  updateUiWithNearest(data) {
    // Header location badge
    if (this.badge) {
      this.badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>
        <span>${data.stationTelemetry.stationName.split(' ')[0]} (${data.distanceFormatted})</span>
      `;
      this.badge.title = `Paired with ${data.stationTelemetry.stationName} | Bearing: ${data.cardinalDirection} (${data.bearingDegrees}°)`;
    }

    // Top banner
    if (this.banner) {
      this.banner.innerHTML = `
        <div class="location-banner-text">
          <div class="title" style="display:flex; align-items:center; gap:0.5rem;">
            <span class="pulse-indicator"></span>
            Location Paired: ${data.stationTelemetry.stationName}
            <span style="font-size:0.75rem; color:var(--cyan-bright); border:1px solid var(--border-glow); padding:0.1rem 0.4rem; border-radius:4px;">
              ${data.distanceFormatted} • ${data.cardinalDirection}
            </span>
          </div>
          <div class="sub">${data.microclimateAssessment}</div>
        </div>
        <button class="location-banner-btn" id="btnBannerPairLocation">Change Zone</button>
      `;

      // Re-attach event listener to new button
      const newBtn = document.getElementById('btnBannerPairLocation');
      if (newBtn) newBtn.addEventListener('click', () => this.showModal());
    }
  }
}

window.TwinLocationManager = TwinLocationManager;
