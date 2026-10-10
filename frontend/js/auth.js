/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - UNIFIED AUTHENTICATION MANAGER
   Single Secure Cybernetic Gateway & Universal Session Controller
   ========================================================== */

class TwinAuthManager {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
    this.currentUser = null;
    this.token = localStorage.getItem('twin_auth_token') || null;

    this.init();
  }

  init() {
    this.bindHeaderAuthEvents();
    this.bindGatewayEvents();
    this.verifyCurrentSession();
  }

  /* ----------------------------------------------------------
     1. BIND HEADER AUTH BUTTON & UNIVERSAL NAVIGATION
     ---------------------------------------------------------- */
  bindHeaderAuthEvents() {
    const authBtn = document.getElementById('btnHeaderAuth');
    if (authBtn) {
      authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.currentUser) {
          // If already authenticated, clicking button triggers clean sign-out
          this.logout(true);
        } else {
          // If not authenticated, smoothly navigate to the ONE unified Login Page
          this.goToLogin(true);
        }
      });
    }
  }

  /* ----------------------------------------------------------
     2. DIRECT NAVIGATION TO THE SINGLE UNIFIED LOGIN PAGE
     ---------------------------------------------------------- */
  goToLogin(focusField = true) {
    if (window.TwinApp && window.TwinApp.productSuite) {
      window.TwinApp.productSuite.applyView('login', true);
    } else {
      const viewGateway = document.getElementById('viewLoginGateway');
      if (viewGateway) viewGateway.style.display = 'block';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (focusField) {
      setTimeout(() => {
        const u = document.getElementById('gwLoginUsername');
        if (u) {
          u.focus();
          u.select();
        }
      }, 180);
    }
  }

  // Backwards compatibility alias (no popup modal - navigates to single page)
  showModal() {
    this.goToLogin(true);
  }

  hideModal() {
    // No-op since there is no separate modal
  }

  /* ----------------------------------------------------------
     3. BIND UNIFIED LOGIN PAGE (GATEWAY) INTERACTIONS
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

    // Active session interactive controls
    const btnGwGoCitizen = document.getElementById('btnGwGoCitizen');
    const btnGwGoTwin = document.getElementById('btnGwGoTwin');
    const btnGwLogout = document.getElementById('btnGwLogout');
    const btnGwSwitchAccount = document.getElementById('btnGwSwitchAccount');

    // Gateway Tab Switching (Login vs Register)
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

    // Single Form Submit: Login
    if (formGwLogin) {
      formGwLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('gwLoginUsername').value.trim();
        const password = document.getElementById('gwLoginPassword').value;
        await this.login(username, password);
      });
    }

    // Single Form Submit: Register
    if (formGwRegister) {
      formGwRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('gwRegFullName').value.trim();
        const username = document.getElementById('gwRegUsername').value.trim();
        const email = document.getElementById('gwRegEmail').value.trim();
        const password = document.getElementById('gwRegPassword').value;
        const role = document.getElementById('gwRegRole').value;
        await this.register(username, email, fullName, password, role);
      });
    }

    // 1-Click Fast Fill & Immediate Login Buttons
    if (btnGwAdmin) {
      btnGwAdmin.addEventListener('click', () => {
        const u = document.getElementById('gwLoginUsername');
        const p = document.getElementById('gwLoginPassword');
        if (u) u.value = 'admin';
        if (p) p.value = 'admin123';
        this.login('admin', 'admin123');
      });
    }

    if (btnGwOperator) {
      btnGwOperator.addEventListener('click', () => {
        const u = document.getElementById('gwLoginUsername');
        const p = document.getElementById('gwLoginPassword');
        if (u) u.value = 'operator';
        if (p) p.value = 'operator123';
        this.login('operator', 'operator123');
      });
    }

    // Instant Guest Citizen Entry (Zero password required)
    if (btnGwGuest) {
      btnGwGuest.addEventListener('click', () => {
        this.loginGuest();
      });
    }

    // Active session card buttons
    if (btnGwGoCitizen) {
      btnGwGoCitizen.addEventListener('click', () => {
        if (window.TwinApp && window.TwinApp.productSuite) {
          window.TwinApp.productSuite.applyView('citizen', true);
        }
      });
    }

    if (btnGwGoTwin) {
      btnGwGoTwin.addEventListener('click', () => {
        if (window.TwinApp && window.TwinApp.productSuite) {
          window.TwinApp.productSuite.applyView('advanced', true);
        }
      });
    }

    if (btnGwLogout) {
      btnGwLogout.addEventListener('click', () => {
        this.logout(true);
      });
    }

    if (btnGwSwitchAccount) {
      btnGwSwitchAccount.addEventListener('click', () => {
        const sessionBox = document.getElementById('gwActiveSessionBox');
        const authFormsBox = document.getElementById('gwAuthFormsBox');
        if (sessionBox) sessionBox.style.display = 'none';
        if (authFormsBox) authFormsBox.style.display = 'block';
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

  /* ----------------------------------------------------------
     4. LOGIN ENGINE (BACKEND API + CLIENT RESILIENT DEMO)
     ---------------------------------------------------------- */
  async login(username, password) {
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
      console.info('Backend API offline, checking client credentials:', err.message);
    }

    // 2. Resilient Client-Side / Demo Fallback
    if (!authSuccess) {
      const userLower = (username || '').toLowerCase();

      // Check registered users in local storage first
      try {
        const registered = JSON.parse(localStorage.getItem('twin_registered_users') || '[]');
        const found = registered.find(u => 
          (u.username.toLowerCase() === userLower || u.email.toLowerCase() === userLower) && u.password === password
        );
        if (found) {
          authSuccess = true;
          authData = {
            id: found.id,
            username: found.username,
            email: found.email,
            fullName: found.fullName,
            role: found.role,
            token: `jwt-local-${Date.now()}`
          };
        }
      } catch (e) {
        console.warn(e);
      }

      // Check default demo accounts
      if (!authSuccess) {
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
            email: 'research@aetheris.env',
            fullName: 'Atmospheric Researcher',
            role: 'RESEARCHER',
            token: `sim-jwt-res-${Date.now()}`
          };
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
      this.updateGatewayActiveSessionUi();
      this.setGatewayAlert(`Welcome back, ${this.currentUser.fullName}! Access granted. Entering dashboard...`, 'success');

      // Navigate to Citizen Dashboard
      if (window.TwinApp && window.TwinApp.productSuite) {
        setTimeout(() => {
          window.TwinApp.productSuite.applyView('citizen', true);
        }, 380);
      }

      if (window.TwinApp) {
        window.TwinApp.showToast(`Authenticated as ${this.currentUser.fullName} (${this.currentUser.role})`, 'success');
      }
      return true;
    } else {
      const errMsg = 'Invalid credentials. Please click Quick Fill (Admin / Operator) or Instant Guest Access.';
      this.setGatewayAlert(errMsg, 'error');
      return false;
    }
  }

  /* ----------------------------------------------------------
     5. INSTANT GUEST CITIZEN ACCESS
     ---------------------------------------------------------- */
  loginGuest() {
    this.token = `guest-token-${Date.now()}`;
    this.currentUser = {
      id: 99,
      username: 'guest',
      email: 'guest@aetheris.env',
      fullName: 'Citizen Explorer',
      role: 'GUEST'
    };

    localStorage.setItem('twin_auth_token', this.token);
    localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

    this.updateHeaderUi();
    this.updateGatewayActiveSessionUi();
    this.setGatewayAlert('Instant Guest Citizen entry authorized! Loading dashboard...', 'success');

    if (window.TwinApp && window.TwinApp.productSuite) {
      setTimeout(() => {
        window.TwinApp.productSuite.applyView('citizen', true);
      }, 300);
    }

    if (window.TwinApp) {
      window.TwinApp.showToast('Welcome, Citizen Explorer! Live Environmental Dashboard Active.', 'success');
    }
  }

  /* ----------------------------------------------------------
     6. REGISTER NEW USER
     ---------------------------------------------------------- */
  async register(username, email, fullName, password, role) {
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
      this.updateGatewayActiveSessionUi();
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
      this.setGatewayAlert(errMsg, 'error');
    }
  }

  /* ----------------------------------------------------------
     7. VERIFY SESSION & LOGOUT
     ---------------------------------------------------------- */
  async verifyCurrentSession() {
    if (!this.token) {
      this.updateHeaderUi();
      this.updateGatewayActiveSessionUi();
      return;
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (res.ok) {
        this.currentUser = await res.json();
        this.updateHeaderUi();
        this.updateGatewayActiveSessionUi();
        return;
      }
    } catch (err) {
      // Offline fallback
    }

    const cached = localStorage.getItem('twin_user_info');
    if (cached) {
      try {
        this.currentUser = JSON.parse(cached);
        this.updateHeaderUi();
        this.updateGatewayActiveSessionUi();
      } catch (e) {
        this.logout(false);
      }
    } else {
      this.updateHeaderUi();
      this.updateGatewayActiveSessionUi();
    }
  }

  logout(showNotification = true) {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('twin_auth_token');
    localStorage.removeItem('twin_user_info');
    this.updateHeaderUi();
    this.updateGatewayActiveSessionUi();

    // Navigate cleanly to the ONE single Login page
    if (window.TwinApp && window.TwinApp.productSuite) {
      window.TwinApp.productSuite.applyView('login', false);
    }

    this.setGatewayAlert('You have signed out. Please authenticate to continue.', 'info');

    if (showNotification && window.TwinApp) {
      window.TwinApp.showToast('Logged out of Digital Twin session.', 'info');
    }
  }

  /* ----------------------------------------------------------
     8. UI SYNC: HEADER & GATEWAY ACTIVE SESSION
     ---------------------------------------------------------- */
  updateHeaderUi() {
    const authBtn = document.getElementById('btnHeaderAuth');
    const userDisplay = document.getElementById('headerUserDisplay');
    const navBtnLoginLabel = document.getElementById('navBtnLoginLabel');

    if (navBtnLoginLabel) {
      navBtnLoginLabel.textContent = this.currentUser ? 'Portal / Profile' : 'Login Portal';
    }

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
        const initial = (this.currentUser.fullName || this.currentUser.username || 'U')[0].toUpperCase();
        userDisplay.innerHTML = `
          <div class="header-user-badge" title="Active User: ${this.currentUser.fullName}">
            <div class="user-avatar-mini">${initial}</div>
            <div class="user-info-mini">
              <span class="user-name-mini">${this.currentUser.fullName || this.currentUser.username}</span>
              <span class="user-role-mini">${this.currentUser.role}</span>
            </div>
          </div>
        `;
        userDisplay.style.display = 'block';
      }
    } else {
      authBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        <span>Sign In</span>
      `;
      authBtn.classList.add('primary');

      if (userDisplay) {
        userDisplay.style.display = 'none';
      }
    }
  }

  updateGatewayActiveSessionUi() {
    const sessionBox = document.getElementById('gwActiveSessionBox');
    const authFormsBox = document.getElementById('gwAuthFormsBox');
    const activeUserName = document.getElementById('gwActiveUserName');
    const activeUserRole = document.getElementById('gwActiveUserRole');
    const activeUserEmail = document.getElementById('gwActiveUserEmail');
    const activeUserAvatar = document.getElementById('gwActiveUserAvatar');

    if (!sessionBox || !authFormsBox) return;

    if (this.currentUser) {
      sessionBox.style.display = 'block';
      authFormsBox.style.display = 'none';

      if (activeUserName) activeUserName.textContent = this.currentUser.fullName || this.currentUser.username;
      if (activeUserRole) activeUserRole.textContent = this.currentUser.role;
      if (activeUserEmail) activeUserEmail.textContent = this.currentUser.email || 'operator@aetheris.env';
      if (activeUserAvatar) {
        activeUserAvatar.textContent = (this.currentUser.fullName || this.currentUser.username || 'U')[0].toUpperCase();
      }
    } else {
      sessionBox.style.display = 'none';
      authFormsBox.style.display = 'block';
    }
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

window.TwinAuthManager = TwinAuthManager;
