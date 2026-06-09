/* ============================================================
   ABSOLUTE — js/tabs/create-trip/dossier.js
   Dossier Orchestrator | Coordinates Claude + Flux outputs
   Portal Ready Handler | Countdown | Final Assembly
   ============================================================ */

const AbsoluteDossier = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let missionData     = null;
  let portalReady     = false;
  let dossierReady    = false;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const dossierPanel      = document.getElementById('dossier-panel');
  const countdownEl       = document.getElementById('departure-countdown');
  const portalContainer   = document.querySelector('.portal-image-container');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    window.addEventListener('absoluteMissionSubmit', onMissionSubmit);
    window.addEventListener('absolutePortalReady',   onPortalReady);
  }

  // ----------------------------------------------------------
  // ON MISSION SUBMIT
  // ----------------------------------------------------------
  function onMissionSubmit(e) {
    missionData  = e.detail;
    portalReady  = false;
    dossierReady = false;

    // Show countdown after delay
    setTimeout(() => {
      revealCountdown();
    }, 800);

    // Animate panel sections in sequence
    animateDossierSections();
  }

  // ----------------------------------------------------------
  // ON PORTAL READY
  // ----------------------------------------------------------
  function onPortalReady(e) {
    portalReady = true;

    const { url, missionData: data } = e.detail;

    // Pulse the portal container
    if (portalContainer && window.gsap) {
      gsap.timeline()
        .to(portalContainer, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(portalContainer, {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        });
    }

    // Update portal label with full mission data
    updatePortalLabel(data);

    // Check if we can do final assembly
    checkFinalAssembly();
  }

  // ----------------------------------------------------------
  // ANIMATE DOSSIER SECTIONS
  // ----------------------------------------------------------
  function animateDossierSections() {
    if (!dossierPanel || !window.gsap) return;

    const sections = [
      '.portal-image-container',
      '.departure-countdown',
      '.dossier-text-panel',
      '.risk-panel',
      '.reset-mission-btn'
    ];

    sections.forEach((selector, i) => {
      const el = dossierPanel.querySelector(selector);
      if (!el) return;

      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity:  1,
          y:        0,
          duration: 0.6,
          delay:    i * 0.15,
          ease:     'power3.out'
        }
      );
    });
  }

  // ----------------------------------------------------------
  // REVEAL COUNTDOWN
  // ----------------------------------------------------------
  function revealCountdown() {
    if (!countdownEl) return;

    if (window.gsap) {
      gsap.fromTo(countdownEl,
        { opacity: 0, scale: 0.95 },
        {
          opacity:  1,
          scale:    1,
          duration: 0.6,
          ease:     'back.out(1.4)'
        }
      );
    }

    // Add scan wipe effect to countdown
    addCountdownScanEffect();
  }

  // ----------------------------------------------------------
  // COUNTDOWN SCAN EFFECT
  // ----------------------------------------------------------
  function addCountdownScanEffect() {
    if (!countdownEl) return;

    const scan = document.createElement('div');
    scan.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--neon-cyan),
        transparent
      );
      pointer-events: none;
      animation: scan-wipe 3s linear infinite;
      z-index: 10;
    `;
    countdownEl.style.position = 'relative';
    countdownEl.appendChild(scan);
  }

  // ----------------------------------------------------------
  // UPDATE PORTAL LABEL
  // ----------------------------------------------------------
  function updatePortalLabel(data) {
    if (!data) return;

    const label = document.getElementById('portal-image-label');
    if (label) {
      label.textContent = `— ${data.reality.toUpperCase()} // ${data.year} AD —`;

      if (window.gsap) {
        gsap.fromTo(label,
          { opacity: 0, letterSpacing: '0.1em' },
          {
            opacity:       1,
            letterSpacing: '0.2em',
            duration:      0.8,
            ease:          'power3.out'
          }
        );
      }
    }
  }

  // ----------------------------------------------------------
  // CHECK FINAL ASSEMBLY
  // Called when all async parts are complete
  // ----------------------------------------------------------
  function checkFinalAssembly() {
    if (!portalReady) return;
    runFinalAssembly();
  }

  // ----------------------------------------------------------
  // FINAL ASSEMBLY
  // The grand finale — everything comes together
  // ----------------------------------------------------------
  function runFinalAssembly() {
    if (!missionData || !window.gsap) return;

    // Flash the entire dossier panel
    if (dossierPanel) {
      gsap.timeline()
        .to(dossierPanel, {
          filter: 'brightness(1.3)',
          duration: 0.15
        })
        .to(dossierPanel, {
          filter: 'brightness(1)',
          duration: 0.4,
          ease: 'power2.out'
        });
    }

    // Glitch flash the portal
    if (window.AbsoluteTransitions && portalContainer) {
      AbsoluteTransitions.glitchFlash(portalContainer);
    }

    // Final status message
    flashMissionConfirmed();

    // Animate the reset button in
    const resetBtn = document.getElementById('reset-mission-btn');
    if (resetBtn) {
      gsap.fromTo(resetBtn,
        { opacity: 0, y: 20 },
        {
          opacity:  1,
          y:        0,
          duration: 0.5,
          delay:    0.8,
          ease:     'power3.out'
        }
      );
    }
  }

  // ----------------------------------------------------------
  // FLASH MISSION CONFIRMED
  // ----------------------------------------------------------
  function flashMissionConfirmed() {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: calc(var(--nav-height) + 20px);
      right: 24px;
      z-index: var(--z-toast);
      padding: 12px 24px;
      background: rgba(0, 245, 255, 0.1);
      border: 1px solid var(--neon-cyan);
      border-radius: 4px;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
      pointer-events: none;
      opacity: 0;
      clip-path: polygon(
        16px 0%, 100% 0%, 100% calc(100% - 16px),
        calc(100% - 16px) 100%, 0% 100%, 0% 16px
      );
    `;
    toast.textContent = '✓ MISSION DOSSIER GENERATED';
    document.body.appendChild(toast);

    if (window.gsap) {
      gsap.timeline({
        onComplete: () => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }
      })
      .to(toast, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' })
      .to(toast, { opacity: 0, y: -10, duration: 0.4, delay: 2.5, ease: 'power2.in' });
    } else {
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 3000);
    }
  }

  // ----------------------------------------------------------
  // GENERATE MISSION CODE
  // Creates a unique mission identifier
  // ----------------------------------------------------------
  function generateMissionCode(data) {
    if (!data) return 'OMEGA-UNKNOWN';

    const yearPart     = data.year ? String(data.year).slice(-2) : '00';
    const realityPart  = data.reality
      ? data.reality.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()
      : 'UNKN';
    const randomPart   = Math.floor(Math.random() * 9000 + 1000);

    return `OMEGA-${realityPart}${yearPart}-${randomPart}`;
  }

  // ----------------------------------------------------------
  // CREATE MISSION SUMMARY CARD
  // Small data card appended after full dossier generation
  // ----------------------------------------------------------
  function createMissionSummaryCard(data) {
    if (!dossierPanel || !data) return;

    const existing = dossierPanel.querySelector('.mission-summary-card');
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.className = 'mission-summary-card';
    card.style.cssText = `
      padding: 16px 20px;
      background: rgba(0, 245, 255, 0.03);
      border: 1px solid rgba(0, 245, 255, 0.15);
      border-radius: 8px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 8px;
    `;

    const missionCode = generateMissionCode(data);

    const fields = [
      { label: 'Mission Code',    value: missionCode },
      { label: 'Agent',           value: data.agentName?.toUpperCase() },
      { label: 'Target Year',     value: data.year },
      { label: 'Reality',         value: data.reality },
      { label: 'Duration',        value: data.duration },
      { label: 'Items Carried',   value: `${data.inventory.length} items` },
    ];

    fields.forEach(f => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      item.innerHTML = `
        <span style="
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        ">${f.label}</span>
        <span style="
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--neon-cyan);
          letter-spacing: 0.05em;
        ">${f.value || '—'}</span>
      `;
      card.appendChild(item);
    });

    // Insert before reset button
    const resetBtn = dossierPanel.querySelector('.reset-mission-btn');
    if (resetBtn) {
      dossierPanel.insertBefore(card, resetBtn);
    } else {
      dossierPanel.appendChild(card);
    }

    if (window.gsap) {
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        {
          opacity:  1,
          y:        0,
          duration: 0.5,
          delay:    0.3,
          ease:     'power3.out'
        }
      );
    }
  }

  // ----------------------------------------------------------
  // LISTEN FOR DOSSIER TEXT COMPLETE
  // When Claude finishes writing the dossier text
  // ----------------------------------------------------------
  function listenForDossierComplete() {
    // Watch for changes in the dossier text element
    const dossierText = document.getElementById('dossier-text');
    if (!dossierText) return;

    const observer = new MutationObserver(() => {
      const text = dossierText.textContent || '';
      if (text.length > 200 && missionData) {
        dossierReady = true;
        createMissionSummaryCard(missionData);
        observer.disconnect();
      }
    });

    observer.observe(dossierText, {
      childList:    true,
      subtree:      true,
      characterData: true
    });
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    generateMissionCode,
    createMissionSummaryCard
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteDossier.init();
});