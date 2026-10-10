/* ==========================================================
   AETHERIS TACTICAL HUD & TELEMETRY CONTROLLER
   High-Tech Aerospace Telemetry, Web Audio SFX & Cyber Effects
   ========================================================== */

class AetherisTacticalHud {
  constructor() {
    this.audioEnabled = false;
    this.cyberMatrixEnabled = false;
    this.audioCtx = null;
    this.clockInterval = null;
    this.init();
  }

  init() {
    this.initClock();
    this.bindControls();
    this.setupAudioListeners();
  }

  /* ----------------------------------------------------------
     1. HIGH-PRECISION MISSION CLOCK & TELEMETRY STREAM
     ---------------------------------------------------------- */
  initClock() {
    const elUtc = document.getElementById('hudClockUtc');
    const elLocal = document.getElementById('hudClockLocal');
    const elNs = document.getElementById('hudClockNs');
    const elFps = document.getElementById('hudSimFps');
    const elIngest = document.getElementById('hudIngestRate');
    const elGrid = document.getElementById('hudGridZone');

    let tickCount = 0;

    const updateTime = () => {
      const now = new Date();
      tickCount++;
      
      // UTC time
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSecs = String(now.getUTCSeconds()).padStart(2, '0');
      const utcMs = String(now.getUTCMilliseconds()).padStart(3, '0');
      
      // Local time
      const locHours = String(now.getHours()).padStart(2, '0');
      const locMins = String(now.getMinutes()).padStart(2, '0');
      const locSecs = String(now.getSeconds()).padStart(2, '0');

      if (elUtc) elUtc.textContent = `UTC ${utcHours}:${utcMins}:${utcSecs}.${utcMs}`;
      if (elLocal) elLocal.textContent = `LOCAL ${locHours}:${locMins}:${locSecs}`;
      if (elNs) {
        // High-frequency nanosecond visual counter
        const pseudoNs = Math.floor(Math.random() * 900 + 100);
        elNs.textContent = `.${pseudoNs}µs`;
      }

      // Live FPS & ingestion stream variance every ~1 second
      if (tickCount % 20 === 0) {
        if (elFps) {
          const fps = (59.8 + Math.random() * 0.4).toFixed(1);
          elFps.textContent = `${fps} NOMINAL`;
        }
        if (elIngest) {
          const rate = (2.75 + Math.random() * 0.15).toFixed(2);
          elIngest.textContent = `${rate} GB/S • AES-GCM`;
        }
      }
    };

    updateTime();
    this.clockInterval = setInterval(updateTime, 45);

    // Listen to stationSelected to update Grid Sector readout
    window.addEventListener('stationSelected', (e) => {
      if (e.detail && e.detail.stationId && elGrid) {
        elGrid.textContent = `${e.detail.stationId} (LINKED)`;
      }
    });
  }

  /* ----------------------------------------------------------
     2. SYNTHESIZED WEB AUDIO HIGH-TECH SOUND EFFECTS
     ---------------------------------------------------------- */
  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBeep(freq = 1200, type = 'sine', duration = 0.04, vol = 0.03) {
    if (!this.audioEnabled) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playActionSound(actionType) {
    if (!this.audioEnabled) return;
    switch (actionType) {
      case 'click':
        this.playBeep(1600, 'sine', 0.03, 0.03);
        break;
      case 'switch':
        this.playBeep(980, 'triangle', 0.05, 0.035);
        setTimeout(() => this.playBeep(1450, 'sine', 0.04, 0.03), 35);
        break;
      case 'alert':
        this.playBeep(880, 'sawtooth', 0.08, 0.03);
        setTimeout(() => this.playBeep(1100, 'sawtooth', 0.09, 0.03), 70);
        break;
      case 'confirm':
        this.playBeep(1200, 'sine', 0.04, 0.03);
        setTimeout(() => this.playBeep(1800, 'sine', 0.06, 0.035), 40);
        break;
      case 'hover':
        this.playBeep(2400, 'sine', 0.015, 0.008);
        break;
    }
  }

  setupAudioListeners() {
    // Add tactical audio response to interactive buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button, .view-switcher-btn, .server-status-pill, .station-item, .sub-plan-opt, .kpi-card');
      if (btn) {
        this.playActionSound('click');
      }
    });

    // Subtle hover chirp on major buttons
    document.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('.view-switcher-btn, .hud-btn, .location-banner-btn');
      if (btn && this.audioEnabled) {
        this.playActionSound('hover');
      }
    });
  }

  /* ----------------------------------------------------------
     3. HUD CONTROLS & TOGGLES
     ---------------------------------------------------------- */
  bindControls() {
    // Audio Toggle
    const btnAudio = document.getElementById('btnHudAudioToggle');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
          this.initAudioContext();
          btnAudio.classList.add('active');
          btnAudio.innerHTML = `
            <span class="hud-audio-icon">🔊</span>
            <span>HUD AUDIO: ON</span>
          `;
          this.playBeep(1400, 'sine', 0.05, 0.04);
          if (window.TwinApp) window.TwinApp.showToast('Tactical Aerospace Audio Telemetry: ACTIVE', 'info');
        } else {
          btnAudio.classList.remove('active');
          btnAudio.innerHTML = `
            <span class="hud-audio-icon">🔇</span>
            <span>HUD AUDIO: OFF</span>
          `;
          if (window.TwinApp) window.TwinApp.showToast('HUD Audio: MUTED', 'info');
        }
      });
    }

    // Cyber Matrix & Scanline Toggle
    const btnMatrix = document.getElementById('btnHudMatrixToggle');
    if (btnMatrix) {
      btnMatrix.addEventListener('click', () => {
        this.cyberMatrixEnabled = !this.cyberMatrixEnabled;
        document.body.classList.toggle('cyber-matrix-mode', this.cyberMatrixEnabled);
        if (this.cyberMatrixEnabled) {
          btnMatrix.classList.add('active');
          this.playActionSound('confirm');
          if (window.TwinApp) window.TwinApp.showToast('Cybernetic Grid & Hologram Matrix: ONLINE', 'success');
        } else {
          btnMatrix.classList.remove('active');
          this.playActionSound('switch');
          if (window.TwinApp) window.TwinApp.showToast('Standard Display Mode', 'info');
        }
      });
    }
  }
}

// Instantiate and expose globally
window.AetherisTacticalHud = AetherisTacticalHud;
