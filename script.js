let balanceEl = document.getElementById('balance');
let remainingEl = document.getElementById('remaining');
let transactionsEl = document.getElementById('transactions');
let incomeBtn = document.getElementById('incomeBtn');
let expenseBtn = document.getElementById('expenseBtn');
let formModal = document.getElementById('formModal');
let formTitle = document.getElementById('formTitle');
let descInput = document.getElementById('descInput');
let amountInput = document.getElementById('amountInput');
let addTransactionBtn = document.getElementById('addTransactionBtn');
let closeBtn = document.querySelector('.close');

let transactions = [];
let type = 'income'; // default

// Open modal
incomeBtn.addEventListener('click', () => openForm('income'));
expenseBtn.addEventListener('click', () => openForm('expense'));

closeBtn.addEventListener('click', () => formModal.style.display = 'none');

function openForm(t){
  type = t;
  formTitle.textContent = t === 'income' ? 'Add Income' : 'Add Expense';
  descInput.value = '';
  amountInput.value = '';
  formModal.style.display = 'flex';
}

// Add transaction
addTransactionBtn.addEventListener('click', () => {
  let desc = descInput.value.trim();
  let amount = parseFloat(amountInput.value);

  if(desc && !isNaN(amount)){
    transactions.push({desc, amount, type});
    formModal.style.display = 'none';
    updateUI();
  } else {
    alert('Please enter valid description and amount');
  }
});

// Update UI
function updateUI(){
  transactionsEl.innerHTML = '';
  let totalIncome = 0, totalExpense = 0;

  transactions.forEach(t => {
    let li = document.createElement('li');
    li.textContent = `${t.desc}: ₹${t.amount}`;
    li.classList.add(t.type);
    transactionsEl.appendChild(li);

    if(t.type === 'income'){
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  });

  let remainingBalance = totalIncome - totalExpense;
  balanceEl.textContent = `₹${remainingBalance}`;
  balanceEl.style.color = remainingBalance >= 0 ? '#27ae60' : '#c0392b';
  remainingEl.textContent = `Remaining: ₹${remainingBalance}`;

  updateChart(totalIncome, totalExpense);
}

// Chart
let ctx = document.getElementById('summaryChart').getContext('2d');
let summaryChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      label: 'Summary',
      data: [0, 0],
      backgroundColor: ['#27ae60','#c0392b'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});

function updateChart(income, expense){
  summaryChart.data.datasets[0].data = [income, expense];
  summaryChart.update();
}