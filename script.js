// ------------------------ Calculator JavaScript ------------------------------

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Pseudocode ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/* 
- Contain functions for all the basic math operators
    - add, subtract, multiply, divide
    - Should all of these functions be on the same object?
- Calculation
    - Components: [a] [operator] [b]
    - Have variable for each component; will be displayed on the calculator
- Operate function
    - Calls the appropriate calculation function (based on the input)
    - Can use an object to store functions under their operator's key
    - Can separate operator and operands into variables, then call the key-val
    - Operator needs to be a string. Needs to be passed to function as string
- Inputs from the HTML
    - Number input from the calculator stored as operands
        - Operands stored on operator keypress event
    - Key functionality
        - [ESC] is same as clear
        - [Backspace] is same as undo
        - [Enter] is same as equals
        - [*], [/], [+], [-] are same as clicking various operations
        - Letter characters should do nothing
        - Number characters should be same as clicking the numbers
- Function
    - Store operand
    - Store the operator
        - Allow operator to be changed
            - Show selected operator button as toggled
    - Operate when:
        - '=' is pressed
        - Subsequent operator is pressed if lower priority:
            - 5 * 2 +(operate 5*2) 3
- Order of operations
    - Automatically calculate previoius subtotal once a new operator is pressed
      of lower priority than previous operator
    - Operate multiplication/division before addition/subtraction
        - i.e., If multiplication is pressed, do current current operation before 
          doing prior addition/subtraction


*/

"use strict";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function add(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return +a - +b;
}

function multiply(a, b) {
    return +a * +b;
}

function divide(a, b) {
    return (+b !== 0) ? +a / +b : 'What do you think you\'re doing?!?';
}


function operate(operator, a, b) {
    
    const mathFunctions = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide,
    };

    return mathFunctions[operator](a, b);
}

function clearDisplay() {
    const display = document.querySelector('#display');
    display.textContent = '';
}

function appendDisplay(value) {
    const display = document.querySelector('#display');
    display.textContent += +value;
}

function backspace() {
    const display = document.querySelector('#display');
    display.textContent = display
        .textContent
        .slice(0, display.textContent.length - 1);
}

function changeSign() {
    const display = document.querySelector('#display');
    display.textContent = +display.textContent * (-1);
}

function appendArray(element, array) {
    array.push(element);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Execution ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Testing ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const lowArgs = [];
const highArgs = [];
const calcArgs = {
    addSubtract: [],
    multiplyDivide: [],
};

const operations = [];