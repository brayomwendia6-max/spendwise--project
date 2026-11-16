// Spendwise - Budget Tracker Logic

// 1. Get elements from HTML
const form = document.getElementById('add-expense');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const categoryInput = document.getElementById('expense-category');
const dateInput = document.getElementById('expense-date');
const tableBody = document.querySelector('#your-expenses tbody');

// Summary cards - first is Total Spent, second is Remaining, third is Savings Goal
const summaryCards = document.querySelectorAll('.summary strong');
const totalSpentEl = summaryCards[0];
const remainingEl = summaryCards[1];

// Sidebar
const budgetEl = document.querySelector('.sidebar-footer strong');
const progressFill = document.querySelector('.progress span');
const progressText = document.querySelector('.sidebar-footer small') || document.querySelector('.sidebar-footer p:last-child');

// Category cards - Food, Rent, Transport, Entertainment, Savings, Utilities
const categoryCards = document.querySelectorAll('.card');

// 2. Starting data - matches your HTML table
const BUDGET = 45000;
const SAVINGS_GOAL = 10500;

let expenses = [
  { name: 'Groceries', amount: 6500, category: 'Food', date: '2026-11-12' },
  { name: 'Gas', amount: 3900, category: 'Transportation', date: '2026-11-13' },
  { name: 'Movie Tickets', amount: 2600, category: 'Entertainment', date: '2026-11-14' },
  { name: 'Clothes', amount: 13000, category: 'Shopping', date: '2026-11-15' },
  { name: 'Electricity Bill', amount: 9750, category: 'Utilities', date: '2026-11-16' },
];

// Category budgets - matches your cards
const categoryBudgets = {
  Food: 10000,
  Rent: 15000,
  Transport: 5000,
  Transportation: 5000,
  Entertainment: 3000,
  Savings: 2000,
  Utilities: 1000,
  Shopping: 13000,
};

// 3. Helper - format number as Ksh
function formatKsh(amount) {
  return 'Ksh ' + amount.toLocaleString('en-KE');
}

// 4. Render table from expenses array
function renderTable() {
  tableBody.innerHTML = '';
  expenses.forEach((exp, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.name}</td>
      <td>${formatKsh(exp.amount)}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  // Attach delete to new buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      expenses.splice(Number(btn.dataset.index), 1);
      updateAll();
    });
  });
}

// 5. Update totals, remaining, progress bar
function updateSummary() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = BUDGET - totalSpent;
  const percentUsed = Math.min(Math.round((totalSpent / BUDGET) * 100), 100);

  totalSpentEl.textContent = formatKsh(totalSpent);
  remainingEl.textContent = formatKsh(remaining);

  // Sidebar budget
  if (budgetEl) budgetEl.textContent = formatKsh(BUDGET);
  if (progressFill) progressFill.style.width = percentUsed + '%';
  if (progressText) progressText.textContent = percentUsed + '% used';

  // Red if over budget
  remainingEl.style.color = remaining < 0 ? '#ef4444' : '';
}

// 6. Update category cards
function updateCategoryCards() {
  categoryCards.forEach(card => {
    const badge = card.querySelector('.badge').textContent.trim();
    const budget = categoryBudgets[badge] || 0;

    // Sum expenses for this category
    const spent = expenses
      .filter(e => e.category === badge || (badge === 'Transport' && e.category === 'Transportation'))
      .reduce((sum, e) => sum + e.amount, 0);

    const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    const amountEl = card.querySelector('h3');
    const descEl = card.querySelector('p');

    if (amountEl) amountEl.textContent = formatKsh(spent).toLowerCase().replace('ksh', 'ksh');
    if (descEl) descEl.textContent = `Budget: ${formatKsh(budget)}. ${percent}% used`;
  });
}

// 7. Update everything
function updateAll() {
  renderTable();
  updateSummary();
  updateCategoryCards();
}

// 8. Handle form submit - Add Expense
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  // Validation
  if (!name || !amount || amount <= 0 || !category || !date) {
    alert('Please fill in all fields with a valid amount.');
    return;
  }

  // Add to array
  expenses.push({ name, amount, category, date });

  // Update page
  updateAll();

  // Clear form
  form.reset();
  dateInput.value = '2026-11-12';
  nameInput.focus();
});

// 9. Header button scrolls to form
const headerAddBtn = document.querySelector('.main-header .btn-add');
if (headerAddBtn) {
  headerAddBtn.addEventListener('click', () => {
    form.scrollIntoView({ behavior: 'smooth' });
    nameInput.focus();
  });
}

// 10. First load
updateAll();