// Si l'utilisateur est connecté, on le redirige
if(getCookieValue('token') === ""){
	document.location.href = "/";
}

// Déclaration des variables
var postFile = document.getElementById("picture");
const pictureDiv = document.getElementById("picture-preview");

// Preview de l'image
function preview() {
	var fileObject = this.files[0];
	var fileReader = new FileReader();
	fileReader.readAsDataURL(fileObject);
	fileReader.onload = function() {
		var result = fileReader.result;
		pictureDiv.style.backgroundImage = "url('"+ result + "')";
	}
};

// Post d'un message
function post(){

	const userId = getCookieValue('userId');

	var filename = "";
	
	if(postFile.value !== ""){
		var fullPath = postFile.value;
		if (fullPath) {
		    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		    filename = fullPath.substring(startIndex);
		    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
		        filename = filename.substring(1);
		    }
		}
	}

	fetch('https://localhost:3000/api/posts', {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			userId: userId,
			message: postInput.value,
			picture: filename
		})
	})
	.then((res) => {
		status = res.status
		return res.json();
	})
	.then((data) => {
		switch(status){
			case '201':
			location.reload();
			break;
		}
	})
	.catch(err => console.log(err));
}
// Ajout des évènements
postFile.addEventListener("change", preview);