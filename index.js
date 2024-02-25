// объявления переменных - строковых констант
const STATUS_IN_LIMIT = 'все хорошо';
const STATUS_OUT_OF_LIMIT = 'все плохо';
const STORAGE_LABEL_LIMIT = 'limit';
const STORAGE_LABEL_EXPENSES = 'expenses';
// объявления переменных - ссылки на html элементы
const inputNode = document.getElementById('expenseInput');
const categorySelectNode = document.getElementById('categorySelect');
const addButtonNode = document.getElementById('addButton');
const changeLimitBtn = document.getElementById('changeLimitBtn');
const totalValueNode = document.getElementById('totalValue');
const statusNode = document.getElementById('statusText');
const historyList = document.getElementById('historyList');
const clearButtonNode = document.getElementById('clearButton');
const limitNode = document.getElementById('limitValue');

const popup = document.getElementById('popup');
const popupContent = document.getElementById('popup__content');
const popupInput = document.getElementById('popupExpenseInput');
const popupButton = document.getElementById('popup__button');
const popupCloseBtn = document.getElementById('popup__close-btn');

// получаем лимит из элемента html
let limit = parseInt(limitNode.innerText);

function initLimit() {
    const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
    if (!limitFromStorage) {
        return;
    }
    limitNode.innerText = limitFromStorage;
    limit = parseInt(limitNode.innerText);
}
initLimit();

// объявления новой основной переменной
// при запуске она содержит в себе пустой массив
// который мы пополняем по нажатию на кнопку добавить
const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
const expensesFromStorage = JSON.parse(expensesFromStorageString);
let expenses = [];
if(Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
}

// ---ФУНКЦИИ-------------------------------------------

// подсчитываем и возвращаем сумму всех трат
function getTotal() {
    let sum = 0;
    expenses.forEach(function (expense) {
        // пробегаем по массиву объектов expense, берем из каждого поле amount
        // и прибовляем к переменной sum
        sum += expense.amount;
    });

    return sum;
};

// отрисовывает и обновляет блок с 'всего','лимит' и статус
const renderStatus = () => {
    // создаем переменную total (всего) и записываем в нее результат getTotal
    const total = getTotal(expenses);
    totalValueNode.innerText = total;

    // условия сравнения - что больше всего или лимит
    if (total <= limit) {
        // всего меньше чем лимит - все хорошо
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.className = 'stats__statusText__positive';
    } else {
        //  всего меньше чем лимит - все плохо
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб)`;
        statusNode.className = 'stats__statusText__negative';
    }
};
// отрисовываем - обновляем историю
function renderHistory () {
    historyList.innerHTML = "";
    expenses.forEach(function(expense) {
const historyItem = document.createElement('li');
historyItem.className = 'rub';
historyItem.innerText = expense;
historyItem.innerText = `${expense.category} - ${expense.amount}`;
historyList.appendChild(historyItem);
    });
};
// отрисовываем-обновляем интерфейс (история, всего, статус)
const render = () => {
    // обновления статуса и всего
    renderStatus();
    // обновления истории
    renderHistory();
};
// возвращаем введенную пользователем сумму
 const getExpenseFromUser = () => parseInt(inputNode.value);
// возвращаем выбранную пользователем категорию
 function getSelectedCategory() {
    return categorySelectNode.value;
 }
// функция очистки поля ввода
 const clearInput = () => {
    inputNode.value = '';
 };

 function saveExpensesToStorage() {
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
}
// при нажатии на кнопку добавить будет вызвана функция
 function addButtonHandler () {
    // сохраняем в переменную введенную сумму
    const currentAmount = getExpenseFromUser();
    if (!currentAmount) {
        alert('не задана сумма');
        return;
    }
// сохраняем в переменную currentCategory выбранную категорию
    const currentCategory = getSelectedCategory();
    if(currentCategory === 'Категория') {
        alert('не задана категория');
        return;
    }
    categorySelectNode.value = "Категория";
    // из полученых категорий собираем объект newExpense
    // который состоит из двух полей - amount, в котором звписано значение currentAmount
    // и category в которое записано значение currentCategory
    const newExpense = {amount: currentAmount, category: currentCategory};
    
    // добавляем наш новый расход в массив расходов
    expenses.push(newExpense);
    saveExpensesToStorage();
    

    // перерисовываем интерфейс
     render();

    //  сбрасываем введенную сумму
    clearInput(inputNode);
 };
//   функция-обработчик кнопки сбросить расходы
 const clearButtonHandler = () => {
    expenses = [];
    render();
    
 };
   // функция-обработчик кнопки открыть popup
 const changeLimitHandler = () => {
    // открыть popup
    openPopup();
  
};

// Функция открытия popup
const openPopup = () => {
    popup.classList.add('popup_open');
  };
  
  //  Функция закрытия popup
  const closePopup = () => {
    popup.classList.remove('popup_open');
  };

  // Добавляем события к кнопке 'задать лимит'
popupButton.addEventListener('click', () => {

    // //Получаем новое значение из входных данных
  const newLimit = popupInput.value;

if (!popupInput.value) {
    return;
}

  //Обновляем переменные и интерфейс
  limitNode.innerText = newLimit;
  limit = newLimit;
  localStorage.setItem(STORAGE_LABEL_LIMIT, newLimit);
  popupInput.value = '';

  render();
  
    // Закрываем popup
    closePopup();
  });

// привязка функций-обработчиков к кнопкам
addButtonNode.addEventListener('click', addButtonHandler); 
clearButtonNode.addEventListener('click', clearButtonHandler);
changeLimitBtn.addEventListener('click', changeLimitHandler);
popupCloseBtn.addEventListener('click', closePopup);





