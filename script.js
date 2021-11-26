'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Izik Zilberman',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Liel Zilberman',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const newPIN = document.querySelector('.new');
const wrong = document.querySelector('.wrong');
const containerMovements = document.querySelector('.movements');
const login = document.querySelector('.login');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnChange = document.querySelector('.new__btn');
const btnOut = document.querySelector('.log_out_btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputyChange = document.querySelector('.new__pin--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return (mov * acc.interestRate) / 100;
    })
    .filter(function (mov) {
      return mov >= 1;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (string) {
        return string[0];
      })
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;

//login
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 100;
    newPIN.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
    login.style.opacity = 0;
    wrong.style.opacity = 0;
  } else {
    wrong.style.opacity = 100;
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();
  }
});

//log out
btnOut.addEventListener('click', function (e) {
  e.preventDefault();
  newPIN.style.opacity = 0;
  containerApp.style.opacity = 0;
  inputyChange.value = '';
  labelWelcome.textContent = `Log in to get started`;
  login.style.opacity = 100;
});

//change your PIN
btnChange.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount.pin = Number(inputyChange.value);
  newPIN.style.opacity = 0;
  containerApp.style.opacity = 0;
  inputyChange.value = '';
  labelWelcome.textContent = `Log in to get started`;
});

//transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    newPIN.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
    inputClosePin.value = '';
    inputCloseUsername.value = '';
    login.style.opacity = 100;
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// console.log(arr.splice(2));
// arr.splice(-1);
// arr.splice(1, 2);
// console.log(arr);

// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'j'];
// console.log(arr2.reverse());
// console.log(arr2);

// const letters = arr.concat(arr2);
// console.log(letters);

// console.log(letters.join(' - '));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1}: you deposited ${movement}`);
//   } else {
//     console.log(`movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
//   }
// }

// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1}: you deposited ${movement}`);
//   } else {
//     console.log(`movement ${i + 1}: you withdrew ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const checkDogs = function (dogsJulia, dogsKate) {
//   const correctJulia = dogsJulia.slice(1, -2);
//   const JuliaKate = correctJulia.concat(dogsKate);

//   JuliaKate.forEach(function (age, i) {
//     let puppyAdult =
//       age >= 3
//         ? `Dog number ${i + 1} is an adult, and is ${age} years old`
//         : `Dog number ${i + 1} is still a puppy`;
//     console.log(puppyAdult);
//   });
// };

// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];
// checkDogs(dogsJulia, dogsKate);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUSD);
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);
// console.log(balance);

// const max = movements.reduce(function (acc, mov) {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(function (age) {
//     if (age <= 2) {
//       return 2 * age;
//     } else {
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAges);
//   const adults = humanAges.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(adults);
//   const average =
//     adults.reduce(function (acc, age, i) {
//       return acc + age;
//     }, 0) / adults.length;
//   console.log(average);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15.8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const totalDepositesUSD = movements
//   .filter(function (mov) {
//     return mov > 0;
//   })
//   .map(function (mov) {
//     return mov * 1.1;
//   })
//   .reduce(function (acc, mov) {
//     return acc + mov;
//   }, 0);
// console.log(totalDepositesUSD);

// const calcAverageHumanAge = function (ages) {
//   let i = 0;
//   const humanAges = ages
//     .map(function (age) {
//       if (age <= 2) {
//         return 2 * age;
//       } else {
//         return 16 + age * 4;
//       }
//     })
//     .filter(function (age) {
//       return age >= 18;
//     })
//     .reduce(function (acc, age) {
//       i++;
//       return acc + age;
//     }, 0);
//   console.log(humanAges / i);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15.8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const firstWithdrawal = movements.find(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(function (acc) {
//   return acc.owner === 'Liel Zilberman';
// });
// console.log(account);

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr.at(-1));

// console.log('jonas'.at(-1));

// console.log(movements);
// console.log(movements.some(mov => mov === -130));

// const anydeposits = movements.some(function (mov) {
//   return mov > 5000;
// });
// console.log(anydeposits);

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));
// //console.log(arrDeep.flatMap());

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);
// console.log(
//   allMovements.reduce(function (acc, cur) {
//     return acc + cur;
//   }, 0)
// );
// const owners = ['jinas', 'zack', 'adam', 'martha'];
// console.log(owners.sort());

// console.log(movements);
// movements.sort((a, b) => a - b);
// console.log(movements);
// const arr = [1, 2, 3, 4, 5, 6];
// const x = new Array(7);
// console.log(x);
// // x.fill(1);
// x.fill(1, 3, 5);
// console.log(x);
// arr.fill(23, 4, 6);
// console.log(arr);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 70 }, (_, i) => i + 1);
// console.log(z);

// const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
// console.log(movementsUI);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   console.log(movementsUI);
// });

// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);

// console.log(bankDepositSum);

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDeposits1000);

// const numdeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numdeposits1000);

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// const convert = function (title) {
//   const excpections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       excpections.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');

//   return titleCase;
// };

// console.log(convert('this is a nice title'));
// console.log(convert('this is a LONG title but not too long'));
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(function (dog) {
//   dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// for (let i = 0; i < dogs.length; i++) {
//   if (dogs[i].owners.includes('Sarah')) {
//     if (
//       dogs[i].curFood >
//       dogs[i].recommendedFood + dogs[i].recommendedFood * 0.1
//     ) {
//       console.log('eating too much ' + dogs[i].recommendedFood);
//     } else if (
//       dogs[i].curFood <
//       dogs[i].recommendedFood + dogs[i].recommendedFood * 0.1
//     ) {
//       console.log('eating too less');
//     } else {
//       console.log('eating good!' + dogs[i].recommendedFood);
//     }
//   }
// }

// let eatingMuch = [];
// let eatingLittle = [];

// eatingMuch = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// eatingLittle = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// console.log(eatingLittle);
// console.log(eatingMuch);

// console.log(`${eatingMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${eatingLittle.join(' and ')}'s dogs eat too little!`);

// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// console.log(
//   dogs.some(
//     dog =>
//       dog.curFood <= dog.recommendedFood + dog.recommendedFood * 0.1 &&
//       dog.curFood >= dog.recommendedFood - dog.recommendedFood * 0.1
//   )
// );
// const dogsOkay = dogs.filter(
//   dog =>
//     dog.curFood <= dog.recommendedFood + dog.recommendedFood * 0.1 &&
//     dog.curFood >= dog.recommendedFood - dog.recommendedFood * 0.1
// );
// console.log(dogsOkay);

// const dogsCopy = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
