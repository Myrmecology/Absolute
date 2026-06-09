/* ============================================================
   ABSOLUTE — js/tabs/create-trip/form.js
   Mission Form | Scroll Reveal | Inventory Tags | Validation
   Submit Handler | Reset | Countdown Timer
   ============================================================ */

const AbsoluteMissionForm = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let inventoryItems  = [];
  let countdownTimer  = null;
  let isSubmitting    = false;
  let scrollVisible   = false;
  let formVisible     = false;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const scrollTriggerBtn  = document.getElementById('scroll-trigger-btn');
  const missionScroll     = document.getElementById('mission-scroll');
  const scrollStartBtn    = document.getElementById('scroll-start-btn');
  const missionForm       = document.getElementById('mission-form');
  const submitBtn         = document.getElementById('submit-mission-btn');
  const resetBtn          = document.getElementById('reset-mission-btn');
  const dossierPanel      = document.getElementById('dossier-panel');
  const inventoryInput    = document.getElementById('inventory-input');
  const inventoryContainer = document.getElementById('inventory-tag-container');

  // Form fields
  const fieldAgentName    = document.getElementById('mission-agent-name');
  const fieldYear         = document.getElementById('mission-year');
  const fieldReality      = document.getElementById('mission-reality');
  const fieldRealityDesc  = document.getElementById('mission-reality-desc');
  const fieldDuration     = document.getElementById('mission-duration');
  const fieldObjective    = document.getElementById('mission-objective');
  const fieldNotes        = document.getElementById('mission-notes');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    if (!scrollTriggerBtn) return;

    prefillAgentName();
    bindScrollReveal();
    bindInventoryTags();
    bindFormSubmit();
    bindReset();
    bindFieldAnimations();
  }

  // ----------------------------------------------------------
  // PREFILL AGENT NAME
  // ----------------------------------------------------------
  function prefillAgentName() {
    if (fieldAgentName && !fieldAgentName.value) {
      const agent = sessionStorage.getItem('absolute_agent') || '';
      fieldAgentName.value = agent;
    }
  }

  // ----------------------------------------------------------
  // SCROLL REVEAL
  // ----------------------------------------------------------
  function bindScrollReveal() {
    if (!scrollTriggerBtn || !missionScroll) return;

    scrollTriggerBtn.addEventListener('click', () => {
      if (scrollVisible) return;
      scrollVisible = true;

      missionScroll.classList.add('visible');

      if (window.gsap) {
        gsap.fromTo(missionScroll,
          { opacity: 0, scaleY: 0.3, transformOrigin: 'top center' },
          { opacity: 1, scaleY: 1, duration: 0.8, ease: 'power3.out' }
        );
      }

      // Animate trigger button
      if (window.gsap) {
        gsap.to(scrollTriggerBtn, {
          scale: 0.95,
          opacity: 0.6,
          duration: 0.3
        });
      }
    });

    if (!scrollStartBtn) return;

    scrollStartBtn.addEventListener('click', () => {
      if (formVisible) return;
      formVisible = true;

      // Hide scroll
      if (window.gsap) {
        gsap.to(missionScroll, {
          opacity: 0,
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            missionScroll.classList.remove('visible');
            missionScroll.style.cssText = '';
            showMissionForm();
          }
        });
      } else {
        missionScroll.classList.remove('visible');
        showMissionForm();
      }
    });
  }

  // ----------------------------------------------------------
  // SHOW MISSION FORM
  // ----------------------------------------------------------
  function showMissionForm() {
    if (!missionForm) return;

    missionForm.classList.add('visible');

    if (window.gsap) {
      const sections = missionForm.querySelectorAll('.form-section');
      const submitBtnEl = missionForm.querySelector('.submit-mission-btn');

      gsap.fromTo(sections,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );

      if (submitBtnEl) {
        gsap.fromTo(submitBtnEl,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: 'back.out(1.4)' }
        );
      }
    }

    // Focus first empty field
    setTimeout(() => {
      if (fieldAgentName && !fieldAgentName.value) {
        fieldAgentName.focus();
      } else if (fieldYear) {
        fieldYear.focus();
      }
    }, 600);
  }

  // ----------------------------------------------------------
  // INVENTORY TAGS
  // ----------------------------------------------------------
  function bindInventoryTags() {
    if (!inventoryInput || !inventoryContainer) return;

    inventoryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = inventoryInput.value.trim().replace(/,$/, '');
        if (val) {
          addInventoryTag(val);
          inventoryInput.value = '';
        }
      }
      if (e.key === 'Backspace' && !inventoryInput.value && inventoryItems.length > 0) {
        removeInventoryTag(inventoryItems[inventoryItems.length - 1]);
      }
    });

    inventoryInput.addEventListener('blur', () => {
      const val = inventoryInput.value.trim();
      if (val) {
        addInventoryTag(val);
        inventoryInput.value = '';
      }
    });
  }

  function addInventoryTag(text) {
    if (inventoryItems.includes(text)) return;
    inventoryItems.push(text);

    const tag = document.createElement('div');
    tag.className = 'inventory-tag';
    tag.dataset.value = text;

    tag.innerHTML = `
      <span>${text}</span>
      <span class="inventory-tag-remove" data-value="${text}">✕</span>
    `;

    tag.querySelector('.inventory-tag-remove').addEventListener('click', () => {
      removeInventoryTag(text);
    });

    inventoryContainer.insertBefore(tag, inventoryInput);

    if (window.gsap) {
      gsap.fromTo(tag,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)' }
      );
    }
  }

  function removeInventoryTag(text) {
    const index = inventoryItems.indexOf(text);
    if (index > -1) inventoryItems.splice(index, 1);

    const tag = inventoryContainer.querySelector(`[data-value="${text}"]`);
    if (!tag) return;

    if (window.gsap) {
      gsap.to(tag, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          if (tag.parentNode) tag.parentNode.removeChild(tag);
        }
      });
    } else {
      if (tag.parentNode) tag.parentNode.removeChild(tag);
    }
  }

  // ----------------------------------------------------------
  // FIELD ANIMATIONS — Glow on focus
  // ----------------------------------------------------------
  function bindFieldAnimations() {
    const fields = document.querySelectorAll('.mission-input');
    fields.forEach(field => {
      field.addEventListener('focus', () => {
        if (window.gsap) {
          gsap.to(field, {
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.2)',
            borderColor: 'var(--neon-cyan)',
            duration: 0.3
          });
        }
      });

      field.addEventListener('blur', () => {
        if (window.gsap) {
          gsap.to(field, {
            boxShadow: '',
            duration: 0.3
          });
        }
      });
    });
  }

  // ----------------------------------------------------------
  // FORM VALIDATION
  // ----------------------------------------------------------
  function validateForm() {
    const errors = [];

    if (!fieldAgentName?.value.trim()) {
      errors.push({ field: fieldAgentName, msg: 'Agent name required' });
    }
    if (!fieldYear?.value.trim()) {
      errors.push({ field: fieldYear, msg: 'Target year required' });
    }
    if (!fieldReality?.value.trim()) {
      errors.push({ field: fieldReality, msg: 'Reality designation required' });
    }
    if (!fieldRealityDesc?.value.trim()) {
      errors.push({ field: fieldRealityDesc, msg: 'Reality description required' });
    }
    if (!fieldDuration?.value.trim()) {
      errors.push({ field: fieldDuration, msg: 'Mission duration required' });
    }
    if (inventoryItems.length === 0) {
      errors.push({ field: inventoryContainer, msg: 'Add at least one item' });
    }

    if (errors.length > 0) {
      errors.forEach(err => highlightError(err.field));
      return false;
    }

    return true;
  }

  function highlightError(field) {
    if (!field || !window.gsap) return;

    gsap.timeline()
      .to(field, { borderColor: 'var(--neon-red)', boxShadow: '0 0 15px rgba(255, 43, 78, 0.3)', duration: 0.2 })
      .to(field, { x: -6, duration: 0.05 })
      .to(field, { x:  6, duration: 0.05 })
      .to(field, { x: -4, duration: 0.05 })
      .to(field, { x:  4, duration: 0.05 })
      .to(field, { x:  0, duration: 0.05 })
      .to(field, { borderColor: '', boxShadow: '', duration: 0.4, delay: 0.5 });
  }

  // ----------------------------------------------------------
  // FORM SUBMIT
  // ----------------------------------------------------------
  function bindFormSubmit() {
    if (!submitBtn) return;

    submitBtn.addEventListener('click', async () => {
      if (isSubmitting) return;
      if (!validateForm()) return;

      isSubmitting = true;
      setSubmitLoading(true);

      const missionData = gatherFormData();

      try {
        // Show dossier panel
        hideMissionForm();
        showDossierPanel();

        // Fire API calls via other modules
        window.dispatchEvent(new CustomEvent('absoluteMissionSubmit', {
          detail: missionData
        }));

      } catch (err) {
        console.error('[ABSOLUTE] Mission submission error:', err);
        setSubmitLoading(false);
        isSubmitting = false;
      }
    });
  }

  // ----------------------------------------------------------
  // GATHER FORM DATA
  // ----------------------------------------------------------
  function gatherFormData() {
    return {
      agentName:    fieldAgentName?.value.trim()      || '',
      clearance:    document.getElementById('mission-clearance')?.value || 'omega',
      year:         fieldYear?.value.trim()            || '',
      reality:      fieldReality?.value.trim()         || '',
      realityDesc:  fieldRealityDesc?.value.trim()     || '',
      duration:     fieldDuration?.value.trim()        || '',
      objective:    fieldObjective?.value.trim()       || '',
      inventory:    [...inventoryItems],
      notes:        fieldNotes?.value.trim()           || '',
      timestamp:    new Date().toISOString()
    };
  }

  // ----------------------------------------------------------
  // SHOW / HIDE
  // ----------------------------------------------------------
  function hideMissionForm() {
    if (!missionForm || !window.gsap) return;

    gsap.to(missionForm, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        missionForm.classList.remove('visible');
        missionForm.style.cssText = '';
      }
    });
  }

  function showDossierPanel() {
    if (!dossierPanel) return;

    dossierPanel.classList.add('visible');

    if (window.gsap) {
      gsap.fromTo(dossierPanel,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }

  // ----------------------------------------------------------
  // SET SUBMIT LOADING STATE
  // ----------------------------------------------------------
  function setSubmitLoading(loading) {
    if (!submitBtn) return;

    const btnText = submitBtn.querySelector('.btn-text');
    if (loading) {
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'GENERATING DOSSIER...';
    } else {
      submitBtn.classList.remove('loading');
      if (btnText) btnText.textContent = 'Generate Mission Dossier';
    }
  }

  // ----------------------------------------------------------
  // COUNTDOWN TIMER
  // ----------------------------------------------------------
  function startCountdown(hours = 72) {
    const cdHours   = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    if (!cdHours || !cdMinutes || !cdSeconds) return;

    let totalSeconds = hours * 3600;

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
      totalSeconds--;

      if (totalSeconds <= 0) {
        clearInterval(countdownTimer);
        totalSeconds = 0;
      }

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      const prevH = cdHours.textContent;
      const prevM = cdMinutes.textContent;
      const prevS = cdSeconds.textContent;

      cdHours.textContent   = String(h).padStart(2, '0');
      cdMinutes.textContent = String(m).padStart(2, '0');
      cdSeconds.textContent = String(s).padStart(2, '0');

      // Flash on change
      if (window.gsap) {
        if (prevS !== cdSeconds.textContent) {
          gsap.fromTo(cdSeconds,
            { color: 'var(--neon-cyan)' },
            { color: 'var(--neon-cyan)', duration: 0.2 }
          );
        }
        if (prevM !== cdMinutes.textContent) {
          gsap.fromTo(cdMinutes,
            { scale: 1.1 },
            { scale: 1, duration: 0.3, ease: 'back.out(2)' }
          );
        }
        if (prevH !== cdHours.textContent) {
          gsap.fromTo(cdHours,
            { scale: 1.15 },
            { scale: 1, duration: 0.4, ease: 'back.out(2)' }
          );
        }
      }
    }, 1000);
  }

  // ----------------------------------------------------------
  // RESET MISSION
  // ----------------------------------------------------------
  function bindReset() {
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
      resetMission();
    });
  }

  function resetMission() {
    // Stop countdown
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }

    // Reset state
    isSubmitting  = false;
    scrollVisible = false;
    formVisible   = false;
    inventoryItems = [];

    // Clear form fields
    const fields = document.querySelectorAll('.mission-input');
    fields.forEach(f => { f.value = ''; });

    // Clear inventory tags
    if (inventoryContainer) {
      const tags = inventoryContainer.querySelectorAll('.inventory-tag');
      tags.forEach(t => t.remove());
    }

    // Hide panels
    if (dossierPanel) {
      dossierPanel.classList.remove('visible');
    }
    if (missionForm) {
      missionForm.classList.remove('visible');
      missionForm.style.cssText = '';
    }
    if (missionScroll) {
      missionScroll.classList.remove('visible');
      missionScroll.style.cssText = '';
    }

    // Reset submit button
    setSubmitLoading(false);
    isSubmitting = false;

    // Re-show trigger
    if (scrollTriggerBtn && window.gsap) {
      gsap.to(scrollTriggerBtn, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.4)'
      });
    }

    // Prefill name again
    prefillAgentName();
  }

  // ----------------------------------------------------------
  // REFRESH — Called when tab becomes active
  // ----------------------------------------------------------
  function refresh() {
    prefillAgentName();
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    refresh,
    startCountdown,
    gatherFormData,
    resetMission
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteMissionForm.init();
});