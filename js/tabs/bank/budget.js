/* ============================================================
   ABSOLUTE — js/tabs/bank/budget.js
   Budget Allocations | Category Management | Progress Bars
   Add / Remove | Live Totals | Animated Updates
   ============================================================ */

const AbsoluteBudget = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let categories = [];
  let totalBudget = 0;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const categoryList  = document.getElementById('budget-category-list');
  const totalEl       = document.getElementById('budget-total');
  const addNameInput  = document.getElementById('budget-add-name');
  const addAmountInput = document.getElementById('budget-add-amount');
  const addBtn        = document.getElementById('budget-add-btn');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    loadCategories();
    bindAddCategory();
  }

  // ----------------------------------------------------------
  // LOAD CATEGORIES FROM DATA
  // ----------------------------------------------------------
  function loadCategories() {
    fetch('data/mock-bank.json')
      .then(r => r.json())
      .then(data => {
        categories = data.budgetCategories || [];
        renderCategories();
        updateTotal();
      })
      .catch(() => {
        categories = getFallbackCategories();
        renderCategories();
        updateTotal();
      });
  }

  // ----------------------------------------------------------
  // RENDER CATEGORIES
  // ----------------------------------------------------------
  function renderCategories() {
    if (!categoryList) return;
    categoryList.innerHTML = '';

    categories.forEach((cat, index) => {
      const item = createCategoryItem(cat);
      categoryList.appendChild(item);

      if (window.gsap) {
        gsap.fromTo(item,
          { opacity: 0, x: -20 },
          {
            opacity:  1,
            x:        0,
            duration: 0.3,
            delay:    index * 0.06,
            ease:     'power3.out'
          }
        );
      }

      // Animate progress bar
      setTimeout(() => {
        const fill = item.querySelector('.budget-progress-fill');
        if (fill) {
          const pct = Math.min((cat.spent / cat.allocated) * 100, 100);
          fill.style.width = `${pct}%`;
        }
      }, index * 60 + 300);
    });
  }

  // ----------------------------------------------------------
  // CREATE CATEGORY ITEM
  // ----------------------------------------------------------
  function createCategoryItem(cat) {
    const pct        = Math.min((cat.spent / cat.allocated) * 100, 100);
    const isOverBudget = cat.spent >= cat.allocated;
    const fillColor  = isOverBudget
      ? 'linear-gradient(90deg, var(--neon-red), rgba(255, 43, 78, 0.6))'
      : cat.color
        ? `linear-gradient(90deg, ${cat.color}, ${cat.color}99)`
        : 'var(--grad-cyan-violet)';

    const item = document.createElement('div');
    item.className = 'budget-category-item';
    item.dataset.id = cat.id;

    item.innerHTML = `
      <div class="budget-category-header">
        <div class="budget-category-name">
          <span class="budget-category-emoji">${cat.emoji || '◈'}</span>
          <span>${cat.name}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="budget-category-amount" style="color: ${isOverBudget ? 'var(--neon-red)' : 'var(--text-primary)'};">
            $${cat.spent.toLocaleString()} / $${cat.allocated.toLocaleString()}
          </span>
          <button
            class="budget-remove-btn"
            data-id="${cat.id}"
            style="
              font-size: 10px;
              color: var(--text-muted);
              background: transparent;
              border: none;
              padding: 2px 6px;
              border-radius: 3px;
              transition: color 0.2s;
            "
          >✕</button>
        </div>
      </div>
      <div class="budget-progress-track">
        <div
          class="budget-progress-fill"
          style="
            width: 0%;
            background: ${fillColor};
            transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
          "
        ></div>
      </div>
    `;

    // Remove button
    const removeBtn = item.querySelector('.budget-remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('mouseenter', () => {
        removeBtn.style.color = 'var(--neon-red)';
      });
      removeBtn.addEventListener('mouseleave', () => {
        removeBtn.style.color = 'var(--text-muted)';
      });
      removeBtn.addEventListener('click', () => {
        removeCategory(cat.id);
      });
    }

    return item;
  }

  // ----------------------------------------------------------
  // BIND ADD CATEGORY
  // ----------------------------------------------------------
  function bindAddCategory() {
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      addCategory();
    });

    if (addAmountInput) {
      addAmountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addCategory();
      });
    }

    if (addNameInput) {
      addNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (addAmountInput) addAmountInput.focus();
        }
      });
    }
  }

  // ----------------------------------------------------------
  // ADD CATEGORY
  // ----------------------------------------------------------
  function addCategory() {
    const name   = addNameInput?.value.trim();
    const amount = parseFloat(addAmountInput?.value);

    if (!name || !amount || amount <= 0) {
      // Shake inputs
      if (window.gsap) {
        const inputs = [addNameInput, addAmountInput].filter(Boolean);
        inputs.forEach(input => {
          if (!input.value.trim() || (input === addAmountInput && amount <= 0)) {
            gsap.timeline()
              .to(input, { x: -5, duration: 0.05 })
              .to(input, { x:  5, duration: 0.05 })
              .to(input, { x: -3, duration: 0.05 })
              .to(input, { x:  0, duration: 0.05 })
              .to(input, { borderColor: 'var(--neon-red)', duration: 0.1 })
              .to(input, { borderColor: '', duration: 0.4, delay: 0.5 });
          }
        });
      }
      return;
    }

    const emojis = ['⚡', '🌀', '🔮', '◈', '▲', '🌌', '⬡', '💎'];
    const colors = [
      '#00f5ff', '#7b2fff', '#ff2ff8',
      '#ffd700', '#00ff9d', '#ff7b00',
      '#ff2b4e', '#00c9ff'
    ];

    const newCat = {
      id:        Date.now(),
      name,
      emoji:     emojis[Math.floor(Math.random() * emojis.length)],
      allocated: amount,
      spent:     0,
      color:     colors[categories.length % colors.length]
    };

    categories.push(newCat);

    // Clear inputs
    if (addNameInput)   addNameInput.value   = '';
    if (addAmountInput) addAmountInput.value  = '';

    // Add to DOM
    if (categoryList) {
      const item = createCategoryItem(newCat);
      categoryList.appendChild(item);

      if (window.gsap) {
        gsap.fromTo(item,
          { opacity: 0, x: -20, height: 0 },
          {
            opacity:  1,
            x:        0,
            height:   'auto',
            duration: 0.4,
            ease:     'back.out(1.4)'
          }
        );
      }

      // Animate progress bar
      setTimeout(() => {
        const fill = item.querySelector('.budget-progress-fill');
        if (fill) fill.style.width = '0%';
      }, 100);
    }

    updateTotal();
    addNameInput?.focus();
  }

  // ----------------------------------------------------------
  // REMOVE CATEGORY
  // ----------------------------------------------------------
  function removeCategory(id) {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return;

    categories.splice(index, 1);

    const item = categoryList?.querySelector(`[data-id="${id}"]`);
    if (item) {
      if (window.gsap) {
        gsap.to(item, {
          opacity: 0,
          x:       20,
          height:  0,
          padding: 0,
          margin:  0,
          duration: 0.3,
          ease:    'power2.in',
          onComplete: () => {
            if (item.parentNode) item.parentNode.removeChild(item);
            updateTotal();
          }
        });
      } else {
        item.parentNode?.removeChild(item);
        updateTotal();
      }
    }
  }

  // ----------------------------------------------------------
  // UPDATE TOTAL
  // ----------------------------------------------------------
  function updateTotal() {
    totalBudget = categories.reduce((sum, cat) => sum + cat.allocated, 0);

    if (!totalEl) return;

    const prev = parseFloat(totalEl.textContent.replace(/[$,]/g, '')) || 0;

    if (window.AbsoluteApp) {
      // Animated count up
      const start     = prev;
      const end       = totalBudget;
      const duration  = 600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = Math.floor(start + (end - start) * eased);
        totalEl.textContent = `$${value.toLocaleString()}`;
        if (progress < 1) requestAnimationFrame(update);
        else totalEl.textContent = `$${end.toLocaleString()}`;
      }
      requestAnimationFrame(update);
    } else {
      totalEl.textContent = `$${totalBudget.toLocaleString()}`;
    }

    // Flash total
    if (window.gsap && totalEl) {
      gsap.timeline()
        .to(totalEl, { color: 'var(--neon-gold)', scale: 1.05, duration: 0.15 })
        .to(totalEl, { color: '',                 scale: 1,    duration: 0.3, ease: 'power2.out' });
    }
  }

  // ----------------------------------------------------------
  // REFRESH
  // ----------------------------------------------------------
  function refresh() {
    if (categories.length === 0) {
      loadCategories();
    }
  }

  // ----------------------------------------------------------
  // FALLBACK DATA
  // ----------------------------------------------------------
  function getFallbackCategories() {
    return [
      { id: 1, name: 'Mission Equipment', emoji: '⚡', allocated: 1200, spent: 890,  color: '#00f5ff' },
      { id: 2, name: 'Portal Access Fees', emoji: '🌀', allocated: 800,  spent: 800,  color: '#7b2fff' },
      { id: 3, name: 'Temporal Provisions', emoji: '🔮', allocated: 450,  spent: 210,  color: '#ff2ff8' },
      { id: 4, name: 'Intelligence Assets', emoji: '◈',  allocated: 600,  spent: 420,  color: '#ffd700' },
      { id: 5, name: 'Extraction Insurance', emoji: '▲', allocated: 300,  spent: 300,  color: '#00ff9d' },
      { id: 6, name: 'Artefact Storage', emoji: '🌌',    allocated: 250,  spent: 130,  color: '#ff7b00' }
    ];
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return { init, refresh, addCategory, removeCategory, updateTotal };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteBudget.init();
});