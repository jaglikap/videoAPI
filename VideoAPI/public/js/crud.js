/*CRUD*/
function loadVideos(){
      let url="/api/videos";
			fetch(url)
       		.then(response => {
         		return response.json();
       		})
       		.then(data => {
         		this.videos = data.data;
       		}).catch(err => {
         		console.log("erreur dans le get : " + err)
       		});
    }

function uploadVideo(formData){
      let url = "/api/videos";
      console.log(formData);
      fetch(url, {
        method: "POST",
        body: formData
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                // Maintenant res est un vrai objet JavaScript
          let div = document.querySelector("#responseAjout");
    div.innerHTML = res.msg;      
          console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
}