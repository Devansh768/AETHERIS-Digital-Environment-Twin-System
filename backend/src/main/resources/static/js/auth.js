/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - AUTHENTICATION & GATEWAY MANAGER
   High-Security Cybernetic Authentication & First-View Gatekeeper
   ========================================================== */

class TwinAuthManager {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.currentUser = null;
    this.token = localStorage.getItem('twin_auth_token') || null;

    this.modal = document.getElementById('authModal');
    this.init();
  }

  init() {
    this.bindEvents();
    this.bindGatewayEvents();
    this.verifyCurrentSession();
  }

  /* ----------------------------------------------------------
     1. BIND MODAL & HEADER AUTH EVENTS
     ---------------------------------------------------------- */
  bindEvents() {
    const authBtn = document.getElementById('btnHeaderAuth');
    const closeBtn = document.getElementById('closeAuthModal');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    // Quick fill demo buttons in modal
    const demoAdminBtn = document.getElementById('btnDemoAdmin');
    const demoOpBtn = document.getElementById('btnDemoOperator');

    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (this.currentUser) {
          this.logout();
        } else {
          // If on gateway, keep on gateway; otherwise show modal
          if (window.TwinApp && window.TwinApp.productSuite && window.TwinApp.productSuite.currentView === 'login') {
            document.getElementById('gwLoginUsername')?.focus();
          } else {
            this.showModal();
          }
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => this.hideModal());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.hideModal();
      });
    }

    // Modal Tab toggling
    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        if (formLogin) formLogin.style.display = 'block';
        if (formRegister) formRegister.style.display = 'none';
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        if (formLogin) formLogin.style.display = 'none';
        if (formRegister) formRegister.style.display = 'block';
      });
    }

    // Modal Submit Login
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await this.login(username, password);
      });
    }

    // Modal Submit Register
    if (formRegister) {
      formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const fullName = document.getElementById('regFullName').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        await this.register(username, email, fullName, password, role);
      });
    }

    // Quick fill buttons in modal
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        const u = document.getElementById('loginUsername');
        const p = document.getElementById('loginPassword');
        if (u) u.value = 'admin';
        if (p) p.value = 'admin123';
        this.login('admin', 'admin123');
      });
    }

    if (demoOpBtn) {
      demoOpBtn.addEventListener('click', () => {
        const u = document.getElementById('loginUsername');
        const p = document.getElementById('loginPassword');
        if (u) u.value = 'operator';
        if (p) p.value = 'operator123';
        this.login('operator', 'operator123');
      });
    }
  }

  /* ----------------------------------------------------------
     2. BIND FIRST-VIEW LOGIN GATEWAY EVENTS
     ---------------------------------------------------------- */
  bindGatewayEvents() {
    const tabGwLogin = document.getElementById('tabGatewayLogin');
    const tabGwRegister = document.getElementById('tabGatewayRegister');
    const formGwLogin = document.getElementById('formGatewayLogin');
    const formGwRegister = document.getElementById('formGatewayRegister');
    const btnGwAdmin = document.getElementById('btnGwDemoAdmin');
    const btnGwOperator = document.getElementById('btnGwDemoOperator');
    const btnGwGuest = document.getElementById('btnGwGuestAccess');
    const btnToggleGwPass = document.getElementById('btnToggleGwPassword');
    const inputGwPass = document.getElementById('gwLoginPassword');

    // Gateway tab switching
    if (tabGwLogin && tabGwRegister) {
      tabGwLogin.addEventListener('click', () => {
        tabGwLogin.classList.add('active');
        tabGwRegister.classList.remove('active');
        if (formGwLogin) formGwLogin.style.display = 'block';
        if (formGwRegister) formGwRegister.style.display = 'none';
        this.setGatewayAlert('', '');
      });

      tabGwRegister.addEventListener('click', () => {
        tabGwRegister.classList.add('active');
        tabGwLogin.classList.remove('active');
        if (formGwLogin) formGwLogin.style.display = 'none';
        if (formGwRegister) formGwRegister.style.display = 'block';
        this.setGatewayAlert('', '');
      });
    }

    // Password visibility toggle
    if (btnToggleGwPass && inputGwPass) {
      btnToggleGwPass.addEventListener('click', () => {
        const isPass = (inputGwPass.type === 'password');
        inputGwPass.type = isPass ? 'text' : 'password';
        btnToggleGwPass.textContent = isPass ? 'Hide' : 'Show';
      });
    }

    // Gateway submit login
    if (formGwLogin) {
      formGwLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('gwLoginUsername').value.trim();
        const password = document.getElementById('gwLoginPassword').value;
        await this.login(username, password, true);
      });
    }

    // Gateway submit registration
    if (formGwRegister) {
      formGwRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('gwRegFullName').value.trim();
        const username = document.getElementById('gwRegUsername').value.trim();
        const email = document.getElementById('gwRegEmail').value.trim();
        const password = document.getElementById('gwRegPassword').value;
        const role = document.getElementById('gwRegRole').value;
        await this.register(username, email, fullName, password, role, true);
      });
    }

    // Gateway 1-Click Demo Buttons
    if (btnGwAdmin) {
      btnGwAdmin.addEventListener('click', () => {
        const u = document.getElementById('gwLoginUsername');
        const p = document.getElementById('gwLoginPassword');
        if (u) u.value = 'admin';
        if (p) p.value = 'admin123';
        this.login('admin', 'admin123', true);
      });
    }

    if (btnGwOperator) {
      btnGwOperator.addEventListener('click', () => {
        const u = document.getElementById('gwLoginUsername');
        const p = document.getElementById('gwLoginPassword');
        if (u) u.value = 'operator';
        if (p) p.value = 'operator123';
        this.login('operator', 'operator123', true);
      });
    }

    // Instant Guest Citizen Entry
    if (btnGwGuest) {
      btnGwGuest.addEventListener('click', () => {
        this.loginGuest();
      });
    }
  }

  setGatewayAlert(msg, type = 'error') {
    const alertBox = document.getElementById('gatewayAlertMsg');
    if (!alertBox) return;
    if (!msg) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
      return;
    }
    alertBox.textContent = msg;
    alertBox.className = `gateway-alert-box ${type}`;
    alertBox.style.display = 'block';
  }

  showModal() {
    if (this.modal) this.modal.classList.add('open');
  }

  hideModal() {
    if (this.modal) this.modal.classList.remove('open');
  }

  /* ----------------------------------------------------------
     3. LOGIN (WITH RESILIENT DEMO/OFFLINE FALLBACK)
     ---------------------------------------------------------- */
  async login(username, password, fromGateway = false) {
    const modalError = document.getElementById('authErrorMsg');
    if (modalError) modalError.textContent = '';
    this.setGatewayAlert('', '');

    let authSuccess = false;
    let authData = null;

    // 1. Attempt Spring Boot backend API
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          authSuccess = true;
          authData = {
            id: data.userId || 1,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            token: data.token || `token-${Date.now()}`
          };
        }
      }
    } catch (err) {
      console.info('Backend API offline or unreachable, checking client-side credentials:', err.message);
    }

    // 2. Resilient Client-Side / Demo Fallback
    if (!authSuccess) {
      const userLower = (username || '').toLowerCase();
      
      // Check demo accounts
      if (userLower === 'admin') {
        authSuccess = true;
        authData = {
          id: 1,
          username: 'admin',
          email: 'admin@aetheris.env',
          fullName: 'Administrator Console',
          role: 'ADMIN',
          token: `sim-jwt-admin-${Date.now()}`
        };
      } else if (userLower === 'operator') {
        authSuccess = true;
        authData = {
          id: 2,
          username: 'operator',
          email: 'operator@aetheris.env',
          fullName: 'Environmental Operator',
          role: 'OPERATOR',
          token: `sim-jwt-op-${Date.now()}`
        };
      } else if (userLower === 'researcher') {
        authSuccess = true;
        authData = {
          id: 3,
          username: 'researcher',
          email: 'researcher@aetheris.env',
          fullName: 'Atmospheric Researcher',
          role: 'RESEARCHER',
          token: `sim-jwt-res-${Date.now()}`
        };
      } else {
        // Check local registered accounts
        try {
          const registered = JSON.parse(localStorage.getItem('twin_registered_users') || '[]');
          const found = registered.find(u => u.username.toLowerCase() === userLower || u.email.toLowerCase() === userLower);
          if (found && (!found.password || found.password === password)) {
            authSuccess = true;
            authData = {
              id: found.id || 10,
              username: found.username,
              email: found.email,
              fullName: found.fullName,
              role: found.role || 'OPERATOR',
              token: `sim-jwt-reg-${Date.now()}`
            };
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 3. Process outcome
    if (authSuccess && authData) {
      this.token = authData.token;
      this.currentUser = {
        id: authData.id,
        username: authData.username,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role
      };

      localStorage.setItem('twin_auth_token', this.token);
      localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

      this.updateHeaderUi();
      this.hideModal();
      this.setGatewayAlert(`Welcome, ${this.currentUser.fullName}! Entering dashboard...`, 'success');

      // Navigate to Citizen Dashboard as requested
      if (window.TwinApp && window.TwinApp.productSuite) {
        setTimeout(() => {
          window.TwinApp.productSuite.applyView('citizen', true);
        }, 350);
      }

      if (window.TwinApp) {
        window.TwinApp.showToast(`Welcome back, ${this.currentUser.fullName}! (${this.currentUser.role})`, 'success');
      }
      return true;
    } else {
      const errMsg = 'Invalid credentials. Use Quick Fill (Admin / Operator) or Instant Guest Access.';
      if (modalError) modalError.textContent = errMsg;
      this.setGatewayAlert(errMsg, 'error');
      return false;
    }
  }

  /* ----------------------------------------------------------
     4. INSTANT GUEST CITIZEN ACCESS
     ---------------------------------------------------------- */
  loginGuest() {
    this.token = `guest-token-${Date.now()}`;
    this.currentUser = {
      id: 99,
      username: 'guest',
      email: 'guest@aetheris.env',
      fullName: 'Guest Citizen',
      role: 'GUEST'
    };

    localStorage.setItem('twin_auth_token', this.token);
    localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

    this.updateHeaderUi();
    this.hideModal();
    this.setGatewayAlert('Guest entry authorized! Loading dashboard...', 'success');

    if (window.TwinApp && window.TwinApp.productSuite) {
      setTimeout(() => {
        window.TwinApp.productSuite.applyView('citizen', true);
      }, 300);
    }

    if (window.TwinApp) {
      window.TwinApp.showToast('Welcome, Guest Citizen! Live Environmental Dashboard Active.', 'success');
    }
  }

  /* ----------------------------------------------------------
     5. REGISTER NEW USER
     ---------------------------------------------------------- */
  async register(username, email, fullName, password, role, fromGateway = false) {
    const modalError = document.getElementById('authErrorMsg');
    if (modalError) modalError.textContent = '';
    this.setGatewayAlert('', '');

    let regSuccess = false;
    let regData = null;

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, fullName, password, role })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          regSuccess = true;
          regData = data;
        }
      }
    } catch (err) {
      console.info('Backend API offline, saving account locally:', err.message);
    }

    // Local account fallback
    if (!regSuccess) {
      try {
        const registered = JSON.parse(localStorage.getItem('twin_registered_users') || '[]');
        const newUser = {
          id: Date.now(),
          username,
          email,
          fullName,
          password,
          role
        };
        registered.push(newUser);
        localStorage.setItem('twin_registered_users', JSON.stringify(registered));

        regSuccess = true;
        regData = {
          userId: newUser.id,
          username,
          email,
          fullName,
          role,
          token: `sim-jwt-reg-${Date.now()}`
        };
      } catch (e) {
        console.error(e);
      }
    }

    if (regSuccess && regData) {
      this.token = regData.token || `sim-jwt-${Date.now()}`;
      this.currentUser = {
        id: regData.userId || 10,
        username: regData.username,
        email: regData.email,
        fullName: regData.fullName,
        role: regData.role
      };

      localStorage.setItem('twin_auth_token', this.token);
      localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

      this.updateHeaderUi();
      this.hideModal();
      this.setGatewayAlert('Account created successfully! Loading dashboard...', 'success');

      if (window.TwinApp && window.TwinApp.productSuite) {
        setTimeout(() => {
          window.TwinApp.productSuite.applyView('citizen', true);
        }, 350);
      }

      if (window.TwinApp) {
        window.TwinApp.showToast(`Account created! Welcome, ${this.currentUser.fullName}!`, 'success');
      }
    } else {
      const errMsg = 'Registration failed. Please verify your details.';
      if (modalError) modalError.textContent = errMsg;
      this.setGatewayAlert(errMsg, 'error');
    }
  }

  /* ----------------------------------------------------------
     6. VERIFY SESSION / LOGOUT
     ---------------------------------------------------------- */
  async verifyCurrentSession() {
    if (!this.token) {
      this.updateHeaderUi();
      return;
    }

    // Try verifying with backend if possible
    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (res.ok) {
        this.currentUser = await res.json();
        this.updateHeaderUi();
        return;
      }
    } catch (err) {
      // Offline fallback: verify cached user info
    }

    const cached = localStorage.getItem('twin_user_info');
    if (cached) {
      try {
        this.currentUser = JSON.parse(cached);
        this.updateHeaderUi();
      } catch (e) {
        this.logout(false);
      }
    } else {
      this.updateHeaderUi();
    }
  }

  logout(showNotification = true) {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('twin_auth_token');
    localStorage.removeItem('twin_user_info');
    this.updateHeaderUi();

    // Return to the first-page Login Gateway view
    if (window.TwinApp && window.TwinApp.productSuite) {
      window.TwinApp.productSuite.applyView('login', false);
    }

    if (showNotification && window.TwinApp) {
      window.TwinApp.showToast('Logged out of Digital Twin session. Please sign in to continue.', 'info');
    }
  }

  updateHeaderUi() {
    const authBtn = document.getElementById('btnHeaderAuth');
    const userDisplay = document.getElementById('headerUserDisplay');

    if (!authBtn) return;

    if (this.currentUser) {
      authBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      `;
      authBtn.classList.remove('primary');

      if (userDisplay) {
        userDisplay.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.25rem 0.65rem; border-radius:12px; border:1px solid var(--border-subtle);">
            <div style="width:24px; height:24px; border-radius:50%; background:linear-gradient(135deg, #00f2fe, #8b5cf6); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:11px; color:#060911;">
              ${(this.currentUser.fullName || this.currentUser.username || 'U')[0].toUpperCase()}
            </div>
            <div style="display:flex; flex-direction:column; line-height:1.2;">
              <span style="font-size:0.82rem; font-weight:700; color:#fff;">${this.currentUser.fullName || this.currentUser.username}</span>
              <span style="font-size:0.65rem; color:var(--cyan-bright); font-family:var(--font-tech); text-transform:uppercase;">${this.currentUser.role}</span>
            </div>
          </div>
        `;
        userDisplay.style.display = 'block';
      }
    } else {
      authBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Sign In</span>
      `;
      authBtn.classList.add('primary');

      if (userDisplay) {
        userDisplay.style.display = 'none';
      }
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

window.TwinAuthManager = TwinAuthManager;
