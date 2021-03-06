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
			rhit.updateCounter(dataAmount, dataIsMultiplication);
		}

	}

	// $("#counterButtons button").click((event) => {
	// 	const dataAmount = $(event.target).data("Amount");
	// 	const dataIsMultiplication = $(event.target).data("isMultiplication");
	// 	this.updateCounter(dataAmount, dataIsMultiplication)
	// });

};

rhit.updateCounter = function (amount, isMultiplication) {
	if (isMultiplication) {
		rhit.counter = rhit.counter * amount;
	} else {
		rhit.counter = rhit.counter + amount;
	}
	document.querySelector("#counterText").innerHTML = `Count = ${rhit.counter}`;
	//$("counterText").html(`Count = ${rhit.counter}`)
}

rhit.main();
