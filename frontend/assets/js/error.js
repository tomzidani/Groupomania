function error(input, message){

    if (input == "name") {
        field = document.getElementById("error-name");
        input = inputName
    }
    if (input == "surname") {
        field = document.getElementById("error-surname");
        input = inputSurname
    }
    if (input == "email") {
        field = document.getElementById("error-email");
        input = inputEmail
    }
    if (input == "password") {
        field = document.getElementById("error-password");
        input = inputPassword
    }
    if (input == "repassword") {
        field = document.getElementById("error-repassword");
        input = inputRepassword
    }
    if (input == "gender") {
        field = document.getElementById("error-gender");
        input = inputGender
    }
    if(input == "post") {
        field = document.getElementById("error-post");
        input = inputPost;
    }

    // Si il n'y a pas de message on retire le message d'erreur affiché
    if (!message) {
        input.classList.remove("error")
        field.innerHTML = "";
    }

    // Sinon, on affiche un message d'erreur
    else {
        input.classList.add("error");
        field.innerHTML = message;
    }
}