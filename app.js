const express = require('express');
const bodyParser = require('body-parser');
const cassandra = require('cassandra-driver');

var client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], keyspace: 'hw4' });

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.post('/deposit', function(req, res) {

	var filename = req.body.filename;
	var contents = req.body.contents;


	const query = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
	//const params = [filename, contents];

	client.execute(query, [filename, contents], { prepare: true }, function(err) {
  		if (err){
    		console.log(err);
  		}
  		console.log('New image inserted in the cluster');
 	});

})


app.get('/retrieve', function() {





})



module.exports = app;