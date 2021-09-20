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
rhit.counter = 0;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

// rhit.ClassName = class {
// 	constructor() {

// 	}

// 	methodName() {

// 	}
// }

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	const minus = document.getElementById("minus");
	const reset = document.getElementById("reset");
	const plus = document.getElementById("plus");
	let counter = document.getElementById("count");

	minus.onclick = (event) => {
		rhit.counter -= 1;
		counter.innerHTML = `${rhit.counter}`;
	}
	reset.onclick = (event) => {
		rhit.counter = 0;
		counter.innerHTML = `${rhit.counter}`;
	}
	plus.onclick = (event) => {
		rhit.counter += 1;
		counter.innerHTML = `${rhit.counter}`;
	}


	const blue = document.getElementById("blue");
	const red = document.getElementById("red");
	const green = document.getElementById("green");
	const purple = document.getElementById("purple");
	let color = document.getElementById("outer-color-div")

	blue.onclick = (event) => {
		color.innerHTML = `<div id="color-div" style="background-color:blue">BLUE</div>`;
	}
	red.onclick = (event) => {
		color.innerHTML = `<div id="color-div" style="background-color:red">RED</div>`;
	}
	green.onclick = (event) => {
		color.innerHTML = `<div id="color-div" style="background-color:green">GREEN</div>`;
	}
	purple.onclick = (event) => {
		color.innerHTML = `<div id="color-div" style="background-color:purple">PURPLE</div>`;
	}
};

rhit.main();
