/* ==========================================================
   AETHERIS PRODUCT SUITE - SAAS PRODUCT & CITIZEN PORTAL MODULE
   ========================================================== */

class AetherisProductSuite {
  constructor(appInstance) {
    this.app = appInstance;
    this.currentView = localStorage.getItem('aetheris_view') || 'landing'; // 'landing', 'citizen', 'advanced'
    this.billingCycle = 'annual'; // 'monthly' or 'annual'
    this.activeUseCase = 'municipal';
    this.tourStep = 0;
    
    this.init();
  }

  init() {
    this.bindViewSwitcher();
    this.bindLandingInteractions();
    this.bindCitizenInteractions();
    this.bindTourInteractions();
    this.bindReportModal();
    this.bindSubscriptionModal();
    this.applyView(this.currentView, false);
  }

  /* ----------------------------------------------------------
     1. VIEW SWITCHER (SHOWCASE / CITIZEN / ADVANCED)
     ---------------------------------------------------------- */
  bindViewSwitcher() {
    const navButtons = document.querySelectorAll('[data-view-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute('data-view-target');
        this.applyView(targetView, true);
      });
    });

    // Quick launch buttons from hero & banners
    const btnHeroLaunchTwin = document.getElementById('btnHeroLaunchTwin');
    const btnHeroLaunchCitizen = document.getElementById('btnHeroLaunchCitizen');
    const btnHeroTour = document.getElementById('btnHeroTour');
    const btnCitizenToAdvanced = document.getElementById('btnCitizenToAdvanced');
    const btnAdvancedToCitizen = document.getElementById('btnAdvancedToCitizen');
    const btnHeaderReport = document.getElementById('btnHeaderReport');
    const btnHeaderTour = document.getElementById('btnHeaderTour');

    if (btnHeroLaunchTwin) {
      btnHeroLaunchTwin.addEventListener('click', () => this.applyView('advanced', true));
    }
    if (btnHeroLaunchCitizen) {
      btnHeroLaunchCitizen.addEventListener('click', () => this.applyView('citizen', true));
    }
    if (btnHeroTour) {
      btnHeroTour.addEventListener('click', () => this.startTour());
    }
    if (btnCitizenToAdvanced) {
      btnCitizenToAdvanced.addEventListener('click', () => this.applyView('advanced', true));
    }
    if (btnAdvancedToCitizen) {
      btnAdvancedToCitizen.addEventListener('click', () => this.applyView('citizen', true));
    }
    if (btnHeaderReport) {
      btnHeaderReport.addEventListener('click', () => this.openExecutiveReport());
    }
    if (btnHeaderTour) {
      btnHeaderTour.addEventListener('click', () => this.startTour());
    }
  }

  applyView(viewName, animateToast = true) {
    this.currentView = viewName;
    localStorage.setItem('aetheris_view', viewName);

    const viewLanding = document.getElementById('viewProductLanding');
    const viewCitizen = document.getElementById('viewCitizenDashboard');
    const viewAdvanced = document.getElementById('viewAdvancedTwin');
    const appHeader = document.querySelector('.app-header');

    // Update active state on nav switcher buttons
    document.querySelectorAll('[data-view-target]').forEach(btn => {
      if (btn.getAttribute('data-view-target') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all views first
    if (viewLanding) viewLanding.style.display = 'none';
    if (viewCitizen) viewCitizen.style.display = 'none';
    if (viewAdvanced) viewAdvanced.style.display = 'none';

    // Show selected view
    if (viewName === 'landing') {
      if (viewLanding) {
        viewLanding.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (appHeader) appHeader.classList.add('landing-header-mode');
      if (animateToast && this.app) {
        this.app.showToast('Navigated to Product Showcase & Solutions', 'info');
      }
    } else if (viewName === 'citizen') {
      if (viewCitizen) {
        viewCitizen.style.display = 'block';
        this.updateCitizenDashboard();
        if (this.app && this.app.resizeCharts) {
          setTimeout(() => this.app.resizeCharts(), 100);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (appHeader) appHeader.classList.remove('landing-header-mode');
      if (animateToast && this.app) {
        this.app.showToast('Citizen & Business Friendly Mode Active', 'success');
      }
    } else {
      // Advanced Twin Core
      if (viewAdvanced) {
        viewAdvanced.style.display = 'grid';
        if (this.app) {
          if (this.app.canvasEngine) {
            setTimeout(() => this.app.canvasEngine.resize(), 80);
          }
          if (this.app.resizeCharts) {
            setTimeout(() => this.app.resizeCharts(), 100);
          }
        }
      }
      if (appHeader) appHeader.classList.remove('landing-header-mode');
      if (animateToast && this.app) {
        this.app.showToast('Advanced 2.5D Digital Twin Core Active', 'info');
      }
    }
  }

  /* ----------------------------------------------------------
     2. PRODUCT LANDING PAGE INTERACTIONS
     ---------------------------------------------------------- */
  bindLandingInteractions() {
    // Billing frequency toggle (Monthly / Annual)
    const btnBillingMonthly = document.getElementById('btnBillingMonthly');
    const btnBillingAnnual = document.getElementById('btnBillingAnnual');
    const pricePro = document.getElementById('priceProVal');
    const priceEnterprise = document.getElementById('priceEnterpriseVal');
    const priceCycleLabels = document.querySelectorAll('.price-cycle-label');

    const updateBilling = (cycle) => {
      this.billingCycle = cycle;
      if (btnBillingMonthly && btnBillingAnnual) {
        if (cycle === 'annual') {
          btnBillingAnnual.classList.add('active');
          btnBillingMonthly.classList.remove('active');
          if (pricePro) pricePro.textContent = '₹6,999';
          if (priceEnterprise) priceEnterprise.textContent = '₹15,999';
          priceCycleLabels.forEach(lbl => lbl.textContent = '/ माह (वार्षिक बिलिंग - 20% बचत)');
        } else {
          btnBillingMonthly.classList.add('active');
          btnBillingAnnual.classList.remove('active');
          if (pricePro) pricePro.textContent = '₹8,499';
          if (priceEnterprise) priceEnterprise.textContent = '₹20,000';
          priceCycleLabels.forEach(lbl => lbl.textContent = '/ माह (मासिक बिलिंग - अधिकतम ₹20,000 सीमा)');
        }
      }
    };

    if (btnBillingMonthly) btnBillingMonthly.addEventListener('click', () => updateBilling('monthly'));
    if (btnBillingAnnual) btnBillingAnnual.addEventListener('click', () => updateBilling('annual'));

    // Use Case Tabs
    const useCaseTabs = document.querySelectorAll('.use-case-tab');
    useCaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        useCaseTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetCase = tab.getAttribute('data-case');
        this.switchUseCase(targetCase);
      });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) item.classList.add('open');
        });
      }
    });

    // Interactive Mini Preview Node Selector on Landing Hero
    const previewNodes = document.querySelectorAll('.preview-node-btn');
    previewNodes.forEach(btn => {
      btn.addEventListener('click', () => {
        previewNodes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const stationId = btn.getAttribute('data-station-id');
        if (this.app) {
          this.app.selectStation(stationId);
          this.updateLandingPreview();
        }
      });
    });
  }

  switchUseCase(caseId) {
    this.activeUseCase = caseId;
    const contents = document.querySelectorAll('.use-case-content');
    contents.forEach(content => {
      if (content.getAttribute('data-case-content') === caseId) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  updateLandingPreview() {
    if (!this.app || !this.app.telemetryList.length) return;
    const active = this.app.telemetryList.find(t => t.stationId === this.app.activeStationId) || this.app.telemetryList[0];
    if (!active) return;

    const elName = document.getElementById('previewStationName');
    const elAqi = document.getElementById('previewStationAqi');
    const elScore = document.getElementById('previewCleanScore');
    const elTemp = document.getElementById('previewStationTemp');
    const elHum = document.getElementById('previewStationHum');
    const elPm = document.getElementById('previewStationPm');
    const elStatus = document.getElementById('previewStationStatus');

    if (elName) elName.textContent = active.stationName;
    if (elAqi) {
      elAqi.textContent = active.aqi;
      elAqi.style.color = active.aqiColor || '#00f2fe';
    }
    const cleanScore = Math.max(5, Math.min(100, Math.round(100 - (active.aqi * 0.35))));
    if (elScore) elScore.textContent = `${cleanScore}/100`;
    if (elTemp) elTemp.textContent = `${active.temperature}°C`;
    if (elHum) elHum.textContent = `${active.humidity}%`;
    if (elPm) elPm.textContent = `${active.pm25} µg/m³`;
    if (elStatus) {
      elStatus.textContent = active.aqiCategory || 'Satisfactory';
      elStatus.style.color = active.aqiColor || '#10b981';
    }
  }

  /* ----------------------------------------------------------
     3. CITIZEN / BUSINESS FRIENDLY DASHBOARD LOGIC
     ---------------------------------------------------------- */
  bindCitizenInteractions() {
    // Temperature Unit toggle on Citizen view
    const citizenTempToggle = document.getElementById('citizenTempUnitToggle');
    if (citizenTempToggle) {
      citizenTempToggle.addEventListener('click', () => {
        if (this.app) {
          this.app.tempUnit = this.app.tempUnit === 'C' ? 'F' : 'C';
          citizenTempToggle.textContent = `°${this.app.tempUnit}`;
          this.updateCitizenDashboard();
          this.app.updateDashboardMetrics();
        }
      });
    }

    // Citizen Export Button
    const btnCitizenExport = document.getElementById('btnCitizenExport');
    if (btnCitizenExport) {
      btnCitizenExport.addEventListener('click', () => this.openExecutiveReport());
    }
  }

  updateCitizenDashboard() {
    if (!this.app || !this.app.telemetryList.length) return;
    const active = this.app.telemetryList.find(t => t.stationId === this.app.activeStationId) || this.app.telemetryList[0];
    if (!active) return;

    // 1. Station Name & State
    const cityNameEl = document.getElementById('citizenActiveStationName');
    const zoneBadgeEl = document.getElementById('citizenActiveZone');
    const timeEl = document.getElementById('citizenUpdateTime');
    if (cityNameEl) cityNameEl.textContent = active.stationName;
    if (zoneBadgeEl) zoneBadgeEl.textContent = (active.zoneType || 'URBAN CORE').replace(/_/g, ' ');
    if (timeEl) {
      const now = new Date();
      timeEl.textContent = `Updated ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }

    // 2. Clean Air Score & Verdict
    const aqi = active.aqi || 50;
    // Calculate Clean Air Score (0 - 100)
    const cleanScore = Math.max(8, Math.min(100, Math.round(100 - (aqi * 0.38))));
    const scoreValEl = document.getElementById('citizenScoreVal');
    const scoreCircleEl = document.getElementById('citizenScoreCircle');
    const verdictTitleEl = document.getElementById('citizenVerdictTitle');
    const verdictSubEl = document.getElementById('citizenVerdictSub');
    const verdictBannerEl = document.getElementById('citizenVerdictBanner');

    if (scoreValEl) scoreValEl.textContent = cleanScore;
    if (scoreCircleEl) {
      // Circumference is 2 * PI * 44 = ~276.4
      const circumference = 276.4;
      const offset = circumference - (cleanScore / 100) * circumference;
      scoreCircleEl.style.strokeDashoffset = offset;
      scoreCircleEl.style.stroke = active.aqiColor || '#10b981';
    }

    // Dynamic Human-Friendly Verdict
    let verdictTitle = '';
    let verdictSub = '';
    let verdictClass = 'verdict-good';

    if (aqi <= 50) {
      verdictTitle = '🌿 Crisp & Pristine Air — Ideal Outdoor Conditions';
      verdictSub = 'Air purity is at optimal peak. Safe and highly recommended for outdoor sports, school recess, jogging, and natural window ventilation.';
      verdictClass = 'verdict-good';
    } else if (aqi <= 100) {
      verdictTitle = '🌤️ Acceptable & Moderate Air Quality';
      verdictSub = 'Air quality is acceptable for the general public. Sensitive individuals (asthma or respiratory sensitivities) should pace prolonged intense outdoor workouts.';
      verdictClass = 'verdict-moderate';
    } else if (aqi <= 150) {
      verdictTitle = '⚠️ Sensitive Health Advisory Active';
      verdictSub = 'Particulates elevated in local urban corridor. Children, active seniors, and individuals with respiratory conditions should limit prolonged outdoor exertion.';
      verdictClass = 'verdict-sensitive';
    } else {
      verdictTitle = '🚨 High Pollution Alert — Take Protective Measures';
      verdictSub = 'Heavy particulate concentration detected. Minimize outdoor exposure, keep windows closed, and run indoor HEPA filtration systems.';
      verdictClass = 'verdict-hazardous';
    }

    if (verdictTitleEl) verdictTitleEl.textContent = verdictTitle;
    if (verdictSubEl) verdictSubEl.textContent = verdictSub;
    if (verdictBannerEl) {
      verdictBannerEl.className = `citizen-verdict-card ${verdictClass}`;
    }

    // 3. Quick Lifestyle Chips
    const chipRun = document.getElementById('citizenChipRun');
    const chipVent = document.getElementById('citizenChipVent');
    const chipUv = document.getElementById('citizenChipUv');
    const chipQuiet = document.getElementById('citizenChipQuiet');

    if (chipRun) {
      if (aqi <= 80) chipRun.innerHTML = `<strong>🏃 Outdoor Sports:</strong> Highly Recommended`;
      else if (aqi <= 120) chipRun.innerHTML = `<strong>🏃 Outdoor Sports:</strong> Moderate Pacing`;
      else chipRun.innerHTML = `<strong>🏃 Outdoor Sports:</strong> Limit / Move Indoors`;
    }

    if (chipVent) {
      if (aqi <= 75) chipVent.innerHTML = `<strong>🪟 Natural Ventilation:</strong> Open Windows Freely`;
      else if (aqi <= 130) chipVent.innerHTML = `<strong>🪟 Natural Ventilation:</strong> Filtered Air Preferred`;
      else chipVent.innerHTML = `<strong>🪟 Natural Ventilation:</strong> Keep Windows Sealed`;
    }

    if (chipUv) {
      const uv = active.uvIndex || 5.0;
      if (uv < 3) chipUv.innerHTML = `<strong>🧴 Sun Exposure:</strong> Low UV (Safe)`;
      else if (uv < 7) chipUv.innerHTML = `<strong>🧴 Sun Exposure:</strong> Moderate (SPF 30+)`;
      else chipUv.innerHTML = `<strong>🧴 Sun Exposure:</strong> High (Wear Hat & Sunscreen)`;
    }

    if (chipQuiet) {
      const noise = active.noiseDb || 55;
      if (noise < 55) chipQuiet.innerHTML = `<strong>🎧 Noise Ambience:</strong> Peaceful (${noise} dB)`;
      else if (noise < 70) chipQuiet.innerHTML = `<strong>🎧 Noise Ambience:</strong> Typical City (${noise} dB)`;
      else chipQuiet.innerHTML = `<strong>🎧 Noise Ambience:</strong> Busy Transit (${noise} dB)`;
    }

    // 4. Six Key Health Cards
    const valPurity = document.getElementById('citizenValPurity');
    const subPurity = document.getElementById('citizenSubPurity');
    const valTemp = document.getElementById('citizenValTemp');
    const subTemp = document.getElementById('citizenSubTemp');
    const valUv = document.getElementById('citizenValUv');
    const subUv = document.getElementById('citizenSubUv');
    const valWind = document.getElementById('citizenValWind');
    const subWind = document.getElementById('citizenSubWind');
    const valNoise = document.getElementById('citizenValNoise');
    const subNoise = document.getElementById('citizenSubNoise');
    const valFresh = document.getElementById('citizenValFresh');
    const subFresh = document.getElementById('citizenSubFresh');

    if (valPurity) valPurity.textContent = `${cleanScore}% Purity`;
    if (subPurity) subPurity.textContent = `PM2.5: ${active.pm25} µg/m³ • PM10: ${active.pm10} µg/m³`;

    if (valTemp) {
      if (this.app.tempUnit === 'F') {
        const fVal = Math.round((active.temperature * 1.8 + 32) * 10) / 10;
        valTemp.textContent = `${fVal}°F`;
      } else {
        valTemp.textContent = `${active.temperature}°C`;
      }
    }
    if (subTemp) subTemp.textContent = `Humidity: ${active.humidity}% • Heat Index: Optimal Comfort`;

    if (valUv) valUv.textContent = `UV ${active.uvIndex || 6.2}`;
    if (subUv) subUv.textContent = active.uvIndex > 6 ? 'Solar peak between 11 AM - 3 PM' : 'Gentle ambient sunlight';

    if (valWind) valWind.textContent = `${active.windSpeed} km/h ${active.windDirection || 'NW'}`;
    if (subWind) subWind.textContent = 'Natural microclimate ventilation active';

    if (valNoise) valNoise.textContent = `${active.noiseDb} dB`;
    if (subNoise) subNoise.textContent = active.noiseDb < 60 ? 'Calm residential tranquility' : 'Active urban corridor';

    if (valFresh) valFresh.textContent = `${Math.round(active.co2)} ppm`;
    if (subFresh) subFresh.textContent = active.co2 < 600 ? 'Natural outdoor baseline oxygenation' : 'Slightly dense atmospheric core';

    // 5. Render Citizen Station Selector Grid
    this.renderCitizenStationCards();
  }

  renderCitizenStationCards() {
    const grid = document.getElementById('citizenStationGrid');
    if (!grid || !this.app) return;

    grid.innerHTML = '';
    this.app.telemetryList.forEach(t => {
      const isSelected = t.stationId === this.app.activeStationId;
      const cleanScore = Math.max(8, Math.min(100, Math.round(100 - (t.aqi * 0.38))));
      const card = document.createElement('div');
      card.className = `citizen-station-card ${isSelected ? 'active' : ''}`;
      card.onclick = () => {
        this.app.selectStation(t.stationId);
        this.updateCitizenDashboard();
      };

      card.innerHTML = `
        <div class="station-card-top">
          <div style="font-weight:700; color:#fff; font-size:0.95rem;">${t.stationName}</div>
          <span class="station-zone-pill">${(t.zoneType || 'CORE').replace(/_/g, ' ')}</span>
        </div>
        <div class="station-card-metrics">
          <div>
            <div style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase;">Clean Air Score</div>
            <div style="font-size:1.1rem; font-weight:700; color:${t.aqiColor || '#10b981'};">${cleanScore}/100</div>
          </div>
          <div>
            <div style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase;">Temperature</div>
            <div style="font-size:1.1rem; font-weight:700; color:var(--text-main);">${t.temperature}°C</div>
          </div>
          <div>
            <div style="font-size:0.7rem; color:var(--text-dim); text-transform:uppercase;">AQI Status</div>
            <div style="font-size:0.85rem; font-weight:700; color:${t.aqiColor || '#38bdf8'};">${t.aqiCategory} (${t.aqi})</div>
          </div>
        </div>
        <div style="margin-top:0.75rem; display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted);">
          <span>📍 Lat: ${t.latitude.toFixed(2)}, Lng: ${t.longitude.toFixed(2)}</span>
          <span style="color:var(--cyan-bright); font-weight:600;">${isSelected ? '✓ Selected' : 'Click to View →'}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ----------------------------------------------------------
     4. INTERACTIVE GUIDED PRODUCT TOUR
     ---------------------------------------------------------- */
  bindTourInteractions() {
    const overlay = document.getElementById('productTourOverlay');
    const btnNext = document.getElementById('tourBtnNext');
    const btnPrev = document.getElementById('tourBtnPrev');
    const btnSkip = document.getElementById('tourBtnSkip');
    const btnFinish = document.getElementById('tourBtnFinish');

    if (btnNext) btnNext.addEventListener('click', () => this.advanceTour(1));
    if (btnPrev) btnPrev.addEventListener('click', () => this.advanceTour(-1));
    if (btnSkip) btnSkip.addEventListener('click', () => this.endTour());
    if (btnFinish) btnFinish.addEventListener('click', () => this.endTour());
  }

  startTour() {
    this.tourStep = 0;
    const overlay = document.getElementById('productTourOverlay');
    if (overlay) overlay.classList.add('open');
    this.renderTourStep();
  }

  endTour() {
    const overlay = document.getElementById('productTourOverlay');
    if (overlay) overlay.classList.remove('open');
    if (this.app) this.app.showToast('Product tour completed! Explore freely.', 'success');
  }

  advanceTour(direction) {
    this.tourStep += direction;
    const totalSteps = 6;
    if (this.tourStep >= totalSteps) {
      this.endTour();
      return;
    }
    if (this.tourStep < 0) this.tourStep = 0;
    this.renderTourStep();
  }

  renderTourStep() {
    const tourData = [
      {
        title: "Welcome to AETHERIS Earth Twin",
        badge: "Step 1 of 6 • System Overview",
        desc: "AETHERIS connects real-time physical IoT weather & air sensors with a live 2.5D predictive atmospheric simulation model. Designed for cities, enterprises, and citizens.",
        targetView: "landing",
        highlightNotice: "You can toggle between Product Showcase, Citizen View, and the Advanced Twin anytime."
      },
      {
        title: "Universal 3-in-1 View Switcher",
        badge: "Step 2 of 6 • Dual Dashboards",
        desc: "Notice the navigation tabs at the top: 'Product Showcase' for SaaS solutions, 'Citizen / Business View' for friendly natural-language health insights, and 'Advanced Twin Core' for deep engineering telemetry.",
        targetView: "citizen",
        highlightNotice: "Click 'Citizen / Business View' to see human-friendly scores and recommendations."
      },
      {
        title: "Clean Air Score & Human Health Verdicts",
        badge: "Step 3 of 6 • Plain-English Intelligence",
        desc: "Rather than confusing raw numbers, the Citizen Dashboard computes a 0-100 Clean Air Score and provides clear advice for outdoor jogging, school recess, window ventilation, and UV protection.",
        targetView: "citizen",
        highlightNotice: "All health metrics are derived dynamically from EPA and WHO environmental standards."
      },
      {
        title: "2.5D Atmospheric Particle Fluid Engine",
        badge: "Step 4 of 6 • Advanced Canvas Simulation",
        desc: "In the Advanced Twin, our custom Canvas engine renders real-time vector wind currents, PM2.5 particulate plumes, and thermal heatwave gradients across terrain elevation models.",
        targetView: "advanced",
        highlightNotice: "Click between 'Air Dispersion', 'Thermal Map', and 'Radar Proximity' above the canvas!"
      },
      {
        title: "Sub-10m GPS Geodesic Radar Pairing",
        badge: "Step 5 of 6 • Hyperlocal Sensor Sync",
        desc: "Click 'Pair Location (GPS)' to calculate the exact Haversine distance and compass bearing to the nearest physical monitoring node, rendering a live geodesic laser line on the twin map.",
        targetView: "advanced",
        highlightNotice: "Supports both browser GPS auto-detection and preset state corridors."
      },
      {
        title: "AI 'What-If' Simulation & Executive Reports",
        badge: "Step 6 of 6 • Enterprise Resilience & ESG",
        desc: "Inject extreme microclimate events (Heatwave, Industrial Emission, Cleansing Rain) to test urban response, and export official certified Environmental Audit summaries for regulatory compliance.",
        targetView: "advanced",
        highlightNotice: "Click 'Export Audit' in the header to view or print the certified compliance report!"
      }
    ];

    const current = tourData[this.tourStep];
    if (!current) return;

    // Auto switch to relevant view for context
    this.applyView(current.targetView, false);

    const titleEl = document.getElementById('tourStepTitle');
    const badgeEl = document.getElementById('tourStepBadge');
    const descEl = document.getElementById('tourStepDesc');
    const noteEl = document.getElementById('tourStepNotice');
    const btnPrev = document.getElementById('tourBtnPrev');
    const btnNext = document.getElementById('tourBtnNext');
    const btnFinish = document.getElementById('tourBtnFinish');

    if (titleEl) titleEl.textContent = current.title;
    if (badgeEl) badgeEl.textContent = current.badge;
    if (descEl) descEl.textContent = current.desc;
    if (noteEl) noteEl.textContent = current.highlightNotice;

    if (btnPrev) btnPrev.style.display = (this.tourStep === 0) ? 'none' : 'inline-block';
    if (btnNext) btnNext.style.display = (this.tourStep === tourData.length - 1) ? 'none' : 'inline-block';
    if (btnFinish) btnFinish.style.display = (this.tourStep === tourData.length - 1) ? 'inline-block' : 'none';

    // Update dots indicator
    const dotsContainer = document.getElementById('tourDotsContainer');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      tourData.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `tour-dot ${i === this.tourStep ? 'active' : ''}`;
        dot.onclick = () => {
          this.tourStep = i;
          this.renderTourStep();
        };
        dotsContainer.appendChild(dot);
      });
    }
  }

  /* ----------------------------------------------------------
     5. EXECUTIVE ENVIRONMENTAL AUDIT REPORT GENERATOR
     ---------------------------------------------------------- */
  bindReportModal() {
    const modal = document.getElementById('executiveReportModal');
    const closeBtn = document.getElementById('closeReportModal');
    const printBtn = document.getElementById('btnReportPrint');
    const jsonBtn = document.getElementById('btnReportJson');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }

    if (jsonBtn) {
      jsonBtn.addEventListener('click', () => {
        if (this.app) this.app.exportTelemetryReport();
      });
    }
  }

  openExecutiveReport() {
    const modal = document.getElementById('executiveReportModal');
    if (!modal || !this.app) return;

    const active = this.app.telemetryList.find(t => t.stationId === this.app.activeStationId) || this.app.telemetryList[0];
    if (!active) return;

    // Populate Report Fields
    const reportDate = document.getElementById('repDate');
    const reportStation = document.getElementById('repStationName');
    const reportZone = document.getElementById('repZone');
    const reportCoords = document.getElementById('repCoords');
    const reportAuditor = document.getElementById('repAuditor');
    const reportStatus = document.getElementById('repStatus');
    const reportAqi = document.getElementById('repAqi');
    const reportPm25 = document.getElementById('repPm25');
    const reportPm10 = document.getElementById('repPm10');
    const reportTemp = document.getElementById('repTemp');
    const reportHum = document.getElementById('repHum');
    const reportCo2 = document.getElementById('repCo2');
    const reportNoise = document.getElementById('repNoise');

    const now = new Date();
    if (reportDate) reportDate.textContent = now.toUTCString();
    if (reportStation) reportStation.textContent = `${active.stationName} (${active.stationId})`;
    if (reportZone) reportZone.textContent = (active.zoneType || 'URBAN CORE').replace(/_/g, ' ');
    if (reportCoords) reportCoords.textContent = `${active.latitude.toFixed(4)}° N, ${active.longitude.toFixed(4)}° E • Elev: ${active.elevation || 210}m`;
    
    const user = (this.app.authManager && this.app.authManager.currentUser)
      ? `${this.app.authManager.currentUser.fullName || this.app.authManager.currentUser.username} (${this.app.authManager.currentUser.role})`
      : 'Chief Environmental Officer (Certified Session)';
    if (reportAuditor) reportAuditor.textContent = user;

    const isCompliant = (active.aqi <= 100);
    if (reportStatus) {
      reportStatus.innerHTML = isCompliant 
        ? '<span style="color:#10b981; font-weight:bold;">COMPLIANT (Within National Ambient Air Quality Standards)</span>'
        : '<span style="color:#f59e0b; font-weight:bold;">ATTENTION REQUIRED (Particulate Exceedance Detected)</span>';
    }

    if (reportAqi) reportAqi.textContent = `${active.aqi} (${active.aqiCategory})`;
    if (reportPm25) reportPm25.textContent = `${active.pm25} µg/m³ (Limit: 35.0 µg/m³)`;
    if (reportPm10) reportPm10.textContent = `${active.pm10} µg/m³ (Limit: 150.0 µg/m³)`;
    if (reportTemp) reportTemp.textContent = `${active.temperature} °C`;
    if (reportHum) reportHum.textContent = `${active.humidity} %`;
    if (reportCo2) reportCo2.textContent = `${Math.round(active.co2)} ppm (Permissible: <1000 ppm)`;
    if (reportNoise) reportNoise.textContent = `${active.noiseDb} dB (Residential Limit: 55 dB)`;

    modal.classList.add('open');
  }

  /* ----------------------------------------------------------
     6. INDIAN BUSINESS SUBSCRIPTION & GST BILLING ENGINE
     ---------------------------------------------------------- */
  bindSubscriptionModal() {
    const modal = document.getElementById('businessSubscriptionModal');
    const closeBtn = document.getElementById('closeSubscriptionModal');
    const headerBtn = document.getElementById('btnHeaderSubscription');
    const optPro = document.getElementById('subOptPro');
    const optEnterprise = document.getElementById('subOptEnterprise');
    const btnMonthly = document.getElementById('subModalBillingMonthly');
    const btnAnnual = document.getElementById('subModalBillingAnnual');
    const stateSelect = document.getElementById('subStateSelect');
    const gstinInput = document.getElementById('subGstinInput');
    const btnComplete = document.getElementById('btnCompleteSubscription');
    const payTabs = document.querySelectorAll('.sub-payment-tab-btn');
    const btnDownloadInvoice = document.getElementById('btnDownloadGstInvoice');
    const btnLaunchTwin = document.getElementById('btnLaunchSubscribedTwin');

    this.subSelectedPlan = 'pro';
    this.subModalCycle = 'annual';
    this.subPaymentMode = 'upi';

    if (headerBtn) {
      headerBtn.addEventListener('click', () => this.openSubscriptionModal('pro'));
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    if (optPro && optEnterprise) {
      optPro.addEventListener('click', () => {
        this.subSelectedPlan = 'pro';
        optPro.classList.add('active');
        optEnterprise.classList.remove('active');
        this.recalcSubInvoice();
      });

      optEnterprise.addEventListener('click', () => {
        this.subSelectedPlan = 'enterprise';
        optEnterprise.classList.add('active');
        optPro.classList.remove('active');
        this.recalcSubInvoice();
      });
    }

    if (btnMonthly && btnAnnual) {
      btnMonthly.addEventListener('click', () => {
        this.subModalCycle = 'monthly';
        btnMonthly.classList.add('active');
        btnAnnual.classList.remove('active');
        this.recalcSubInvoice();
      });

      btnAnnual.addEventListener('click', () => {
        this.subModalCycle = 'annual';
        btnAnnual.classList.add('active');
        btnMonthly.classList.remove('active');
        this.recalcSubInvoice();
      });
    }

    if (stateSelect) {
      stateSelect.addEventListener('change', () => this.recalcSubInvoice());
    }

    if (gstinInput) {
      gstinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
      });
    }

    payTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        payTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.subPaymentMode = tab.getAttribute('data-sub-pay');
        this.renderSubPaymentContent();
      });
    });

    if (btnComplete) {
      btnComplete.addEventListener('click', () => this.processSubscriptionOrder());
    }

    if (btnDownloadInvoice) {
      btnDownloadInvoice.addEventListener('click', () => window.print());
    }

    if (btnLaunchTwin) {
      btnLaunchTwin.addEventListener('click', () => {
        if (modal) modal.classList.remove('open');
        this.applyView('advanced', true);
      });
    }

    this.renderSubPaymentContent();
  }

  openSubscriptionModal(planType = 'pro') {
    const modal = document.getElementById('businessSubscriptionModal');
    if (!modal) return;

    this.subSelectedPlan = planType;
    const optPro = document.getElementById('subOptPro');
    const optEnterprise = document.getElementById('subOptEnterprise');

    if (planType === 'pro') {
      if (optPro) optPro.classList.add('active');
      if (optEnterprise) optEnterprise.classList.remove('active');
    } else {
      if (optEnterprise) optEnterprise.classList.add('active');
      if (optPro) optPro.classList.remove('active');
    }

    // Reset views
    const formView = document.getElementById('subCheckoutFormView');
    const successView = document.getElementById('subSuccessView');
    if (formView) formView.style.display = 'grid';
    if (successView) successView.style.display = 'none';

    this.recalcSubInvoice();
    this.renderSubPaymentContent();
    modal.classList.add('open');
  }

  recalcSubInvoice() {
    const isPro = (this.subSelectedPlan === 'pro');
    const isAnnual = (this.subModalCycle === 'annual');

    // Pricing Matrix (INR) - Highest Limit Capped at ₹20,000
    // Pro: ₹6,999/mo (annual = ₹83,988/yr), Monthly = ₹8,499/mo
    // Sovereign: ₹15,999/mo (annual = ₹1,91,988/yr), Monthly = ₹20,000/mo (Maximum Ceiling)
    let baseTaxable = 0;
    let standardWithoutDiscount = 0;
    let discountAmount = 0;

    const optProPrice = document.getElementById('subOptProPrice');
    const optEntPrice = document.getElementById('subOptEntPrice');
    if (optProPrice) optProPrice.textContent = isAnnual ? '₹6,999/माह' : '₹8,499/माह';
    if (optEntPrice) optEntPrice.textContent = isAnnual ? '₹15,999/माह' : '₹20,000/माह';

    if (isPro) {
      if (isAnnual) {
        baseTaxable = 6999 * 12; // 83,988
        standardWithoutDiscount = 8499 * 12; // 101,988
        discountAmount = standardWithoutDiscount - baseTaxable; // 18,000 savings
      } else {
        baseTaxable = 8499;
        discountAmount = 0;
      }
    } else {
      // Sovereign (Highest limit capped at ₹20,000)
      if (isAnnual) {
        baseTaxable = 15999 * 12; // 191,988
        standardWithoutDiscount = 20000 * 12; // 240,000
        discountAmount = standardWithoutDiscount - baseTaxable; // 48,012 savings
      } else {
        baseTaxable = 20000;
        discountAmount = 0;
      }
    }

    // State check for GST: Supplier is Maharashtra [27]
    const stateSelect = document.getElementById('subStateSelect');
    const stateVal = stateSelect ? stateSelect.value : '27-MH';
    const isIntraState = stateVal.startsWith('27');

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIntraState) {
      cgst = baseTaxable * 0.09;
      sgst = baseTaxable * 0.09;
    } else {
      igst = baseTaxable * 0.18;
    }

    const totalGst = isIntraState ? (cgst + sgst) : igst;
    const totalPayable = baseTaxable + totalGst;

    // Update Modal DOM
    const lblPlan = document.getElementById('subInvPlanLabel');
    const elBase = document.getElementById('subInvBasePrice');
    const discountRow = document.getElementById('subInvDiscountRow');
    const elTaxable = document.getElementById('subInvTaxableAmount');
    const cgstRow = document.getElementById('subInvCgstRow');
    const sgstRow = document.getElementById('subInvSgstRow');
    const igstRow = document.getElementById('subInvIgstRow');
    const elCgst = document.getElementById('subInvCgstVal');
    const elSgst = document.getElementById('subInvSgstVal');
    const elIgst = document.getElementById('subInvIgstVal');
    const elTotal = document.getElementById('subInvTotalVal');
    const elItc = document.getElementById('subInvItcVal');
    const elNet = document.getElementById('subInvNetCost');

    if (lblPlan) {
      lblPlan.textContent = `${isPro ? 'Smart Business Pro' : 'Metropolis Sovereign'} (${isAnnual ? 'वार्षिक बिलिंग' : 'मासिक बिलिंग'})`;
    }
    if (elBase) elBase.textContent = `₹${Math.round(isAnnual ? standardWithoutDiscount : baseTaxable).toLocaleString('en-IN')}`;

    if (discountRow) {
      discountRow.style.display = isAnnual ? 'flex' : 'none';
      const elDisc = discountRow.querySelector('span:last-child');
      if (elDisc) elDisc.textContent = `- ₹${Math.round(discountAmount).toLocaleString('en-IN')}`;
    }

    if (elTaxable) elTaxable.textContent = `₹${Math.round(baseTaxable).toLocaleString('en-IN')}`;

    if (isIntraState) {
      if (cgstRow) cgstRow.style.display = 'flex';
      if (sgstRow) sgstRow.style.display = 'flex';
      if (igstRow) igstRow.style.display = 'none';
      if (elCgst) elCgst.textContent = `₹${cgst.toFixed(2)}`;
      if (elSgst) elSgst.textContent = `₹${sgst.toFixed(2)}`;
    } else {
      if (cgstRow) cgstRow.style.display = 'none';
      if (sgstRow) sgstRow.style.display = 'none';
      if (igstRow) igstRow.style.display = 'flex';
      if (elIgst) elIgst.textContent = `₹${igst.toFixed(2)}`;
    }

    if (elTotal) elTotal.textContent = `₹${totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (elItc) elItc.textContent = `₹${Math.round(totalGst).toLocaleString('en-IN')}`;
    if (elNet) elNet.textContent = `₹${Math.round(baseTaxable).toLocaleString('en-IN')}`;
  }

  renderSubPaymentContent() {
    const box = document.getElementById('subPaymentContent');
    if (!box) return;

    if (this.subPaymentMode === 'upi') {
      box.innerHTML = `
        <div style="display:flex; gap:1.25rem; align-items:center;">
          <div class="sub-qr-box">
            <!-- Simulated Crisp SVG QR Code -->
            <svg width="105" height="105" viewBox="0 0 100 100" fill="#000">
              <rect x="0" y="0" width="100" height="100" fill="#fff"/>
              <rect x="10" y="10" width="25" height="25" fill="#000"/>
              <rect x="15" y="15" width="15" height="15" fill="#fff"/>
              <rect x="18" y="18" width="9" height="9" fill="#000"/>
              <rect x="65" y="10" width="25" height="25" fill="#000"/>
              <rect x="70" y="15" width="15" height="15" fill="#fff"/>
              <rect x="73" y="18" width="9" height="9" fill="#000"/>
              <rect x="10" y="65" width="25" height="25" fill="#000"/>
              <rect x="15" y="70" width="15" height="15" fill="#fff"/>
              <rect x="18" y="73" width="9" height="9" fill="#000"/>
              <rect x="42" y="15" width="8" height="8" fill="#000"/>
              <rect x="52" y="25" width="8" height="8" fill="#000"/>
              <rect x="42" y="42" width="16" height="16" fill="#000"/>
              <rect x="65" y="45" width="10" height="8" fill="#000"/>
              <rect x="45" y="68" width="12" height="10" fill="#000"/>
              <rect x="70" y="70" width="18" height="18" fill="#000"/>
              <rect x="80" y="55" width="8" height="10" fill="#000"/>
            </svg>
            <div style="font-size:0.65rem; color:#444; font-family:var(--font-tech); font-weight:700; margin-top:2px;">BHIM UPI QR</div>
          </div>
          <div>
            <div style="font-size:0.85rem; font-weight:700; color:#fff; margin-bottom:0.25rem;">Scan & Pay with Any UPI App</div>
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.6rem;">Google Pay, PhonePe, Paytm, BHIM, CRED, Navi</div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <code style="background:rgba(255,255,255,0.06); border:1px solid var(--border-glow); padding:0.25rem 0.5rem; border-radius:4px; font-size:0.78rem; color:var(--cyan-bright);">aetheris.twin@icici</code>
              <button class="server-status-pill" onclick="navigator.clipboard.writeText('aetheris.twin@icici'); window.TwinApp.showToast('UPI VPA copied to clipboard!', 'info');" style="font-size:0.7rem; padding:0.25rem 0.6rem;">Copy VPA</button>
            </div>
          </div>
        </div>
      `;
    } else if (this.subPaymentMode === 'netbanking') {
      box.innerHTML = `
        <div style="font-size:0.85rem; color:#fff; font-weight:600; margin-bottom:0.5rem;">कॉर्पोरेट नेट बैंकिंग (Corporate Net Banking)</div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem;">
          <button class="server-status-pill active" style="justify-content:center; padding:0.4rem;">🏛️ State Bank of India</button>
          <button class="server-status-pill" style="justify-content:center; padding:0.4rem;">🏛️ HDFC Bank</button>
          <button class="server-status-pill" style="justify-content:center; padding:0.4rem;">🏛️ ICICI Bank</button>
          <button class="server-status-pill" style="justify-content:center; padding:0.4rem;">🏛️ Axis Bank</button>
          <button class="server-status-pill" style="justify-content:center; padding:0.4rem;">🏛️ Kotak Mahindra</button>
          <button class="server-status-pill" style="justify-content:center; padding:0.4rem;">🏛️ Other 50+ Banks</button>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Supports Corporate Maker-Checker approval workflows.</div>
      `;
    } else if (this.subPaymentMode === 'card') {
      box.innerHTML = `
        <div style="display:grid; grid-template-columns:2fr 1fr 1fr; gap:0.5rem;">
          <div>
            <label style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">कार्ड नंबर (RuPay / Visa / Master)</label>
            <input type="text" class="sub-form-input" placeholder="4532 •••• •••• 9921" value="4532 8901 2345 9921">
          </div>
          <div>
            <label style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">EXP (MM/YY)</label>
            <input type="text" class="sub-form-input" placeholder="12/28" value="08/29">
          </div>
          <div>
            <label style="font-size:0.72rem; color:var(--text-dim); text-transform:uppercase;">CVV</label>
            <input type="password" class="sub-form-input" placeholder="•••" value="882" maxlength="4">
          </div>
        </div>
      `;
    } else {
      // GeM / NEFT
      box.innerHTML = `
        <div style="font-size:0.85rem; color:#fff; font-weight:700; margin-bottom:0.35rem;">🏛️ GeM & NEFT/RTGS Corporate Virtual Account</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.75rem;">Government e-Marketplace (GeM) Direct Purchase / PSU Challan:</div>
        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-subtle); padding:0.6rem; border-radius:4px; font-size:0.78rem; display:grid; grid-template-columns:1fr 1fr; gap:0.4rem;">
          <div>Beneficiary: <strong style="color:#fff;">AETHERIS TWIN PVT LTD</strong></div>
          <div>IFSC Code: <strong style="color:var(--cyan-bright);">HDFC0000060</strong></div>
          <div>Virtual A/C: <strong style="color:var(--cyan-bright);">AETH2026IN88492</strong></div>
          <div>GeM Seller ID: <strong style="color:var(--amber);">GEM-SELLER-AETH-992</strong></div>
        </div>
      `;
    }
  }

  processSubscriptionOrder() {
    const companyInput = document.getElementById('subCompanyName');
    const companyName = companyInput ? companyInput.value.trim() : 'EcoSmart Industrial Ltd';

    const formView = document.getElementById('subCheckoutFormView');
    const successView = document.getElementById('subSuccessView');

    const invNoEl = document.getElementById('subSuccessInvNo');
    const keyEl = document.getElementById('subSuccessKey');
    const quotaEl = document.getElementById('subSuccessQuota');

    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `TAX-INV-2026-IN-${randomSerial}`;
    const enterpriseKey = `AETH-IN-${this.subSelectedPlan.toUpperCase()}-${randomSerial}-ACTIVE`;

    if (invNoEl) invNoEl.textContent = invoiceNumber;
    if (keyEl) keyEl.textContent = enterpriseKey;
    if (quotaEl) {
      quotaEl.textContent = (this.subSelectedPlan === 'pro') 
        ? '50 Dedicated Industrial Sensor Nodes (Active Quota)'
        : 'Unlimited Sovereign Nodes + On-Premise ICCC License (Active)';
    }

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';

    if (this.app) {
      this.app.showToast(`🎉 ${companyName} सब्सक्रिप्शन सक्रिय! Invoice: ${invoiceNumber}`, 'success');
      
      // Update header subscription status
      const headerSubBtn = document.getElementById('btnHeaderSubscription');
      if (headerSubBtn) {
        headerSubBtn.innerHTML = `
          <span style="color:#10b981;">✓</span>
          <span>PRO सदस्य (Active)</span>
        `;
        headerSubBtn.style.borderColor = 'var(--emerald)';
        headerSubBtn.style.color = '#fff';
      }
    }
  }
}

window.AetherisProductSuite = AetherisProductSuite;
