var Accueil = Vue.extend({
  name:'Accueil',
  template:'#accueil'
});

var AjouterVideo=Vue.extend({
name:'Accueil',
template:'#ajout-video',
  data:function(){
   return {
     title:"",
    videourl:"",
      videoid:"",
      description:""
   }
  },
  methods:{
    ajouterVideo:function(event){
       let form = event.target;
    let donneesFormulaire = new FormData(form);
    this.$emit('add-v',donneesFormulaire);
    }
  },

});

var Videos=Vue.extend({
  name:'Videos',
  template:'#videos',
  props:["video","videos"],
  methods:{
    supprimerVideo:function(video){
      this.$emit('delete-v',video);
    }
  }
});
var DetailsVideo = Vue.extend({
  name:'detvideo',
  template: '#detvideo-template',
  //props: ["video"],
  data:function(){
    return {

    }
  }
});

var Video=Vue.extend({
  name:'mavideo',
  template:'#video-temp',

 // props:["video","id"],
  data:function(){
    return {
      id:"",
      videoid:"",
      videourl:"",
      title:"",
      description:"",
    }
  },
  methods:{
    modifierVideo:function(event,idv){
      console.log("idv.video: "+idv.videoid);
      let form = event.target;
      
      let donneesFormulaire = new FormData(form);
      console.log(donneesFormulaire);
      if(document.getElementById("title").value === ''){
        console.log("NULL title");
        donneesFormulaire.set("title",document.getElementById("title").placeholder);
      }
      if(document.getElementById("description").value === ''){
        console.log("NULL description");
        donneesFormulaire.set("description",document.getElementById("description").placeholder);
      }
      donneesFormulaire.set("videoid",document.getElementById("videoid").placeholder);
      donneesFormulaire.set("videourl",document.getElementById("videourl").placeholder);

      console.log(document.getElementById("videoid").placeholder);

     // console.log(donneesFormulaire.get("title"));
      //console.log("FORM VIDEOID: " +donneesFormulaire.videoid);
      //console.log("FORM VIDEOURL: " +donneesFormulaire.videourl);
      //console.log("FORM VIDEO TITLE: " +donneesFormulaire.title);
      //console.log("FORM VIDEO DESCRIPTION: " +donneesFormulaire.description);
      this.$emit('edit-v',{'data':donneesFormulaire,'id':idv._id, 'videoid':idv.videoid});
    }
  }
});

var router = new VueRouter({
  routes:[
    {path: '/', component: Accueil},
    {path: '/ajout', component: AjouterVideo},
    {name:'Videos',path: '/videos', component: Videos, props: true},
    {name:'mavideo',path: '/videos/:id', component: Video, props: true },
    {name:'detvideo',path: '/videos/:id', component: DetailsVideo, props: true }
   // {path: '/ajout', component: NewVideo}
  ]
});

new Vue({
  el:'#app',
  router: router,
  data:{
    videos:[]
  },
  mounted:function(){
    console.log("vue mounted");
    this.loadVideos();
  },

watch: {
    // call again the method if the route changes
    '$route': 'loadVideos',
    videos: 'loadVideos'
  },

  methods:{
    editVideo:function(formData){
      let id=formData.id;
      console.log("VIDEO ID DB: "+formData.id);
      console.log("AFTER donneesFormulaire:");
      console.log(formData.data);
      let url = "/api/videos/" + id;
      fetch(url, {
        method: "PUT",
        body: formData.data
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                // Maintenant res est un vrai objet JavaScript
                let div = document.querySelector("#alertmodif");
            div.innerHTML = "Modification réussie !";
                
                console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });/**/
      //console.log()
      //TODO
    },
    deleteVideo:function(event){
      console.log(event._id);
      let url = "/api/videos/" + event._id;

    /**/
    fetch(url, {
        method: "DELETE",
    })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                // Maintenant res est un vrai objet JavaScript
                console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
    },
    addVideo:function(formData){
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
            let div = document.querySelector("#alertajout");
            div.innerHTML = "Téléchargement réussi !";
          //console.log(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
    },
    loadVideos:function(){
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
  }
});