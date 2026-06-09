/* ============================================================
   ABSOLUTE — js/dashboard/transitions.js
   Page Transitions | Panel Animations | GSAP Orchestration
   Entrance Sequences | Warp Effects | Stagger Reveals
   ============================================================ */

const AbsoluteTransitions = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let isAnimating = false;

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!window.gsap) return;
    setupPanelObserver();
    bindTabTransitions();
  }

  // ----------------------------------------------------------
  // PANEL OBSERVER
  // Watches for panels becoming active and runs entrance anims
  // ----------------------------------------------------------
  function setupPanelObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.target.classList.forEach(cls => {
          if (cls === 'active' && mutation.type === 'attributes') {
            const panel = mutation.target;
            const panelId = panel.id;
            runPanelEntrance(panelId, panel);
          }
        });
      });
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['class']
      });
    });
  }

  // ----------------------------------------------------------
  // PANEL ENTRANCE ANIMATIONS
  // ----------------------------------------------------------
  function runPanelEntrance(panelId, panel) {
    if (!window.gsap || isAnimating) return;
    isAnimating = true;

    setTimeout(() => { isAnimating = false; }, 1000);

    switch (panelId) {
      case 'panel-create-trip':
        animateCreateTrip(panel);
        break;
      case 'panel-bank':
        animateBank(panel);
        break;
      case 'panel-media':
        animateMedia(panel);
        break;
    }
  }

  // ----------------------------------------------------------
  // CREATE TRIP ENTRANCE
  // ----------------------------------------------------------
  function animateCreateTrip(panel) {
    const tl = gsap.timeline();

    const header  = panel.querySelector('.panel-header');
    const intro   = panel.querySelector('.mission-intro');
    const trigger = panel.querySelector('.scroll-reveal-zone');

    if (header) {
      tl.fromTo(header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    if (intro) {
      tl.fromTo(intro,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
    }

    if (trigger) {
      tl.fromTo(trigger,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.3'
      );
    }
  }

  // ----------------------------------------------------------
  // BANK ENTRANCE
  // ----------------------------------------------------------
  function animateBank(panel) {
    const tl = gsap.timeline();

    const header    = panel.querySelector('.panel-header');
    const statCards = panel.querySelectorAll('.bank-stat-card');
    const charts    = panel.querySelectorAll('.chart-card');
    const lower     = panel.querySelectorAll('.bank-lower-row > *');
    const feed      = panel.querySelector('.transaction-feed');

    if (header) {
      tl.fromTo(header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }

    if (statCards.length) {
      tl.fromTo(statCards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 0.5,
          stagger:  0.08,
          ease:     'back.out(1.4)'
        },
        '-=0.2'
      );
    }

    if (charts.length) {
      tl.fromTo(charts,
        { opacity: 0, y: 20 },
        {
          opacity:  1,
          y:        0,
          duration: 0.5,
          stagger:  0.12,
          ease:     'power3.out'
        },
        '-=0.2'
      );
    }

    if (lower.length) {
      tl.fromTo(lower,
        { opacity: 0, y: 20 },
        {
          opacity:  1,
          y:        0,
          duration: 0.5,
          stagger:  0.1,
          ease:     'power3.out'
        },
        '-=0.2'
      );
    }

    if (feed) {
      tl.fromTo(feed,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      );
    }
  }

  // ----------------------------------------------------------
  // MEDIA ENTRANCE
  // ----------------------------------------------------------
  function animateMedia(panel) {
    const tl = gsap.timeline();

    const header      = panel.querySelector('.panel-header');
    const sidebarLeft = panel.querySelector('.media-sidebar-left');
    const feed        = panel.querySelector('.media-feed');
    const sidebarRight = panel.querySelector('.media-sidebar-right');

    if (header) {
      tl.fromTo(header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }

    if (sidebarLeft) {
      tl.fromTo(sidebarLeft,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      );
    }

    if (feed) {
      tl.fromTo(feed,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    }

    if (sidebarRight) {
      tl.fromTo(sidebarRight,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      );
    }

    // Stagger post cards
    setTimeout(() => {
      const posts = panel.querySelectorAll('.post-card');
      if (posts.length) {
        gsap.fromTo(posts,
          { opacity: 0, y: 20 },
          {
            opacity:  1,
            y:        0,
            duration: 0.4,
            stagger:  0.1,
            ease:     'power3.out'
          }
        );
      }
    }, 400);
  }

  // ----------------------------------------------------------
  // BIND TAB TRANSITIONS
  // Extra visual feedback on tab switch
  // ----------------------------------------------------------
  function bindTabTransitions() {
    window.addEventListener('absoluteTabChanged', (e) => {
      const tabName = e.detail.tab;
      flashTabIndicator(tabName);
    });
  }

  // ----------------------------------------------------------
  // FLASH TAB INDICATOR
  // ----------------------------------------------------------
  function flashTabIndicator(tabName) {
    if (!window.gsap) return;

    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    if (!tab) return;

    const indicator = tab.querySelector('.tab-indicator');
    if (!indicator) return;

    gsap.fromTo(indicator,
      { scaleX: 0, opacity: 1 },
      { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }

  // ----------------------------------------------------------
  // WARP TRANSITION — Full page warp effect
  // ----------------------------------------------------------
  function warpTransition(callback) {
    if (!window.gsap) {
      if (callback) callback();
      return;
    }

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: var(--color-void);
      z-index: 9998;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    gsap.timeline({
      onComplete: () => {
        if (callback) callback();
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          }
        });
      }
    })
    .to(overlay, { opacity: 1, duration: 0.3 })
    .to(document.body, {
      filter: 'blur(8px) brightness(2)',
      duration: 0.2
    }, 0)
    .to(document.body, {
      filter: 'blur(0px) brightness(1)',
      duration: 0.2,
      delay: 0.1
    });
  }

  // ----------------------------------------------------------
  // CARD REVEAL — Stagger reveal for any set of cards
  // ----------------------------------------------------------
  function revealCards(selector, delay = 0) {
    if (!window.gsap) return;

    const cards = document.querySelectorAll(selector);
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity:  1,
        y:        0,
        scale:    1,
        duration: 0.5,
        stagger:  0.08,
        delay,
        ease:     'back.out(1.4)'
      }
    );
  }

  // ----------------------------------------------------------
  // GLITCH FLASH — Momentary glitch on an element
  // ----------------------------------------------------------
  function glitchFlash(el) {
    if (!el || !window.gsap) return;

    const tl = gsap.timeline();

    tl.to(el, { skewX: -3, duration: 0.05 })
      .to(el, { skewX:  2, duration: 0.05 })
      .to(el, { skewX: -1, duration: 0.05 })
      .to(el, { skewX:  0, duration: 0.05 })
      .to(el, { opacity: 0.7, duration: 0.05 })
      .to(el, { opacity: 1.0, duration: 0.05 })
      .to(el, { opacity: 0.8, duration: 0.05 })
      .to(el, { opacity: 1.0, duration: 0.05 });
  }

  // ----------------------------------------------------------
  // PULSE HIGHLIGHT — Briefly highlights an element
  // ----------------------------------------------------------
  function pulseHighlight(el, color = '#00f5ff') {
    if (!el || !window.gsap) return;

    gsap.timeline()
      .to(el, {
        boxShadow: `0 0 30px ${color}, 0 0 60px ${color}40`,
        borderColor: color,
        duration: 0.3
      })
      .to(el, {
        boxShadow: '',
        borderColor: '',
        duration: 0.6,
        ease: 'power2.out'
      });
  }

  // ----------------------------------------------------------
  // NUMBER FLASH — Animate a stat number changing
  // ----------------------------------------------------------
  function numberFlash(el) {
    if (!el || !window.gsap) return;

    gsap.timeline()
      .to(el, { color: '#00f5ff', scale: 1.1, duration: 0.15 })
      .to(el, { color: '',        scale: 1.0, duration: 0.3, ease: 'power2.out' });
  }

  // ----------------------------------------------------------
  // SCROLL REVEAL — Intersection observer for scroll anims
  // ----------------------------------------------------------
  function initScrollReveal() {
    if (!window.gsap) return;

    const targets = document.querySelectorAll('.gsap-from-bottom');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity:   1,
            y:         0,
            duration:  0.6,
            ease:      'power3.out'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    warpTransition,
    revealCards,
    glitchFlash,
    pulseHighlight,
    numberFlash,
    initScrollReveal,
    runPanelEntrance
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteTransitions.init();
});