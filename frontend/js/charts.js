/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - TIME-SERIES CANVAS CHARTS
   ========================================================== */

class TwinTrendChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.options = {
      lineColor: options.lineColor || '#00f2fe',
      fillColor: options.fillColor || 'rgba(0, 242, 254, 0.15)',
      unit: options.unit || '',
      min: options.min !== undefined ? options.min : 0,
      max: options.max !== undefined ? options.max : 300,
      label: options.label || 'Trend'
    };

    this.history = [];
    this.maxPoints = 20;

    this.initCanvas();
  }

  initCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 300;
    this.height = 120;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    this.ctx.scale(dpr, dpr);
  }

  addPoint(value, timestamp = new Date()) {
    this.history.push({ value, time: timestamp });
    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }
    this.render();
  }

  setPoints(points) {
    this.history = points.slice(-this.maxPoints);
    this.render();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.history.length < 2) {
      // Placeholder dashed line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(10, this.height / 2);
      ctx.lineTo(this.width - 10, this.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    const paddingX = 15;
    const paddingY = 15;
    const drawW = this.width - paddingX * 2;
    const drawH = this.height - paddingY * 2;

    // Calculate dynamic range
    let minVal = this.options.min;
    let maxVal = this.options.max;
    const values = this.history.map(p => p.value);
    const localMin = Math.min(...values);
    const localMax = Math.max(...values);
    
    if (localMax > maxVal) maxVal = Math.ceil(localMax * 1.15);
    if (localMin < minVal) minVal = Math.floor(localMin * 0.85);

    const stepX = drawW / (this.history.length - 1);

    // Draw horizontal grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const gy = paddingY + (drawH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(paddingX, gy);
      ctx.lineTo(this.width - paddingX, gy);
      ctx.stroke();
    }

    // Points coordinates
    const coords = this.history.map((pt, i) => {
      const normY = (pt.value - minVal) / (maxVal - minVal || 1);
      return {
        x: paddingX + i * stepX,
        y: paddingY + (1 - normY) * drawH,
        val: pt.value
      };
    });

    // Fill area gradient
    const grad = ctx.createLinearGradient(0, paddingY, 0, this.height);
    grad.addColorStop(0, this.options.fillColor);
    grad.addColorStop(1, 'rgba(0, 242, 254, 0)');

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      // Smooth cubic curve
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(coords[coords.length - 1].x, this.height - paddingY);
    ctx.lineTo(coords[0].x, this.height - paddingY);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw primary curve
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(midX, prev.y, midX, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = this.options.lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw last point dot with pulse
    const last = coords[coords.length - 1];
    ctx.fillStyle = this.options.lineColor;
    ctx.shadowColor = this.options.lineColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

window.TwinTrendChart = TwinTrendChart;
