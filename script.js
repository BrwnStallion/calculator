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
    display.textContent = '0';
}

function appendDisplay(value) {
    const display = document.querySelector('#display');
    
    // Conditions for replacing default display value of zero
    if (display.textContent === '-0' && value !== '.') {
        display.textContent = '-' + value;   
    } else if (display.textContent === '0' && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    };
}

function backspace() {
    const display = document.querySelector('#display');
    
    // Conditions for final backspace (if pos or neg)
    if (display.textContent === '-0') {
        display.textContent = '0';
    } else if (display.textContent.charAt(0) === '-' 
        && display.textContent.length === 2) {
        display.textContent = '-0';
    } else if (display.textContent.charAt(0) !== '-'
        && display.textContent.length === 1) {
            display.textContent = '0';
    } else {
        display.textContent = display
            .textContent
            .slice(0, display.textContent.length - 1);
    };
}

function clearAll(...arrays) {
    arrays.forEach( (arrayArg) => {
        arrayArg.length = 0;
    });
}

function changeSign() {
    const display = document.querySelector('#display');
    if (display.textContent.charAt(0) === '-') {
        display.textContent = display.textContent.slice(1);
    } else if (display.textContent.charAt(0) !== '-') {
        display.textContent = '-' + display.textContent.slice(0);
    };
}

function appendArray(element, array) {
    array.push(element);
}

function appendPriorityArray(operator, priorityArr, lookupArr) {
    priorityArr.push(lookupArr[operator]);
}

function removeArrayElement(array, type = 'penultimate') {
    let arrayEnd;
    if (type === 'penultimate') {
        arrayEnd = 2;
    } else if (type === 'ultimate') {
        arrayEnd = 1;
    };
    array.splice(array.length - arrayEnd, 1);
}

function replaceWithResult(result, array, element) {
    array[element] = result;
}

function evaluate(equationArr, priorityArr, type = 'operator') {
    let arrayEnd;
    let removeElementLocation;
    if (type === 'operator') {
        arrayEnd = 2;
        removeElementLocation = 'penultimate';
    } else if (type === 'equals') {
        arrayEnd = 1;
        removeElementLocation = 'ultimate';
    };

    let b = equationArr[equationArr.length - arrayEnd];
    removeArrayElement(equationArr, removeElementLocation);
    let operator = equationArr[equationArr.length - arrayEnd];
    removeArrayElement(equationArr, removeElementLocation);
    let a = equationArr[equationArr.length - arrayEnd];
    let result = operate(operator, a, b);
    replaceWithResult(result, equationArr, equationArr.length - arrayEnd);
    
    removeArrayElement(priorityArr, removeElementLocation);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Execution ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Set default to zero
addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('#display');
    display.textContent = '0';
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Testing ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const equation = [];

const operatePriority = [];

const priorityLookup = {
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
};

let operatorJustPressed = false;
let equalsJustPressed = false;

// -------------- This code is for when an operator is entered -----------------

const buttons = document.querySelector('#buttons');
buttons.addEventListener('click', (e) => {
    let button = e.target;
    let buttonId = e.target.id;
    let buttonContent = e.target.textContent;

    switch (buttonId) {
        
        // Numbers
        case 'one':
        case 'two':
        case 'three':
        case 'four':
        case 'five':
        case 'six':
        case 'seven':
        case 'eight':
        case 'nine':
        case 'zero':
        case 'decimal':
            
            const display = document.querySelector('#display');
            
            // If first character since operator was pressed, clear display
            if (operatorJustPressed) {
                clearDisplay();

                // Untoggle CSS style on the previously selected operator
                document.querySelector('.toggled').classList.toggle('toggled');
            };
            
            // Don't append decimal if there already is one in the display
            if (buttonId === 'decimal' && display.textContent.includes('.')) {
                break;
            };
            
            // Don't append zero if it violates math notation rules
            if (buttonId === 'zero' &&
                (display.textContent === '-0' || display.textContent === '0')) {
                break;
            };

            appendDisplay(buttonContent);
            operatorJustPressed = false;
        break;
        
        // Operators
        case 'multiply':
        case 'divide':
        case 'add':
        case 'subtract':
            
            // only button that doesn't reflect the correct operator character
            if (buttonId === 'multiply') buttonContent = '*';
            
            if (!operatorJustPressed) {
                
                operatorJustPressed = true;
                const display = document.querySelector('#display');

                // Show selected operator as toggled using CSS
                button.classList.toggle('toggled');
                
                // Append number, operator, and operator priority to arrays
                appendArray(display.textContent, equation);
                appendArray(buttonContent, equation);
                appendPriorityArray(buttonContent,
                    operatePriority, priorityLookup);
                
                // Calculate, if applicable
                if (equation.length > 3) {
                    
                    let priorityDifference = operatePriority[
                        operatePriority.length - 1]
                        - operatePriority[operatePriority.length - 2];
                    
                    
                    // Evaluation depends on order of operations
                    if (priorityDifference > 0) {
                        
                        // Do nothing
                        
                    } else if (priorityDifference === 0) {
                        

                        // Same priority; evaluate
                        evaluate(equation, operatePriority, 'operator');
                        
                        // Display total/subtotal
                        display.textContent = equation[equation.length - 2];
                        

                    } else if (priorityDifference < 0) {
                        
                        // Evaluate everything
                        let continueEval = true;
                        while (continueEval) {
                            
                            evaluate(equation, operatePriority, 'operator');
                            
                            // operate until the equation array is simplified
                            if (equation.length === 2) continueEval = false;
                        };
                        
                        // Display total
                        display.textContent = equation[equation.length - 2];

                    };
                };
            };
        break;
        
        // Equals
        case 'equals':

        break;

        // Misc
        case 'clear':
            clearDisplay();
            clearAll(equation, operatePriority);

            // Untoggle CSS style on the previously selected operator
            document.querySelector('.toggled').classList.toggle('toggled');
            operatorJustPressed = false;
        break;
        case 'undo':
            if (!operatorJustPressed) backspace();
        break;
        case 'sign':
            changeSign();
        break;
    };
});

// --------------- This code is for when 'equals' is entered -------------------

/* let continueEval = true;
while (continueEval) {
    
    evaluate(equation, operatePriority, 'equals');

    // operate until the equation array is simplified
    if (equation.length === 1) {
        continueEval = false;
    };
}; */
