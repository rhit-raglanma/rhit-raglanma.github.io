var counter = 0;

function main() {
    console.log("Ready");
    document.querySelector("#decButton").onclick = (event) => {
        counter = counter - 1;
        updateView();
    }
    document.querySelector("#incButton").onclick = (event) => {
        counter = counter + 1;
        updateView();
    }
    document.querySelector("#resetButton").onclick = (event) => {
        counter = 0;
        updateView();
    }
}

function updateView() {
    document.querySelector("#counterText").innerHTML = "Counter = " + counter;
}

main();