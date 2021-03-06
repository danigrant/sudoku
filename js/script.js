//example board
//the solution is here: http://bit.ly/sudoku-solution
var example = {
	initial: [
		"2--3-----",
		"8-4-62--3",
		"-138--2--",
		"----2-39-",
		"5-7---621",
		"-32--6---",
		"-2---914-",
		"6-125-8-9",
		"-----1--2"
	],
	solution: [
		"276314958",
		"854962713",
		"913875264",
		"468127395",
		"597438621",
		"132596487",
		"325789146",
		"641253879",
		"789641532"
	]
};


$(document).ready(function(){
	var sudokuGame = new Sudoku(example.initial, example.solution);
	var autoValidate = false;

	load(sudokuGame);

	$('#board').on('keydown', '.sudoku-box', function(e){
		//only accepts inputs from backspace(8), tab(9), arrows(37-40), 0-9(48-57 && 96-105), enter(13), delete(46)
		if([8,9,37,38,39,40,48,49,50,51,52,53,54,55,56,57,13,46,96,97,98,99,100,101,102,103,104,105].indexOf(e.which) === -1){
			e.preventDefault();
		} 
		else {
			//if input from accepted key, on keydown - check if the key matches the solution
			if (autoValidate) validateBox();
		}
		//on arrow keys, move around the board
		switch(e.which){
			case 37: // left arrow
				var c = $(this);
				do {
					c = c.prev().focus();
				} while ((c.is(':disabled') || c.is('br')) && c.prev().length > 0)
				break;
			case 38: // up arrow
				var c = $(this);
				do {
					var currentRow = Number(c.data('row'));
					var currentCol = Number(c.data('col'));
					if(currentRow === 1 && currentCol === 9){
						return;
					}
					else if(currentRow === 1){
						c = $('.sudoku-box[data-row="'+9+'"][data-col="'+(currentCol+1)+'"]').focus();
					}
					else {
						c = $('.sudoku-box[data-row="'+(currentRow-1)+'"][data-col="'+currentCol+'"]').focus();
					}
				} while (c.is(':disabled'))
				break;
			case 39: // right arrow
				var c = $(this);
				do {
					c = c.next().focus();
				} while ((c.is(':disabled') || c.is('br')) && c.next().length > 0)
				break;
			case 40: // down arrow
				var c = $(this);
				do {
					var currentRow = Number(c.data('row'));
					var currentCol = Number(c.data('col'));
					if(currentRow === 9 && currentCol === 1){
						return;
					}
					else if(currentRow === 9){
						c = $('.sudoku-box[data-row="'+1+'"][data-col="'+(currentCol-1)+'"]').focus();
					}
					else {
						c = $('.sudoku-box[data-row="'+(currentRow+1)+'"][data-col="'+currentCol+'"]').focus();
					}
				} while (c.is(':disabled'))
				break;
		}
	});
	//automatically selects the current square after input
	$('#board').on('keyup', '.sudoku-box', function(e){
		$(this).select();
	});

	//automatically selects a box when the user clicks on it
	$('#board').on('focus', '.sudoku-box', function(e){
		$(this).select();
	});

	$('#board').on('mouseup', '.sudoku-box', function(e){
		e.preventDefault();
	});
	
	//when the validate button is pressed, validate the board
	$('#valid').click(function () {
		autoValidate = !autoValidate;
		if (autoValidate) validateBox();
		else {
			$('.valid').removeClass('valid');
			$('.invalid').removeClass('invalid');
		};
	});

	function validateBox() {
		sudokuGame.board.forEach(function(currentRow, rowIndex) { // rowIndex is 0 indexed
			currentRow.forEach(function(currentEl, colIndex) { // colIndex is 0 indexed
				var currentBox = getCurrentBox(rowIndex, colIndex);
				currentBox.removeClass('valid');
				currentBox.removeClass('invalid');
				
				if(currentBox.val() === "") { 
					//empty string, nothing to validate
				} 
				else if(currentEl.solution === Number(currentBox.val())) {
					currentBox.addClass('valid');
				}
				else {
					currentBox.addClass('invalid');
				}
			});
		})
	}

	$('#submit').click(validateBoard);

	function validateBoard() {
		//boolean will turn false if any box has a value that does not match its solution
		var validGame = true;
		validateBox(); //validateBox() doesn't mark empty strings as invalid

		//if there are blank elems, it's a false board
		$('input').filter(function(i) { return $(this).val() === ""; }).addClass('invalid');

		//if there are elems with invalid class, then the board is invalid
		if ($('.invalid').length > 0) {
			validGame = false;
		} 

		//clean up. remove invalid class from blank boxes
		//if autovalidate is turned off, also remove invalid + valid classes
		$('input').filter(function(i) { return $(this).val() === ""; }).removeClass('invalid');
		if(!autoValidate) {
			$('.valid').removeClass('valid');
			$('.invalid').removeClass('invalid');
		}
		
		//if the game is won - celebrate
		//otherwise, let the user know the board is incorrect
		if (validGame) {
			hooray();
		}
		else {
			$('#submit').addClass('shake');
		}
		
		//after half a second, remove the shake class
		setTimeout(function(){
			$('.shake').removeClass('shake');
		}, 500);
	}

	//converts from obj model to the corresponding DOM elem
	function getCurrentBox(rowIndex, colIndex) {
		return $($('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]:not(:disabled)')[0]);
	}
});

//Sudoku constructor takes the initial setting of the board && the board's solution 
var Sudoku = (function(initial, solution){
	
	function Sudoku(initial, solution){
		this.initial = initial;
		this.solution = solution;
		this.board = this.generateBoard();
	}
	
	Sudoku.prototype.generateBoard = function() {
		var tempArray = [];
		for(var i = 1; i < 10; i++){
			var tempRow = [];
			for(var j = 1; j < 10; j++){
				var currentInitialEl = this.initial[i-1][j-1];
				
				//checks for invalid initial settings
				if(!validCharacter(currentInitialEl)) {
					console.error('Input character at ('+i-1+','+j-1+') is not recognized. Accepted characters are {-,1,2,3,4,5,6,7,8,9}');
					throw new Error("invalid characters");
				}

				tempRow.push({
					value: currentInitialEl == "-" ? "" : currentInitialEl,
					mutable: currentInitialEl == "-",
					solution: Number(this.solution[i-1][j-1])
				});
			}
			tempArray.push(tempRow);
		}
		return tempArray;
	}
	
	return Sudoku;
})();

//a char is valid if it is '-' (indicates an empty square), or an integer between 1 and 9 
function validCharacter(c){
	var cToNum = Number(c);
	return c === "-" || ( cToNum % 1 === 0 && 1<= cToNum && cToNum <= 9)
}


function load(sudokuGame) {
	sudokuGame.board.forEach(function(currentRow, rowIndex) { // rowIndex is 0 indexed
		currentRow.forEach(function(currentEl, colIndex) { // colIndex is 0 indexed
			$('#board').append('<input class="sudoku-box" data-row="'+(rowIndex+1)+'" data-col="'+(colIndex+1)+'" type="text" min="0" max="9" maxlength="1" value="'+ currentEl["value"]+'" '+ (currentEl.mutable ? "": "disabled") +'>');
			// Input type 'number' doesn't support maxlength. Using input type 'text' instead

			//create borders for internal sudoku 3x3 blocks
			if((rowIndex+1) % 3 == 0) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-bottom');
			}

			if ((colIndex+1) % 3 == 0) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-right');
			}

			//create border for external sudoku perimeter
			if ((rowIndex + 1) == 1) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-top');
			}

			if ((colIndex+1) == 1) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-left');
			}

		});
		$('#board').append('<br />');
	})
}