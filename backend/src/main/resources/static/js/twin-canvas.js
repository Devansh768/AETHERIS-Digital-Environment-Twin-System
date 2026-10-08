/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - INTERACTIVE 2.5D CANVAS ENGINE
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

    // Atmospheric flow particles
    this.particles = [];
    this.numParticles = 90;

    // Animation & timing
    this.time = 0;
    this.animationFrameId = null;

    this.initCanvasSize();
    this.initParticles();
    this.bindEvents();
    this.startLoop();
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = 440;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.ctx.scale(dpr, dpr);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: 0.6 + Math.random() * 1.2,
        vy: -0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 120
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

      let found = null;
      for (const s of this.stations) {
        if (s.x && s.y) {
          const dx = mouseX - s.x;
          const dy = mouseY - s.y;
          if (Math.sqrt(dx * dx + dy * dy) < 24) {
            found = s;
            break;
          }
        }
      }
      this.hoveredStation = found;
      this.canvas.style.cursor = found ? 'pointer' : 'crosshair';
    });

    this.canvas.addEventListener('click', (e) => {
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

    // Normalize coordinates or distribute evenly across stylized spatial digital twin terrain
    const padding = 70;
    const availableW = this.width - padding * 2;
    const availableH = this.height - padding * 2;

    // Fixed geographic offsets for consistent topology
    const layout = [
      { rx: 0.50, ry: 0.45 }, // Urban Core (Center)
      { rx: 0.82, ry: 0.68 }, // Industrial Park (South-East)
      { rx: 0.24, ry: 0.22 }, // Forest Reserve (North-West)
      { rx: 0.18, ry: 0.75 }, // Suburban Valley (South-West)
      { rx: 0.78, ry: 0.25 }  // Coastal Basin (North-East)
    ];

    this.stations.forEach((s, i) => {
      const pos = layout[i % layout.length];
      s.x = padding + availableW * pos.rx;
      s.y = padding + availableH * pos.ry;
    });

    if (this.userLocation) {
      // Position user near center or mapped offset
      this.userLocation.x = this.width * 0.46;
      this.userLocation.y = this.height * 0.56;
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

    // 1. Draw Digital Twin Grid & Isometric Terrain Mesh
    this.renderTerrainGrid();

    // 2. Draw Environmental Atmosphere & Wind Particle Layer
    this.renderAtmosphericFlow();

    // 3. Draw Heatmap or Dispersion Overlay depending on mode
    if (this.viewMode === 'thermal') {
      this.renderThermalOverlay();
    } else if (this.viewMode === 'radar' && this.userLocation) {
      this.renderRadarOverlay();
    }

    // 4. Draw Geodesic Link from User Location to Nearest Station
    if (this.userLocation && this.userLocation.nearestId) {
      this.renderUserGeoPairing();
    }

    // 5. Draw Sensor Nodes & Beacons
    this.renderStations();

    // 6. Draw User Location Marker
    if (this.userLocation) {
      this.renderUserMarker();
    }
  }

  renderTerrainGrid() {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.lineWidth = 1;

    const gridSize = 40;
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

    // Isometric elevation contour waves
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
    ctx.beginPath();
    for (let x = 0; x < this.width; x += 10) {
      const y = (this.height * 0.5) + Math.sin(x * 0.015 + this.time * 0.5) * 18 + Math.cos(x * 0.03 - this.time * 0.3) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  renderAtmosphericFlow() {
    const ctx = this.ctx;
    ctx.save();

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy + Math.sin(this.time + p.x * 0.01) * 0.3;
      p.life++;

      if (p.x > this.width || p.y < 0 || p.life > p.maxLife) {
        p.x = 0;
        p.y = Math.random() * this.height;
        p.life = 0;
      }

      const alpha = (1 - (p.life / p.maxLife)) * p.alpha;
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric flow trails
      ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
      ctx.stroke();
    }
    ctx.restore();
  }

  renderThermalOverlay() {
    const ctx = this.ctx;
    ctx.save();
    for (const s of this.stations) {
      if (!s.x || !s.y) continue;
      const temp = s.temperature || 28;
      const radius = 90 + (temp - 20) * 4;

      const grad = ctx.createRadialGradient(s.x, s.y, 10, s.x, s.y, radius);
      if (temp > 33) {
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.38)');
        grad.addColorStop(1, 'rgba(244, 63, 94, 0)');
      } else if (temp > 28) {
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      } else {
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
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
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1;

    // Concentric range rings
    const rings = [60, 130, 200, 280];
    rings.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(u.x, u.y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.font = '10px Rajdhani';
      ctx.fillText(`${(idx + 1) * 0.8} km`, u.x + r - 25, u.y - 4);
    });

    // Radar beam sweep
    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    const angle = this.time * 2;
    ctx.arc(u.x, u.y, 280, angle, angle + 0.35);
    ctx.lineTo(u.x, u.y);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.fill();

    ctx.restore();
  }

  renderUserGeoPairing() {
    const ctx = this.ctx;
    const u = this.userLocation;
    const target = this.stations.find(s => (s.stationId || s.id) === u.nearestId);
    if (!target || !target.x || !target.y) return;

    ctx.save();
    // Geodesic dashed laser line
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -this.time * 15;

    ctx.beginPath();
    ctx.moveTo(u.x, u.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Midpoint distance label
    const midX = (u.x + target.x) / 2;
    const midY = (u.y + target.y) / 2;

    ctx.fillStyle = 'rgba(9, 14, 28, 0.85)';
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.beginPath();
    ctx.roundRect(midX - 40, midY - 12, 80, 22, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px Orbitron';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(u.distanceFormatted || 'Nearby', midX, midY);

    ctx.restore();
  }

  renderStations() {
    const ctx = this.ctx;

    this.stations.forEach((s) => {
      if (!s.x || !s.y) return;

      const isCurrentActive = (s.stationId || s.id) === this.activeStationId;
      const isHovered = this.hoveredStation === s;
      const color = s.aqiColor || '#00f2fe';
      const aqi = s.aqi || 50;

      ctx.save();

      // Pulsing radar ripple ring
      const pulseSize = 16 + Math.sin(this.time * 3 + (s.x * 0.05)) * 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(s.x, s.y, pulseSize + 8, 0, Math.PI * 2);
      ctx.stroke();

      // Outer glow circle
      ctx.globalAlpha = isCurrentActive || isHovered ? 0.9 : 0.7;
      ctx.fillStyle = 'rgba(10, 16, 32, 0.9)';
      ctx.beginPath();
      ctx.arc(s.x, s.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = isCurrentActive ? 2.5 : 1.5;
      ctx.strokeStyle = color;
      ctx.stroke();

      // Center core
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Station ID & AQI Tag
      ctx.globalAlpha = 1;
      ctx.font = 'bold 11px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(s.stationName || s.name || s.id, s.x, s.y - 24);

      // AQI Pill
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(s.x - 22, s.y + 20, 44, 16, 3);
      ctx.fill();

      ctx.fillStyle = '#060911';
      ctx.font = 'bold 9px Orbitron';
      ctx.textBaseline = 'middle';
      ctx.fillText(`AQI ${aqi}`, s.x, s.y + 28);

      ctx.restore();
    });
  }

  renderUserMarker() {
    const ctx = this.ctx;
    const u = this.userLocation;
    if (!u || !u.x || !u.y) return;

    ctx.save();
    // GPS Beacon animation
    const pulse = 18 + Math.sin(this.time * 4) * 8;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(u.x, u.y, pulse, 0, Math.PI * 2);
    ctx.stroke();

    // User pin
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(u.x, u.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.arc(u.x, u.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // User Label
    ctx.shadowBlur = 0;
    ctx.font = 'bold 10px Orbitron';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('YOU (DEVICE GPS)', u.x, u.y + 22);

    ctx.restore();
  }
}

window.TwinCanvasEngine = TwinCanvasEngine;
