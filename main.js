$(document).ready(init);

    function init(){
        attachEventHandlers();
    }

    function attachEventHandlers(){
        $('.clear').click(calculator.clearArray);
        $('.clearEntry').click(calculator.clearEntry);
        $('.number').click(calculator.doMath);
        $('.operator').click(calculator.doMath);
        $('.equalSign').click(calculator.evaluate);
        $('.decimal').click(calculator.doMath);
    }

    function CalculatorApp(value, inputArray){ //create space for value and inputArray
        this.value = value;
        this.inputArray = inputArray;

        value = null;
        inputArray = [];
      
        this.storedOperators = {
            '+':'+',
            '-':'-',
            '*':'*',
            '/':'/'
        }

        this.storedNumbers = {
            '1':1,
            '2':2,
            '3':3,
            '4':4,
            '5':5,
            '6':6,
            '7':7,
            '8':8,
            '9':9,
            '0':0
        }

        this.clearArray = function(){
            value = null;
            inputArray = [];
            $('.calculatorScreen').val(0);
        }

        this.clearEntry = function(){

            if(inputArray.length > 1 && typeof inputArray[inputArray.length - 1] === "string"){
                inputArray.pop();
                $('.calculatorScreen').val(inputArray.join(""));

            } else if (inputArray.length >= 2 && inputArray[inputArray.length - 1] !== "" || inputArray.length === 1 && typeof inputArray[inputArray.length - 1] === "number" && isNaN(inputArray[0])){
                inputArray[inputArray.length - 1] = "" + inputArray[inputArray.length - 1];
                let stringNum = inputArray[inputArray.length - 1];
                stringNum = stringNum.slice(0, -1);
                inputArray[inputArray.length - 1] = stringNum;
                $('.calculatorScreen').val(inputArray.join(""));

            } else if (inputArray.length > 0){

                if(typeof inputArray[inputArray.length -1] === "number"){
                    let stringNum = "" + inputArray[inputArray.length - 1];

                    if (stringNum.length > 1){
                        stringNum = stringNum.slice(0, -1);
                        inputArray[inputArray.length - 1] = stringNum;
                        $('.calculatorScreen').val(inputArray.join(""));

                    } else {
                        inputArray = [];
                        $('.calculatorScreen').val(0);
                    }

                } else if (typeof inputArray[inputArray.length -1] === "string"){
                    let stringNum = inputArray[inputArray.length - 1];

                    if(stringNum.length > 1){
                        stringNum = stringNum.slice(0, -1);
                        inputArray[inputArray.length - 1] = stringNum;
                        $('.calculatorScreen').val(inputArray.join(""));

                    } else {
                        inputArray = [];
                        $('.calculatorScreen').val(0);
                    }

                } else {
                    inputArray = [];
                    $('.calculatorScreen').val(0);
                }
            }
        }

        this.doMath = function(num1, num2, operator){ //assign value to appropriate parameter
            value = $(this).text();
            let inputArrayString = "" + inputArray;
            let opsRegex = inputArrayString.match(/[\+\-\*\/]/g);
            this.num1 = num1;
            this.num2 = num2;
            this.operator = operator;

            if(value in calculator.storedNumbers || value === "."){ //check for value in storedNumbers

                if(isNaN(inputArray[inputArray.length - 1]) && inputArray.length !== 0 && value !== "." && inputArray.indexOf(".") > -1 && opsRegex || isNaN(inputArray[1]) && inputArray.length > 1 && inputArray.indexOf(".") === -1 && value !== "." && opsRegex){//if last item if inputArray is not a number OR second item in array is NaN -----NUM2
                    num2 = value;
                    inputArray.push(num2);
                    $('.calculatorScreen').val(num2);

                } else if (inputArray.length === 0 && value !== "." || !isNaN(inputArray[inputArray.length - 1]) && num2 === undefined && value !== "." || num2 === undefined && inputArray.indexOf(".") >= 1 && value !== "."){ //if last item of inputArray is a number -----NUM1

                    if(inputArray[0] === 0){
                        inputArray = [];
                    }

                    num1 = value;
                    inputArray.push(num1);

                    if(inputArray.length >= 1){
                        let newValue = inputArray.join("");
                        num1 = parseFloat(newValue);
                    }
                  
                } else if (num1 && inputArray.indexOf(".") === -1){ //check for decimal in inputArray
                    let decimal = value;
                    inputArray.push(decimal);
                }

                let displayArray = inputArray.join("");
                $('.calculatorScreen').val(displayArray);

            } else if (value in calculator.storedOperators){//check for value in storedOperators ------OPERATOR

                if(inputArray.length === 0){
                    inputArray[0] = 0;

                } else if (inputArrayString.includes(opsRegex)){
                    calculator.evaluate();
                }

                let newValue = inputArray.join("");
                num1 = parseFloat(newValue);
                operator = value;
                inputArray.push(operator);

                if(isNaN(inputArray[inputArray.length - 1])){//check if last item of inputArray is an operator
                    inputArray.splice(0, inputArray.length - 1, num1);
                    let newArray = inputArray.join("");
                    $('.calculatorScreen').val(newArray);
                }
            }
        }

        this.evaluate = function(){
            let newValue = [];
            let value = null;
            let itemsToRemove = 0;
            let operator = inputArray[1];
            let num1 = inputArray[0];
            let num2 = calculator.num2
            let newNum1 = null;
            let newNum2 = null;
            let newValueDigits = null;

            for(var inputIndex = 2; inputIndex <= inputArray.length - 1; inputIndex++){

                if(typeof inputArray[inputIndex] === "string" && !isNaN(inputArray[inputIndex]) || typeof inputArray[inputIndex] === "string" && inputArray.indexOf(".") > -1){
                    newValue.push(inputArray[inputIndex]);
                    itemsToRemove = itemsToRemove + 1;          //add count for numbers to remove for splice

                    if(inputIndex === inputArray.length - 1){
                        newValue = newValue.join("");
                        num2 = parseFloat(newValue);
                        inputArray.splice(2, itemsToRemove, num2);
                    }
                }
            }

            if(inputArray.length === 1 && CalculatorApp.prototype.operator !== undefined){
                num1 = inputArray[0];
                num2 = CalculatorApp.prototype.num2;
                operator= CalculatorApp.prototype.operator;

            } else if(inputArray.length === 1 && CalculatorApp.prototype.operator === undefined){
                num1 = parseFloat(num1);
                num2 = 0;
                operator = "+";

            } else if (inputArray.length === 2){
                num2 = inputArray[0];
            }

            switch(operator){
                case '+':
                    value = num1 + num2;
                    break;
                case '-':
                    value = num1 - num2;
                    break;
                case '*':
                case 'x':
                case 'X':
                    value = num1 * num2;
                    break;
                case '/':
                    value = num1 / num2;
            }

            if(!isFinite(value)){
                return $('.calculatorScreen').val("Error");
            }

            CalculatorApp.prototype.num1 = num1;
            CalculatorApp.prototype.num2 = num2;
            CalculatorApp.prototype.operator = operator;

            newNum1 = (num1 + '').replace('.', '').length;
            newNum2 = (num2 + '').replace('.', '').length;
            newValueDigits = (value + '').replace('.', '').length;

            if(newNum1 + newNum2 < newValueDigits){
                value = parseFloat(value.toFixed(newNum1 + newNum2 - 1));
            }

            num1 = value;
            inputArray = [value];
            $('.calculatorScreen').val(value);
        }
    }

const calculator = new CalculatorApp();