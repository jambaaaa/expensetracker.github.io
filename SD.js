//ITEM CONTROLLER
const itemCtrl = (function(){
    //item contructor
    const Item = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }
    //data structure
    const data = {
        items:[]
    }
    //public method
    return{
        logData: function(){
            return data;
        },
        addMoney: function(description, amount){
            //create random id
            let ID = itemCtrl.createID();
            //create new item
            newMoney = new Item(ID, description, amount);
            //push it into the array
            data.items.push(newMoney);

            return newMoney;
        },
        createID: function(){
            //create random id number between 0 and 10000
            const idNum = Math.floor(Math.random()*10000);
            return idNum;
        },
        getIdNumber: function(item){
            //get the item id
            const amountId = (item.parentElement.id);
            //break the id into an array
            const itemArr = amountId.split('-');
            //get the id number
            const id = parseInt(itemArr[1]);

            return id;
        },
        deleteAmountArr: function(id){
            //get all the ids
            const ids = data.items.map(function(item){
                //return item with id
                return item.id
            });
            //get index
            const index = ids.indexOf(id)
            //remove item
            data.items.splice(index, 1);
        }
    }
})();

//UI CONTROLLER
const UICtrl = (function(){
    //ui selectors
    const UISelectors = {
        incomeBtn: '#add__income',
        expenseBtn: '#add__expense',
        description: '#description',
        amount: '#amount',
        moneyEarned: '#amount__earned',
        moneyAvailable: '#amount__available',
        moneySpent: '#amount__spent',
        incomeList: '#income__container',
        expensesList: '#expenses__container',
        incomeItem: '.income__amount',
        expenseItem: '.expense__amount',
        itemsContainer: '.items__container'
    }
    //public methods
    return{
        //return ui selectors
        getSelectors: function(){
            return UISelectors
        },
        getDescriptionInput: function(){
            return {
                descriptionInput: document.querySelector(UISelectors.description).value
            }
        },
        getValueInput: function(){
            return{
                amountInput: document.querySelector(UISelectors.amount).value
            }
        },
        addIncomeItem: function(item){
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item income'
            //add id to the item
            div.id = `item-${item.id}`
            //add html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
                <p class="symbol">₱</p>
                <span class="income__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
            //insert income into the list
            document.querySelector(UISelectors.incomeList).insertAdjacentElement('beforeend', div);
        },
        clearInputs: function(){
            document.querySelector(UISelectors.description).value = ''
            document.querySelector(UISelectors.amount).value = ''
        },
        updateEarned: function(){
            //all income elements
            const allIncome = document.querySelectorAll(UISelectors.incomeItem);
            //array with all incomes
            const incomeCount = [...allIncome].map(item => +item.innerHTML);
            //calculate the total earned
            const incomeSum = incomeCount.reduce(function(a,b){
                return a+b
            },0);
            //display the total earned
            const earnedTotal = document.querySelector(UISelectors.moneyEarned).innerHTML = incomeSum.toFixed(2);
        },
        addExpenseItem: function(item){
            //create new div
            const div = document.createElement('div');
            //add class
            div.classList = 'item expense'
            //add id to the item
            div.id = `item-${item.id}`
            //add html
            div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <p class="symbol">₱</p>
                <span class="expense__amount">${item.amount}</span>
            </div>
            <i class="far fa-trash-alt"></i>
            `;
            //insert income into the list
            document.querySelector(UISelectors.expensesList).insertAdjacentElement('beforeend', div);
        },
        updateSpent: function(){
            //all expenses elements
            const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
            //array with all expenses
            const expenseCount = [...allExpenses].map(item => +item.innerHTML)
            //calculate the total
            const expenseSum = expenseCount.reduce(function(a, b){
                return a+b
            },0)
            // display the total spent
            const expensesTotal = document.querySelector(UISelectors.moneySpent).innerHTML = expenseSum;
        },
        updateAvailable: function(){
            const earned = document.querySelector(UISelectors.moneyEarned);
            const spent = document.querySelector(UISelectors.moneySpent)
            const available = document.querySelector(UISelectors.moneyAvailable);
            available.innerHTML = ((+earned.innerHTML)-(+spent.innerHTML)).toFixed(2)
        },
        deleteAmount: function(id){
            //create the id we will select
            const amountId = `#item-${id}`;
            //select the amount with the id we passed
            const amountDelete = document.querySelector(amountId);
            //remove from ui
            amountDelete.remove();
        }
    }
})();

//APP CONTROLLER
const App = (function(){
    //event listeners
    const loadEventListeners = function(){
        //get ui selectors
        const UISelectors = UICtrl.getSelectors();
        //add new income
        document.querySelector(UISelectors.incomeBtn).addEventListener('click', addIncome);
        //add new expense
        document.querySelector(UISelectors.expenseBtn).addEventListener('click', addExpense);
        //delete item
        document.querySelector(UISelectors.itemsContainer).addEventListener('click', deleteItem);
    }

    //add new income
    const addIncome = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput);
            //add item to the list
            UICtrl.addIncomeItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update earned
            UICtrl.updateEarned();
            //calculate money available
            UICtrl.updateAvailable();
        }
    }

    //add new expense
    const addExpense = function(){
        //get description and amount values
        const description = UICtrl.getDescriptionInput();
        const amount = UICtrl.getValueInput();
        //if inputs are not empty
        if(description.descriptionInput !=='' && amount.amountInput !== ''){
            //add new item
            const newMoney = itemCtrl.addMoney(description.descriptionInput, amount.amountInput);
            //add item to the list
            UICtrl.addExpenseItem(newMoney);
            //clear inputs
            UICtrl.clearInputs();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }
    }

    //delete item
    const deleteItem = function(e){
        if(e.target.classList.contains('far')){
            //get id number
            const id = itemCtrl.getIdNumber(e.target)
            //delete amount from ui
            UICtrl.deleteAmount(id);
            //delete amount from data
            itemCtrl.deleteAmountArr(id);
            //update earned
            UICtrl.updateEarned();
            //update total spent
            UICtrl.updateSpent();
            //calculate money available
            UICtrl.updateAvailable();
        }

        e.preventDefault()
    }

    //init function
    return{
        init: function(){
            loadEventListeners();
        }
    }

})(itemCtrl, UICtrl);

App.init();


//------------------------ BUDGET ALLOCATION---------------//

//----------------WEEKLY----------//

// Event Listener
document.getElementById("calctotal-btn-weekly").addEventListener("click", calcTotalWeek);
document.getElementById("calcave-btn-weekly").addEventListener("click", calcAverageWeek);

//Event Function
function calcAverageWeek(){

// Input
let num1 = +document.getElementById("num11").value;
let num2 = +document.getElementById("num21").value;
let num3 = +document.getElementById("num31").value;
let num4 = +document.getElementById("num41").value;
let num5 = +document.getElementById("num51").value;
let num6 = +document.getElementById("num61").value;
let num7 = +document.getElementById("num71").value;

// Process
let average = (num1 + num2 + num3 + num4 + num5 + num6 + num7)/7;

// Output
document.getElementById("ave-out-weekly").innerHTML = average;

}

//Event Function
function calcTotalWeek(){

// Input
let num1 = +document.getElementById("num11").value;
let num2 = +document.getElementById("num21").value;
let num3 = +document.getElementById("num31").value;
let num4 = +document.getElementById("num41").value;
let num5 = +document.getElementById("num51").value;
let num6 = +document.getElementById("num61").value;
let num7 = +document.getElementById("num71").value;

// Process
let total = (num1 + num2 + num3 + num4 + num5 + num6 + num7);

// Output
document.getElementById("total-out-weekly").innerHTML = total;

}

//------------------MONTHLY----------------//

// Event Listener
document.getElementById("calctotal-btn-monthly").addEventListener("click", calcTotalMonth);
document.getElementById("calcave-btn-monthly").addEventListener("click", calcAverageMonth);

//Event Function
function calcAverageMonth(){

// Input
let num1 = +document.getElementById("num12").value;
let num2 = +document.getElementById("num22").value;
let num3 = +document.getElementById("num32").value;
let num4 = +document.getElementById("num42").value;

// Process
let averageMonth = (num1 + num2 + num3 + num4)/4;

// Output
document.getElementById("ave-out-monthly").innerHTML = averageMonth;

}

//Event Function
function calcTotalMonth(){

// Input
let num1 = +document.getElementById("num12").value;
let num2 = +document.getElementById("num22").value;
let num3 = +document.getElementById("num32").value;
let num4 = +document.getElementById("num42").value;

// Process
let total = (num1 + num2 + num3 + num4);

// Output
document.getElementById("total-out-monthly").innerHTML = total;

}

//------------------YEARLY----------------//

// Event Listener
document.getElementById("calctotal-btn-annual").addEventListener("click", calcTotalAnnual);
document.getElementById("calcave-btn-annual").addEventListener("click", calcAverageAnnual);

//Event Function
function calcAverageAnnual(){

// Input
let num1 = +document.getElementById("num13").value;
let num2 = +document.getElementById("num23").value;
let num3 = +document.getElementById("num33").value;
let num4 = +document.getElementById("num43").value;
let num5 = +document.getElementById("num53").value;
let num6 = +document.getElementById("num63").value;
let num7 = +document.getElementById("num73").value;
let num8 = +document.getElementById("num83").value;
let num9 = +document.getElementById("num93").value;
let num10 = +document.getElementById("num103").value;
let num11 = +document.getElementById("num113").value;
let num12 = +document.getElementById("num123").value;

// Process
let average = (num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10 + num11 + num12)/12;

// Output
document.getElementById("ave-out-annual").innerHTML = average;

}

//Event Function
function calcTotalAnnual(){

// Input
let num1 = +document.getElementById("num13").value;
let num2 = +document.getElementById("num23").value;
let num3 = +document.getElementById("num33").value;
let num4 = +document.getElementById("num43").value;
let num5 = +document.getElementById("num53").value;
let num6 = +document.getElementById("num63").value;
let num7 = +document.getElementById("num73").value;
let num8 = +document.getElementById("num83").value;
let num9 = +document.getElementById("num93").value;
let num10 = +document.getElementById("num103").value;
let num11 = +document.getElementById("num113").value;
let num12 = +document.getElementById("num123").value;

// Process
let total = (num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10 + num11 + num12);

// Output
document.getElementById("total-out-annual").innerHTML = total;

}



let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector ('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toogle('bx-x');
    navbar.classList.toogle('active');
};