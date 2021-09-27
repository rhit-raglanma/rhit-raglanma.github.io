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

rhit.Game = class {

	static State = {
		WIN: "You won",
		PLAYING: "playing",
	}

	constructor() {
		this.state = rhit.Game.State.PLAYING;
		this.board = [];
		for (let k = 0; k < 7; k++) {
			this.board[k] = false;
			
		}

		for (let i = 0; i < 100; i++) {
			this.pressedButtonAt(Math.floor(Math.random()*7));
			this.state = rhit.Game.State.PLAYING;
		}

		this.moves = 0;
		
	}

	pressedButtonAt(buttonIndex) {

		if (this.state == rhit.Game.State.WIN) {
			return;
		}

		this.board[buttonIndex] = !this.board[buttonIndex];
		
		if (buttonIndex-1 >= 0) {
			this.board[buttonIndex-1] = !this.board[buttonIndex-1];
		}
		if (buttonIndex+1 <= 6) {
			this.board[buttonIndex+1] = !this.board[buttonIndex+1];
		}

		this.moves++;
		// console.log(this.board[buttonIndex-1], this.board[buttonIndex], this.board[buttonIndex+1]);
		this._checkForGameOver();
	}

	_checkForGameOver() {
		let s = this.board[0];
		for(let b of this.board) {
			if (b != s) {
				return;
			}
		}
		this.state = rhit.Game.State.WIN;
	}
}



rhit.pageController = class {
	constructor() {
		this.game = new rhit.Game;
		const buttons = document.querySelectorAll(".button");

		for (const button of buttons) {
			button.onclick = (event) => {
				const buttonIndex = parseInt(button.dataset.buttonIndex);
				this.game.pressedButtonAt(buttonIndex);

				this.updateView();
			}
		}

		document.querySelector("#newGameButton").onclick = (event) => {
			this.game = new rhit.Game();
			this.updateView();
		}

		this.updateView();
	}

	updateView() {
		const buttons = document.querySelectorAll(".button");
		buttons.forEach((button) => {
			const buttonIndex = parseInt(button.dataset.buttonIndex);
			if (this.game.board[buttonIndex]) {
				button.innerHTML = `1`;
				button.style.color = "black";
				button.style.background = "gold";
			} else {
				button.innerHTML = `0`;
				button.style.color = "white";
				button.style.background = "#444";
			}
		});

		if (this.game.state == rhit.Game.State.WIN) {
			document.getElementById("gameStateText").innerHTML = `You won in ${this.game.moves} moves`;
		} else if (this.game.moves > 0) {
			document.getElementById("gameStateText").innerHTML = `You have taken ${this.game.moves} moves so far.`;
		} else {
			document.getElementById("gameStateText").innerHTML = `Make the buttons match.`;
		}
	}

}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	//console.log("Ready");
	new rhit.pageController();
};

rhit.main();
