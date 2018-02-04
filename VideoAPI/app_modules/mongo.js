var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

exports.connexionMongo = function(callback) {
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		callback(err, db);
	});
}

exports.findVideos = function(page, pagesize, callback) {
    MongoClient.connect(url, function(err, db) {
    	    //console.log("pagesize = " + pagesize);
    	    //console.log("page = " + page);
        if(!err){
        		db.collection('videos')
            .find()
            .toArray()
            .then(arr => callback(arr));
        }
        else{
            callback(-1);
        }
    });
};

exports.orderVideosByName = function(page, pagesize, callback){
	MongoClient.connect(url, function(err, db){
		console.log("page size = "+ pagesize);
		console.log("page = "+ page);
		if(!err){
			db.collection('videos')
			.find()
			.sort({"title": 1})
			.skip(page*pagesize)
			.limit(pagesize)
			.toArray()
			.then(arr => callback(arr));
		}
		else {
			callback(-1);
		}
	});
};

exports.countVideos = function(callback) {
	console.log("DANS COUNT")
	MongoClient.connect(url, function(err, db) {
		db.collection('videos')
		.count(function(err, res) {
			callback(res);
		});
	});
};

exports.findVideoById = function(id, callback) {
    MongoClient.connect(url, function(err, db) {
        if(!err) {
        	// La requete mongoDB
			//da se smeni tuka vo funkcija na id na videoto
            let myquery = { "_id": ObjectId(id)};

            db.collection("videos") 
            .findOne(myquery, function(err, data) {
            	let reponse;

                if(!err){
                    reponse = {
                    	succes: true,
                        video : data,
                        error : null,
                        msg:"Details du video envoyés"
                    };
                } else{
                    reponse = {
                    	succes: false,
                        video : null,
                        error : err,
                        msg: "erreur lors du find"

                    };
                }
                callback(reponse);
            });
        } else {
        	let reponse = reponse = {
                    	succes: false,
                        video : null,
                        error : err,
                        msg: "erreur de connexion à la base"
                    };
            callback(reponse);
        }
    });
}

exports.createVideo = function(formData, callback) {
	MongoClient.connect(url, function(err, db) {
	    if(!err) {
			//da se smeni vo funkcija na formata na json a video
			console.log(formData.videourl);
			var video_id = formData.videourl.split('v=')[1];
			let toInsert = {
				videoid : video_id,
				videourl: formData.videourl, 
				title : formData.title,
				description : formData.description
			};
			console.dir(JSON.stringify(toInsert));
		    db.collection("videos")
		    .insertOne(toInsert, function(err, result) {
		    	let reponse;

		        if(!err){
		            reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Ajout réussi " + result
		            };
		        } else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à l'insertion"
		            };
		        }
		        callback(reponse);
		    });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de l'insertion, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}

exports.updateVideo = function(id, formData, callback) {
	MongoClient.connect(url, function(err, db) {
		if(!err) {
			//da se smeni vo funkcija na json na videoto
            let myquery = { "_id": ObjectId(id)};
           	console.log("===============VIDEOID==============  "+formData.videoid);
           		console.log("===============VIDEOURL==============  "+formData.videourl);
           	console.log("===============TITLE================  "+formData.title);
           	console.log("===============DESC=================  "+formData.description);
	        let newvalues = {
	        	videoid : formData.videoid,
	        	videourl : formData.videourl,
				title : formData.title,
				description : formData.description
	        };


			db.collection("videos")
			.updateOne(myquery, newvalues, function(err, result) {
	         	if(!err){
			    	reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Modification réussie " + result
		            };
			   	} else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à la modification"
		            };
			    }
			    callback(reponse);
	        });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de la modification, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}

exports.deleteVideo = function(id, callback) {
	MongoClient.connect(url, function(err, db) {
		if(!err) {
			//da se smeni vo funkcija na json na videoto
            let myquery = { "_id": ObjectId(id)};
	        
			db.collection("videos")
			.deleteOne(myquery, function(err, result) {
	         	if(!err){
			    	reponse = {
		                succes : true,
		                result: result,
		                error : null,
		                msg: "Suppression réussie " + result
		            };
			   	} else {
		            reponse = {
		                succes : false,
		                error : err,
		                msg: "Problème à la suppression"
		            };
			    }
			    callback(reponse);
	        });
		} else{
			let reponse = reponse = {
                    	succes: false,
                        error : err,
                        msg:"Problème lors de la suppression, erreur de connexion."
                    };
            callback(reponse);
		}
	});
}