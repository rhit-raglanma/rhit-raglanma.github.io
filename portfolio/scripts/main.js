const btn = document.querySelector("#scrollUp");

btn.onclick = (event) => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
}