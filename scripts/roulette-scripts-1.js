var redCells = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]; // list containing all red cells, if its not red, its either zero or black
var gameCanvasName = ".game-field"; // name of game canvas class
var number = 0; // number in the cell

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
    var result = Math.floor(Math.random() * 37);
    var cellColor = DetermineCellColor(result);
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
        $('.spin-result').html(result);

        $(".result-holder .explanation").html(ExplainResult(result));

        if(bet==="no_bet") {
            $('.spin-text').html(choiceText).fadeIn(speed);
        } else {
            if(WinOrLose(bet, result)) {
                $('.spin-text').html(winText).fadeIn(speed);
            } else {
                $('.spin-text').html(loseText).fadeIn(speed);
            }
        }
        $('.spin-result').fadeIn(speed);
        $('.explanation').fadeIn(speed);
    });
    return;
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
                return(true);
            } else {
                return(false);
            }
        break;

        case "black":
            if(color===bet) {
                return(true);
            } else {
                return(false);
            }
        break;

        case "zero":
            if(color===bet) {
                return(true);
            } else {
                return(false);
            }
        break;

        case "even":
            if(num>0 && num%2===0) {
                return(true);
            } else {
                return(false);
            }
        break;

        case "odd":
            if(num>0 && num%2!==0) {
                return(true);
            } else {
                return(false);
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