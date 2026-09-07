const AUTH_KEY = 'apex_admin_session';

// Simulates secure login with percentage loader
function performLoginWithProgress(username, password) {
  return new Promise((resolve, reject) => {
    if (username === 'admin' && password === 'admin123') {
      const loaderScreen = document.getElementById('login-loader-screen');
      const progressBar = document.getElementById('loading-progress-bar');
      const progressText = document.getElementById('loading-percentage-text');
      
      if (loaderScreen) loaderScreen.style.display = 'flex';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          localStorage.setItem(AUTH_KEY, JSON.stringify({ token: 'active_session', user: username, timestamp: Date.now() }));
          setTimeout(() => {
            if (loaderScreen) loaderScreen.style.display = 'none';
            window.location.href = '/admin';
          }, 200);
        }
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.innerText = progress + '%';
      }, 100);
    } else {
      reject('Invalid username or password.');
    }
  });
}

function checkAdminAuth() {
  const session = localStorage.getItem(AUTH_KEY);
  if (!session && window.location.pathname.includes('/admin')) {
    window.location.href = '/index';
  }
}

function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = '/index';
}

document.addEventListener('DOMContentLoaded', checkAdminAuth);
