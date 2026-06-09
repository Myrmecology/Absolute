/* ============================================================
   ABSOLUTE — js/tabs/bank/lists.js
   Buy List | Avoid List | Transactions | Add / Remove
   Check / Uncheck | Animated Updates | Live Counts
   ============================================================ */

const AbsoluteLists = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let buyItems       = [];
  let avoidItems     = [];
  let transactions   = [];
  let transactionType = 'income';

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const buyList       = document.getElementById('buy-list');
  const avoidList     = document.getElementById('avoid-list');
  const buyInput      = document.getElementById('buy-input');
  const avoidInput    = document.getElementById('avoid-input');
  const buyAddBtn     = document.getElementById('buy-add-btn');
  const avoidAddBtn   = document.getElementById('avoid-add-btn');
  const buyCount      = document.getElementById('buy-count');
  const avoidCount    = document.getElementById('avoid-count');

  // Transaction elements
  const transactionList   = document.getElementById('transaction-list');
  const transNameInput    = document.getElementById('transaction-name-input');
  const transAmountInput  = document.getElementById('transaction-amount-input');
  const typeIncomeBtn     = document.getElementById('type-income');
  const typeExpenseBtn    = document.getElementById('type-expense');
  const addTransactionBtn = document.getElementById('add-transaction-btn');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    loadData();
    bindListInputs();
    bindTransactionInputs();
  }

  // ----------------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------------
  function loadData() {
    fetch('data/mock-bank.json')
      .then(r => r.json())
      .then(data => {
        buyItems     = data.buyList        || [];
        avoidItems   = data.avoidList      || [];
        transactions = data.transactions   || [];
        renderBuyList();
        renderAvoidList();
        renderTransactions();
      })
      .catch(() => {
        buyItems     = getFallbackBuyItems();
        avoidItems   = getFallbackAvoidItems();
        transactions = getFallbackTransactions();
        renderBuyList();
        renderAvoidList();
        renderTransactions();
      });
  }

  // ----------------------------------------------------------
  // RENDER BUY LIST
  // ----------------------------------------------------------
  function renderBuyList() {
    if (!buyList) return;
    buyList.innerHTML = '';

    buyItems.forEach((item, i) => {
      const el = createListItem(item, 'buy');
      buyList.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.3, delay: i * 0.05, ease: 'power3.out' }
        );
      }
    });

    updateBuyCount();
  }

  // ----------------------------------------------------------
  // RENDER AVOID LIST
  // ----------------------------------------------------------
  function renderAvoidList() {
    if (!avoidList) return;
    avoidList.innerHTML = '';

    avoidItems.forEach((item, i) => {
      const el = createListItem(item, 'avoid');
      avoidList.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: -15 },
          { opacity: 1, x: 0, duration: 0.3, delay: i * 0.05, ease: 'power3.out' }
        );
      }
    });

    updateAvoidCount();
  }

  // ----------------------------------------------------------
  // CREATE LIST ITEM
  // ----------------------------------------------------------
  function createListItem(item, type) {
    const el = document.createElement('div');
    el.className = 'shopping-list-item';
    el.dataset.id = item.id;

    const checkColor = type === 'buy' ? 'var(--neon-green)' : 'var(--neon-red)';
    const checkSymbol = type === 'buy' ? '✓' : '✕';

    el.innerHTML = `
      <div
        class="list-item-checkbox ${item.checked ? 'checked' : ''}"
        data-id="${item.id}"
        data-type="${type}"
        style="${item.checked ? `background: ${checkColor}; border-color: ${checkColor};` : ''}"
      >${item.checked ? checkSymbol : ''}</div>
      <span class="list-item-text ${item.checked ? 'checked' : ''}">${item.text}</span>
      <span class="list-item-delete" data-id="${item.id}" data-type="${type}">✕</span>
    `;

    // Checkbox click
    const checkbox = el.querySelector('.list-item-checkbox');
    if (checkbox) {
      checkbox.addEventListener('click', () => {
        toggleItem(item.id, type);
      });
    }

    // Delete click
    const deleteBtn = el.querySelector('.list-item-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteItem(item.id, type, el);
      });
    }

    return el;
  }

  // ----------------------------------------------------------
  // TOGGLE ITEM
  // ----------------------------------------------------------
  function toggleItem(id, type) {
    const items = type === 'buy' ? buyItems : avoidItems;
    const item  = items.find(i => i.id === id);
    if (!item) return;

    item.checked = !item.checked;

    const listEl   = type === 'buy' ? buyList : avoidList;
    const itemEl   = listEl?.querySelector(`[data-id="${id}"]`);
    if (!itemEl) return;

    const checkbox  = itemEl.querySelector('.list-item-checkbox');
    const textEl    = itemEl.querySelector('.list-item-text');
    const checkColor = type === 'buy' ? 'var(--neon-green)' : 'var(--neon-red)';
    const checkSymbol = type === 'buy' ? '✓' : '✕';

    if (item.checked) {
      checkbox?.classList.add('checked');
      textEl?.classList.add('checked');
      if (checkbox) {
        checkbox.textContent = checkSymbol;
        checkbox.style.background   = checkColor;
        checkbox.style.borderColor  = checkColor;
      }
    } else {
      checkbox?.classList.remove('checked');
      textEl?.classList.remove('checked');
      if (checkbox) {
        checkbox.textContent = '';
        checkbox.style.background  = '';
        checkbox.style.borderColor = '';
      }
    }

    if (window.gsap) {
      gsap.fromTo(itemEl,
        { scale: 0.97 },
        { scale: 1, duration: 0.2, ease: 'back.out(2)' }
      );
    }
  }

  // ----------------------------------------------------------
  // DELETE ITEM
  // ----------------------------------------------------------
  function deleteItem(id, type, el) {
    if (type === 'buy') {
      buyItems = buyItems.filter(i => i.id !== id);
    } else {
      avoidItems = avoidItems.filter(i => i.id !== id);
    }

    if (window.gsap && el) {
      gsap.to(el, {
        opacity: 0,
        x:       20,
        height:  0,
        padding: 0,
        margin:  0,
        duration: 0.3,
        ease:    'power2.in',
        onComplete: () => {
          if (el.parentNode) el.parentNode.removeChild(el);
          if (type === 'buy') updateBuyCount();
          else updateAvoidCount();
        }
      });
    } else {
      if (el?.parentNode) el.parentNode.removeChild(el);
      if (type === 'buy') updateBuyCount();
      else updateAvoidCount();
    }
  }

  // ----------------------------------------------------------
  // BIND LIST INPUTS
  // ----------------------------------------------------------
  function bindListInputs() {
    // Buy list
    if (buyAddBtn) {
      buyAddBtn.addEventListener('click', () => addListItem('buy'));
    }
    if (buyInput) {
      buyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addListItem('buy');
      });
    }

    // Avoid list
    if (avoidAddBtn) {
      avoidAddBtn.addEventListener('click', () => addListItem('avoid'));
    }
    if (avoidInput) {
      avoidInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addListItem('avoid');
      });
    }
  }

  // ----------------------------------------------------------
  // ADD LIST ITEM
  // ----------------------------------------------------------
  function addListItem(type) {
    const input = type === 'buy' ? buyInput : avoidInput;
    const list  = type === 'buy' ? buyList  : avoidList;
    const items = type === 'buy' ? buyItems : avoidItems;

    const text = input?.value.trim();
    if (!text) {
      if (input && window.gsap) {
        gsap.timeline()
          .to(input, { x: -5, duration: 0.05 })
          .to(input, { x:  5, duration: 0.05 })
          .to(input, { x:  0, duration: 0.05 });
      }
      return;
    }

    const newItem = {
      id:      Date.now(),
      text,
      checked: false
    };

    items.push(newItem);
    if (input) input.value = '';

    if (list) {
      const el = createListItem(newItem, type);
      list.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: -15, height: 0 },
          {
            opacity:  1,
            x:        0,
            height:   'auto',
            duration: 0.3,
            ease:     'back.out(1.4)'
          }
        );
      }
    }

    if (type === 'buy') updateBuyCount();
    else updateAvoidCount();

    input?.focus();
  }

  // ----------------------------------------------------------
  // UPDATE COUNTS
  // ----------------------------------------------------------
  function updateBuyCount() {
    if (!buyCount) return;
    const prev = parseInt(buyCount.textContent) || 0;
    const next = buyItems.length;
    buyCount.textContent = next;

    if (prev !== next && window.gsap) {
      gsap.fromTo(buyCount,
        { scale: 1.4 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
  }

  function updateAvoidCount() {
    if (!avoidCount) return;
    const prev = parseInt(avoidCount.textContent) || 0;
    const next = avoidItems.length;
    avoidCount.textContent = next;

    if (prev !== next && window.gsap) {
      gsap.fromTo(avoidCount,
        { scale: 1.4 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
  }

  // ----------------------------------------------------------
  // RENDER TRANSACTIONS
  // ----------------------------------------------------------
  function renderTransactions() {
    if (!transactionList) return;
    transactionList.innerHTML = '';

    transactions.forEach((trans, i) => {
      const el = createTransactionItem(trans);
      transactionList.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, delay: i * 0.04, ease: 'power3.out' }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // CREATE TRANSACTION ITEM
  // ----------------------------------------------------------
  function createTransactionItem(trans) {
    const el = document.createElement('div');
    el.className = 'transaction-item';
    el.dataset.id = trans.id;

    const isIncome  = trans.type === 'income';
    const amountStr = isIncome
      ? `+$${trans.amount.toLocaleString()}`
      : `-$${trans.amount.toLocaleString()}`;

    el.innerHTML = `
      <div class="transaction-icon ${trans.type}">
        ${trans.icon || (isIncome ? '▲' : '▼')}
      </div>
      <div class="transaction-details">
        <span class="transaction-name">${trans.name}</span>
        <span class="transaction-date">${trans.date}</span>
      </div>
      <span class="transaction-amount ${trans.type}">${amountStr}</span>
    `;

    return el;
  }

  // ----------------------------------------------------------
  // BIND TRANSACTION INPUTS
  // ----------------------------------------------------------
  function bindTransactionInputs() {

    // Type toggle
    if (typeIncomeBtn) {
      typeIncomeBtn.addEventListener('click', () => {
        transactionType = 'income';
        typeIncomeBtn.classList.add('active');
        typeExpenseBtn?.classList.remove('active');
      });
    }

    if (typeExpenseBtn) {
      typeExpenseBtn.addEventListener('click', () => {
        transactionType = 'expense';
        typeExpenseBtn.classList.add('active');
        typeIncomeBtn?.classList.remove('active');
      });
    }

    // Add transaction
    if (addTransactionBtn) {
      addTransactionBtn.addEventListener('click', () => addTransaction());
    }

    if (transAmountInput) {
      transAmountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTransaction();
      });
    }
  }

  // ----------------------------------------------------------
  // ADD TRANSACTION
  // ----------------------------------------------------------
  function addTransaction() {
    const name   = transNameInput?.value.trim();
    const amount = parseFloat(transAmountInput?.value);

    if (!name || !amount || amount <= 0) {
      const inputs = [transNameInput, transAmountInput].filter(Boolean);
      inputs.forEach(input => {
        if (!input.value.trim() && window.gsap) {
          gsap.timeline()
            .to(input, { borderColor: 'var(--neon-red)', duration: 0.1 })
            .to(input, { borderColor: '', duration: 0.4, delay: 0.5 });
        }
      });
      return;
    }

    const icons = {
      income:  ['◈', '▲', '💎', '⬡', '🌟'],
      expense: ['🌀', '⚡', '🔮', '🌌', '▼']
    };
    const iconSet = icons[transactionType];
    const icon    = iconSet[Math.floor(Math.random() * iconSet.length)];

    const now    = new Date();
    const dateStr = `${now.toLocaleString('en-US', { month: 'short', day: 'numeric' })} — ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newTrans = {
      id:     Date.now(),
      name,
      amount,
      type:   transactionType,
      icon,
      date:   dateStr
    };

    transactions.unshift(newTrans);

    if (transNameInput)   transNameInput.value   = '';
    if (transAmountInput) transAmountInput.value  = '';

    if (transactionList) {
      const el = createTransactionItem(newTrans);
      transactionList.insertBefore(el, transactionList.firstChild);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, y: -15, backgroundColor: 'rgba(0, 245, 255, 0.08)' },
          {
            opacity:         1,
            y:               0,
            backgroundColor: 'rgba(5, 5, 31, 0.6)',
            duration:        0.5,
            ease:            'power3.out'
          }
        );
      }
    }

    // Update balance stat
    updateBalanceStat(amount, transactionType);
    transNameInput?.focus();
  }

  // ----------------------------------------------------------
  // UPDATE BALANCE STAT
  // ----------------------------------------------------------
  function updateBalanceStat(amount, type) {
    const balanceEl = document.getElementById('bank-total-balance');
    if (!balanceEl) return;

    const currentText = balanceEl.textContent.replace(/[$,]/g, '');
    const current     = parseFloat(currentText) || 0;
    const newBalance  = type === 'income'
      ? current + amount
      : current - amount;

    if (window.gsap) {
      const start     = current;
      const end       = newBalance;
      const duration  = 800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = Math.floor(start + (end - start) * eased);
        balanceEl.textContent = `$${value.toLocaleString()}`;
        if (progress < 1) requestAnimationFrame(update);
        else balanceEl.textContent = `$${Math.round(end).toLocaleString()}`;
      }

      requestAnimationFrame(update);

      gsap.timeline()
        .to(balanceEl, {
          color: type === 'income' ? 'var(--neon-green)' : 'var(--neon-red)',
          scale: 1.1,
          duration: 0.2
        })
        .to(balanceEl, {
          color: 'var(--neon-cyan)',
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.4)'
        });
    } else {
      balanceEl.textContent = `$${Math.round(newBalance).toLocaleString()}`;
    }
  }

  // ----------------------------------------------------------
  // REFRESH
  // ----------------------------------------------------------
  function refresh() {
    if (buyItems.length === 0 && avoidItems.length === 0) {
      loadData();
    }
  }

  // ----------------------------------------------------------
  // FALLBACK DATA
  // ----------------------------------------------------------
  function getFallbackBuyItems() {
    return [
      { id: 1, text: 'Temporal stabilizer unit',      checked: false },
      { id: 2, text: 'Dimensional compass mk.4',      checked: true  },
      { id: 3, text: 'Anti-paradox field generator',  checked: false },
      { id: 4, text: 'Reality anchor tether',         checked: false }
    ];
  }

  function getFallbackAvoidItems() {
    return [
      { id: 1, text: 'Black market portal keys',   checked: false },
      { id: 2, text: 'Unregistered artefacts',     checked: false },
      { id: 3, text: 'Epoch-class time debt',      checked: false }
    ];
  }

  function getFallbackTransactions() {
    return [
      { id: 1, name: 'Portal Access — Earth-7',      amount: 800,  type: 'expense', icon: '🌀', date: 'Cycle 7 — Day 4' },
      { id: 2, name: 'Mission Stipend — Omega',      amount: 3200, type: 'income',  icon: '◈',  date: 'Cycle 7 — Day 3' },
      { id: 3, name: 'Temporal Gear Restock',        amount: 420,  type: 'expense', icon: '⚡', date: 'Cycle 7 — Day 3' },
      { id: 4, name: 'Reality Bonus — Crystal',      amount: 1800, type: 'income',  icon: '💎', date: 'Cycle 7 — Day 1' },
      { id: 5, name: 'Extraction Insurance Premium', amount: 300,  type: 'expense', icon: '▲', date: 'Cycle 6 — Day 7' }
    ];
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    refresh,
    addListItem,
    addTransaction
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteLists.init();
});