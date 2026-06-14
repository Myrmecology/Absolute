/* ============================================================
   ABSOLUTE — js/dashboard/easter-egg.js
   Hidden Feature | Type "GLITCH" to trigger a temporal breach
   Self-contained | Does not modify existing functionality
   ============================================================ */

const AbsoluteEasterEgg = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  const triggerWord = 'GLITCH';
  let typedBuffer   = '';
  let isPlaying     = false;

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    document.addEventListener('keydown', onKeyDown);
  }

  // ----------------------------------------------------------
  // KEY LISTENER
  // ----------------------------------------------------------
  function onKeyDown(e) {
    // Ignore typing while in input fields, textareas, selects
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (isPlaying) return;

    const key = e.key.toUpperCase();

    // Only track single letter keys
    if (key.length !== 1 || !/[A-Z]/.test(key)) {
      typedBuffer = '';
      return;
    }

    typedBuffer += key;

    // Keep buffer trimmed to trigger word length
    if (typedBuffer.length > triggerWord.length) {
      typedBuffer = typedBuffer.slice(-triggerWord.length);
    }

    if (typedBuffer === triggerWord) {
      triggerBreach();
      typedBuffer = '';
    }
  }

  // ----------------------------------------------------------
  // TRIGGER BREACH
  // ----------------------------------------------------------
  function triggerBreach() {
    if (isPlaying) return;
    isPlaying = true;

    const overlay = createOverlay();
    document.body.appendChild(overlay);

    // Activate animation
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    // Optional: glitch flash the dashboard nav for extra effect
    const nav = document.querySelector('.dashboard-nav');
    if (nav && window.AbsoluteTransitions) {
      AbsoluteTransitions.glitchFlash(nav);
    }

    // Clean up after animation completes
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      isPlaying = false;
    }, 1900);
  }

  // ----------------------------------------------------------
  // CREATE OVERLAY ELEMENT
  // ----------------------------------------------------------
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'breach-overlay';

    overlay.innerHTML = `
      <div class="breach-scanline"></div>
      <div class="breach-text" data-text="TEMPORAL BREACH DETECTED">TEMPORAL BREACH DETECTED</div>
      <div class="breach-subtext">Stabilizing dimensional integrity...</div>
    `;

    return overlay;
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, triggerBreach };

})();

// Auto-init — only runs on dashboard page
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('dashboard-body')) {
    AbsoluteEasterEgg.init();
  }
});