/* ==========================================================
   DIGITAL ENVIRONMENT TWIN - AUTHENTICATION MANAGER
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
    this.verifyCurrentSession();
  }

  bindEvents() {
    const authBtn = document.getElementById('btnHeaderAuth');
    const closeBtn = document.getElementById('closeAuthModal');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');

    // Quick fill demo buttons
    const demoAdminBtn = document.getElementById('btnDemoAdmin');
    const demoOpBtn = document.getElementById('btnDemoOperator');

    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (this.currentUser) {
          this.logout();
        } else {
          this.showModal();
        }
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => this.hideModal());

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.hideModal();
      });
    }

    // Tab toggling
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

    // Submit Login
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await this.login(username, password);
      });
    }

    // Submit Register
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

    // Quick fill buttons
    if (demoAdminBtn) {
      demoAdminBtn.addEventListener('click', () => {
        document.getElementById('loginUsername').value = 'admin';
        document.getElementById('loginPassword').value = 'admin123';
        this.login('admin', 'admin123');
      });
    }

    if (demoOpBtn) {
      demoOpBtn.addEventListener('click', () => {
        document.getElementById('loginUsername').value = 'operator';
        document.getElementById('loginPassword').value = 'operator123';
        this.login('operator', 'operator123');
      });
    }
  }

  showModal() {
    if (this.modal) this.modal.classList.add('open');
  }

  hideModal() {
    if (this.modal) this.modal.classList.remove('open');
  }

  async login(username, password) {
    const errorBox = document.getElementById('authErrorMsg');
    if (errorBox) errorBox.textContent = '';

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.token = data.token;
        this.currentUser = {
          id: data.userId,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role
        };
        localStorage.setItem('twin_auth_token', this.token);
        localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

        this.updateHeaderUi();
        this.hideModal();
        if (window.TwinApp) {
          window.TwinApp.showToast(`Welcome back, ${data.fullName}! (${data.role})`, 'success');
        }
      } else {
        if (errorBox) errorBox.textContent = data.message || 'Invalid username or password';
      }
    } catch (err) {
      console.error('Login error:', err);
      if (errorBox) errorBox.textContent = 'Server connection error. Ensure backend is running.';
    }
  }

  async register(username, email, fullName, password, role) {
    const errorBox = document.getElementById('authErrorMsg');
    if (errorBox) errorBox.textContent = '';

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, fullName, password, role })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.token = data.token;
        this.currentUser = {
          id: data.userId,
          username: data.username,
          email: data.email,
          fullName: data.fullName,
          role: data.role
        };
        localStorage.setItem('twin_auth_token', this.token);
        localStorage.setItem('twin_user_info', JSON.stringify(this.currentUser));

        this.updateHeaderUi();
        this.hideModal();
        if (window.TwinApp) {
          window.TwinApp.showToast(`Account created! Logged in as ${data.username}`, 'success');
        }
      } else {
        if (errorBox) errorBox.textContent = data.message || 'Registration failed';
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (errorBox) errorBox.textContent = 'Registration failed. Try again.';
    }
  }

  async verifyCurrentSession() {
    if (!this.token) {
      this.updateHeaderUi();
      return;
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });

      if (res.ok) {
        this.currentUser = await res.json();
        this.updateHeaderUi();
      } else {
        this.logout(false);
      }
    } catch (err) {
      // In offline mode, check cached user info
      const cached = localStorage.getItem('twin_user_info');
      if (cached) {
        try {
          this.currentUser = JSON.parse(cached);
          this.updateHeaderUi();
        } catch (e) {
          this.logout(false);
        }
      }
    }
  }

  logout(showNotification = true) {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('twin_auth_token');
    localStorage.removeItem('twin_user_info');
    this.updateHeaderUi();

    if (showNotification && window.TwinApp) {
      window.TwinApp.showToast('Logged out of Digital Twin session.', 'info');
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
