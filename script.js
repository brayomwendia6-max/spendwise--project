// ===== SpendWise - Interactive Logic =====
const appName = "SpendWise";
console.log("App Name:", appName);

// 2. ARRAYS - Store multiple expense records
let expenses = [];
let budget = 45000; // Matches your sidebar Monthly Budget

// Get DOM elements - using YOUR HTML IDs
const expenseForm = document.getElementById("add-expense");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");
const expenseDateInput = document.getElementById("expense-date");
const expensesTableBody = document.querySelector("#your-expenses tbody");

// Dashboard elements - your summary cards
const summaryValues = document.querySelectorAll(".summary-card strong");
const totalSpentEl = summaryValues[0];
const remainingEl = summaryValues[1];

const progressBar = document.querySelector(".sidebar-footer .progress span");
const progressText = document.querySelector(".sidebar-footer small");

// Header + Add Expense button scrolls to form
const headerAddBtn = document.querySelector(".header-actions .btn-add");
if (headerAddBtn) {
  headerAddBtn.addEventListener("click", function() {
    document.getElementById("add-expense").scrollIntoView({ behavior: "smooth" });
    expenseNameInput.focus();
  });
}

// 5. EVENT LISTENER - Add Expense Form
expenseForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = expenseNameInput.value.trim();
  const amount = Number(expenseAmountInput.value);
  const category = expenseCategoryInput.value;
  const date = expenseDateInput.value;

  // 1. CONDITIONAL - Decision Making / Validation
  if (name === "" || category === "" || date === "") {
    alert("Please fill in all fields.");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    return;
  }

  // 2. ARRAY - Add new record
  expenses.push({ name: name, amount: amount, category: category, date: date });

  updateDashboard();
  expenseForm.reset();
  expenseDateInput.value = "2026-11-12";
});

function calculateBalance(budget, totalExpense) {
  return budget - totalExpense;
}

function calculateWeeklyBudget(monthlyBudget) {
  return monthlyBudget / 4;
}

// 4. DOM + 3. LOOPS + 1. CONDITIONALS
function updateDashboard() {
  // 3. LOOP - Calculate total from array
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }

  const remaining = calculateBalance(budget, total);
  const weeklyBudget = calculateWeeklyBudget(budget);
  const percentUsed = Math.round((total / budget) * 100);

  console.log("Monthly Budget:", budget);
  console.log("Total Spent:", total);
  console.log("Remaining Balance:", remaining);
  console.log("Weekly Budget:", weeklyBudget);

  // 4. DOM - Update Dashboard
  totalSpentEl.textContent = "Ksh " + total.toLocaleString();
  remainingEl.textContent = "Ksh " + remaining.toLocaleString();

  if (progressBar) {
    progressBar.style.width = Math.min(percentUsed, 100) + "%";
  }
  if (progressText) {
    progressText.textContent = percentUsed + "% used";
  }

  // 1. CONDITIONAL - Budget Feedback
  if (expenses.length === 0) {
    // No message yet
  } else if (total > budget) {
    alert("⚠️ Over Budget! You are Ksh " + (total - budget).toLocaleString() + " over your budget.");
    remainingEl.style.color = "red";
  } else if (total === budget) {
    alert("You have exactly used your full budget.");
  } else if (percentUsed >= 80) {
    alert("⚠️ Warning: You have used " + percentUsed + "% of your budget. Less than 20% left!");
    remainingEl.style.color = "orange";
  } else {
    remainingEl.style.color = "green";
  }

  // 3. LOOP + 4. DOM - Render Table
  if (expenses.length === 0) {
    expensesTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No expenses yet. Your expenses will appear here.</td></tr>';
  } else {
    expensesTableBody.innerHTML = "";
    for (let i = 0; i < expenses.length; i++) {
      const row = document.createElement("tr");
      row.innerHTML =
        "<td>" + expenses[i].name + "</td>" +
        "<td>Ksh " + expenses[i].amount.toLocaleString() + "</td>" +
        "<td>" + expenses[i].category + "</td>" +
        "<td>" + expenses[i].date + "</td>" +
        '<td><button type="button" class="delete-btn" data-index="' + i + '">Delete</button></td>';
      expensesTableBody.appendChild(row);
    }

    // 5. EVENT LISTENER - Delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    for (let j = 0; j < deleteButtons.length; j++) {
      deleteButtons[j].addEventListener("click", function() {
        const index = Number(this.getAttribute("data-index"));
        if (confirm("Delete " + expenses[index].name + "?")) {
          expenses.splice(index, 1);
          updateDashboard();
        }
      });
    }
  }
}

updateDashboard();
