

// Accounts
const accounts = [
  {
    owner: 'Lukas Berg',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
  },
  {
    owner: 'Bella Cookie',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  },
  {
    owner: 'Sir Adam Sevilla',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  },
  {
    owner: 'Constantino Ronaldo',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  },
];

const welcomeMessage = document.querySelector('.welcome');
// const dateLabel = document.querySelector('.date');
const balanceLabel = document.querySelector('.balance__value');
const incomeSummaryLabel = document.querySelector('.summary__value--in');
const expensesSummaryLabel = document.querySelector('.summary__value--out');
const interestSummaryLabel = document.querySelector(
  '.summary__value--interest'
);
const logoutTimerLabel = document.querySelector('.timer');

const appContainer = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');

const loginButton = document.querySelector('.login__btn');
const transferButton = document.querySelector('.form__btn--transfer');
const loanButton = document.querySelector('.form__btn--loan');
const closeAccountButton = document.querySelector('.form__btn--close');
const sortButton = document.querySelector('.btn--sort');

const usernameInput = document.querySelector('.login__input--user');
const pinInput = document.querySelector('.login__input--pin');
const transferToInput = document.querySelector('.form__input--to');
const transferAmountInput = document.querySelector('.form__input--amount');
const loanAmountInput = document.querySelector('.form__input--loan-amount');
const closeUsernameInput = document.querySelector('.form__input--user');
const closePinInput = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  movementsContainer.innerHTML = '';

  const sortedMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;
  sortedMovements.forEach(function (transaction) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';
    const transactionHTML = `
      <div class="movements__row">
        <div class="movements__type movements__type--${transactionType}">
          ${transactionType}
        </div>
        <div class="movements__value">${transaction} €</div>
      </div>`;
    movementsContainer.insertAdjacentHTML('afterbegin', transactionHTML);
  });
};

const generateUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

generateUsernames(accounts);

const updateUI = function (account) {
  displayMovements(account.movements);
  displayBalance(account);
  displaySummary(account);
};

const displaySummary = function (account) {
  const incomes = account.movements
    .filter(movement => movement > 0)
    .reduce((total, movement) => total + movement, 0);
  incomeSummaryLabel.textContent = `${incomes}€`;

  const expenses = account.movements
    .filter(movement => movement < 0)
    .reduce((total, movement) => total + movement, 0);
  expensesSummaryLabel.textContent = `${Math.abs(expenses)}€`;

  const totalInterest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((total, interest) => total + interest, 0);
  interestSummaryLabel.textContent = `${totalInterest.toFixed(2)}€`;
};

const displayBalance = function (account) {
  account.balance = account.movements.reduce(
    (total, movement) => total + movement,
    0
  );
  balanceLabel.textContent = `${account.balance} €`;
};

let activeAccount;
loginButton.addEventListener('click', function (e) {
  e.preventDefault();

  activeAccount = accounts.find(
    account => account.username === usernameInput.value
  );

  if (activeAccount?.pin === Number(pinInput.value)) {
    welcomeMessage.innerHTML = `Welcome back, <span class="highlight">${
      activeAccount.owner.split(' ')[0]
    }</span>`;

    appContainer.style.opacity = 100;

    usernameInput.value = pinInput.value = '';
    pinInput.blur();

    updateUI(activeAccount);
  }
});

let isSorted = false;

sortButton.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(activeAccount.movements, !isSorted);
  isSorted = !isSorted;
});

transferButton.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(transferAmountInput.value);
  const recipientAccount = accounts.find(
    account => account.username === transferToInput.value
  );

  transferAmountInput.value = transferToInput.value = '';

  if (
    recipientAccount &&
    amount > 0 &&
    activeAccount.balance >= amount &&
    recipientAccount?.username !== activeAccount.username
  ) {
    activeAccount.movements.push(-amount);
    recipientAccount.movements.push(amount);

    updateUI(activeAccount);
  }
});

loanButton.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(loanAmountInput.value);

  if (amount > 0 && activeAccount.movements.some(mov => mov >= amount * 0.1)) {
    activeAccount.movements.push(amount);
    updateUI(activeAccount);
  }
  loanAmountInput.value = '';
});

closeAccountButton.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    closeUsernameInput.value === activeAccount.username &&
    Number(closePinInput.value) === activeAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      account => account.username === activeAccount.username
    );
    accounts.splice(accountIndex, 1);

    appContainer.style.opacity = 0;
  }
  closeUsernameInput.value = closePinInput.value = '';
});
