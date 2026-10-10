/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - MAIN APPLICATION ORCHESTRATOR
   ========================================================== */

class DigitalTwinApp {
  constructor() {
    this.apiBaseUrl = (window.location.protocol.startsWith('http'))
      ? window.location.origin
      : 'http://localhost:9090';

    this.stations = [];
    this.telemetryList = [];
    this.activeStationId = 'NODE-METRO-01';
    this.alerts = [];
    this.userLocationData = null;
    this.tempUnit = 'C'; // 'C' or 'F'

    this.canvasEngine = null;
    this.locationManager = null;
    this.authManager = null;
    this.aqiChart = null;
    this.tempChart = null;

    this.pollingTimer = null;

    this.init();
  }

  async init() {
    console.log('>>> Initializing Digital Environment Twin System...');

    // Initialize sub-modules
    this.canvasEngine = new TwinCanvasEngine('twinCanvas');
    this.locationManager = new TwinLocationManager(this.apiBaseUrl);
    this.authManager = new TwinAuthManager(this.apiBaseUrl);

    // Initialize charts (Advanced Twin)
    this.aqiChart = new TwinTrendChart('chartAqiHistory', {
      lineColor: '#00f2fe',
      fillColor: 'rgba(0, 242, 254, 0.15)',
      min: 20,
      max: 250,
      unit: 'AQI'
    });

    this.tempChart = new TwinTrendChart('chartTempHistory', {
      lineColor: '#f59e0b',
      fillColor: 'rgba(245, 158, 11, 0.15)',
      min: 15,
      max: 45,
      unit: '°C'
    });

    // Initialize charts (Citizen Dashboard)
    this.citizenAqiChart = new TwinTrendChart('chartAqiHistoryCitizen', {
      lineColor: '#00f2fe',
      fillColor: 'rgba(0, 242, 254, 0.15)',
      min: 20,
      max: 250,
      unit: 'AQI'
    });

    this.citizenTempChart = new TwinTrendChart('chartTempHistoryCitizen', {
      lineColor: '#f59e0b',
      fillColor: 'rgba(245, 158, 11, 0.15)',
      min: 15,
      max: 45,
      unit: '°C'
    });

    // Initialize Product Suite (Landing Page & Citizen Portal)
    if (window.AetherisProductSuite) {
      this.productSuite = new AetherisProductSuite(this);
    }

    this.bindEvents();
    await this.fetchInitialData();
    this.startLiveTelemetryPolling();
  }

  bindEvents() {
    // Canvas View Mode Toggles
    const btnDispersion = document.getElementById('viewModeDispersion');
    const btnThermal = document.getElementById('viewModeThermal');
    const btnRadar = document.getElementById('viewModeRadar');

    const setModeActive = (activeBtn, mode) => {
      [btnDispersion, btnThermal, btnRadar].forEach(b => b && b.classList.remove('active'));
      if (activeBtn) activeBtn.classList.add('active');
      if (this.canvasEngine) this.canvasEngine.setViewMode(mode);
    };

    if (btnDispersion) btnDispersion.addEventListener('click', () => setModeActive(btnDispersion, 'dispersion'));
    if (btnThermal) btnThermal.addEventListener('click', () => setModeActive(btnThermal, 'thermal'));
    if (btnRadar) btnRadar.addEventListener('click', () => setModeActive(btnRadar, 'radar'));

    // Global Custom Event: Station Selected from Canvas
    window.addEventListener('stationSelected', (e) => {
      if (e.detail && e.detail.stationId) {
        this.selectStation(e.detail.stationId);
      }
    });

    // Global Custom Event: User Location Updated
    window.addEventListener('userLocationUpdated', (e) => {
      if (e.detail) {
        this.userLocationData = {
          lat: e.detail.coords.lat,
          lng: e.detail.coords.lng,
          nearestId: e.detail.nearest.stationTelemetry.stationId,
          distanceFormatted: e.detail.nearest.distanceFormatted
        };
        // Auto select nearest station
        this.selectStation(this.userLocationData.nearestId);
        this.updateCanvasData();
      }
    });

    // Temperature Unit Toggle
    const tempToggle = document.getElementById('tempUnitToggle');
    if (tempToggle) {
      tempToggle.addEventListener('click', () => {
        this.tempUnit = this.tempUnit === 'C' ? 'F' : 'C';
        tempToggle.textContent = `°${this.tempUnit}`;
        this.updateDashboardMetrics();
      });
    }

    // Simulation Trigger Buttons
    document.querySelectorAll('.btn-scenario').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const scenario = btn.dataset.scenario;
        await this.triggerSimulationScenario(scenario);
      });
    });

    // Add Sensor Node Modal
    const btnOpenAddNode = document.getElementById('btnOpenAddNode');
    const modalAddNode = document.getElementById('addNodeModal');
    const closeAddNode = document.getElementById('closeAddNodeModal');
    const formAddNode = document.getElementById('formAddNode');

    if (btnOpenAddNode && modalAddNode) {
      btnOpenAddNode.addEventListener('click', () => {
        if (!this.authManager.isAuthenticated()) {
          this.showToast('Please Sign In with Operator or Admin credentials to register new virtual simulation nodes.', 'error');
          this.authManager.showModal();
          return;
        }
        modalAddNode.classList.add('open');
      });
    }

    if (closeAddNode && modalAddNode) {
      closeAddNode.addEventListener('click', () => modalAddNode.classList.remove('open'));
    }

    if (formAddNode) {
      formAddNode.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleCreateStation();
      });
    }

    // Export Audit Report
    const btnExport = document.getElementById('btnExportReport');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.exportTelemetryReport());
    }
  }

  async fetchInitialData() {
    try {
      // 1. Fetch stations
      const stationsRes = await fetch(`${this.apiBaseUrl}/api/stations`);
      if (stationsRes.ok) {
        this.stations = await stationsRes.json();
      }

      // 2. Fetch live telemetry
      const telRes = await fetch(`${this.apiBaseUrl}/api/telemetry/live`);
      if (telRes.ok) {
        this.telemetryList = await telRes.json();
      }

      // 3. Fetch alerts
      const alertsRes = await fetch(`${this.apiBaseUrl}/api/alerts`);
      if (alertsRes.ok) {
        this.alerts = await alertsRes.json();
      }

      this.renderStationsList();
      this.renderAlertsList();
      this.updateDashboardMetrics();
      this.updateCanvasData();
      await this.loadStationChartHistory(this.activeStationId);
    } catch (err) {
      console.warn('Backend loading or offline, booting fallback telemetry simulation:', err);
      this.setupFallbackData();
    }
  }

  setupFallbackData() {
    this.stations = [
      { id: 'NODE-METRO-01', name: 'Metro Central Hub Station', zoneType: 'URBAN_CORE', latitude: 28.6139, longitude: 77.2090, elevation: 216.0, status: 'ACTIVE' },
      { id: 'NODE-INDUS-02', name: 'Industrial Sector 62 Park', zoneType: 'INDUSTRIAL_PARK', latitude: 28.5355, longitude: 77.3910, elevation: 198.0, status: 'ACTIVE' },
      { id: 'NODE-FOREST-03', name: 'North Ridge Botanical Bio-Reserve', zoneType: 'FOREST_RESERVE', latitude: 28.6850, longitude: 77.2150, elevation: 235.0, status: 'ACTIVE' },
      { id: 'NODE-VALLEY-04', name: 'Greenfield Suburban Microclimate', zoneType: 'SUBURBAN_VALLEY', latitude: 28.4595, longitude: 77.0266, elevation: 220.0, status: 'ACTIVE' },
      { id: 'NODE-COAST-05', name: 'Riverside Basin Wetland Station', zoneType: 'COASTAL_BASIN', latitude: 28.6400, longitude: 77.2600, elevation: 205.0, status: 'ACTIVE' }
    ];

    this.telemetryList = this.stations.map((s, i) => {
      const aqi = [142, 215, 46, 85, 92][i];
      return {
        stationId: s.id,
        stationName: s.name,
        zoneType: s.zoneType,
        latitude: s.latitude,
        longitude: s.longitude,
        elevation: s.elevation,
        status: 'ACTIVE',
        aqi: aqi,
        pm25: Math.round(aqi * 0.48 * 10) / 10,
        pm10: Math.round(aqi * 0.9 * 10) / 10,
        temperature: [29.5, 32.8, 24.2, 27.1, 26.4][i],
        humidity: [48.0, 42.0, 68.0, 54.0, 72.0][i],
        co2: [540.0, 720.0, 395.0, 460.0, 430.0][i],
        noiseDb: [68.5, 74.2, 41.0, 52.0, 49.0][i],
        uvIndex: 6.0,
        windSpeed: 7.2,
        windDirection: 'NW',
        statusSummary: 'Optimal Digital Twin Telemetry',
        aqiColor: aqi <= 50 ? '#10b981' : (aqi <= 100 ? '#f59e0b' : (aqi <= 150 ? '#f97316' : '#ef4444')),
        aqiCategory: aqi <= 50 ? 'Good' : (aqi <= 100 ? 'Moderate' : 'Unhealthy'),
        recordedAt: new Date().toISOString()
      };
    });

    this.alerts = [
      { id: 1, stationId: 'NODE-INDUS-02', severity: 'CRITICAL', title: 'Particulate AQI Spike Warning', message: 'PM2.5 exceeds permissible threshold (110.8 ug/m3). Industrial scrubbing active.', acknowledged: false },
      { id: 2, stationId: 'NODE-METRO-01', severity: 'WARNING', title: 'Acoustic Pollution Advisory', message: 'Traffic noise sustained at 68.5 dB during peak transit window.', acknowledged: false }
    ];

    this.renderStationsList();
    this.renderAlertsList();
    this.updateDashboardMetrics();
    this.updateCanvasData();
    this.loadStationChartHistory(this.activeStationId);
  }

  startLiveTelemetryPolling() {
    if (this.pollingTimer) clearInterval(this.pollingTimer);

    this.pollingTimer = setInterval(async () => {
      try {
        const res = await fetch(`${this.apiBaseUrl}/api/telemetry/live`);
        if (res.ok) {
          this.telemetryList = await res.json();
          this.updateDashboardMetrics();
          this.updateCanvasData();
          this.renderStationsList();
        }

        const alertsRes = await fetch(`${this.apiBaseUrl}/api/alerts?unacknowledgedOnly=true`);
        if (alertsRes.ok) {
          this.alerts = await alertsRes.json();
          this.renderAlertsList();
        }
      } catch (e) {
        // Micro variations in local simulation fallback
        this.simulateLocalMicroFluctuation();
      }
    }, 3500);
  }

  simulateLocalMicroFluctuation() {
    this.telemetryList.forEach(t => {
      const deltaAqi = Math.floor(Math.random() * 5) - 2;
      t.aqi = Math.max(20, Math.min(450, t.aqi + deltaAqi));
      t.temperature = Math.round((t.temperature + (Math.random() * 0.4 - 0.2)) * 10) / 10;
      t.humidity = Math.round((t.humidity + (Math.random() * 0.8 - 0.4)) * 10) / 10;
    });
    this.updateDashboardMetrics();
    this.updateCanvasData();
    this.renderStationsList();
  }

  selectStation(stationId) {
    this.activeStationId = stationId;
    this.renderStationsList();
    this.updateDashboardMetrics();
    this.updateCanvasData();
    this.loadStationChartHistory(stationId);

    const activeNode = this.telemetryList.find(t => t.stationId === stationId);
    if (activeNode) {
      this.showToast(`Active Twin Node: ${activeNode.stationName}`, 'info');
    }
  }

  async loadStationChartHistory(stationId) {
    const active = this.telemetryList.find(t => t.stationId === stationId) || this.telemetryList[0];
    const baseAqi = active ? active.aqi : 80;
    const baseTemp = active ? active.temperature : 26;

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/telemetry/history/${stationId}?limit=25`);
      if (res.ok) {
        const historyRecords = await res.json();
        if (historyRecords && historyRecords.length > 0) {
          if (this.aqiChart) this.aqiChart.loadHistory(historyRecords, 'aqi');
          if (this.tempChart) this.tempChart.loadHistory(historyRecords, 'temperature');
          if (this.citizenAqiChart) this.citizenAqiChart.loadHistory(historyRecords, 'aqi');
          if (this.citizenTempChart) this.citizenTempChart.loadHistory(historyRecords, 'temperature');
          return;
        }
      }
    } catch (e) {
      // Offline fallback
    }

    if (this.aqiChart) this.aqiChart.seedFallbackPoints(baseAqi);
    if (this.tempChart) this.tempChart.seedFallbackPoints(baseTemp);
    if (this.citizenAqiChart) this.citizenAqiChart.seedFallbackPoints(baseAqi);
    if (this.citizenTempChart) this.citizenTempChart.seedFallbackPoints(baseTemp);
  }

  resizeCharts() {
    if (this.aqiChart) this.aqiChart.resize();
    if (this.tempChart) this.tempChart.resize();
    if (this.citizenAqiChart) this.citizenAqiChart.resize();
    if (this.citizenTempChart) this.citizenTempChart.resize();
  }

  updateDashboardMetrics() {
    const active = this.telemetryList.find(t => t.stationId === this.activeStationId) || this.telemetryList[0];
    if (!active) return;

    // Header strip quick stats
    const stripAqi = document.getElementById('stripAvgAqi');
    if (stripAqi) {
      const avgAqi = Math.round(this.telemetryList.reduce((acc, t) => acc + (t.aqi || 0), 0) / (this.telemetryList.length || 1));
      stripAqi.textContent = `SYSTEM AQI: ${avgAqi}`;
    }

    // Active station name and zone
    const lblStationName = document.getElementById('activeStationName');
    const lblZoneType = document.getElementById('activeZoneType');
    const lblStationId = document.getElementById('activeStationId');

    if (lblStationName) lblStationName.textContent = active.stationName;
    if (lblZoneType) lblZoneType.textContent = (active.zoneType || '').replace(/_/g, ' ');
    if (lblStationId) lblStationId.textContent = active.stationId;

    // AQI Big Dial Card
    const valAqi = document.getElementById('valAqi');
    const lblAqiCategory = document.getElementById('lblAqiCategory');
    const cardAqi = document.getElementById('cardAqi');

    if (valAqi) {
      valAqi.textContent = active.aqi;
      valAqi.style.color = active.aqiColor || '#00f2fe';
    }
    if (lblAqiCategory) {
      lblAqiCategory.textContent = active.aqiCategory || 'Satisfactory';
      lblAqiCategory.style.color = active.aqiColor || '#00f2fe';
    }
    if (cardAqi) {
      cardAqi.style.borderColor = active.aqiColor || 'var(--border-glow)';
    }

    // Temperature (toggle C / F)
    const valTemp = document.getElementById('valTemperature');
    const unitTemp = document.getElementById('unitTemperature');
    if (valTemp && unitTemp) {
      if (this.tempUnit === 'F') {
        const fVal = Math.round((active.temperature * 1.8 + 32) * 10) / 10;
        valTemp.textContent = fVal;
        unitTemp.textContent = '°F';
      } else {
        valTemp.textContent = active.temperature;
        unitTemp.textContent = '°C';
      }
    }

    // Humidity
    const valHum = document.getElementById('valHumidity');
    if (valHum) valHum.textContent = active.humidity;

    // CO2
    const valCo2 = document.getElementById('valCo2');
    if (valCo2) valCo2.textContent = Math.round(active.co2);

    // Particulate Matters PM2.5 & PM10
    const valPm25 = document.getElementById('valPm25');
    const valPm10 = document.getElementById('valPm10');
    if (valPm25) valPm25.textContent = active.pm25;
    if (valPm10) valPm10.textContent = active.pm10;

    // Noise Level
    const valNoise = document.getElementById('valNoise');
    if (valNoise) valNoise.textContent = active.noiseDb;

    // Wind & UV
    const valWind = document.getElementById('valWind');
    const valUv = document.getElementById('valUv');
    if (valWind) valWind.textContent = `${active.windSpeed} km/h (${active.windDirection || 'NE'})`;
    if (valUv) valUv.textContent = active.uvIndex;

    // Add points to trend charts
    if (this.aqiChart) this.aqiChart.addPoint(active.aqi);
    if (this.tempChart) this.tempChart.addPoint(active.temperature);
    if (this.citizenAqiChart) this.citizenAqiChart.addPoint(active.aqi);
    if (this.citizenTempChart) this.citizenTempChart.addPoint(active.temperature);

    // Update Floating Canvas Tooltip HUD
    const hudNodeName = document.getElementById('hudNodeName');
    const hudNodeAqi = document.getElementById('hudNodeAqi');
    const hudAqiBox = document.getElementById('hudAqiBox');
    const hudNodeMetrics = document.getElementById('hudNodeMetrics');

    if (hudNodeName) hudNodeName.textContent = active.stationName;
    if (hudNodeAqi) hudNodeAqi.textContent = active.aqi;
    if (hudAqiBox) hudAqiBox.style.background = active.aqiColor || '#00f2fe';
    if (hudNodeMetrics) {
      hudNodeMetrics.textContent = `${active.temperature}°C • ${active.humidity}% Hum • ${active.pm25} µg/m³ PM2.5`;
    }

    // Update Citizen Dashboard & Landing Preview
    if (this.productSuite) {
      this.productSuite.updateCitizenDashboard();
      this.productSuite.updateLandingPreview();
    }
  }

  updateCanvasData() {
    if (this.canvasEngine) {
      this.canvasEngine.updateData(this.telemetryList, this.activeStationId, this.userLocationData);
    }
  }

  renderStationsList() {
    const listGroup = document.getElementById('stationListGroup');
    if (!listGroup) return;

    listGroup.innerHTML = '';
    this.telemetryList.forEach(t => {
      const isSelected = t.stationId === this.activeStationId;
      const el = document.createElement('div');
      el.className = `station-item ${isSelected ? 'active' : ''}`;
      el.onclick = () => this.selectStation(t.stationId);

      el.innerHTML = `
        <div class="station-info-meta">
          <div class="station-item-name" style="display:flex; align-items:center; gap:0.4rem;">
            <span class="pulse-indicator" style="background:${t.aqiColor || '#10b981'}; box-shadow:0 0 8px ${t.aqiColor || '#10b981'};"></span>
            ${t.stationName}
          </div>
          <div class="station-item-sub">${(t.zoneType || '').replace(/_/g, ' ')} • ${t.temperature}°C</div>
        </div>
        <div class="station-item-badge">
          <span class="badge-aqi" style="background:${t.aqiColor || '#00f2fe'}; color:#060911;">${t.aqi}</span>
          <span style="font-size:0.68rem; color:var(--text-dim); margin-top:2px;">AQI</span>
        </div>
      `;
      listGroup.appendChild(el);
    });
  }

  renderAlertsList() {
    const container = document.getElementById('alertsListContainer');
    const badgeCount = document.getElementById('alertsCountBadge');
    if (!container) return;

    const unack = this.alerts.filter(a => !a.acknowledged);
    if (badgeCount) badgeCount.textContent = unack.length;

    if (unack.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:1.5rem 0.5rem; color:var(--text-dim); font-size:0.8rem;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:0.5rem; stroke:var(--emerald);">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div>All Environmental Thresholds Nominal</div>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    unack.forEach(a => {
      const item = document.createElement('div');
      item.className = `alert-item ${a.severity.toLowerCase()}`;
      item.innerHTML = `
        <div style="flex:1;">
          <div class="alert-title">${a.title}</div>
          <div class="alert-msg">${a.message}</div>
        </div>
        <button onclick="window.TwinApp.acknowledgeAlert(${a.id})" style="background:transparent; border:1px solid var(--border-subtle); color:var(--text-muted); border-radius:4px; padding:0.2rem 0.5rem; font-size:0.7rem; cursor:pointer;">
          Ack
        </button>
      `;
      container.appendChild(item);
    });
  }

  async acknowledgeAlert(alertId) {
    try {
      await fetch(`${this.apiBaseUrl}/api/alerts/${alertId}/acknowledge`, { method: 'POST' });
    } catch (e) {}

    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.acknowledged = true;
    this.renderAlertsList();
    this.showToast('Hazard alert acknowledged.', 'info');
  }

  async triggerSimulationScenario(scenario) {
    if (!this.authManager.isAuthenticated()) {
      this.showToast('Please Sign In to inject environmental digital twin scenarios.', 'error');
      this.authManager.showModal();
      return;
    }

    this.showToast(`Injecting Scenario: ${scenario}...`, 'info');

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/simulation/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: 'ALL',
          scenario: scenario,
          intensity: 1.5,
          durationMinutes: 20
        })
      });

      if (res.ok) {
        const data = await res.json();
        this.showToast(`Scenario Applied: ${data.scenario} active across all twin nodes`, 'success');
        // Refresh telemetry immediately
        setTimeout(() => this.fetchInitialData(), 400);
      }
    } catch (e) {
      // Offline fallback simulation
      this.telemetryList.forEach(t => {
        if (scenario === 'HEATWAVE') {
          t.temperature += 6.5;
          t.humidity = Math.max(15, t.humidity - 14);
          t.aqi += 45;
        } else if (scenario === 'INDUSTRIAL_EMISSION') {
          if (t.zoneType === 'INDUSTRIAL_PARK') t.aqi += 110;
          else t.aqi += 40;
        } else if (scenario === 'RAIN_CLEANSING') {
          t.aqi = Math.max(25, Math.round(t.aqi * 0.45));
          t.humidity = Math.min(95, t.humidity + 25);
          t.temperature -= 4.0;
        } else {
          t.aqi = 85;
          t.temperature = 27.5;
        }
      });
      this.updateDashboardMetrics();
      this.updateCanvasData();
      this.showToast(`Offline Simulation Applied: ${scenario}`, 'success');
    }
  }

  async handleCreateStation() {
    const id = document.getElementById('newStationId').value.trim();
    const name = document.getElementById('newStationName').value.trim();
    const zoneType = document.getElementById('newStationZone').value;
    const lat = parseFloat(document.getElementById('newStationLat').value);
    const lng = parseFloat(document.getElementById('newStationLng').value);
    const desc = document.getElementById('newStationDesc').value.trim();

    const payload = {
      id: id || `NODE-${Date.now() % 10000}`,
      name: name,
      zoneType: zoneType,
      latitude: lat,
      longitude: lng,
      elevation: 210.0,
      status: 'ACTIVE',
      description: desc
    };

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.showToast(`Virtual Simulation Node '${name}' registered successfully!`, 'success');
        document.getElementById('addNodeModal').classList.remove('open');
        await this.fetchInitialData();
      }
    } catch (err) {
      // Fallback
      this.stations.push(payload);
      this.setupFallbackData();
      this.showToast(`Node '${name}' saved locally!`, 'success');
      document.getElementById('addNodeModal').classList.remove('open');
    }
  }

  exportTelemetryReport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      reportTimestamp: new Date().toISOString(),
      twinSystem: "Digital Environment Twin System v1.0",
      userLocation: this.userLocationData,
      activeStationsCount: this.stations.length,
      stations: this.stations,
      latestTelemetry: this.telemetryList,
      activeAlerts: this.alerts
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `environment_twin_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.showToast('Environmental Audit Report exported (JSON).', 'success');
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="pulse-indicator ${type === 'error' ? 'alert' : ''}"></div>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.TwinApp = new DigitalTwinApp();
});
