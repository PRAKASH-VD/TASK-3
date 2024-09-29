// Get DOM elements
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const transactionTypeInput = document.getElementById('transaction-type');
const transactionList = document.getElementById('transactions');
const totalIncomeElem = document.getElementById('total-income');
const totalExpenseElem = document.getElementById('total-expense');
const netBalanceElem = document.getElementById('net-balance');

// Transactions array to store the data
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Event listener for form submission
transactionForm.addEventListener('submit', addTransaction);

// Add transaction
function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = transactionTypeInput.value;

  if (!description || isNaN(amount)) {
    alert('Please enter valid details');
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type
  };

  transactions.push(transaction);
  updateLocalStorage();
  displayTransactions();
  resetForm();
}

// Display transactions based on filter
function displayTransactions(filter = 'all') {
  transactionList.innerHTML = '';

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'income') return transaction.type === 'income';
    if (filter === 'expense') return transaction.type === 'expense';
    return true;
  });

  filteredTransactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add('flex', 'justify-between', 'items-center', 'border', 'px-4', 'py-2', 'rounded-lg');
    li.innerHTML = `
      <span>${transaction.description} - ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}</span>
      <div>
        <button onclick="editTransaction(${transaction.id})" class="text-blue-500">Edit</button>
        <button onclick="deleteTransaction(${transaction.id})" class="text-red-500 ml-2">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });

  updateBalance();
}

// Update the balance summary
function updateBalance() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  totalIncomeElem.textContent = `$${totalIncome.toFixed(2)}`;
  totalExpenseElem.textContent = `$${totalExpense.toFixed(2)}`;
  netBalanceElem.textContent = `$${netBalance.toFixed(2)}`;
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Edit transaction
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  transactionTypeInput.value = transaction.type;
  deleteTransaction(id);
}

// Delete transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  displayTransactions();
}

// Reset form fields
function resetForm() {
  descriptionInput.value = '';
  amountInput.value = '';
  transactionTypeInput.value = 'income';
}

// Filters
document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener('change', (e) => displayTransactions(e.target.value));
});

// Initial display
displayTransactions();


// Get the clear button element
const clearBtn = document.getElementById('clear-btn');

// Event listener for clear button
clearBtn.addEventListener('click', clearAllTransactions);

// Clear all transactions
function clearAllTransactions() {
  const confirmation = confirm("Are you sure you want to clear all transactions?");
  if (confirmation) {
    transactions = []; // Reset the transactions array
    updateLocalStorage(); // Update the local storage
    displayTransactions(); // Refresh the UI
  }
}
