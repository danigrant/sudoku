//TODO - make the select select the whole board, not just the inputted val

//example board
var example = {
	initial: [
		"---6--4--",
		"7----36--",
		"----91-8-",
		"---------",
		"-5-18---3",
		"---3-6-45",
		"-4-2---6-",
		"9-3------",
		"-2----1--"
	],
	solution: [
		"333633433",
		"733333633",
		"333391383",
		"333333333",
		"353183333",
		"333336345",
		"343233363",
		"933333333",
		"323333133"
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

	$('#board').on('focus', '.sudoku-box', function(e){
		$(this).select();
	});
	$('#board').on('mouseup', '.sudoku-box', function(e){
		e.preventDefault();
	});
	
	//when the validate button is pressed, if it is now checked, validate the board
	$('#valid').click(function () {
		console.log(autoValidate);
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
				//wrap the next logic in if the box is not a preset (i.e. can be validated)
				var currentBox = getCurrentBox(rowIndex, colIndex);
				currentBox.removeClass('valid');
				currentBox.removeClass('invalid');
				
				if(currentBox.val() === "") { 
					//TODO replace empty string
					//empty string
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
		//check for each box that value matches solution
		var validGame = true;
		validateBox(); //doesn't check for empty strings

		//if there are blank elems, it's a false board
		$('input').filter(function(i) { return $(this).val() === ""; }).addClass('invalid');

		//if there are elems with invalid class, then the board is invalid
		if ($('.invalid').length > 0) {
			validGame = false;
		} 

		//cleanup. remove invalid class from blank boxes. and remove invalid + valid classes if autovalidate is turned off
		$('input').filter(function(i) { return $(this).val() === ""; }).removeClass('invalid');
		if(!autoValidate) {
			$('.valid').removeClass('valid');
			$('.invalid').removeClass('invalid');
		}
		
		alert(validGame);
		return validGame;
	}

	//convert from obj model to the corresponding DOM elem
	function getCurrentBox(rowIndex, colIndex) {
		return $($('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]:not(:disabled)')[0]);
	}

	// //event handlers for animations
	// $('#toggle').mouseenter(function() {
	// 	console.log("mouse enter toggle");
	// 	$('#toggle').addClass('floating');
	// }).mouseleave(function() {
	// 	$('#toggle').removeClass('floating');
	// });

	// $('#submit').mouseenter(function() {
	// 	console.log("mouse enter submit");
	// 	$('#submit').addClass('floating');
	// }).mouseleave(function() {
	// 	$('#submit').removeClass('floating');
	// });

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

//a char is valid if it is '-' (indicates an empty square), an integer, and between 1 and 9 
function validCharacter(c){
	var cToNum = Number(c);
	return c === "-" || ( cToNum % 1 === 0 && 1<= cToNum && cToNum <= 9)
}


function load(sudokuGame) {
	sudokuGame.board.forEach(function(currentRow, rowIndex) { // rowIndex is 0 indexed
		currentRow.forEach(function(currentEl, colIndex) { // colIndex is 0 indexed
			$('#board').append('<input class="sudoku-box" data-row="'+(rowIndex+1)+'" data-col="'+(colIndex+1)+'" type="text" min="0" max="9" maxlength="1" value="'+ currentEl["value"]+'" '+ (currentEl.mutable ? "": "disabled") +'>');
			// Input type 'number' doesn't support maxlength. Thus, input type 'text'

			//create borders for internal sudoku 3x3 blocks
			if((rowIndex+1) % 3 == 0) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-bottom');
			}

			if ((colIndex+1) % 3 == 0) {
				$('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]').addClass('border-right');
			}

			//create border for external sudoku blocks

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