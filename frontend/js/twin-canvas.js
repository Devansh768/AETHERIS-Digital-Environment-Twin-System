/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - INTERACTIVE 2.5D CANVAS ENGINE
   Advanced Aerospace Telemetry, Lidar Scan & Fluid Dynamics
   ========================================================== */

class TwinCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.stations = [];
    this.activeStationId = null;
    this.userLocation = null; // { lat, lng, x, y, nearestId, distanceFormatted }
    this.viewMode = 'dispersion'; // 'dispersion', 'thermal', 'radar'
    this.hoveredStation = null;
    this.mousePos = { x: -100, y: -100, isOver: false };

    // Atmospheric flow particles & vector streamlines
    this.particles = [];
    this.numParticles = 120;
    this.streamlines = [];

    // Lidar Laser Scanner Beam
    this.lidarScanX = 0;
    this.lidarScanSpeed = 1.8;

    // Animation & timing
    this.time = 0;
    this.animationFrameId = null;

    this.initCanvasSize();
    this.initParticles();
    this.initStreamlines();
    this.bindEvents();
    this.startLoop();
  }

  initCanvasSize() {
    const parent = this.canvas ? this.canvas.parentElement : null;
    const rect = parent ? parent.getBoundingClientRect() : { width: 800 };
    const dpr = window.devicePixelRatio || 1;
    this.width = (rect.width && rect.width > 50) ? rect.width : 800;
    this.height = 460;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.ctx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    const w = this.width > 50 ? this.width : 800;
    const h = this.height > 50 ? this.height : 460;
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0.8 + Math.random() * 1.5,
        vy: -0.4 + Math.random() * 0.8,
        size: 1.2 + Math.random() * 2.8,
        alpha: 0.25 + Math.random() * 0.65,
        life: Math.random() * 100,
        maxLife: 90 + Math.random() * 130,
        color: (Math.random() > 0.4) ? '#38bdf8' : '#00f2fe'
      });
    }
  }

  initStreamlines() {
    this.streamlines = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      this.streamlines.push({
        yOffset: 30 + (i * 35),
        speed: 1.2 + Math.random() * 0.8,
        amplitude: 12 + Math.random() * 14,
        frequency: 0.008 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.updateNodePositions();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.mousePos.x = mouseX;
      this.mousePos.y = mouseY;
      this.mousePos.isOver = true;

      let found = null;
      for (const s of this.stations) {
        if (s.x && s.y) {
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          if (Math.sqrt(dx * dx + dy * dy) < 26) {
            found = s;
            break;
          }
        }
      }
      this.hoveredStation = found;
      this.canvas.style.cursor = found ? 'pointer' : 'crosshair';
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mousePos.isOver = false;
      this.hoveredStation = null;
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredStation) {
        window.dispatchEvent(new CustomEvent('stationSelected', {
          detail: { stationId: this.hoveredStation.stationId || this.hoveredStation.id }
        }));
      }
    });
  }

  updateData(stationsList, activeId, userLoc) {
    this.stations = stationsList || [];
    this.activeStationId = activeId;
    this.userLocation = userLoc;
    this.updateNodePositions();
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  updateNodePositions() {
    if (!this.stations.length) return;

    const padding = 75;
    const availableW = this.width - padding * 2;
    const availableH = this.height - padding * 2;

    const layout = [
      { rx: 0.50, ry: 0.46 }, // Urban Core (Center)
      { rx: 0.82, ry: 0.68 }, // Industrial Park (South-East)
      { rx: 0.24, ry: 0.24 }, // Forest Reserve (North-West)
      { rx: 0.18, ry: 0.74 }, // Suburban Valley (South-West)
      { rx: 0.80, ry: 0.26 }  // Coastal Basin (North-East)
    ];

    this.stations.forEach((s, i) => {
      const pos = layout[i % layout.length];
      s.x = padding + availableW * pos.rx;
      s.y = padding + availableH * pos.ry;
    });

    if (this.userLocation) {
      this.userLocation.x = this.width * 0.44;
      this.userLocation.y = this.height * 0.58;
    }
  }

  startLoop() {
    const loop = () => {
      this.time += 0.03;
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Digital Twin Holographic Terrain Mesh & Isometric Grid
    this.renderTerrainGrid();

    // 2. Orbital Lidar Laser Scan Beam
    this.renderLidarScanner();

    // 3. Atmospheric Wind Streamlines & Fluid Vector Field
    this.renderAtmosphericStreamlines();
    this.renderAtmosphericFlow();

    // 4. Heatmap, Dispersion Isobars, or Radar Mode
    if (this.viewMode === 'thermal') {
      this.renderThermalOverlay();
    } else if (this.viewMode === 'radar' && this.userLocation) {
      this.renderRadarOverlay();
    } else {
      this.renderDispersionIsobars();
    }

    // 5. Geodesic Quantum Telemetry Laser between User and Station
    if (this.userLocation && this.userLocation.nearestId) {
      this.renderUserGeoPairing();
    }

    // 6. Sensor Nodes, Quantum Beacons & Active Targeting Reticles
    this.renderStations();

    // 7. User GPS Marker
    if (this.userLocation) {
      this.renderUserMarker();
    }

    // 8. Interactive Mouse HUD Crosshairs & Vector Tracker
    if (this.mousePos.isOver) {
      this.renderMouseReticle();
    }

    // 9. Top-Right Aerospace HUD Compass Azimuth & Telemetry Box
    this.renderCompassTelemetryHUD();
  }

  /* ----------------------------------------------------------
     1. CYBERNETIC TERRAIN GRID & TOPOGRAPHY
     ---------------------------------------------------------- */
  renderTerrainGrid() {
    const ctx = this.ctx;
    ctx.save();

    // Deep grid lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
    ctx.lineWidth = 1;

    const gridSize = 38;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Subtle tactical coordinate marks on grid crossings
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.font = '8px monospace';
    for (let x = gridSize * 2; x < this.width - 60; x += gridSize * 3) {
      for (let y = gridSize * 2; y < this.height - 40; y += gridSize * 3) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    // Isometric elevation wave contours (Dynamic fluid topography)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.16)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 8) {
      const y = (this.height * 0.52) + Math.sin(x * 0.014 + this.time * 0.5) * 22 + Math.cos(x * 0.028 - this.time * 0.3) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Secondary harmonic contour
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 10) {
      const y = (this.height * 0.68) + Math.cos(x * 0.018 + this.time * 0.4) * 16 + Math.sin(x * 0.009 - this.time * 0.2) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.restore();
  }

  /* ----------------------------------------------------------
     2. ORBITAL LIDAR LASER SCANNER BEAM
     ---------------------------------------------------------- */
  renderLidarScanner() {
    const ctx = this.ctx;
    ctx.save();

    this.lidarScanX += this.lidarScanSpeed;
    if (this.lidarScanX > this.width + 100) {
      this.lidarScanX = -50;
    }

    const x = this.lidarScanX;
    const beamGrad = ctx.createLinearGradient(x - 50, 0, x, 0);
    beamGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
    beamGrad.addColorStop(0.8, 'rgba(0, 242, 254, 0.06)');
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');

    ctx.fillStyle = beamGrad;
    ctx.fillRect(x - 50, 0, 50, this.height);

    // Crisp laser beam line
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.height);
    ctx.stroke();

    ctx.restore();
  }

  /* ----------------------------------------------------------
     3. AERODYNAMIC STREAMLINES & PARTICULATE FLOW
     ---------------------------------------------------------- */
  renderAtmosphericStreamlines() {
    const ctx = this.ctx;
    ctx.save();
    ctx.lineWidth = 1;

    this.streamlines.forEach((sl) => {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.beginPath();
      for (let x = 0; x < this.width; x += 20) {
        const y = sl.yOffset + Math.sin(x * sl.frequency + this.time * sl.speed + sl.phase) * sl.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.restore();
  }

  renderAtmosphericFlow() {
    const ctx = this.ctx;
    ctx.save();

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy + Math.sin(this.time * 1.5 + p.x * 0.01) * 0.45;
      p.life++;

      if (p.x > this.width || p.y < 0 || p.life > p.maxLife) {
        p.x = 0;
        p.y = Math.random() * this.height;
        p.life = 0;
      }

      const alpha = (1 - (p.life / p.maxLife)) * p.alpha;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric vector velocity streaks
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 8, p.y - p.vy * 8);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ----------------------------------------------------------
     4. DISPERSION ISOBARS & THERMAL PLUMES
     ---------------------------------------------------------- */
  renderDispersionIsobars() {
    const ctx = this.ctx;
    ctx.save();

    this.stations.forEach((s) => {
      if (!s.x || !s.y) return;
      const aqi = s.aqi || 60;
      const color = s.aqiColor || '#00f2fe';

      // Concentric dispersion contour wave ripples
      for (let r = 1; r <= 3; r++) {
        const radius = (28 * r) + Math.sin(this.time * 2 + r + s.x * 0.02) * 5;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.18 / r;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.setLineDash([]);
    ctx.restore();
  }

  renderThermalOverlay() {
    const ctx = this.ctx;
    ctx.save();
    for (const s of this.stations) {
      if (!s.x || !s.y) continue;
      const temp = s.temperature || 28;
      const radius = 95 + (temp - 20) * 4.5;

      const grad = ctx.createRadialGradient(s.x, s.y, 8, s.x, s.y, radius);
      if (temp > 33) {
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.42)');
        grad.addColorStop(0.6, 'rgba(244, 63, 94, 0.18)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      } else if (temp > 28) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.14)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      } else {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.32)');
        grad.addColorStop(0.6, 'rgba(16, 185, 129, 0.12)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderRadarOverlay() {
    const ctx = this.ctx;
    const u = this.userLocation;
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1;

    // Tactical range rings
    const rings = [65, 135, 210, 290];
    rings.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(u.x, u.y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`RNG: ${(idx + 1) * 0.8} KM`, u.x + r - 32, u.y - 6);
    });

    // 360-degree rotating radar scan sweep
    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    const angle = this.time * 2.2;
    ctx.arc(u.x, u.y, 290, angle, angle + 0.4);
    ctx.lineTo(u.x, u.y);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
    ctx.fill();

    ctx.restore();
  }

  renderUserGeoPairing() {
    const ctx = this.ctx;
    const u = this.userLocation;
    const target = this.stations.find(s => (s.stationId || s.id) === u.nearestId);
    if (!target || !target.x || !target.y) return;

    ctx.save();
    // Geodesic pulsed laser line
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -this.time * 20;

    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Midpoint distance badge
    const midX = (u.x + target.x) / 2;
    const midY = (u.y + target.y) / 2;

    ctx.fillStyle = 'rgba(8, 14, 28, 0.9)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
    ctx.beginPath();
    ctx.roundRect(midX - 44, midY - 13, 88, 24, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`📡 ${u.distanceFormatted || 'Nearby'}`, midX, midY);

    ctx.restore();
  }

  /* ----------------------------------------------------------
     5. SENSOR NODES & AEROSPACE TARGETING RETICLE
     ---------------------------------------------------------- */
  renderStations() {
    const ctx = this.ctx;

    this.stations.forEach((s) => {
      if (!s.x || !s.y) return;

      const isCurrentActive = (s.stationId || s.id) === this.activeStationId;
      const isHovered = this.hoveredStation === s;
      const color = s.aqiColor || '#00f2fe';
      const aqi = s.aqi || 50;

      ctx.save();

      // If active node, draw aerospace high-tech targeting reticle
      if (isCurrentActive) {
        this.renderTargetReticle(s.x, s.y, color, s);
      }

      // Pulsing radar ripple ring
      const pulseSize = 16 + Math.sin(this.time * 3 + (s.x * 0.05)) * 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, pulseSize + 8, 0, Math.PI * 2);
      ctx.stroke();

      // Outer glow circle
      ctx.globalAlpha = (isCurrentActive || isHovered) ? 0.95 : 0.75;
      ctx.fillStyle = 'rgba(9, 15, 30, 0.92)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = isCurrentActive ? 2.5 : 1.5;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = isCurrentActive ? 15 : 6;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center core beacon
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Station ID & AQI Tag
      ctx.globalAlpha = 1;
      ctx.font = 'bold 12px Rajdhani, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(s.stationName || s.name || s.id, s.x, s.y - 25);

      // AQI Pill
      ctx.shadowBlur = 0;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(s.x - 24, s.y + 20, 48, 17, 3);
      ctx.fill();

      ctx.fillStyle = '#060911';
      ctx.font = 'bold 9px Orbitron, monospace';
      ctx.textBaseline = 'middle';
      ctx.fillText(`AQI ${aqi}`, s.x, s.y + 29);

      ctx.restore();
    });
  }

  /* Rotating military / aerospace targeting reticle around active node */
  renderTargetReticle(cx, cy, color, station) {
    const ctx = this.ctx;
    ctx.save();

    const reticleRadius = 38;
    const rot = this.time * 1.2;

    // Segmented rotating outer circle
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;

    for (let i = 0; i < 4; i++) {
      const startAngle = rot + (i * Math.PI / 2) + 0.15;
      const endAngle = startAngle + (Math.PI / 2) - 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, reticleRadius, startAngle, endAngle);
      ctx.stroke();
    }

    // Reticle crosshair ticks
    const tickLen = 7;
    const ticks = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    ticks.forEach(angle => {
      const a = rot + angle;
      const x1 = cx + Math.cos(a) * (reticleRadius - tickLen);
      const y1 = cy + Math.sin(a) * (reticleRadius - tickLen);
      const x2 = cx + Math.cos(a) * (reticleRadius + tickLen);
      const y2 = cy + Math.sin(a) * (reticleRadius + tickLen);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // High-tech floating telemetry tag
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`LAT: ${(station.latitude || 28.61).toFixed(3)}°N`, cx + reticleRadius + 8, cy - 8);
    ctx.fillText(`LNG: ${(station.longitude || 77.20).toFixed(3)}°E`, cx + reticleRadius + 8, cy + 4);
    ctx.fillText(`STATUS: NOMINAL`, cx + reticleRadius + 8, cy + 16);

    ctx.restore();
  }

  /* ----------------------------------------------------------
     6. USER GPS MARKER
     ---------------------------------------------------------- */
  renderUserMarker() {
    const ctx = this.ctx;
    const u = this.userLocation;
    if (!u || !u.x || !u.y) return;

    ctx.save();
    const pulse = 18 + Math.sin(this.time * 4) * 8;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(u.x, u.y, pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(u.x, u.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.arc(u.x, u.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.font = 'bold 9px Orbitron, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('GPS DEVICE LOCK', u.x, u.y + 24);

    ctx.restore();
  }

  /* ----------------------------------------------------------
     7. TACTICAL MOUSE CROSSHAIRS
     ---------------------------------------------------------- */
  renderMouseReticle() {
    const ctx = this.ctx;
    const mx = this.mousePos.x;
    const my = this.mousePos.y;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Horizontal & vertical guide lines
    ctx.beginPath();
    ctx.moveTo(0, my);
    ctx.lineTo(this.width, my);
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, this.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Reticle brackets around cursor
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.lineWidth = 1.2;
    const bSize = 8;
    const bOffset = 10;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(mx - bOffset, my - bOffset + bSize);
    ctx.lineTo(mx - bOffset, my - bOffset);
    ctx.lineTo(mx - bOffset + bSize, my - bOffset);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(mx + bOffset, my + bOffset - bSize);
    ctx.lineTo(mx + bOffset, my + bOffset);
    ctx.lineTo(mx + bOffset - bSize, my + bOffset);
    ctx.stroke();

    // Coordinate readout
    ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.font = '9px monospace';
    ctx.fillText(`X:${Math.round(mx)} Y:${Math.round(my)}`, mx + 14, my - 12);

    ctx.restore();
  }

  /* ----------------------------------------------------------
     8. TOP-RIGHT AEROSPACE AZIMUTH COMPASS & TELEMETRY BOX
     ---------------------------------------------------------- */
  renderCompassTelemetryHUD() {
    const ctx = this.ctx;
    ctx.save();

    const boxW = 150;
    const boxH = 68;
    const x = this.width - boxW - 14;
    const y = 14;

    // Glass panel
    ctx.fillStyle = 'rgba(8, 14, 28, 0.75)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    // Compass circle inside box
    const cx = x + 24;
    const cy = y + 34;
    const cr = 18;

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();

    // Heading arrow (animated slight swing)
    const headingAngle = -Math.PI / 2 + Math.sin(this.time * 0.4) * 0.15;
    ctx.strokeStyle = '#00f2fe';
    ctx.fillStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(headingAngle) * 14, cy + Math.sin(headingAngle) * 14);
    ctx.stroke();

    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, cy - 20);

    // Telemetry text
    ctx.textAlign = 'left';
    ctx.fillStyle = 'var(--text-main)';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('HDG: 042° NE', cx + 24, y + 24);
    ctx.fillStyle = 'var(--cyan-bright)';
    ctx.fillText('ALT: +210M AGL', cx + 24, y + 38);
    ctx.fillStyle = 'var(--text-dim)';
    ctx.fillText('BARO: 1013.2 hPa', cx + 24, y + 52);

    ctx.restore();
  }
}

window.TwinCanvasEngine = TwinCanvasEngine;
