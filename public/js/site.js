function newLine(){
    let button = document.getElementById("newLineBtn");
    let form = document.getElementById("lineForm");
    button.addEventListener("click", function(){
        form.classList.remove("d-none");
        button.classList.add("d-none");
        document.getElementById("num").focus();
    });
}

window.onload = () => {
    // toggleVocab();
    newLine();
    window.scrollTo(0, document.body.scrollHeight);
}