// Si l'utilisateur est connecté, on le redirige
if(getCookieValue('token') !== ""){
	document.location.href = "/home";
}

// Déclaration des variables
const loginBtn = document.getElementById("login");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

// Création de la fonction de connexion
function login(){

	// Déclaration des regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	// Si les champs sont vides
	if(inputEmail.value !== ""){ emailOk = true; error("email"); } else { emailOk = false; error("email", "Le champ est vide"); }
	if(inputPassword.value !== ""){ passwordOk = true; error("password"); } else { passwordOk = false; error("password", "Le champ est vide"); }

	// Si l'email est valide
	if(emailRegex.test(inputEmail.value)){ emailOk = true; error("email"); } else { emailOk = false; error("email", "L'adresse e-mail est invalide"); }

	// Si tout est bon
	if(emailOk === true && passwordOk === true){

		// Envoi des informations au serveur
		fetch('https://localhost:3000/api/auth/login', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: inputEmail.value,
				password: inputPassword.value
			})
		})
	    .then(function(res) {
	    	status = res.status;
	        return res.json();
	    })
	    .then(function(data) {

	    	// Réinitialisation des erreurs
            error("email");
            error("password");

            // Si c'est ok, on démarre la session, sinon on affiche une erreur.
	    	switch(status){
	    	case '200':
	    		// Déclaration du token
		       	const token = data.token;
		       	const userId = data.userId;
				const isAdmin = data.isAdmin;

		       	// Création de la date d'expiration
		       	var tomorrow = new Date();
		       	tomorrow.setDate(tomorrow.getDate() + 1);

		       	// Ajout du cookie et redirection
		       	document.cookie = "token="+ token +"; expires= "+ tomorrow;
				document.cookie = "userId="+ userId +"; expires= "+ tomorrow;
				document.cookie = "isAdmin="+ isAdmin +"; expires= "+ tomorrow;
				document.location.href = "/home";
				break;

			case '404':
				error("email", "Utilisateur introuvable");
				break;
            case '401':
                error("password", "Mot de passe incorrect");
                break;				
	       	}        
	    })
	}
}

// Ajout des évènements
loginBtn.addEventListener("click", login);