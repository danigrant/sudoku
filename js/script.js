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


	$('#board').on('keydown', '.sudoku-box', function(e){
		if([8,9,37,38,39,40,48,49,50,51,52,53,54,55,56,57,13,46,96,97,98,99,100,101,102,103,104,105].indexOf(e.which) === -1){
			e.preventDefault();
		}
	});
	$('#board').on('focus', '.sudoku-box', function(e){
		$(this).select();
	});
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
					solution: this.solution[i-1][j-1]
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
	sudokuGame.board.forEach(function(currentRow) {
		currentRow.forEach(function(currentEl) {
			console.log(currentEl);
			$('#board').append('<input class="sudoku-box" type="text" min="0" max="9" maxlength="1" value="'+ currentEl["value"]+'" '+ (currentEl.mutable ? "": "disabled") +'>');
			// Input type number doesn't support maxlength
		});
		$('#board').append('<br />');
	})
}