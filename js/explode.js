function explode() {
	console.log("fading out");
	//fade out the buttons
	$('.option1').each(function() {
		$(this).fadeTo(2000*Math.random(),0);
	});

	//fade out the board
	$('input').each(function() {
		$(this).fadeTo(2500*Math.random(),0);
	});

	//bring in the hidden congratulatory elems
	$('.congrats').fadeTo(3500, 1, function() {
		//click here to play again fades in
		$('.back').fadeTo(1000, 1);
	});
}