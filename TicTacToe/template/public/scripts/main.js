/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.pageController = class {
	constructor() {
		this.game = new rhit.Game();
	}

	UpdateView() {

	}
}

rhit.Game = class {

	static Mark = {
		X: "X",
		O: "O",
		NONE: " ",
	}

	static State = {
		X_TURN: "X's Turn",
		O_TURN: "O's Turn",
		X_WIN: "X Wins!",
		O_WIN: "O Wins!",
		TIE: "Tie Game",
	}

	constructor() {
		this.state = rhit.Game.State.X_TURN;
		this.board = [];
		for (let k = 0; k < 9; k++) {
			this.board.push(rhit.Game.Mark.NONE);
		}
		console.log('this.board = ', this.board);
		console.log('this.state = ', this.state);
	}

	pressedButtonAtIndex(buttonIndex) {

	}

	getMarkAtIndex(buttonIndex) {

	}

	getState() {
		return "";
	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	new rhit.pageController();
};

rhit.main();
