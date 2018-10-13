'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var app = express();

var urlList = [];

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/shorturl/:id", function (req, res) {
  console.log(req.params.id);
  //res.json({shorturl: urlList[parseInt(req.params.id)]});
  res.redirect(urlList[parseInt(req.params.id)]);

});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

app.post('/api/shorturl/new',function (req,res,next){
  
  let addrNoProt = req.body.url.split('//')[1];
  let addrProt = req.body.url;

  dns.lookup(addrNoProt, (err,addresses,family)=>{
    if(err || !addrProt.slice(0,4).includes('http')) {
    res.json({error: "invalid URL"});
    }else{
    console.log(addrProt);
    urlList.push(addrProt);
    res.json({original_url: addrProt, short_url: (urlList.length-1)});
    }

  });
  
}); 

