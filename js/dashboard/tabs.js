/* ============================================================
   ABSOLUTE — js/dashboard/tabs.js
   Tab Navigation System | Panel Switching | Active States
   3D Cube Effect | GSAP Transitions
   ============================================================ */

const AbsoluteTabs = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let currentTab    = 'create-trip';
  let isTransitioning = false;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const tabs   = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!tabs.length || !panels.length) return;

    bindTabEvents();
    setActiveTab('create-trip', false);
  }

  // ----------------------------------------------------------
  // BIND TAB EVENTS
  // ----------------------------------------------------------
  function bindTabEvents() {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (target && target !== currentTab && !isTransitioning) {
          switchTab(target);
        }
      });

      // 3D cube hover effect on create-trip tab
      if (tab.classList.contains('tab-create-trip')) {
        bindCubeEffect(tab);
      }
    });
  }

  // ----------------------------------------------------------
  // CUBE EFFECT — Create Trip tab
  // ----------------------------------------------------------
  function bindCubeEffect(tab) {
    if (!window.gsap) return;

    tab.addEventListener('mouseenter', () => {
      gsap.to(tab, {
        rotateY: 8,
        rotateX: -4,
        scale: 1.05,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });
    });

    tab.addEventListener('mouseleave', () => {
      gsap.to(tab, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });

    tab.addEventListener('mousemove', (e) => {
      const rect    = tab.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) / (rect.width / 2);
      const dy = (e.clientY - centerY) / (rect.height / 2);

      gsap.to(tab, {
        rotateY:  dx * 12,
        rotateX: -dy * 8,
        duration: 0.2,
        ease: 'none'
      });
    });
  }

  // ----------------------------------------------------------
  // SWITCH TAB
  // ----------------------------------------------------------
  function switchTab(targetTab, animate = true) {
    if (targetTab === currentTab) return;

    isTransitioning = true;

    const prevPanel    = document.getElementById(`panel-${currentTab}`);
    const targetPanel  = document.getElementById(`panel-${targetTab}`);
    const prevTabEl    = document.querySelector(`[data-tab="${currentTab}"]`);
    const targetTabEl  = document.querySelector(`[data-tab="${targetTab}"]`);

    if (!targetPanel) {
      isTransitioning = false;
      return;
    }

    // Update tab button states
    setActiveTab(targetTab, true);

    if (!animate || !window.gsap) {
      // Instant switch
      if (prevPanel) {
        prevPanel.classList.remove('active');
      }
      targetPanel.classList.add('active');
      currentTab = targetTab;
      isTransitioning = false;
      onTabChanged(targetTab);
      return;
    }

    // Animated transition
    if (prevPanel) {
      gsap.to(prevPanel, {
        opacity:   0,
        y:        -20,
        duration:  0.3,
        ease:      'power2.in',
        onComplete: () => {
          prevPanel.classList.remove('active');
          prevPanel.style.opacity   = '';
          prevPanel.style.transform = '';

          // Animate in new panel
          targetPanel.classList.add('active');
          gsap.fromTo(targetPanel,
            { opacity: 0, y: 30 },
            {
              opacity:  1,
              y:        0,
              duration: 0.5,
              ease:     'power3.out',
              onComplete: () => {
                isTransitioning = false;
                onTabChanged(targetTab);
              }
            }
          );
        }
      });
    } else {
      targetPanel.classList.add('active');
      gsap.fromTo(targetPanel,
        { opacity: 0, y: 30 },
        {
          opacity:  1,
          y:        0,
          duration: 0.5,
          ease:     'power3.out',
          onComplete: () => {
            isTransitioning = false;
            onTabChanged(targetTab);
          }
        }
      );
    }

    currentTab = targetTab;
  }

  // ----------------------------------------------------------
  // SET ACTIVE TAB BUTTON
  // ----------------------------------------------------------
  function setActiveTab(tabName, animate) {
    tabs.forEach(tab => {
      const isTarget = tab.dataset.tab === tabName;
      tab.classList.toggle('active', isTarget);

      if (animate && window.gsap && isTarget) {
        gsap.fromTo(tab,
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: 'back.out(2)' }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // ON TAB CHANGED — Fire init for each tab module
  // ----------------------------------------------------------
  function onTabChanged(tabName) {
    switch (tabName) {
      case 'create-trip':
        if (window.AbsoluteMissionForm) {
          AbsoluteMissionForm.refresh();
        }
        break;
      case 'bank':
        if (window.AbsoluteBankCharts) {
          AbsoluteBankCharts.refresh();
        }
        if (window.AbsoluteBudget) {
          AbsoluteBudget.refresh();
        }
        if (window.AbsoluteLists) {
          AbsoluteLists.refresh();
        }
        break;
      case 'media':
        if (window.AbsoluteMediaFeed) {
          AbsoluteMediaFeed.refresh();
        }
        break;
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('absoluteTabChanged', {
      detail: { tab: tabName }
    }));
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    switchTab,
    getCurrentTab: () => currentTab
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteTabs.init();
});