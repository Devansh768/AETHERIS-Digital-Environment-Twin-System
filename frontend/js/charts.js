/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - TIME-SERIES CANVAS CHARTS
   High-performance, auto-resizing, interactive spline charts
   ========================================================== */

class TwinTrendChart {
  constructor(canvasId, options = {}) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`[TwinTrendChart] Canvas with id '${canvasId}' not found.`);
      return;
    }
    this.ctx = this.canvas.getContext('2d');

    this.options = {
      lineColor: options.lineColor || '#00f2fe',
      fillColor: options.fillColor || 'rgba(0, 242, 254, 0.15)',
      unit: options.unit || '',
      min: options.min !== undefined ? options.min : 0,
      max: options.max !== undefined ? options.max : 300,
      label: options.label || 'Trend',
      valueKey: options.valueKey || 'value'
    };

    this.history = [];
    this.maxPoints = 25;
    this.width = 300;
    this.height = 120;
    this.hoverPoint = null;

    this.initCanvas();
    this.bindEvents();
  }

  initCanvas() {
    this.updateDimensions();
  }

  updateDimensions() {
    if (!this.canvas) return false;

    // Detect actual container width even if previously display:none
    const rect = this.canvas.getBoundingClientRect();
    const parentW = (this.canvas.parentElement) ? this.canvas.parentElement.clientWidth : 0;
    
    // Determine target width
    let targetW = rect.width;
    if (!targetW || targetW <= 10) {
      targetW = parentW > 50 ? parentW - 32 : 360;
    }
    let targetH = rect.height;
    if (!targetH || targetH <= 10) {
      targetH = 130;
    }

    this.width = Math.max(120, targetW);
    this.height = Math.max(80, targetH);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);

    // Keep CSS responsive
    this.canvas.style.width = '100%';
    this.canvas.style.height = `${this.height}px`;

    // Scale drawing context
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  bindEvents() {
    if (!this.canvas) return;

    // Window resize handler
    window.addEventListener('resize', () => {
      this.resize();
    });

    // Mouse move for interactive tooltip
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.handleHover(mouseX, mouseY);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPoint = null;
      this.render();
    });
  }

  handleHover(mouseX, mouseY) {
    if (!this.history || this.history.length === 0) return;

    const paddingX = 40;
    const drawW = Math.max(10, this.width - paddingX - 15);
    const stepX = drawW / Math.max(1, this.history.length - 1);

    // Find nearest point
    let nearest = null;
    let minDist = Infinity;

    this.history.forEach((pt, i) => {
      const ptX = paddingX + i * stepX;
      const dist = Math.abs(mouseX - ptX);
      if (dist < minDist && dist < 30) {
        minDist = dist;
        nearest = { ...pt, x: ptX, index: i };
      }
    });

    this.hoverPoint = nearest;
    this.render();
  }

  resize() {
    this.updateDimensions();
    this.render();
  }

  addPoint(value, timestamp = new Date()) {
    if (value === null || value === undefined || isNaN(value)) return;
    const num = Math.round(Number(value) * 10) / 10;
    const time = (timestamp instanceof Date) ? timestamp : new Date(timestamp);
    
    this.history.push({ value: num, time: time });
    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }
    this.render();
  }

  setPoints(points) {
    if (!Array.isArray(points)) return;
    this.history = points.slice(-this.maxPoints).map(p => {
      if (typeof p === 'number') {
        return { value: p, time: new Date() };
      }
      return {
        value: Number(p.value !== undefined ? p.value : p.aqi || p.temperature || 0),
        time: p.time ? new Date(p.time) : (p.recordedAt ? new Date(p.recordedAt) : new Date())
      };
    });
    this.render();
  }

  loadHistory(records, valueKey = null) {
    const key = valueKey || this.options.valueKey || 'value';
    if (!Array.isArray(records) || records.length === 0) {
      this.seedFallbackPoints();
      return;
    }

    // Backend returns records ordered either newest-first or oldest-first
    // We sort ascending by timestamp
    const sorted = [...records].sort((a, b) => {
      const ta = new Date(a.recordedAt || a.time || 0).getTime();
      const tb = new Date(b.recordedAt || b.time || 0).getTime();
      return ta - tb;
    });

    const parsed = sorted.slice(-this.maxPoints).map(r => {
      let val = 0;
      if (typeof r === 'number') {
        val = r;
      } else if (r[key] !== undefined) {
        val = r[key];
      } else if (key === 'aqi' && r.aqi !== undefined) {
        val = r.aqi;
      } else if ((key === 'temperature' || key === 'temp') && r.temperature !== undefined) {
        val = r.temperature;
      } else {
        val = r.value || 0;
      }

      return {
        value: Math.round(Number(val) * 10) / 10,
        time: r.recordedAt ? new Date(r.recordedAt) : (r.time ? new Date(r.time) : new Date())
      };
    });

    if (parsed.length > 0) {
      this.history = parsed;
      this.render();
    } else {
      this.seedFallbackPoints();
    }
  }

  seedFallbackPoints(baselineVal = null) {
    const base = baselineVal !== null ? baselineVal : (this.options.min + this.options.max) / 2;
    const now = Date.now();
    const seeded = [];
    const count = 15;

    for (let i = count - 1; i >= 0; i--) {
      const variation = (Math.sin(i * 0.8) * 0.15 + (Math.random() * 0.08 - 0.04)) * base;
      const val = Math.max(this.options.min, Math.min(this.options.max, Math.round((base + variation) * 10) / 10));
      seeded.push({
        value: val,
        time: new Date(now - i * 3500)
      });
    }
    this.history = seeded;
    this.render();
  }

  render() {
    if (!this.canvas) return;

    // Check if canvas element is visible now
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width > 10 && Math.abs(rect.width - this.width) > 5) {
      this.updateDimensions();
    }

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // If history is empty, seed initial points
    if (!this.history || this.history.length === 0) {
      this.seedFallbackPoints();
      return;
    }

    // Chart margins
    const padLeft = 40;
    const padRight = 15;
    const padTop = 15;
    const padBottom = 22;

    const drawW = Math.max(10, w - padLeft - padRight);
    const drawH = Math.max(10, h - padTop - padBottom);

    // Calculate dynamic range with gentle margins
    const values = this.history.map(p => p.value);
    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);

    if (minVal === maxVal) {
      minVal -= 5;
      maxVal += 5;
    } else {
      const span = maxVal - minVal;
      minVal = Math.floor(minVal - span * 0.1);
      maxVal = Math.ceil(maxVal + span * 0.15);
    }

    minVal = Math.max(this.options.min, minVal);
    maxVal = Math.max(minVal + 1, maxVal);

    // 1. Draw horizontal grid lines & Y-axis labels
    const gridLines = 3;
    ctx.font = '10px "Rajdhani", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridLines; i++) {
      const ratio = i / gridLines;
      const y = padTop + drawH * (1 - ratio);
      const val = Math.round(minVal + ratio * (maxVal - minVal));

      // Grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y-axis label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.fillText(`${val}`, padLeft - 6, y);
    }

    // 2. Compute point coordinates
    const stepX = drawW / Math.max(1, this.history.length - 1);
    const coords = this.history.map((pt, i) => {
      const normY = (pt.value - minVal) / (maxVal - minVal || 1);
      return {
        x: padLeft + i * stepX,
        y: padTop + (1 - normY) * drawH,
        val: pt.value,
        time: pt.time
      };
    });

    if (coords.length < 2) return;

    // 3. Draw gradient fill area
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + drawH);
    grad.addColorStop(0, this.options.fillColor || 'rgba(0, 242, 254, 0.2)');
    grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(coords[coords.length - 1].x, padTop + drawH);
    ctx.lineTo(coords[0].x, padTop + drawH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 4. Draw smooth primary stroke curve
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = this.options.lineColor || '#00f2fe';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 5. Draw pulse on latest point
    const latest = coords[coords.length - 1];
    ctx.fillStyle = this.options.lineColor;
    ctx.shadowColor = this.options.lineColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(latest.x, latest.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Draw X-axis timestamps
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.font = '9px "Outfit", sans-serif';
    ctx.textBaseline = 'top';

    // Start time label
    ctx.textAlign = 'left';
    const firstTime = coords[0].time;
    const firstStr = (firstTime instanceof Date) ? firstTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    ctx.fillText(firstStr, padLeft, h - padBottom + 6);

    // End time label
    ctx.textAlign = 'right';
    const lastTime = latest.time;
    const lastStr = (lastTime instanceof Date) ? lastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
    ctx.fillText(lastStr, w - padRight, h - padBottom + 6);

    // 7. Interactive Hover Crosshair & Tooltip
    if (this.hoverPoint) {
      const hX = this.hoverPoint.x;
      const hNorm = (this.hoverPoint.value - minVal) / (maxVal - minVal || 1);
      const hY = padTop + (1 - hNorm) * drawH;

      // Vertical guide line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hX, padTop);
      ctx.lineTo(hX, padTop + drawH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight circle
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(hX, hY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = this.options.lineColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hX, hY, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Tooltip pill box
      const timeStr = (this.hoverPoint.time instanceof Date)
        ? this.hoverPoint.time.toLocaleTimeString()
        : '';
      const tipText = `${this.hoverPoint.value} ${this.options.unit} (${timeStr})`;
      ctx.font = 'bold 11px "Rajdhani", sans-serif';
      const textW = ctx.measureText(tipText).width;
      const boxW = textW + 16;
      const boxH = 22;

      let boxX = hX - boxW / 2;
      boxX = Math.max(padLeft, Math.min(w - padRight - boxW, boxX));
      let boxY = hY - 32;
      if (boxY < 2) boxY = hY + 12;

      ctx.fillStyle = 'rgba(10, 16, 32, 0.92)';
      ctx.strokeStyle = this.options.lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tipText, boxX + boxW / 2, boxY + boxH / 2);
    }
  }
}

window.TwinTrendChart = TwinTrendChart;
