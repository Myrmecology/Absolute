/* ============================================================
   ABSOLUTE — js/tabs/create-trip/flux.js
   Flux Pro via fal.ai | Hyper Realistic Portal Image
   Image Generation | Portal Open Animation
   ============================================================ */

const AbsoluteFlux = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let isGenerating = false;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const portalImage    = document.getElementById('portal-image');
  const portalLoading  = document.getElementById('portal-loading');
  const portalLabel    = document.getElementById('portal-image-label');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    window.addEventListener('absoluteMissionSubmit', (e) => {
      generatePortalImage(e.detail);
    });
  }

  // ----------------------------------------------------------
  // GENERATE PORTAL IMAGE
  // ----------------------------------------------------------
  async function generatePortalImage(missionData) {
    if (isGenerating) return;
    isGenerating = true;

    showLoading();

    const apiKey = window.__ENV__?.FAL_API_KEY;

    if (!apiKey) {
      setFallbackImage(missionData);
      isGenerating = false;
      return;
    }

    const prompt = buildImagePrompt(missionData);

    try {
      const response = await fetch(API_CONFIG.flux.baseURL, {
        method: 'POST',
        headers: API_CONFIG.flux.headers,
        body: JSON.stringify({
          prompt,
          ...API_CONFIG.flux.defaults
        })
      });

      if (!response.ok) {
        throw new Error(`Flux API error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data?.images?.[0]?.url || data?.image?.url || '';

      if (imageUrl) {
        revealPortalImage(imageUrl, missionData);
      } else {
        setFallbackImage(missionData);
      }

    } catch (err) {
      console.error('[ABSOLUTE] Flux generation error:', err);
      setFallbackImage(missionData);
    } finally {
      isGenerating = false;
    }
  }

  // ----------------------------------------------------------
  // BUILD IMAGE PROMPT
  // ----------------------------------------------------------
  function buildImagePrompt(data) {
    return API_CONFIG.flux.promptTemplate(
      data.year,
      data.reality,
      data.realityDesc
    );
  }

  // ----------------------------------------------------------
  // REVEAL PORTAL IMAGE
  // ----------------------------------------------------------
  function revealPortalImage(url, missionData) {
    if (!portalImage) return;

    portalImage.onload = () => {
      hideLoading();
      portalImage.classList.add('loaded');

      if (portalLabel) {
        portalLabel.textContent = `— ${missionData.reality} // ${missionData.year} —`;
      }

      // Animate portal opening
      if (window.gsap) {
        const container = portalImage.closest('.portal-image-container');
        if (container) {
          gsap.timeline()
            .to(container, {
              boxShadow: '0 0 60px rgba(0, 245, 255, 0.8), 0 0 120px rgba(123, 47, 255, 0.4)',
              duration: 0.5
            })
            .to(container, {
              boxShadow: '0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(123, 47, 255, 0.2)',
              duration: 1,
              ease: 'power2.out'
            });
        }

        // Label reveal
        if (portalLabel) {
          gsap.fromTo(portalLabel,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: 'power3.out' }
          );
        }
      }

      // Dispatch event for dossier module
      window.dispatchEvent(new CustomEvent('absolutePortalReady', {
        detail: { url, missionData }
      }));
    };

    portalImage.onerror = () => {
      setFallbackImage(missionData);
    };

    portalImage.src = url;
  }

  // ----------------------------------------------------------
  // FALLBACK IMAGE
  // Uses a CSS gradient + text as placeholder when no API key
  // ----------------------------------------------------------
  function setFallbackImage(missionData) {
    hideLoading();

    const container = document.querySelector('.portal-image-container');
    if (!container) return;

    // Create a styled fallback
    const fallback = document.createElement('div');
    fallback.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 15, 0.95) 0%,
        rgba(2, 2, 30, 0.95) 50%,
        rgba(5, 0, 20, 0.95) 100%
      );
    `;

    // Animated glow orb
    const orb = document.createElement('div');
    orb.style.cssText = `
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        rgba(0, 245, 255, 0.6) 0%,
        rgba(123, 47, 255, 0.4) 40%,
        rgba(255, 47, 248, 0.2) 70%,
        transparent 100%
      );
      box-shadow:
        0 0 40px rgba(0, 245, 255, 0.6),
        0 0 80px rgba(123, 47, 255, 0.3),
        0 0 120px rgba(255, 47, 248, 0.2);
      animation: geometry-breathe 3s ease-in-out infinite;
    `;

    const label = document.createElement('div');
    label.style.cssText = `
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
      text-align: center;
      padding: 0 20px;
    `;
    label.textContent = `${missionData.reality} // ${missionData.year}`;

    const subLabel = document.createElement('div');
    subLabel.style.cssText = `
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
      text-align: center;
    `;
    subLabel.textContent = 'Portal visualization requires fal.ai API key';

    fallback.appendChild(orb);
    fallback.appendChild(label);
    fallback.appendChild(subLabel);
    container.appendChild(fallback);

    if (portalLabel) {
      portalLabel.textContent = `— ${missionData.reality} // ${missionData.year} —`;
    }

    if (window.gsap) {
      gsap.fromTo(fallback,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    window.dispatchEvent(new CustomEvent('absolutePortalReady', {
      detail: { url: null, missionData }
    }));
  }

  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------
  function showLoading() {
    if (portalLoading) {
      portalLoading.style.display = 'flex';

      // Animate loading text
      const loadingText = portalLoading.querySelector('.portal-loading-text');
      if (loadingText) {
        const messages = [
          'CALCULATING COORDINATES...',
          'ALIGNING DIMENSIONAL VECTORS...',
          'STABILIZING PORTAL MATRIX...',
          'RENDERING DESTINATION...',
          'OPENING PORTAL...'
        ];
        let idx = 0;
        const msgTimer = setInterval(() => {
          if (!portalLoading.style.display || portalLoading.style.display === 'none') {
            clearInterval(msgTimer);
            return;
          }
          loadingText.textContent = messages[idx % messages.length];
          idx++;
        }, 1200);
      }
    }

    if (portalImage) {
      portalImage.style.opacity = '0';
    }
  }

  function hideLoading() {
    if (portalLoading) {
      if (window.gsap) {
        gsap.to(portalLoading, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            portalLoading.style.display = 'none';
            portalLoading.style.opacity = '';
          }
        });
      } else {
        portalLoading.style.display = 'none';
      }
    }
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, generatePortalImage };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteFlux.init();
});