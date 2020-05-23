// Déclaration des variables
const postBtn = document.getElementById('post');
const inputPost = document.getElementById('message');
const inputFile = document.getElementById('picture');
const postsDiv = document.getElementById('posts');
const regex = /^[a-zA-Z0-9 _.,!()&éèàç&#@']+$/;

// Récupération des derniers messages
fetch('https://localhost:3000/api/posts', {
	headers: { Authorization: 'Bearer ' + token },
})
	.then((res) => res.json())
	.then((data) => {
		// Boucle affichant progressivement chaque post dans le feed
		for (let i = 0; i < data.length; i++) {
			// Création du  HTML
			let articlePost = '<article class="post">';
			articlePost +=
				'<div class="infos">' +
				data[i].name.toUpperCase() +
				' ' +
				data[i].surname;

			// Si le post appartient à l'utilisateur ou si l'utilisateur est admin
			if (isAdmin === 1 || userId === data[i].userId) {
				articlePost +=
					'<span class="edit"><i class="fas fa-pencil-alt" onclick="editPost(' +
					data[i].id +
					', ' +
					data[i].userId +
					')"></i>';
				articlePost +=
					'<i class="fas fa-trash" onclick="deletePost(' +
					data[i].id +
					', ' +
					data[i].userId +
					')"></i></span>';
				articlePost +=
					'</div><div class="edit" id="post' +
					data[i].id +
					'"><span class="error" id="error-edit"></span><textarea id="post' +
					data[i].id +
					'"></textarea>';
				articlePost +=
					'<div class="button b-red white" id="post' +
					data[i].id +
					'">Modifier</div></div>';
			} else {
				articlePost += '</div>';
			}
			articlePost +=
				'<p id="post' + data[i].id + '">' + data[i].message + '</p>';

			if (data[i].picture !== '' && data[i].picture !== null) {
				articlePost += '<img src="' + data[i].picture + '">';
			}

			articlePost += '</article>';

			// Ajout du HTML
			postsDiv.innerHTML += articlePost;
		}
	})
	.catch((err) => console.log(err));

// Ajouter un post
function addPost() {
	// Si l'utilisateur n'est pas connecté
	if (!userId) {
		document.location.href = '/';
	}

	// Vérification du message
	if (inputPost.value !== '') {
		if (inputPost.value.length >= 5 && inputPost.value.length <= 350) {
			if (regex.test(inputPost.value)) {
				postOk = true;
				error('post');
			} else {
				error('post', 'Votre message contient des caractères invalides');
				postOk = false;
			}
		} else {
			error('post', 'Votre message doit contenir entre 5 et 350 caractètres');
			postOk = false;
		}
	} else {
		error('post', 'Le champ est vide');
		postOk = false;
	}

	// Si le message a passé les vérifications
	if (postOk === true) {
		// Déclaration des variables
		var form = $('#applicationForm')[0];
		var data = new FormData(form);

		var formData = new FormData(form);
		formData.append('userId', userId);

		// Envoi des informations
		$.ajax({
			type: 'POST',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer ' + token);
			},
			enctype: 'multipart/form-data',
			url: 'https://localhost:3000/api/posts',
			data: formData,
			processData: false,
			contentType: false,
			cache: false,
			success: (res) => {
				location.reload();
			},
			error: (e) => {
				console.log(e);
			},
		});
	}
}

// Modifier un post
function editPost(id, userPostId) {
	// Déclaration des variables
	const message = document.querySelector('p#post' + id);
	const editForm = document.querySelector('div.edit#post' + id);
	const editText = document.querySelector('textarea#post' + id);
	const editBtn = document.querySelector('div.button#post' + id);

	// Affichage du formulaire de modification
	editText.value = message.textContent;
	message.style.display = 'none';
	editForm.style.display = 'block';

	// Ajout de l'évènement
	editBtn.addEventListener('click', function () {
		// Vérification du message
		if (editText.value !== '') {
			if (editText.value.length >= 5 && editText.value.length <= 350) {
				if (regex.test(editText.value)) {
					editOk = true;
				} else {
					editOk = false;
				}
			} else {
				editOk = false;
			}
		} else {
			editOk = false;
		}

		// Si tout est ok
		if (editOk) {
			// Envoi des données
			fetch('https://localhost:3000/api/posts/' + id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + token,
				},
				body: JSON.stringify({
					userId: userId,
					userPostId: userPostId,
					isAdmin: isAdmin,
					message: editText.value,
				}),
			})
				.then((res) => {
					if (res.status === 200) {
						location.reload();
					}
				})
				.catch((err) => console.log(err));
		}
	});
}

// Supprimer un post
function deletePost(id, userPostId) {
	if (id) {
		// Envoi des données
		fetch('https://localhost:3000/api/posts/delete/' + id, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token,
			},
			body: JSON.stringify({
				userId: userId,
				userPostId: userPostId,
				isAdmin: isAdmin,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					location.reload();
				}
			})
			.catch((err) => console.log(err));
	}
}

// Ajout des évènements
$(document).ready(() => {
	$('#post').click((event) => {
		event.preventDefault();
		addPost();
	});
});
