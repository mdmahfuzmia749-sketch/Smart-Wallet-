const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const incomeListEl = document.getElementById('income-list');
const expenseListEl = document.getElementById('expense-list');
const form = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');

if(dateInput) {
    dateInput.valueAsDate = new Date();
}

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '' || dateInput.value === '') {
        alert('Please fill out all fields');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();

    textInput.value = '';
    amountInput.value = '';
    dateInput.valueAsDate = new Date();
});

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    updateLocalStorage();
    init();
}

function init() {
    incomeListEl.innerHTML = '';
    expenseListEl.innerHTML = '';

    let totalIncome = 0;
    let totalExpense = 0;

    let incomeCount = 1;
    let expenseCount = 1;

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('history-item');

        const formattedAmount = transaction.amount < 0 ? `-$${Math.abs(transaction.amount)}` : `+$${transaction.amount}`;

        if (transaction.amount < 0) {
            li.classList.add('expense');
            li.innerHTML = `
                <span><strong>${expenseCount}. ${transaction.text}</strong><br><small>Date: ${transaction.date}</small></span>
                <span>${formattedAmount}</span>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">&times;</button>
            `;
            expenseListEl.appendChild(li);
            totalExpense += Math.abs(transaction.amount);
            expenseCount++;
        } else {
            li.classList.add('income');
            li.innerHTML = `
                <span><strong>${incomeCount}. ${transaction.text}</strong><br><small>Date: ${transaction.date}</small></span>
                <span>${formattedAmount}</span>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">&times;</button>
            `;
            incomeListEl.appendChild(li);
            totalIncome += transaction.amount;
            incomeCount++;
        }
    });

    const totalBalance = totalIncome - totalExpense;

    balanceEl.innerText = `$${totalBalance.toFixed(2)}`;
    incomeEl.innerText = `+$${totalIncome.toFixed(2)}`;
    expenseEl.innerText = `-$${totalExpense.toFixed(2)}`;

    // প্রিন্টের জন্য আলাদা টোটাল আপডেট করা হচ্ছে
    document.getElementById('print-income-total').innerText = `Total Income: +$${totalIncome.toFixed(2)}`;
    document.getElementById('print-expense-total').innerText = `Total Expense: -$${totalExpense.toFixed(2)}`;
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

init();


