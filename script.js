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
    return manageResultLength(+a + +b);
}

function subtract(a, b) {
    return manageResultLength(+a - +b);
}

function multiply(a, b) {
    return manageResultLength(+a * +b);
}

function divide(a, b) {
    if (+b !== 0) {
        return manageResultLength(+a / +b);
    } else {
        errorThrown = true;
        return 'don\'t do that';
    };
}

function manageResultLength(result) {
    // Split string result at decimal, get length of nums after decimal
    let decimalPlaces;
    if (!Number.isInteger(result)) {
        decimalPlaces = result.toString().split('.')[1].length;
    };

    // Remove decimal place from result; get length
    let numberSize = Math.trunc(result).toString().length;

    // Only need to deal with numbers that are too large
        // numberSize is too large => exponential form, 10 places
        // decimalPlaces is too large
            // trailing decimals => round to: 15 - numberSize
            // exponentially small decimals => exponential form, 10 places
    if (numberSize > 16 || Math.abs(result) < 1/1000000) { // really big/small
        return result.toExponential(10);
    } else if (numberSize + decimalPlaces > 15) { // too many trailing decimals
        return result.toFixed(15 - numberSize);
    } else { // everything else
        return result;
    };
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

function untoggleOperator() {
    // Untoggle CSS style on the previously selected operator
    if (document.querySelector('.toggled') !== null) {
        document.querySelector('.toggled')
            .classList
            .toggle('toggled');
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


// Global variable declations
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
let errorThrown = false;


// Set display default to zero
addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('#display');
    display.textContent = '0';
});


// Event listener to handle the calculator operation when buttons are clicked
const buttons = document.querySelector('#buttons');
buttons.addEventListener('click', (e) => {
    
    // Event information
    let button = e.target;
    let buttonId = e.target.id;
    let buttonContent = e.target.textContent;
    
    // Display information
    const display = document.querySelector('#display');
    let displayLength = display.textContent.length;
    let displayIsNegative;
    (display.textContent.charAt(0) === '-')
        ? displayIsNegative = true 
        : displayIsNegative = false;
    
    
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
            
            // Don't allow too many digits
            if (displayLength > 16 && !operatorJustPressed
                && !equalsJustPressed) {
                break;
            }

            // If error was thrown previously (div/0); same code as 'clear'
            // If user types a number when a result is displayed, clear the 
                // previous stuff
            if (errorThrown || equalsJustPressed) {

                clearDisplay();
                clearAll(equation, operatePriority);

                // Untoggle CSS style on the previously selected operator
                untoggleOperator();
                operatorJustPressed = false;
                equalsJustPressed = false;
                errorThrown = false;
            };

            // If first character since operator was pressed, clear display
            if (operatorJustPressed) {
                clearDisplay();

                // Untoggle CSS style on the previously selected operator
                untoggleOperator();
            };
            
            // Don't append decimal if there already is one in the display
            if (buttonId === 'decimal' && display.textContent.includes('.')) {
                break;
            };
            
            // Don't append zero if it violates math notation rules
            if (buttonId === 'zero' &&
                (display.textContent === '-0' || display.textContent === '0')) {
                
                operatorJustPressed = false;
                equalsJustPressed = false;
                break;
            };
            
            appendDisplay(buttonContent);
            operatorJustPressed = false;
            equalsJustPressed = false;
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
                
                
                // Show selected operator as toggled using CSS
                button.classList.toggle('toggled');
                
                
                // Append number, operator, and operator priority to arrays
                    // Don't append if equals was just pressed. Display already
                    // reflects the equation array
                if (!equalsJustPressed) {
                    appendArray(display.textContent, equation);
                };

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

                // This handles the case when operating on a result
                equalsJustPressed = false;

            };
        break;
        
        // Equals
        case 'equals':
            
            if (!equalsJustPressed && !operatorJustPressed
                    && equation.length > 1) {
                
                // Append display number to equation array
                appendArray(display.textContent, equation);

                let continueEval = true;
                while (continueEval) {
                    
                    evaluate(equation, operatePriority, 'equals');
                    
                    // operate until the equation array is simplified
                    if (equation.length === 1) {
                        continueEval = false;
                    };
                };
                
                
                // Display total
                display.textContent = equation[equation.length - 1];
                equalsJustPressed = true;
            };
        break;

        // Misc
        case 'clear':
            clearDisplay();
            clearAll(equation, operatePriority);

            // Untoggle CSS style on the previously selected operator
            untoggleOperator();
            operatorJustPressed = false;
            equalsJustPressed = false;
            errorThrown = false;
        break;
        case 'undo':
            if (!operatorJustPressed && !equalsJustPressed) backspace();
        break;
        case 'sign':
            
            // Only allow sign change if:
                // 1. equals wasn't just pressed (not displaying a result)
                // 2. (number is negative)
                    // OR (number isn't max char and positive)
            if (!equalsJustPressed && 
                (displayIsNegative ||
                    (displayLength < 17 && !displayIsNegative))) changeSign();
        break;
    };
});


// Event listener to translate keyboard to clicks on the appropriate buttons
document.addEventListener('keydown', (e) => {

    let buttonId;
    let validKeyPressed;

    // Process keyboard to simulated click location
    switch (e.key) {
        case '1':
            buttonId = '#one';
            validKeyPressed = true;
        break;
        case '2':
            buttonId = '#two';
            validKeyPressed = true;
        break;
        case '3':
            buttonId = '#three';
            validKeyPressed = true;
        break;
        case '4':
            buttonId = '#four';
            validKeyPressed = true;
        break;
        case '5':
            buttonId = '#five';
            validKeyPressed = true;
        break;
        case '6':
            buttonId = '#six';
            validKeyPressed = true;
        break;
        case '7':
            buttonId = '#seven';
            validKeyPressed = true;
        break;
        case '8':
            buttonId = '#eight';
            validKeyPressed = true;
        break;
        case '9':
            buttonId = '#nine';
            validKeyPressed = true;
        break;
        case '0':
            buttonId = '#zero';
            validKeyPressed = true;
        break;
        case '.':
            buttonId = '#decimal';
            validKeyPressed = true;
        break;
        case '*':
            buttonId = '#multiply';
            validKeyPressed = true;
        break;
        case '/':
            buttonId = '#divide';
            validKeyPressed = true;
        break;
        case '+':
            buttonId = '#add';
            validKeyPressed = true;
        break;
        case '-':
            buttonId = '#subtract';
            validKeyPressed = true;
        break;
        case '=':
        case 'Enter':
            buttonId = '#equals';
            validKeyPressed = true;
        break;
        case 'Backspace':
            buttonId = '#undo';
            validKeyPressed = true;
        break;
        case 'Delete':
            buttonId = '#clear';
            validKeyPressed = true;
        break;
    };

    // Dispatch click event
    if (validKeyPressed) {
        let simClickElement = document.querySelector(buttonId);
        let simClickEvent = new MouseEvent('click', {bubbles: true});
        simClickElement.dispatchEvent(simClickEvent);
    };

});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Testing ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

