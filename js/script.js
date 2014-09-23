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
	load(sudokuGame);

	var autoValidate = false;

	$('#board').on('keydown', '.sudoku-box', function(e){
		if([8,9,37,38,39,40,48,49,50,51,52,53,54,55,56,57,13,46,96,97,98,99,100,101,102,103,104,105].indexOf(e.which) === -1){
			e.preventDefault();
		} 
		else {
			if (autoValidate) validateBoard();
		}
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
	$('#board').on('keyup', '.sudoku-box', function(e){
		$(this).select();
	});
	$('#board').on('focus', '.sudoku-box', function(e){
		$(this).select();
	});
	$('#board').on('mouseup', '.sudoku-box', function(e){
		e.preventDefault();
	});
	$('#toggle-validation').change(function() {
		autoValidate = $(this).prop('checked');
		if (autoValidate) validateBoard();
	});
	function validateBoard() {
		$('.valid').removeClass('valid');
		$('.invalid').removeClass('invalid');
		sudokuGame.board.forEach(function(currentRow, rowIndex) { // rowIndex is 0 indexed
			currentRow.forEach(function(currentEl, colIndex) { // colIndex is 0 indexed
				console.log(currentEl);

				var currentBox = $('.sudoku-box[data-row="'+(rowIndex+1)+'"][data-col="'+(colIndex+1)+'"]');
				if(currentBox.val() === "") { 
					//empty string
				} 
				else if(currentEl.solution === Number(currentBox.val())) {
					currentBox.addClass('valid');
				}
				else {
					console.log(currentBox.val());
					console.log(currentBox.solution);
					currentBox.addClass('invalid');
				}
			});
		})
	}
});

var Sudoku = (function(initial, solution){
	
	function Sudoku(initial, solution){
		this.initial = initial;
		this.solution = solution;
		this.board = this.generateBoard();
	}
	
	Sudoku.prototype.generateBoard = function() {
		var tempRay = [];
		for(var i = 1; i < 10; i++){
			var tempRow = [];
			for(var j = 1; j < 10; j++){
				var currentInitialEl = this.initial[i-1][j-1];
				if(!validCharacter(currentInitialEl))
					console.error('Input character at ('+i-1+','+j-1+') is not recognized. Accepted characters are {-,1,2,3,4,5,6,7,8,9}');
				tempRow.push({
					value: currentInitialEl == "-" ? "" : currentInitialEl,
					mutable: currentInitialEl == "-",
					solution: Number(this.solution[i-1][j-1])
				});
			}
			tempRay.push(tempRow);
		}
		return tempRay;
	}
	
	return Sudoku;
})();

function validCharacter(c){
	var cToNum = Number(c);
	return c === "-" || ( cToNum % 1 === 0 && 1<= cToNum && cToNum <= 9)
}


function load(sudokuGame) {
	sudokuGame.board.forEach(function(currentRow, rowIndex) { // rowIndex is 0 indexed
		currentRow.forEach(function(currentEl, colIndex) { // colIndex is 0 indexed
			console.log(currentEl);
			$('#board').append('<input class="sudoku-box" data-row="'+(rowIndex+1)+'" data-col="'+(colIndex+1)+'" type="text" min="0" max="9" maxlength="1" value="'+ currentEl["value"]+'" '+ (currentEl.mutable ? "": "disabled") +'>');
			// Input type number doesn't support maxlength
		});
		$('#board').append('<br />');
	})
}

