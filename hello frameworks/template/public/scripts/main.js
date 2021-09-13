/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

rhit.counter = 0;

/** function and class syntax examples */
// rhit.functionName = function () {
// 	/** function body */
// 	console.log("Ready")
// };

rhit.main = function () {
	//console.log("Ready");
	let buttons = document.querySelectorAll("#counterButtons button");
	// for (let i = 0; i < buttons.length; i++) {
	// 	const button = buttons[i]
	// 	button.onclick = (event) => {
	// 		console.log(`You pressed`, button)
	// 	}
	// }

	for (const button of buttons) {
		button.onclick = (event) => {
			const dataAmount = parseInt(button.dataset.amount);
			const dataIsMultiplication = button.dataset.isMultiplication === "true";
			console.log(`Amount: ${dataAmount}, Mult: ${dataIsMultiplication}`);
		}
	}
};

rhit.main();
