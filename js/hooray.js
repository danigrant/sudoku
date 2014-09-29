//called upon correct completion of board
function hooray() {
	//fade out the buttons
	$('.button').each(function() {
		$(this).fadeTo(2000*Math.random(),0);
	});

	//fade out the board
	$('input').each(function() {
		$(this).fadeTo(2500*Math.random(),0);
	});

	//bring in the hidden congratulatory elems
	$('.congrats').fadeTo(3000, 1, function() {
		//click here to play again fades in
		$('.back').fadeTo(1000, 1);
	});

	//listen for 'go back'
	$('.back').click(function() {
		//reverse the fade outs, bring everything back in

		//fade out the congratulatory elems
		$('.back').fadeTo(25, 0);
		$('.congrats').fadeTo(50, 0);

		//reset the board
		$('input').each(function() { if($(this).prop("disabled")) {} else { $(this).val(" "); }});


		//fade in the board
		$('input').each(function() {
			$(this).fadeTo(5000*Math.random(),1);
		});

		//fade in the buttons
		$('.button').each(function() {
			$(this).fadeTo(2000*Math.random(),1);
		});

	})
}