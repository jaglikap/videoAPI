const express  = require('express');
const app      = express();
const port     = process.env.PORT || 8080;
const server   = require('http').Server(app);
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

const mongoDBModule = require('./app_modules/mongo');

// Pour les formulaires standards
const bodyParser = require('body-parser');
// pour les formulaires multiparts
var multer = require('multer');
var multerData = multer();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Cette ligne indique le répertoire qui contient
// les fichiers statiques: html, css, js, images etc.
app.use(express.static(__dirname + '/public'));
// Paramètres standards du modyle bodyParser
// qui sert à récupérer des paramètres reçus
// par ex, par l'envoi d'un formulaire "standard"
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Lance le serveur avec express
server.listen(port);

console.log("Serveur lancé sur le port : " + port);

//------------------
// ROUTES
//------------------
// Utile pour indiquer la home page, dans le cas
// ou il ne s'agit pas de public/index.html
/*app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
*/


// Test de la connexion à la base
app.get('/api/connection', function(req, res) {
	// Pour le moment on simule, mais après on devra
	// réellement se connecte à la base de données
	// et renvoyer une valeur pour dire si tout est ok
   mongoDBModule.connexionMongo(function(err, db) {
   	let reponse;

   	if(err) {
   		console.log("erreur connexion");
   		reponse = {
   			msg: "erreur de connexion err=" + err
   		}
   	} else {
   		reponse = {
   			msg: "connexion établie"
   		}
   	}
   	res.send(JSON.stringify(reponse));

   });
});
// On va récupérer des restaurants par un GET (standard REST) 
// cette fonction d'API peut accepter des paramètres
// pagesize = nombre de restaurants par page
// page = no de la page
// Oui, on va faire de la pagination, pour afficher
// par exemple les restaurants 10 par 10
app.get('/api/videos', function(req, res) { 
  // Si présent on prend la valeur du param, sinon 1
    let page = parseInt(req.query.page || 0);
    // idem si present on prend la valeur, sinon 10
    let pagesize = parseInt(req.query.pagesize || 10);
    let nom = req.query.title;

  //if(nom) {
      // find by name
   /* mongoDBModule.findVideosByName(nom, page, pagesize, function(data) {
      var objdData = {
        msg:"restaurant recherchés par nom avec succès",
        data: data
      }
      res.send(JSON.stringify(objdData)); 
    }); */
    //} else {
      // find normal
    mongoDBModule.findVideos(page, pagesize, function(data) {
      var objdData = {
        msg:"restaurant recherchés avec succès",
        data: data
      }
      res.send(JSON.stringify(objdData)); 
    }); 

    //}
});



// ICI c'est autorisé par la norme REST car
// "count" est un mot réservé, on ne risque pas de
// le prendre pour une TABLE ou une collection
// cf la partie "reserved words" de
// https://blog.octo.com/designer-une-api-rest/
app.get('/api/videos/count', function(req, res) { 
  // on renvoie le nombre de restaurants
  mongoDBModule.countVideos(function(data) {
    var objdData = {
      msg:"Count effectué avec succès",
      data: data
    }
    res.send(JSON.stringify(objdData)); 
  });       
});
// Récupération d'un seul restaurant par son id
app.get('/api/videos/:id', function(req, res) {
	var id = req.params.id;

 	mongoDBModule.findVideoById(id, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
 
});

// Ajout d'une video par envoi d'un formulaire
// On fera l'insert par un POST, c'est le standard REST
app.post('/api/videos', multerData.fields([]), function(req, res) {
	// On supposera qu'on ajoutera un restaurant en 
	// donnant son nom et sa cuisine. On va donc 
	// recuperer les données du formulaire d'envoi
	// les params sont dans req.body même si le formulaire
	// est envoyé en multipart

 	mongoDBModule.createVideo(req.body, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
});

// Modification d'un restaurant, on fera l'update par
// une requête http PUT, c'est le standard REST
app.put('/api/videos/:id', multerData.fields([]), function(req, res) {
	var id = req.params.id;

 	mongoDBModule.updateVideo(id, req.body, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
});

// Suppression d'une video
// On fera la suppression par une requête http DELETE
// c'est le standard REST
app.delete('/api/videos/:id', function(req, res) {
	var id = req.params.id;

 	mongoDBModule.deleteVideo(id, function(data) {
 		res.send(JSON.stringify(data)); 
 	});
})