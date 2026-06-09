/* ============================================================
   ABSOLUTE — js/app.js
   Root Application Controller | Page Detection | Session
   Bootstraps all modules for login and dashboard pages
   ============================================================ */

const AbsoluteApp = (() => {

  // ----------------------------------------------------------
  // PAGE DETECTION
  // ----------------------------------------------------------
  const isLoginPage     = window.location.pathname.includes('index') ||
                          window.location.pathname === '/' ||
                          window.location.pathname.endsWith('/');
  const isDashboardPage = window.location.pathname.includes('dashboard');

  // ----------------------------------------------------------
  // SESSION
  // ----------------------------------------------------------
  function getAgent() {
    return sessionStorage.getItem('absolute_agent') || 'Agent';
  }

  function checkSession() {
    if (isDashboardPage) {
      const agent = getAgent();
      if (!agent || agent === '') {
        window.location.href = 'index.html';
        return false;
      }
    }
    return true;
  }

  // ----------------------------------------------------------
  // INJECT AGENT NAME
  // ----------------------------------------------------------
  function injectAgentName() {
    const agent = getAgent();

    // Nav agent name
    const navName = document.getElementById('nav-agent-name');
    if (navName) navName.textContent = agent.toUpperCase();

    // Media profile
    const mediaName = document.getElementById('media-profile-name');
    if (mediaName) mediaName.textContent = `Agent ${agent}`;

    const mediaHandle = document.getElementById('media-profile-handle');
    if (mediaHandle) {
      mediaHandle.textContent = `@${agent.toLowerCase().replace(/\s+/g, '.')}.absolute`;
    }

    const mediaAvatar = document.getElementById('media-profile-avatar');
    if (mediaAvatar) mediaAvatar.textContent = agent.charAt(0).toUpperCase();

    const createPostAvatar = document.getElementById('create-post-avatar');
    if (createPostAvatar) createPostAvatar.textContent = agent.charAt(0).toUpperCase();

    // Mission form agent name pre-fill
    const missionAgent = document.getElementById('mission-agent-name');
    if (missionAgent) missionAgent.value = agent;
  }

  // ----------------------------------------------------------
  // SYSTEM CLOCK
  // ----------------------------------------------------------
  function startSystemClock() {
    const clockEl = document.getElementById('system-time');
    if (!clockEl) return;

    function updateClock() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ----------------------------------------------------------
  // ENV KEYS INJECTION
  // Helper to read from .env for local dev
  // In production inject via server-side template
  // ----------------------------------------------------------
  function injectEnvKeys() {
    if (window.__ENV__) {
      // Keys are already injected via the script block in HTML
      // This is a safety check
      if (!window.__ENV__.CLAUDE_API_KEY) {
        console.warn(
          '%c[ABSOLUTE] CLAUDE_API_KEY not set. Add to window.__ENV__ in HTML.',
          'color: #ff4d4d; font-weight: bold; font-size: 12px;'
        );
      }
      if (!window.__ENV__.FAL_API_KEY) {
        console.warn(
          '%c[ABSOLUTE] FAL_API_KEY not set. Add to window.__ENV__ in HTML.',
          'color: #ff4d4d; font-weight: bold; font-size: 12px;'
        );
      }
    }
  }

  // ----------------------------------------------------------
  // GSAP SETUP
  // ----------------------------------------------------------
  function setupGSAP() {
    if (!window.gsap) return;

    // Register custom ease
    if (window.CustomEase) {
      CustomEase.create('absoluteEase', 'M0,0 C0.16,1 0.3,1 1,1');
    }

    // Default GSAP settings
    gsap.defaults({
      ease:     'power3.out',
      duration: 0.6
    });
  }

  // ----------------------------------------------------------
  // LOGIN PAGE BOOT
  // ----------------------------------------------------------
  function bootLoginPage() {
    console.log(
      '%c ABSOLUTE v1.0.0 ',
      'background: #00f5ff; color: #00000f; font-weight: bold; font-size: 14px; padding: 4px 8px;'
    );
    console.log(
      '%c Interdimensional Operations Hub — LOGIN',
      'color: #7b2fff; font-size: 11px;'
    );

    setupGSAP();
    injectEnvKeys();

    // Cursor and scene are auto-inited via their own DOMContentLoaded
    // Auth is auto-inited via its own DOMContentLoaded
  }

  // ----------------------------------------------------------
  // DASHBOARD PAGE BOOT
  // ----------------------------------------------------------
  function bootDashboardPage() {
    console.log(
      '%c ABSOLUTE v1.0.0 ',
      'background: #00f5ff; color: #00000f; font-weight: bold; font-size: 14px; padding: 4px 8px;'
    );
    console.log(
      '%c Interdimensional Operations Hub — DASHBOARD',
      'color: #7b2fff; font-size: 11px;'
    );

    setupGSAP();
    injectEnvKeys();
    injectAgentName();
    startSystemClock();
    animateDashboardEntrance();
  }

  // ----------------------------------------------------------
  // DASHBOARD ENTRANCE ANIMATION
  // ----------------------------------------------------------
  function animateDashboardEntrance() {
    if (!window.gsap) return;

    const nav = document.querySelector('.dashboard-nav');
    const panel = document.querySelector('.tab-panel.active');

    if (nav) {
      gsap.fromTo(nav,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (panel) {
      gsap.fromTo(panel,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );
    }

    // Stagger nav tabs
    const tabs = document.querySelectorAll('.nav-tab');
    if (tabs.length) {
      gsap.fromTo(tabs,
        { opacity: 0, y: -20, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.2
        }
      );
    }
  }

  // ----------------------------------------------------------
  // GLOBAL ERROR HANDLER
  // ----------------------------------------------------------
  function setupErrorHandler() {
    window.addEventListener('error', (e) => {
      console.error('[ABSOLUTE] Runtime error:', e.message, e.filename, e.lineno);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('[ABSOLUTE] Unhandled promise rejection:', e.reason);
    });
  }

  // ----------------------------------------------------------
  // UTILITY — Debounce
  // ----------------------------------------------------------
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // ----------------------------------------------------------
  // UTILITY — Format currency
  // ----------------------------------------------------------
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // ----------------------------------------------------------
  // UTILITY — Typewriter effect
  // ----------------------------------------------------------
  function typewriter(el, text, speed = 30, callback) {
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  }

  // ----------------------------------------------------------
  // UTILITY — Animate number count up
  // ----------------------------------------------------------
  function countUp(el, target, duration = 1500, prefix = '', suffix = '') {
    if (!el) return;
    const start     = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.floor(start + (target - start) * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    setupErrorHandler();

    if (!checkSession()) return;

    if (isLoginPage)     bootLoginPage();
    if (isDashboardPage) bootDashboardPage();
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    getAgent,
    formatCurrency,
    typewriter,
    countUp,
    debounce
  };

})();

// Boot
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteApp.init();
});