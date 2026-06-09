/* ============================================================
   ABSOLUTE — js/tabs/create-trip/claude.js
   Claude API Integration | Mission Dossier | Risk Assessment
   Streaming Text Output | Typewriter Reveal
   ============================================================ */

const AbsoluteClaude = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let isGenerating = false;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const dossierText  = document.getElementById('dossier-text');
  const riskItems    = document.getElementById('risk-items');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    window.addEventListener('absoluteMissionSubmit', (e) => {
      const missionData = e.detail;
      generateDossier(missionData);
    });
  }

  // ----------------------------------------------------------
  // GENERATE DOSSIER
  // ----------------------------------------------------------
  async function generateDossier(missionData) {
    if (isGenerating) return;
    isGenerating = true;

    setDossierLoading(true);
    setRiskLoading(true);

    try {
      // Run both in parallel
      await Promise.all([
        generateMissionBrief(missionData),
        generateRiskAssessment(missionData)
      ]);
    } catch (err) {
      console.error('[ABSOLUTE] Claude generation error:', err);
      setDossierError();
      setRiskError();
    } finally {
      isGenerating = false;
    }
  }

  // ----------------------------------------------------------
  // GENERATE MISSION BRIEF
  // ----------------------------------------------------------
  async function generateMissionBrief(data) {
    const apiKey = window.__ENV__?.CLAUDE_API_KEY;

    if (!apiKey) {
      setDossierFallback(data);
      return;
    }

    const prompt = buildDossierPrompt(data);

    try {
      const response = await fetch(API_CONFIG.claude.baseURL, {
        method: 'POST',
        headers: API_CONFIG.claude.headers,
        body: JSON.stringify({
          model:      API_CONFIG.claude.model,
          max_tokens: API_CONFIG.claude.maxTokens,
          system:     API_CONFIG.claude.prompts.dossier,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data_resp = await response.json();
      const text = data_resp?.content?.[0]?.text || '';

      if (text) {
        typewriterReveal(dossierText, text);
        if (window.AbsoluteMissionForm) {
          AbsoluteMissionForm.startCountdown(72);
        }
      } else {
        setDossierFallback(data);
      }

    } catch (err) {
      console.error('[ABSOLUTE] Mission brief error:', err);
      setDossierFallback(data);
    }
  }

  // ----------------------------------------------------------
  // GENERATE RISK ASSESSMENT
  // ----------------------------------------------------------
  async function generateRiskAssessment(data) {
    const apiKey = window.__ENV__?.CLAUDE_API_KEY;

    if (!apiKey) {
      setRiskFallback(data);
      return;
    }

    const prompt = buildRiskPrompt(data);

    try {
      const response = await fetch(API_CONFIG.claude.baseURL, {
        method: 'POST',
        headers: API_CONFIG.claude.headers,
        body: JSON.stringify({
          model:      API_CONFIG.claude.model,
          max_tokens: 600,
          system:     API_CONFIG.claude.prompts.risk,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API risk error: ${response.status}`);
      }

      const data_resp = await response.json();
      const text = data_resp?.content?.[0]?.text || '';

      if (text) {
        renderRiskItems(text);
      } else {
        setRiskFallback(data);
      }

    } catch (err) {
      console.error('[ABSOLUTE] Risk assessment error:', err);
      setRiskFallback(data);
    }
  }

  // ----------------------------------------------------------
  // PROMPT BUILDERS
  // ----------------------------------------------------------
  function buildDossierPrompt(data) {
    return `
MISSION PARAMETERS:
- Agent: ${data.agentName}
- Clearance: ${data.clearance.toUpperCase()}
- Target Year: ${data.year}
- Reality Designation: ${data.reality}
- Reality Description: ${data.realityDesc}
- Mission Duration: ${data.duration}
- Primary Objective: ${data.objective || 'Unspecified'}
- Equipment & Inventory: ${data.inventory.join(', ')}
- Additional Intelligence: ${data.notes || 'None provided'}

Generate the classified mission dossier now.
    `.trim();
  }

  function buildRiskPrompt(data) {
    return `
MISSION PARAMETERS FOR RISK ANALYSIS:
- Agent: ${data.agentName}
- Target Year: ${data.year}
- Reality: ${data.reality}
- Description: ${data.realityDesc}
- Duration: ${data.duration}
- Equipment: ${data.inventory.join(', ')}
- Notes: ${data.notes || 'None'}

Provide exactly 4 risk assessment points as a numbered list (1. 2. 3. 4.).
Each point should be one sentence. Be specific to the mission parameters.
    `.trim();
  }

  // ----------------------------------------------------------
  // TYPEWRITER REVEAL
  // ----------------------------------------------------------
  function typewriterReveal(el, text, speed = 18) {
    if (!el) return;

    el.textContent = '';
    el.style.opacity = '1';

    // Format sections with line breaks
    const formatted = text
      .replace(/MISSION BRIEF:/gi,        '\n\nMISSION BRIEF:\n')
      .replace(/DESTINATION PROFILE:/gi,  '\n\nDESTINATION PROFILE:\n')
      .replace(/TEMPORAL RISK ASSESSMENT:/gi, '\n\nTEMPORAL RISK ASSESSMENT:\n')
      .replace(/AGENT DIRECTIVE:/gi,      '\n\nAGENT DIRECTIVE:\n')
      .trim();

    let i = 0;
    let currentEl = document.createElement('p');
    currentEl.style.marginBottom = '12px';
    currentEl.style.lineHeight = '1.7';
    el.appendChild(currentEl);

    const timer = setInterval(() => {
      if (i >= formatted.length) {
        clearInterval(timer);
        if (window.AbsoluteTransitions) {
          AbsoluteTransitions.pulseHighlight(el.closest('.dossier-text-panel'));
        }
        return;
      }

      const char = formatted[i];

      if (char === '\n' && formatted[i + 1] === '\n') {
        currentEl = document.createElement('p');
        currentEl.style.marginBottom = '12px';
        currentEl.style.lineHeight   = '1.7';
        el.appendChild(currentEl);
        i += 2;
        return;
      }

      if (char === '\n') {
        currentEl.appendChild(document.createElement('br'));
      } else {
        // Bold section headers
        const remaining = formatted.slice(i);
        const headerMatch = remaining.match(
          /^(MISSION BRIEF|DESTINATION PROFILE|TEMPORAL RISK ASSESSMENT|AGENT DIRECTIVE):/
        );
        if (headerMatch) {
          const strong = document.createElement('strong');
          strong.style.color         = 'var(--neon-cyan)';
          strong.style.letterSpacing = '0.1em';
          strong.style.fontSize      = '0.75rem';
          strong.textContent = headerMatch[0];
          currentEl.appendChild(strong);
          i += headerMatch[0].length;
          return;
        }

        currentEl.insertAdjacentText('beforeend', char);
      }

      i++;

      // Auto scroll
      if (el.parentElement) {
        el.parentElement.scrollTop = el.parentElement.scrollHeight;
      }

    }, speed);
  }

  // ----------------------------------------------------------
  // RENDER RISK ITEMS
  // ----------------------------------------------------------
  function renderRiskItems(text) {
    if (!riskItems) return;

    riskItems.innerHTML = '';

    // Parse numbered list
    const lines = text.split('\n').filter(line => line.trim());
    const riskLines = lines.filter(line => /^\d+\./.test(line.trim()));

    if (riskLines.length === 0) {
      // Fallback — split by sentences
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
      sentences.slice(0, 4).forEach(sentence => {
        appendRiskItem(sentence.trim() + '.');
      });
    } else {
      riskLines.forEach(line => {
        const clean = line.replace(/^\d+\.\s*/, '').trim();
        if (clean) appendRiskItem(clean);
      });
    }

    if (window.gsap) {
      const items = riskItems.querySelectorAll('.risk-item');
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
    }
  }

  function appendRiskItem(text) {
    if (!riskItems) return;

    const item = document.createElement('div');
    item.className = 'risk-item';
    item.innerHTML = `
      <span class="risk-item-icon">⚠</span>
      <span>${text}</span>
    `;
    riskItems.appendChild(item);
  }

  // ----------------------------------------------------------
  // LOADING STATES
  // ----------------------------------------------------------
  function setDossierLoading(loading) {
    if (!dossierText) return;
    if (loading) {
      dossierText.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; color: var(--text-muted);">
          <div class="spinner"></div>
          <span style="font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: 0.1em;">
            GENERATING CLASSIFIED DOSSIER...
          </span>
        </div>
      `;
    }
  }

  function setRiskLoading(loading) {
    if (!riskItems) return;
    if (loading) {
      riskItems.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; color: var(--text-muted);">
          <div class="spinner"></div>
          <span style="font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: 0.1em;">
            ANALYZING MISSION PARAMETERS...
          </span>
        </div>
      `;
    }
  }

  // ----------------------------------------------------------
  // FALLBACK CONTENT (no API key)
  // ----------------------------------------------------------
  function setDossierFallback(data) {
    if (!dossierText) return;

    const fallback = `
MISSION BRIEF:
Agent ${data.agentName}, you have been assigned an Omega-clearance interdimensional mission to ${data.reality}, target year ${data.year}. This mission has been authorized at the highest level of ABSOLUTE command.

DESTINATION PROFILE:
${data.realityDesc || `${data.reality} represents an uncharted dimensional coordinate with unknown atmospheric and societal conditions. Proceed with extreme caution and maintain your cover at all times.`}

TEMPORAL RISK ASSESSMENT:
Your mission window of ${data.duration} carries significant temporal displacement risk. Any interaction with the local timeline must be carefully managed to prevent paradox cascade events. Your equipment inventory has been reviewed and cleared for dimensional transit.

AGENT DIRECTIVE:
${data.objective ? `Primary objective: ${data.objective}. ` : ''}Maintain radio silence on all non-secure channels. Return through designated portal coordinates only. All artefacts must be declared upon return. ABSOLUTE command will monitor your temporal signature throughout the mission. Good luck, Agent.
    `.trim();

    typewriterReveal(dossierText, fallback);
    if (window.AbsoluteMissionForm) {
      AbsoluteMissionForm.startCountdown(72);
    }
  }

  function setRiskFallback(data) {
    if (!riskItems) return;

    const risks = [
      `Temporal paradox risk is elevated due to the ${data.year} target year — avoid interaction with known historical figures.`,
      `Inventory item${data.inventory.length > 1 ? 's' : ''} [${data.inventory.slice(0, 2).join(', ')}] may attract attention in ${data.reality} — consider concealment protocols.`,
      `Mission duration of ${data.duration} exceeds standard temporal window — dimensional drift probability is moderate.`,
      `Reality designation ${data.reality} has limited prior intelligence — unknown threats may be present upon arrival.`
    ];

    riskItems.innerHTML = '';
    risks.forEach(risk => appendRiskItem(risk));

    if (window.gsap) {
      const items = riskItems.querySelectorAll('.risk-item');
      gsap.fromTo(items,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }

  // ----------------------------------------------------------
  // ERROR STATES
  // ----------------------------------------------------------
  function setDossierError() {
    if (!dossierText) return;
    dossierText.innerHTML = `
      <span style="color: var(--neon-red); font-family: var(--font-mono); font-size: var(--fs-xs);">
        ⚠ DOSSIER GENERATION FAILED — CHECK API CONFIGURATION
      </span>
    `;
  }

  function setRiskError() {
    if (!riskItems) return;
    riskItems.innerHTML = `
      <div class="risk-item">
        <span class="risk-item-icon">⚠</span>
        <span style="color: var(--neon-red);">Risk assessment unavailable — API error</span>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, generateDossier };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteClaude.init();
});