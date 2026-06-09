/* ============================================================
   ABSOLUTE — js/login/cursor.js
   Custom Cursor System | Trail | Ripple | Magnetic | Aura
   Used on both login and dashboard pages
   ============================================================ */

const AbsoluteCursor = (() => {

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const dot        = document.getElementById('cursor-dot');
  const ring       = document.getElementById('cursor-ring');
  const trail      = document.getElementById('cursor-trail-container');
  const aura       = document.getElementById('cursor-aura');

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let mouseX      = 0;
  let mouseY      = 0;
  let ringX       = 0;
  let ringY       = 0;
  let auraX       = 0;
  let auraY       = 0;
  let isVisible   = false;
  let trailPool   = [];
  let lastTrailX  = 0;
  let lastTrailY  = 0;
  let trailTimer  = null;
  let currentState = 'default';

  // Trail particle colors cycling
  const trailColors = [
    'rgba(0, 245, 255, 0.6)',
    'rgba(123, 47, 255, 0.5)',
    'rgba(255, 47, 248, 0.4)',
    'rgba(0, 245, 255, 0.3)'
  ];
  let trailColorIndex = 0;

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!dot || !ring) return;

    document.body.classList.add('cursor-default');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup',   onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    bindHoverTargets();
    startRingFollow();
    startAuraFollow();
    startTrailLoop();

    // Re-bind on DOM changes for dynamic content
    const observer = new MutationObserver(() => bindHoverTargets());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ----------------------------------------------------------
  // MOUSE MOVE
  // ----------------------------------------------------------
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      showCursor();
    }

    // Move dot instantly — no lag
    if (dot) {
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    }

    // Spawn trail particle if moved enough
    const dx = mouseX - lastTrailX;
    const dy = mouseY - lastTrailY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 12) {
      spawnTrailParticle(mouseX, mouseY);
      lastTrailX = mouseX;
      lastTrailY = mouseY;
    }
  }

  // ----------------------------------------------------------
  // RING FOLLOW — Smooth lag behind cursor
  // ----------------------------------------------------------
  function startRingFollow() {
    function loop() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ring) {
        const size = parseInt(
          getComputedStyle(ring).width
        ) / 2;
        ring.style.transform = `translate(${ringX - size}px, ${ringY - size}px)`;
      }

      requestAnimationFrame(loop);
    }
    loop();
  }

  // ----------------------------------------------------------
  // AURA FOLLOW — Very slow, large ambient glow
  // ----------------------------------------------------------
  function startAuraFollow() {
    function loop() {
      auraX += (mouseX - auraX) * 0.05;
      auraY += (mouseY - auraY) * 0.05;

      if (aura) {
        aura.style.transform = `translate(${auraX - 150}px, ${auraY - 150}px)`;
      }

      requestAnimationFrame(loop);
    }
    loop();
  }

  // ----------------------------------------------------------
  // TRAIL PARTICLES
  // ----------------------------------------------------------
  function spawnTrailParticle(x, y) {
    if (!trail) return;

    const particle = document.createElement('div');
    particle.className = 'cursor-trail-particle';

    const size = Math.random() * 6 + 3;
    const color = trailColors[trailColorIndex % trailColors.length];
    trailColorIndex++;

    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
    `;

    trail.appendChild(particle);

    // Remove after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 600);
  }

  // ----------------------------------------------------------
  // TRAIL LOOP — Periodic ambient particles when idle
  // ----------------------------------------------------------
  function startTrailLoop() {
    setInterval(() => {
      if (isVisible && mouseX > 0) {
        const jitterX = mouseX + (Math.random() - 0.5) * 20;
        const jitterY = mouseY + (Math.random() - 0.5) * 20;
        spawnTrailParticle(jitterX, jitterY);
      }
    }, 80);
  }

  // ----------------------------------------------------------
  // CLICK RIPPLE
  // ----------------------------------------------------------
  function onMouseDown(e) {
    setState('click');
    spawnRipple(e.clientX, e.clientY);
  }

  function onMouseUp() {
    setState(currentState === 'click' ? 'default' : currentState);
  }

  function spawnRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 700);
  }

  // ----------------------------------------------------------
  // VISIBILITY
  // ----------------------------------------------------------
  function showCursor() {
    isVisible = true;
    if (dot)  dot.style.opacity  = '1';
    if (ring) ring.style.opacity = '1';
    if (aura) aura.style.opacity = '1';
  }

  function onMouseLeave() {
    isVisible = false;
    if (dot)  dot.style.opacity  = '0';
    if (ring) ring.style.opacity = '0';
    if (aura) aura.style.opacity = '0';
  }

  function onMouseEnter() {
    showCursor();
  }

  // ----------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------
  function setState(state) {
    document.body.classList.remove(
      'cursor-default',
      'cursor-hover',
      'cursor-input',
      'cursor-btn',
      'cursor-click',
      'cursor-drag'
    );
    document.body.classList.add(`cursor-${state}`);
    currentState = state;
  }

  // ----------------------------------------------------------
  // HOVER TARGET BINDING
  // ----------------------------------------------------------
  function bindHoverTargets() {

    // Input fields
    document.querySelectorAll(
      'input, textarea, select, .agent-name-input'
    ).forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => setState('input'));
      el.addEventListener('mouseleave', () => setState('default'));
      el.addEventListener('focus',      () => setState('input'));
      el.addEventListener('blur',       () => setState('default'));
    });

    // Buttons
    document.querySelectorAll(
      'button, .nav-tab, .login-btn, .dash-btn, .scroll-trigger-btn, .scroll-start-btn, .submit-mission-btn, .post-submit-btn'
    ).forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => setState('btn'));
      el.addEventListener('mouseleave', () => setState('default'));
    });

    // General hover elements
    document.querySelectorAll(
      'a, .nav-tab, .post-card, .bank-stat-card, .trending-item, .suggestion-item, .media-nav-link, .story-item'
    ).forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';

      el.addEventListener('mouseenter', () => {
        if (currentState !== 'btn' && currentState !== 'input') {
          setState('hover');
        }
      });
      el.addEventListener('mouseleave', () => {
        if (currentState === 'hover') {
          setState('default');
        }
      });
    });

    // Magnetic elements
    bindMagneticElements();
  }

  // ----------------------------------------------------------
  // MAGNETIC EFFECT
  // ----------------------------------------------------------
  function bindMagneticElements() {
    document.querySelectorAll('.magnetic').forEach(el => {
      if (el.dataset.magneticBound) return;
      el.dataset.magneticBound = 'true';

      const strength = 0.3;
      const radius   = 80;

      el.addEventListener('mousemove', (e) => {
        const rect   = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top  + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const pull = (1 - dist / radius) * strength;
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`;
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      });
    });
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    setState,
    spawnRipple
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteCursor.init();
});