// Déclaration des variables
const fieldUser = document.getElementById('field-user-infos');
const textareaPost = document.getElementById('message');
const userId = parseInt(getCookieValue('userId'));
const isAdmin = parseInt(getCookieValue('isAdmin'));
const token = getCookieValue('token');

if (!userId) {
	document.location.href = '/';
}

fetch('https://localhost:3000/api/users/' + userId, {
	headers: { Authorization: 'Bearer ' + token },
})
	.then((res) => res.json())
	.then((data) => {
		const user = data;
		fieldUser.textContent = user.name.toUpperCase() + ' ' + user.surname;
		textareaPost.setAttribute(
			'placeholder',
			'Que voulez-vous dire, ' + user.surname + '?'
		);
	})
	.catch((err) => console.log(err));
