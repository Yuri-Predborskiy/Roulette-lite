var redCells = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]; // list containing all red cells, if its not red, its either zero or black
var gameCanvasName = ".game-field"; // name of game canvas class
var number = 0; // number in the cell
var defaultBalance = 1000; // default balance
var myBalance;
var defaultBet = 50; // default size of bet
var minBet = 1; // smallest possible bet amount
var maxBet = 1000; // biggest possible bet amount


// loop through the playing field and build cells, append to HTML
// roulette uses 12+1 rows (one for zero)
for(var rowNumber=0; rowNumber<13; rowNumber++) { // generate a game field inside canvas
    rowString = RowStartAsString();
    for(var colNumber=0; colNumber<3 ; colNumber++) {
        rowString = rowString + InsideCellAsString();
        number++;
        if(rowNumber===0) break;
    }
    rowString = RowEndAsString(rowString, rowNumber);
    $(gameCanvasName).append(rowString);
}

// load balance as soon as the page loads
$(function() {
    if(myBalance===0) { myBalance = defaultBalance; }
    if(window.localStorage) {
        myTempBalance = localStorage.getItem("myBalance");
        if(myTempBalance !== null) {
            myBalance = myTempBalance;
        }
    }
    $('.myBalanceAmount').html(myBalance);
    myBalance = parseInt(myBalance);
});

function ResetBalance() {
    myBalance=defaultBalance;
    $('.myBalanceAmount').html(myBalance);
    localStorage.setItem("myBalance",myBalance);
}

// start row as String, return string
function RowStartAsString() {
    var rowStart = '<div class="row">';
    var rowAsString = rowStart;
    return rowAsString;
}

// generate inside HTML for a cell
function InsideCellAsString() {
    var code="";
    var holder = '<div class="inside-cell-holder">'
    var cellColor = DetermineCellColor(number);
    var start = '<div class="cell '+cellColor+'">';
    var end = '</div>';
    code = start
           + number 
           + end;
    return code;
}

// write "row end" HTML as String and return
function RowEndAsString(code, rowNum) {
    var endBlock = '</div>';
    var clrfix = '<div class="clearfix"></div>';
    code = code + clrfix + endBlock;
    return code;
}

// determine color of the cell by number - zero, red or green
function DetermineCellColor(num) {
    if(num===0) { return "zero"; }
    if(redCells.indexOf(num) > -1) {
        return "red";
    } else {
        return "black";
    }
}

// spin the roulette - generate random result from 0 to 36
function Spin() {
    var betAmount = CheckBetAmount();
    if(betAmount===0) { return; }
    
    console.log("returned "+betAmount);

    var spinResult = Math.floor(Math.random() * 37);
    var cellColor = DetermineCellColor(spinResult);
    var speed = 300;
    var choiceText = "Make a choice and press Spin!";
    var winText = "Congratulations! You win!";
    var loseText = "You lose. Better luck next time!";
    var bet = FindBet();

    $('.spin-text').fadeOut(speed);
    $('.explanation').fadeOut(speed);
    $('.spin-result').fadeOut(speed, function() {
        $('.spin-result').removeClass("red");
        $('.spin-result').removeClass("black");
        $('.spin-result').removeClass("zero");

        $('.spin-result').addClass(cellColor);
        $('.spin-result').html(spinResult);

        $(".result-holder .explanation").html(ExplainResult(spinResult));

        if(bet==="no_bet") {
            $('.spin-text').html(choiceText).fadeIn(speed);
        } else {
            var tempBalanceAmount = parseInt($('.myBalanceAmount').html());
            $('.myBalanceAmount').html(tempBalanceAmount-betAmount); // made a bet
            tempBalanceAmount = tempBalanceAmount - betAmount; // update temp balance
            var winOrLose = WinOrLose(bet, spinResult);
            if(winOrLose==="win double") {
                $('.spin-text').html(winText).fadeIn(speed);
                $('.myBalanceAmount').html(tempBalanceAmount+betAmount*2); // win = 2*bet size
                $('.myBetAmount').val(defaultBet);
            } else if(winOrLose==="win number36") {
                $('.spin-text').html(winText).fadeIn(speed);
                $('.myBalanceAmount').html($('.myBalanceAmount').html()+betAmount*36); // win, guessed the number correctly = 36*bet size
                $('.myBetAmount').val(defaultBet);
            } else {
                $('.spin-text').html(loseText).fadeIn(speed);
                $('.myBetAmount').val(defaultBet);
            }
        }
        $('.spin-result').fadeIn(speed);
        $('.explanation').fadeIn(speed);
    });
    
    // save the current balance
    localStorage.setItem("myBalance",myBalance);
    
    return;
}

// checks weather bet amount is a valid number (more than 0 and less than balance and less than max bet size)
function CheckBetAmount() {
    var myBalance = parseInt($('.myBalanceAmount').html());
    var myBetAmount = $('.myBetAmount').val();
    var retryText = "\nPlease enter a valid bet amount and try again.";
    
    switch(true) {
        case (myBetAmount > myBalance):
            alert("Invalid bet. You cannot bet more than your current balance. "+retryText);
            return(0);
            break;

        case (myBetAmount < minBet):
            alert("Invalid bet. Smallest allowed bet is "+minBet+". "+retryText);
            return(0);
            break;
        
        case (myBetAmount > maxBet):
            alert("Invalid bet. Largest allowed bet is "+maxBet+". "+retryText);
            return(0);
            break;
            
        default:
            console.log("returning "+myBetAmount);
            return(myBetAmount);
    }
}

// creates explanation text for resulting roll (spin)
function ExplainResult(result) {
    var exp = "";
    var exBlack = "Black, ";
    var exRed = "Red, ";
    var exZero = "Zero!";
    var exEven = "even.";
    var exOdd = "odd.";
    var color = DetermineCellColor(result);
    switch(color) {
        case "zero":
            exp=exZero;
            break;
        case "red":
            exp=exRed + (IsEven(result) ? exEven : exOdd);
            break;
        case "black":
            exp=exBlack + (IsEven(result) ? exEven : exOdd);
            break;
    }
    return exp;
}

// returns true if number provided is even, false otherwise
function IsEven(num) {
    if(num%2===0) {
        return(true);
    }
    return(false);
}

// determines weather the user wins or not
function WinOrLose(bet, num) {
    var color=DetermineCellColor(num);
    switch(bet) {
        case "red":
            if(color===bet) {
                return("win double"); // win, normal
            } else {
                return(false); // lose
            }
        break;

        case "black":
            if(color===bet) {
                return("win double"); // win, normal
            } else {
                return(false); // lose
            }
        break;

        case "zero":
            if(color===bet) {
                return("win number36"); // win, number guessed, 36x win
            } else {
                return(false); // lose
            }
        break;

        case "even":
            if(num>0 && num%2===0) {
                return("win double"); // win, normal
            } else {
                return(false); // lose
            }
        break;

        case "odd":
            if(num>0 && num%2!==0) {
                return("win double"); // win, normal
            } else {
                return(false); // lose
            }
        break;
    }
    return(false); // if all else fails, its a false
} 

// finds the type of bet the user has selected
function FindBet() {
    var selected = $('.bet.selected');
    var possibleBets = ["no_bet","red","black","even","odd","zero"];
    var resultReal = "";
    var result = jQuery.each(possibleBets,function(index, value) {
        if(selected.hasClass(value)) {
            resultReal = value;
            return(false);
        }
    });
    if(selected.length === 0) resultReal="no_bet";
    return(resultReal);
}

$('.bets').on('click', '.bet', function () {
    $(this).parent().children().removeClass("selected");
    $(this).addClass("selected");
});

// filtering myBet of extra symbols
$(document).ready(function() {
    $("#myBetAmount").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, ]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});