// Déclaration des variables
const logoutBtn = document.getElementById("logout");
const settingsBtn = document.getElementById("settings");
const closeModalBtn = document.getElementById("close");
const deleteAccountBtn = document.getElementById("deleteaccount");
const inputPassword = document.getElementById("password");
const modal = document.getElementById("modal");

// Afficher la fenêtre de paramètres
function displayModal(){

	if(modal.style.display !== "block"){
		$('#modal').fadeIn();
	}
	else{
		$('#modal').fadeOut();
	}
}

// Supprimer un utilisateur
function deleteUser(){

    // Déclaration de la variable id
	const id = parseInt(getCookieValue('userId'));
    
    // Si le champ est vide
	if(inputPassword.value === ""){ error("password", "Le champ est vide"); passwordOk = false} else { error("password"); passwordOk = true}

    // Si les champs passent les contrôles
	if(passwordOk === true){
		fetch('https://localhost:3000/api/users/' + id, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+ token
			},
			body: JSON.stringify({
                userId: userId,
				password: inputPassword.value
			})
		})
		.then((res) => {

            // Réactivité en fonction du code réponse du serveur
            switch(res.status){
                case 401:
                    error("password", "Mot de passe incorrect");
                    break;
                case 200:
                    document.cookie = "token=";
                    document.cookie = "userId=";
                    document.location.href = "/";                   
                    break;
            }
        })
		.catch(err => console.log(err));
	}
}

// Déconnexion
function logout(){
	document.cookie = "token=";
	document.cookie = "userId=";
	document.cookie = "isAdmin=";
	document.location.href = "/";
}

// Ajout des évènements
deleteAccountBtn.addEventListener("click", deleteUser);
settingsBtn.addEventListener("click", displayModal);
closeModalBtn.addEventListener("click", displayModal);
logoutBtn.addEventListener("click", logout);