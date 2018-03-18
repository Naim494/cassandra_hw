const express = require('express');
const cassandra = require('cassandra-driver');
const multer  = require('multer');
const bodyParser = require('body-parser');
var mime = require('mime-types')

const storage = multer.memoryStorage();

const upload = multer({storage: storage});

const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], keyspace: 'hw4' });

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.post('/deposit', upload.single('contents'), function(req, res) {
    console.log(req.file);
    
	var filename = req.file.originalname;
	var contents = req.file.buffer;

	console.log(filename);

	const query = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';

	client.execute(query, [filename, contents], { prepare: true }, function(err) {
  		if (err){
    		console.log(err);
  		}
  		else{

  		console.log('New image inserted in the cluster');
  		res.status(200).json({
				status: 'OK'});
  		};
 	});

})


app.get('/retrieve', function(req, res) {
    
	var filename = req.query.filename;
	console.log(filename);


	const query = 'SELECT contents FROM imgs WHERE filename = ?';

	var mimetype = mime.lookup(filename);
	console.log(mimetype);

	client.execute(query, [filename], { prepare: true }, function(err, result) {
  		if (err){
    		console.log(err);
    		console.log('FUUUUUUUUUUUUUUUUUUUUKKKKKKKKK');
  		}
  		else{
  			console.log(result);
  		console.log('Image retrieved');
  		
  		res.set('Content-Type', mimetype);

  		res.send(result);
  	    }
 	});




})



module.exports = app;