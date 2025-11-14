(() => {
  'use strict';

  // Demo accounts that users can select
  const DEMO_ACCOUNTS = {
    'alice@demo.com': {
      email: 'alice@demo.com',
      password: 'demo123',
      name: 'Alice Johnson',
      role: 'Software Engineer'
    },
    'bob@demo.com': {
      email: 'bob@demo.com',
      password: 'demo123',
      name: 'Bob Smith',
      role: 'Product Manager'
    },
    'carol@demo.com': {
      email: 'carol@demo.com',
      password: 'demo123',
      name: 'Carol Williams',
      role: 'Data Analyst'
    },
    'david@demo.com': {
      email: 'david@demo.com',
      password: 'demo123',
      name: 'David Brown',
      role: 'Marketing Specialist'
    }
  };

  const STORAGE_KEY = 'resumesensei_user';
  const USERS_KEY = 'resumesensei_users';

  // Initialize: Load registered users from localStorage
  function initUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
      // Store demo accounts as registered users too
      localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
    }
  }

  // Get all registered users
  function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  // Save users to localStorage
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // Get current user
  function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Set current user
  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Register new user
  function register(name, email, password) {
    const users = getUsers();
    
    if (users[email]) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    users[email] = {
      email,
      password, // In a real app, this would be hashed
      name,
      role: 'User'
    };

    saveUsers(users);
    return { success: true, message: 'Account created successfully!' };
  }

  // Login user
  function login(email, password) {
    const users = getUsers();
    const user = users[email];

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Create user session object (without password)
    const sessionUser = {
      email: user.email,
      name: user.name,
      role: user.role
    };

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }

  // Logout user
  function logout() {
    setCurrentUser(null);
    return true;
  }

  // Check if user is authenticated
  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  // Update navigation based on auth state
  function updateNavigation() {
    const navList = document.querySelector('.nav-list');
    if (!navList) return;

    const currentUser = getCurrentUser();
    
    // Remove existing auth-related items
    const authLinks = navList.querySelectorAll('.auth-link, #logout-link');
    authLinks.forEach(link => {
      const listItem = link.closest('li');
      if (listItem) {
        listItem.remove();
      }
    });

    const authItem = document.createElement('li');
    if (currentUser) {
      authItem.innerHTML = `
        <span class="nav-link" style="color: var(--accent);">${currentUser.name}</span>
        <a class="nav-link" href="#" id="logout-link" style="margin-left: 8px;">Logout</a>
      `;
    } else {
      authItem.innerHTML = '<a class="nav-link auth-link" href="login.html">Login</a>';
    }

    navList.appendChild(authItem);

    // Add logout handler
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
        window.location.href = 'index.html';
      });
    }
  }

  // Handle login page
  function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    const demoAccounts = document.querySelectorAll('.demo-account');

    // Demo account selection
    demoAccounts.forEach(account => {
      account.addEventListener('click', () => {
        const email = account.dataset.email;
        const password = account.dataset.password;
        
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        
        // Auto-submit after a brief delay for visual feedback
        account.style.transform = 'scale(0.98)';
        setTimeout(() => {
          account.style.transform = '';
          loginForm.dispatchEvent(new Event('submit'));
        }, 150);
      });
    });

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const result = login(email, password);
        
        if (result.success) {
          // Redirect to demo page or home, or use redirect parameter
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirect') || 'demo.html';
          window.location.href = redirectTo;
        } else {
          errorMessage.textContent = result.message;
          errorMessage.classList.add('show');
          setTimeout(() => {
            errorMessage.classList.remove('show');
          }, 5000);
        }
      });
    }
  }

  // Handle registration page
  function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validation
        if (password !== confirmPassword) {
          errorMessage.textContent = 'Passwords do not match.';
          errorMessage.classList.add('show');
          successMessage.classList.remove('show');
          return;
        }

        const result = register(name, email, password);
        
        if (result.success) {
          successMessage.textContent = result.message;
          successMessage.classList.add('show');
          errorMessage.classList.remove('show');
          
          // Auto-login and redirect
          setTimeout(() => {
            login(email, password);
            window.location.href = 'demo.html';
          }, 1500);
        } else {
          errorMessage.textContent = result.message;
          errorMessage.classList.add('show');
          successMessage.classList.remove('show');
        }
      });
    }
  }

  // Optional: Protect demo page (redirect to login if not authenticated)
  function protectDemoPage() {
    if (document.body.dataset.page === 'demo' && !isAuthenticated()) {
      window.location.href = 'login.html?redirect=demo.html';
    }
  }

  // Initialize on page load
  function init() {
    initUsers();
    updateNavigation();
    protectDemoPage();

    // Initialize page-specific handlers
    if (document.body.dataset.page === 'login') {
      initLoginPage();
    } else if (document.body.dataset.page === 'register') {
      initRegisterPage();
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for use in other scripts
  window.auth = {
    getCurrentUser,
    isAuthenticated,
    logout,
    updateNavigation
  };
})();

