// Si l'utilisateur est connecté, on le redirige
if (getCookieValue('token') !== '') {
	document.location.href = '/home';
}

// Déclaration des variables
const registerBtn = document.getElementById('register');
const inputName = document.getElementById('name');
const inputSurname = document.getElementById('surname');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const inputRepassword = document.getElementById('repassword');
const inputGender = document.getElementById('gender');

// Création de la fonction d'inscription
function register() {
	// Déclaration des variables
	const name = inputName.value;
	const surname = inputSurname.value;
	const email = inputEmail.value;
	const password = inputPassword.value;
	const repassword = inputRepassword.value;
	const gender = inputGender.value;
	const nameRegex = /^[a-zA-Z ]+$/;
	const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

	// Si les champs sont vides
	if (name != '') {
		nameOk = true;
		error('name');
	} else {
		nameOk = false;
		error('name', 'Les champs sont vides');
	}
	if (surname != '') {
		surnameOk = true;
		error('surname');
	} else {
		surnameOk = false;
		error('surname', 'Les champs sont vides');
	}
	if (email != '') {
		emailOk = true;
		error('email');
	} else {
		emailOk = false;
		error('email', 'Les champs sont vides');
	}
	if (password != '') {
		passwordOk = true;
		error('password');
	} else {
		passwordOk = false;
		error('password', 'Les champs sont vides');
	}
	if (repassword != '') {
		repasswordOk = true;
		error('repassword');
	} else {
		repasswordOk = false;
		error('repassword', 'Les champs sont vides');
	}
	if (gender != '') {
		genderOk = true;
		error('gender');
	} else {
		genderOk = false;
		error('gender', 'Les champs sont vides');
	}

	// Si les champs contiennent un certain nombre de caractères
	if (name.length >= 2 && name.length <= 30) {
		nameOk = true;
		error('name');
	} else {
		nameOk = false;
		error('name', 'Votre nom doit contenir entre 2 et 30 caractères');
	}
	if (surname.length >= 2 && name.length <= 30) {
		surnameOk = true;
		error('surname');
	} else {
		surnameOk = false;
		error('surname', 'Votre prénom doit contenir entre 2 et 30 caractères');
	}
	if (email.length >= 6 && name.length <= 50) {
		emailOk = true;
		error('email');
	} else {
		emailOk = false;
		error('email', 'Votre email doit contenir entre 6 et 50 caractères');
	}
	if (password.length >= 8 && name.length <= 50) {
		passwordOk = true;
		error('password');
	} else {
		passwordOk = false;
		error(
			'password',
			'Votre mot de passe doit contenir entre 8 et 50 caractères'
		);
	}

	// Si les caractères sont valides
	if (nameRegex.test(name)) {
		nameOk = true;
		error('name');
	} else {
		nameOk = false;
		error('name', 'Votre nom contient des caractères invalides');
	}
	if (nameRegex.test(surname)) {
		surnameOk = true;
		error('surname');
	} else {
		surnameOk = false;
		error('surname', 'Votre prénom contient des caractères invalides');
	}
	if (emailRegex.test(email)) {
		emailOk = true;
		error('email');
	} else {
		emailOk = false;
		error('email', 'Votre adresse e-mail est invalide');
	}
	if (passwordRegex.test(password)) {
		passwordOk = true;
		error('password');
	} else {
		passwordOk = false;
		error(
			'password',
			'Votre mot de passe doit contenir 1 majuscule, 1 minuscule et 1 chiffre'
		);
	}
	if (repassword === password) {
		repasswordOk = true;
		error('repassword');
	} else {
		repasswordOk = false;
		error('repassword', 'Les mots de passe ne correspondent pas');
	}

	// Si tout les champs sont bons
	if (
		nameOk === true &&
		surnameOk === true &&
		emailOk === true &&
		passwordOk === true &&
		repasswordOk === true &&
		genderOk === true
	) {
		// Envoi des données
		fetch('https://localhost:3000/api/auth/signup', {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: name,
				surname: surname,
				email: email,
				password: password,
				gender: gender,
			}),
		})
			.then(function (res) {
				status = res.status;
				return res.json();
			})
			.then(function (data) {
				// Reset des erreurs
				error('email');

				// Si l'utilisateur est créé, on ajoute les cookies de token
				// et d'userId puis on redirige vers home.html
				switch (status) {
					case '201':
						// Déclaration du token et de l'userId
						const token = data.token;
						const userId = data.userId;
						const isAdmin = data.isAdmin;

						// Création de la date d'expiration
						var expDate = new Date();
						expDate.setHours(expDate.getHours() + 4);

						// Ajout du cookie et redirection
						document.cookie = 'token=' + token + '; expires= ' + expDate;
						document.cookie = 'userId=' + userId + '; expires= ' + expDate;
						document.cookie = 'isAdmin=' + isAdmin + '; expires= ' + expDate;
						document.location.href = '/home';

						break;
					case '409':
						error('email', "L'adresse e-mail est déjà utilisée");
						break;
				}
			});
	}
}

// Ajout des évènements
registerBtn.addEventListener('click', register);
