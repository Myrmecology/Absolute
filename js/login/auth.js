/* ============================================================
   ABSOLUTE — js/login/auth.js
   Login Authentication | Boot Sequence | Transition | Session
   ============================================================ */

const AbsoluteAuth = (() => {

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const agentInput     = document.getElementById('agent-name');
  const loginBtn       = document.getElementById('login-btn');
  const bootLog        = document.getElementById('boot-log');
  const bootLogInner   = document.getElementById('boot-log-inner');
  const statusText     = document.getElementById('status-text');
  const overlay        = document.getElementById('login-transition-overlay');
  const transitionSub  = document.getElementById('transition-subtext');
  const footerTime     = document.getElementById('footer-time');

  // ----------------------------------------------------------
  // BOOT LOG LINES
  // ----------------------------------------------------------
  const bootLines = [
    { text: 'Initializing ABSOLUTE core systems...', type: 'info',  delay: 0   },
    { text: 'Quantum encryption layer — ACTIVE',     type: '',      delay: 300  },
    { text: 'Dimensional gateway array — ONLINE',    type: '',      delay: 600  },
    { text: 'Temporal navigation engine — READY',    type: '',      delay: 900  },
    { text: 'Biometric scanner — STANDBY',           type: 'warn',  delay: 1100 },
    { text: 'YubiKey auth module — LOADED',          type: '',      delay: 1300 },
    { text: 'Omega clearance protocols — VERIFIED',  type: '',      delay: 1600 },
    { text: 'Awaiting agent identification...',      type: 'info',  delay: 1900 },
  ];

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!agentInput || !loginBtn) return;

    sessionStorage.removeItem('absolute_agent');

    startFooterClock();
    bindEvents();
    runBootSequence();
  }

  // ----------------------------------------------------------
  // FOOTER CLOCK
  // ----------------------------------------------------------
  function startFooterClock() {
    function updateClock() {
      if (!footerTime) return;
      const now = new Date();
      footerTime.textContent = now.toLocaleTimeString('en-US', {
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
  // BOOT SEQUENCE
  // ----------------------------------------------------------
  function runBootSequence() {
    if (!bootLog || !bootLogInner) return;

    setTimeout(() => {
      bootLog.classList.add('active');
    }, 800);

    bootLines.forEach((line, i) => {
      setTimeout(() => {
        addBootLine(line.text, line.type);
      }, line.delay + 800);
    });
  }

  function addBootLine(text, type = '') {
    if (!bootLogInner) return;

    const line = document.createElement('div');
    line.className = `boot-log-line${type ? ' ' + type : ''}`;
    line.style.animationDelay = '0s';

    const prefix = type === 'warn'  ? '⚠ ' :
                   type === 'error' ? '✕ ' :
                   type === 'info'  ? '► ' : '✓ ';

    line.textContent = prefix + text;
    bootLogInner.appendChild(line);
    bootLogInner.scrollTop = bootLogInner.scrollHeight;
  }

  // ----------------------------------------------------------
  // EVENT BINDING
  // ----------------------------------------------------------
  function bindEvents() {

    // Enter key on input
    agentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptLogin();
    });

    // Login button click
    loginBtn.addEventListener('click', () => attemptLogin());

    // Input typing feedback
    agentInput.addEventListener('input', () => {
      const val = agentInput.value.trim();
      if (val.length > 0) {
        updateStatus(`AGENT DESIGNATION RECEIVED — ${val.toUpperCase()}`);
        loginBtn.style.opacity = '1';
      } else {
        updateStatus('AWAITING AGENT IDENTIFICATION');
        loginBtn.style.opacity = '0.6';
      }
    });

    // Input focus effects
    agentInput.addEventListener('focus', () => {
      updateStatus('ENTER YOUR DESIGNATION TO PROCEED');
      addBootLine('Input field activated — scanning...', 'info');
    });
  }

  // ----------------------------------------------------------
  // UPDATE STATUS
  // ----------------------------------------------------------
  function updateStatus(msg) {
    if (!statusText) return;
    statusText.textContent = msg;
  }

  // ----------------------------------------------------------
  // ATTEMPT LOGIN
  // ----------------------------------------------------------
  function attemptLogin() {
    const name = agentInput.value.trim();

    if (!name || name.length < 1) {
      shakeInput();
      updateStatus('⚠ DESIGNATION REQUIRED — ENTER YOUR NAME');
      addBootLine('Authentication failed — no designation provided', 'error');
      return;
    }

    if (name.length < 2) {
      shakeInput();
      updateStatus('⚠ DESIGNATION TOO SHORT');
      addBootLine('Authentication failed — designation invalid', 'error');
      return;
    }

    // Begin authentication sequence
    lockInput();
    runAuthSequence(name);
  }

  // ----------------------------------------------------------
  // AUTH SEQUENCE
  // ----------------------------------------------------------
  function runAuthSequence(name) {
    updateStatus('AUTHENTICATING — PLEASE STAND BY');
    addBootLine(`Verifying agent: ${name.toUpperCase()}`, 'info');

    const authLines = [
      { text: `Identity scan: ${name.toUpperCase()} — PROCESSING`,  delay: 200  },
      { text: 'Cross-referencing Omega clearance database...',        delay: 600  },
      { text: 'Temporal signature verified',                          delay: 1000 },
      { text: 'Dimensional access key — ACCEPTED',                    delay: 1300 },
      { text: `Welcome, Agent ${name.toUpperCase()}. Access granted.`, delay: 1700 },
    ];

    authLines.forEach(line => {
      setTimeout(() => {
        addBootLine(line.text, '');
      }, line.delay);
    });

    setTimeout(() => {
      updateStatus(`IDENTITY CONFIRMED — WELCOME AGENT ${name.toUpperCase()}`);
    }, 1800);

    setTimeout(() => {
      triggerTransition(name);
    }, 2400);
  }

  // ----------------------------------------------------------
  // TRANSITION TO DASHBOARD
  // ----------------------------------------------------------
  function triggerTransition(name) {
    if (!overlay) {
      redirectToDashboard(name);
      return;
    }

    // Update transition sub text
    if (transitionSub) {
      transitionSub.textContent = `WELCOME AGENT ${name.toUpperCase()}`;
    }

    // Store agent name
    sessionStorage.setItem('absolute_agent', name);

    // Show overlay
    overlay.classList.add('active');

    // Warp out the login content
    const loginWrapper = document.querySelector('.login-wrapper');
    if (loginWrapper) {
      loginWrapper.classList.add('warp-out');
    }

    // Redirect after transition
    setTimeout(() => {
      redirectToDashboard(name);
    }, 1800);
  }

  // ----------------------------------------------------------
  // REDIRECT
  // ----------------------------------------------------------
  function redirectToDashboard(name) {
    sessionStorage.setItem('absolute_agent', name);
    window.location.href = 'dashboard.html';
  }

  // ----------------------------------------------------------
  // INPUT SHAKE (validation error)
  // ----------------------------------------------------------
  function shakeInput() {
    const wrapper = document.getElementById('input-field-wrapper');
    if (!wrapper) return;

    wrapper.style.animation = 'none';
    wrapper.offsetHeight; // force reflow

    wrapper.style.animation = 'shake 0.4s ease-in-out';

    // Inject shake keyframe if not present
    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      if (wrapper) wrapper.style.animation = '';
    }, 400);
  }

  // ----------------------------------------------------------
  // LOCK INPUT during auth
  // ----------------------------------------------------------
  function lockInput() {
    if (agentInput) {
      agentInput.disabled = true;
      agentInput.style.opacity = '0.5';
    }
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.style.opacity = '0.5';
      const btnText = loginBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'AUTHENTICATING...';
    }
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteAuth.init();
});