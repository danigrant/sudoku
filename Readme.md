# Super user do ku.

http://danigrant.github.io/sudoku/

## The Stack
Sudoku is built with LESS/CSS/JS/JQuery.

## Exception Handling

Because the project only called for one sudoku board on the site, it’s not so much a complete system, but an interface to a future implementation of sudoku.

I wanted it to be built so that anyone could write a module for importing or generating sudoku boards and easily plug it in, completing a robust sudoku web app.

The sudoku object accepts an array of nine, nine-character strings as a board, stored as a Javascript object for ease of use.

Although this implementation of sudoku uses a hardcoded board, future implementations will hopefully generate or import the board, and the program needs to catch and handle exceptions when the board is made up of illegal characters.

In my implementation, I built a function for validating the board before the user even sees it loaded to the DOM, so that in case of an illegal character set, the board can be re-generated or swapped out before the user receives a bad sudoku experience.

The function `validCharacter` accepts empty strings and integers between one and nine, or else returns a console.error, with the message: `Input character at [row] and [column] is not recognized. Accepted characters are [and then lists the accepted characters]`

Exceptions are also checked at every user input. On every keydown, the program checks the keycode against an array of allowed inputs and prevents the addition of any key outside of the legal keycode set to the board. 

Moving forward to a dynamic system with generated or imported boards, it would also be important to handle null and undefined boards, as well as boards that have too many or too few characters.

## Decisions: Step-by-Step or All-At-Once Validation
On initial setup, each sudoku input-box object locally stores its correct solution for easy lookup. The question still remains - should the game validate each box play by play, or should the validation happen for the whole board at once, right at the end?

One way to set up the game is to keep a key-value store of input-boxes to booleans. Each time the player changes a value, that value is checked against its solution and its truthiness is kept in a key-value store. At the end, if that set contains the value “false”, then at least one value on the board is incorrect. 

Another way is to wait until the end to perform all the calculations at once. Iterate through the board, compare the current value to the solution. If one is false, the board is wrong.

The second option is favorable in terms of both space and time efficiency. Not only does the second option not involve any extra storage space, it offers the possibility of iterating over fewer of the sudoku input-boxes. In the second scenario, if the function finds even one false comparison of value to solution, it can break out of the function, stop iterating and return false. At worst case, the function iterates once through the entire sudoku matrix. The first scenario, on the other hand, offers a best case of one calculation per object and a likely worse case scenario of many calculations per object, if the user goes back and tries multiple values for any of the squares.

## The State of the Union: What would I fix with another 24 hours?

Currently, there are inconsistencies between using zero-indexed and one-indexed iterators to loop through the board. The board starts at index 1, but many of the for loops start at index 0. This is inelegant code. I left quick reminders in the comments next to the loops of the differences in indexes, but this would not be a good solution if I were working on this for an extended period of time or with another developer.

Also inelegant: every time the program iterates over the board, it does so manually - without a function call - leaving redundant code. This would be problematic in maintaining the code - I could easily find a mistake in the iteration, patch it in some places and forget to fix it in others. The iteration function should be abstracted into a higher order function to make the code base less redundant and less vulnerable to human error in maintenance.

## Redundant Functions

The function to validate the full board and validate the boxes completed are very similar and could be combined into one function to reduce redundancy, or at least break up the functions into smaller modules that could be pieced together. This would also help with the namespace because validateBox and validateBoard are similar enough to cause confusion - one function that depended on the arguments passed in to know if it should validate the full board or just the boxes completed would help clear up redundancies in the code base as well as in the namespace.
