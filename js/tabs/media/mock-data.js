/* ============================================================
   ABSOLUTE — js/tabs/media/mock-data.js
   Mock Data Helpers | Dynamic Content Generators
   Simulated Network Activity | Randomized Feed Content
   ============================================================ */

const AbsoluteMockData = (() => {

  // ----------------------------------------------------------
  // AGENT NAMES & AVATARS
  // ----------------------------------------------------------
  const agents = [
    { name: 'AGENT VEGA',   handle: '@vega.absolute',   avatar: '🌟' },
    { name: 'AGENT AXIOM',  handle: '@axiom.absolute',  avatar: '⚡' },
    { name: 'AGENT NOVA',   handle: '@nova.absolute',   avatar: '🌀' },
    { name: 'AGENT CIPHER', handle: '@cipher.absolute', avatar: '◈'  },
    { name: 'AGENT LYRA',   handle: '@lyra.absolute',   avatar: '🔮' },
    { name: 'AGENT DUSK',   handle: '@dusk.absolute',   avatar: '🌌' },
    { name: 'AGENT ECHO',   handle: '@echo.absolute',   avatar: '⬡'  },
    { name: 'AGENT ORION',  handle: '@orion.absolute',  avatar: '🌠' },
    { name: 'AGENT FLUX',   handle: '@flux.absolute',   avatar: '⚡' },
    { name: 'AGENT PRISM',  handle: '@prism.absolute',  avatar: '🔷' },
    { name: 'AGENT ZERO',   handle: '@zero.absolute',   avatar: '◯'  },
    { name: 'AGENT RAVEN',  handle: '@raven.absolute',  avatar: '🌑' },
  ];

  // ----------------------------------------------------------
  // REALITIES
  // ----------------------------------------------------------
  const realities = [
    'Earth-7',
    'Mirror Realm',
    'Quantum-Null',
    'Crystal Expanse',
    'Fracture Zone',
    'Epoch-1923',
    'Epoch-2157',
    'Neon Citadel',
    'The Void Between',
    'Inverted Earth',
    'Deep Sigma',
    'The Lattice',
    'Chromatic Dimension',
    'Echo Chamber',
    'Paradox Loop'
  ];

  // ----------------------------------------------------------
  // POST TEMPLATES
  // ----------------------------------------------------------
  const postTemplates = [
    (agent, reality) => `Just completed a reconnaissance sweep of #${reality.replace(/\s+/g, '')}. The dimensional fabric here is unlike anything in the archives. Compiling full report now. #TemporalOps`,
    (agent, reality) => `Warning to all operatives — portal coordinates to ${reality} have shifted by 0.7 degrees. Update your navigation matrices before departure. #Alert`,
    (agent, reality) => `${reality} debrief complete. Day 3 of operations and the locals have no idea we are here. Temporal camouflage is holding. #Classified #FieldReport`,
    (agent, reality) => `Found something in ${reality} that is not in any of our databases. Artefact scan returning anomalous readings. Requesting immediate analysis support. @cipher.absolute`,
    (agent, reality) => `The atmosphere in #${reality.replace(/\s+/g, '')} is beautiful and terrifying in equal measure. Hard to believe we almost missed this reality entirely. #Exploration`,
    (agent, reality) => `Temporal drift detected near extraction point in ${reality}. Departure window closing faster than projected. Initiating emergency protocol now. #Emergency`,
    (agent, reality) => `Intelligence confirmed — ${reality} has its own version of ABSOLUTE. They call it something different but the infrastructure is identical. #Disturbing #Multiverse`,
    (agent, reality) => `Communication blackout lifted in #${reality.replace(/\s+/g, '')}. All agents please report your status. Command is waiting. #RollCall #Operations`,
    (agent, reality) => `Spent 72 hours in ${reality} studying the local power structures. The implications for our own timeline are significant. Full report to follow. #Intelligence`,
    (agent, reality) => `The version of me in ${reality} made different choices. Observing them is the strangest experience I have ever had in the field. #Multiverse #TemporalEthics`,
  ];

  // ----------------------------------------------------------
  // COMMENT TEMPLATES
  // ----------------------------------------------------------
  const commentTemplates = [
    'Stay safe out there. That sector has been unstable for three cycles.',
    'Cross-referencing with our dimensional database now. Stand by.',
    'Confirmed — we picked up the same anomaly on our sensors.',
    'Requesting more details in a secure transmission. Do not post coordinates.',
    'This matches the pattern from the Kepler incident. Be careful.',
    'Outstanding field work. Command will want to see this immediately.',
    'The artefact readings you described suggest dimensional contamination.',
    'I was in that reality six cycles ago. The drift is accelerating.',
    'Temporal signature verified. Your report has been logged.',
    'Do NOT engage with the locals until we have more intelligence.',
  ];

  // ----------------------------------------------------------
  // ACTIVITY TEMPLATES
  // ----------------------------------------------------------
  const activityTemplates = [
    (agent) => ({ icon: '🌀', text: `${agent.name} opened a new portal`, time: 'now' }),
    (agent) => ({ icon: '⚡', text: `${agent.name} filed a field report`, time: 'now' }),
    (agent) => ({ icon: '🔮', text: `${agent.name} returned from mission`, time: 'now' }),
    (agent) => ({ icon: '◈',  text: `${agent.name} accessed the archives`, time: 'now' }),
    (agent) => ({ icon: '⚠',  text: `${agent.name} flagged an anomaly`, time: 'now' }),
    (agent) => ({ icon: '🌌', text: `${agent.name} catalogued an artefact`, time: 'now' }),
    (agent) => ({ icon: '⬡',  text: `${agent.name} joined the network`, time: 'now' }),
    (agent) => ({ icon: '🌟', text: `${agent.name} completed debrief`, time: 'now' }),
  ];

  // ----------------------------------------------------------
  // TRENDING TEMPLATES
  // ----------------------------------------------------------
  const trendingTemplates = [
    { tag: '#FractureZone',      baseCount: 24700  },
    { tag: '#TemporalAlert',     baseCount: 18200  },
    { tag: '#KeplerMission',     baseCount: 12900  },
    { tag: '#CrystalExpanse',    baseCount: 9400   },
    { tag: '#QuantumNull',       baseCount: 7100   },
    { tag: '#MirrorRealm',       baseCount: 31400  },
    { tag: '#ArtifactRecovery',  baseCount: 5600   },
    { tag: '#DimensionalDrift',  baseCount: 19800  },
    { tag: '#TemporalEthics',    baseCount: 4200   },
    { tag: '#OmegaClearance',    baseCount: 8800   },
  ];

  // ----------------------------------------------------------
  // GENERATE RANDOM POST
  // ----------------------------------------------------------
  function generateRandomPost() {
    const agent    = randomFrom(agents);
    const reality  = randomFrom(realities);
    const template = randomFrom(postTemplates);
    const text     = template(agent, reality);

    return {
      id:           Date.now() + Math.random(),
      username:     agent.name,
      handle:       agent.handle,
      avatar:       agent.avatar,
      timestamp:    randomTimestamp(),
      reality,
      text,
      hasImage:     Math.random() > 0.6,
      imagePlaceholder: randomFrom(['🌆', '🌌', '🔮', '⚡', '🌀', '💎']),
      likes:        Math.floor(Math.random() * 500),
      comments:     Math.floor(Math.random() * 80),
      shares:       Math.floor(Math.random() * 30),
      liked:        false,
      reactions:    randomReactions(),
      reactionCount: Math.floor(Math.random() * 500),
      comments_data: generateRandomComments(Math.floor(Math.random() * 3))
    };
  }

  // ----------------------------------------------------------
  // GENERATE RANDOM COMMENTS
  // ----------------------------------------------------------
  function generateRandomComments(count) {
    const comments = [];
    for (let i = 0; i < count; i++) {
      const agent = randomFrom(agents);
      comments.push({
        id:        Date.now() + i,
        username:  agent.name.replace('AGENT ', ''),
        avatar:    agent.avatar,
        text:      randomFrom(commentTemplates),
        timestamp: randomTimestamp()
      });
    }
    return comments;
  }

  // ----------------------------------------------------------
  // GENERATE RANDOM ACTIVITY ITEM
  // ----------------------------------------------------------
  function generateRandomActivity() {
    const agent    = randomFrom(agents);
    const template = randomFrom(activityTemplates);
    return template(agent);
  }

  // ----------------------------------------------------------
  // GENERATE TRENDING DATA
  // ----------------------------------------------------------
  function generateTrending(count = 5) {
    const shuffled = [...trendingTemplates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((item, i) => ({
      rank:  i + 1,
      tag:   item.tag,
      count: formatCount(item.baseCount + Math.floor(Math.random() * 1000))
    }));
  }

  // ----------------------------------------------------------
  // GENERATE SUGGESTIONS
  // ----------------------------------------------------------
  function generateSuggestions(count = 4) {
    const shuffled = [...agents].sort(() => Math.random() - 0.5);
    const reasons  = [
      'Operative in your sector',
      '3 mutual operatives',
      'Similar mission profile',
      'Omega clearance',
      'Frequent collaborator',
      'New to the network',
      'Top-rated field agent',
      'Dimensional specialist'
    ];

    return shuffled.slice(0, count).map((agent, i) => ({
      id:        i + 1,
      name:      agent.name,
      avatar:    agent.avatar,
      reason:    randomFrom(reasons),
      following: false
    }));
  }

  // ----------------------------------------------------------
  // GENERATE BANK TRANSACTION
  // ----------------------------------------------------------
  function generateRandomTransaction(type = null) {
    const transactionType = type || (Math.random() > 0.4 ? 'expense' : 'income');

    const incomeNames = [
      'Mission Stipend',
      'Reality Bonus',
      'Dimensional Research Grant',
      'Artefact Appraisal Fee',
      'Extraction Reward',
      'Omega Clearance Bonus',
      'Field Intelligence Payment',
      'Multiverse Survey Compensation'
    ];

    const expenseNames = [
      'Portal Access Fee',
      'Temporal Gear Restock',
      'Intelligence Asset Payment',
      'Artefact Storage Fee',
      'Extraction Insurance',
      'Dimensional Compass Calibration',
      'Reality Anchor Maintenance',
      'Anti-Paradox Field Service'
    ];

    const incomeIcons  = ['◈', '▲', '💎', '⬡', '🌟'];
    const expenseIcons = ['🌀', '⚡', '🔮', '🌌', '▼'];

    const names = transactionType === 'income' ? incomeNames : expenseNames;
    const icons = transactionType === 'income' ? incomeIcons : expenseIcons;

    const now     = new Date();
    const dateStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric' })} — ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    return {
      id:     Date.now(),
      name:   randomFrom(names),
      amount: Math.floor(Math.random() * 1800) + 50,
      type:   transactionType,
      icon:   randomFrom(icons),
      date:   dateStr
    };
  }

  // ----------------------------------------------------------
  // GENERATE RANDOM BUDGET CATEGORY
  // ----------------------------------------------------------
  function generateRandomBudgetCategory() {
    const categories = [
      { name: 'Neural Interface Upkeep',   emoji: '⬡', color: '#00f5ff' },
      { name: 'Quantum Fuel Reserves',     emoji: '⚡', color: '#7b2fff' },
      { name: 'Dimensional Cartography',   emoji: '🌀', color: '#ff2ff8' },
      { name: 'Reality Anchor Upkeep',     emoji: '◈',  color: '#ffd700' },
      { name: 'Bio-Temporal Supplements',  emoji: '🔮', color: '#00ff9d' },
      { name: 'Stealth Field Rental',      emoji: '🌌', color: '#ff7b00' },
      { name: 'Paradox Resolution Fund',   emoji: '▲',  color: '#ff2b4e' },
      { name: 'Multiverse Insurance',      emoji: '🌟', color: '#00c9ff' },
    ];

    const cat      = randomFrom(categories);
    const allocated = Math.floor(Math.random() * 1000) + 100;
    const spent     = Math.floor(Math.random() * allocated);

    return {
      id:        Date.now(),
      ...cat,
      allocated,
      spent
    };
  }

  // ----------------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------------
  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomTimestamp() {
    const options = [
      'just now',
      '2 minutes ago',
      '5 minutes ago',
      '12 minutes ago',
      '28 minutes ago',
      '1 hour ago',
      '2 hours ago',
      '3 hours ago',
      '5 hours ago',
      '8 hours ago',
    ];
    return randomFrom(options);
  }

  function randomReactions() {
    const all = ['🔥', '⚡', '🌀', '🔮', '◈', '⚠', '🌟', '💎'];
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function formatCount(num) {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K transmissions`;
    }
    return `${num} transmissions`;
  }

  // ----------------------------------------------------------
  // SEED DATA REFRESH
  // Called periodically to keep the UI feeling alive
  // ----------------------------------------------------------
  function refreshTrendingData() {
    const trendingEl = document.getElementById('trending-list');
    if (!trendingEl) return;

    const newTrending = generateTrending(5);
    trendingEl.innerHTML = '';

    newTrending.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'trending-item';
      el.innerHTML = `
        <span class="trending-rank">#${item.rank} Trending</span>
        <span class="trending-tag">${item.tag}</span>
        <span class="trending-count">${item.count}</span>
      `;
      trendingEl.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: 15 },
          {
            opacity:  1,
            x:        0,
            duration: 0.3,
            delay:    i * 0.05,
            ease:     'power3.out'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // START LIVE DATA SIMULATION
  // ----------------------------------------------------------
  function startLiveSimulation() {
    // Refresh trending every 30 seconds
    setInterval(() => {
      refreshTrendingData();
    }, 30000);
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    startLiveSimulation();
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    generateRandomPost,
    generateRandomComments,
    generateRandomActivity,
    generateTrending,
    generateSuggestions,
    generateRandomTransaction,
    generateRandomBudgetCategory,
    agents,
    realities,
    randomFrom,
    refreshTrendingData
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteMockData.init();
});