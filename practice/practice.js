
// Create Alert with the message "hi"

alert("hi");

// Change the text message inside paragrpah with id greeting to a different language greeting



//Create a function square
let square = (x) => {
    return x*x;
};
document.getElementById("output1").innerHTML += square(5);

//Create a function sum with two parameters a and b
let sum = (x,y) => {
    return x + y;
};
document.getElementById("output2").innerHTML += sum(8,9);


/*hard coded fuctorial*/
let calc5fact = () => 5*4*3*2*1;
document.getElementById("output3").innerHTML += calc5fact();

/* convert to arrow function  */
// function factorial(x) {
// 	if (x == 1) {
// 		return 1;
// 	} else {
// 		return x * factorial(x-1);
// 	}
// }

let factorial = (x) => {
    for (i = x-1; i > 1; i--) x*=i;
    return x;
}; 

document.getElementById("output4").innerHTML += factorial(5);

