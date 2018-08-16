var http = require('http');
var express = require('express');
var exp = express();
var parser = require('body-parser')
var fs = require('fs');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;


/************database creation ************//*
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/myProductdb', function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
*/


/****************create collection*********************/
/*
MongoClient.connect('mongodb://localhost:27017/myProductdb', function(err, db) {
  if (err) throw err;
  var dbo = db.db("myProductdb");
  dbo.createCollection("productCollection", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
*/



/********************inserting data**********************************/


exp.use(parser.json());
exp.route('/rest/api/post', cors()).post((req, res) => {
    console.log(req.body);
   // fs.appendFileSync('demo.json', JSON.stringify(req.body));
    res.status(201).send(req.body);

    MongoClient.connect('mongodb://localhost:27017/myProductdb', function (err, dbvar) {
        console.log('In Mongo Client', req.body);
        if (err) throw err;
        //database mani
        var coll = dbvar.db('myProductdb');
        //collection Mans
        coll.collection('productCollection').insert(req.body, true, function (err, res) {
            if (err) throw err;
            console.log('One document inserted....');
            dbvar.close();
        });
        dbvar.close();
    });
});



/*************************get all Data*******************************/

exp.route('/rest/api/get', cors()).get((req, res)=>{
    console.log('GET Invoked....');
    //res.send({msg: 'GET WORLD....'});
    MongoClient.connect('mongodb://localhost:27017/myProductdb', (err, dbvar)=>{
        console.log('In Mongo Client');
        if(err) throw err;
        var coll = dbvar.db('myProductdb');
        coll.collection('productCollection').find().toArray((err, result)=>{
            if (err) throw err;
            console.log('result',result);
            res.send(result);
            dbvar.close();
        })
        dbvar.close();
    });
})


/***********************get data based On Id***************************/
//get?productId=1
exp.route('/rest/api/getID',cors()).get((req,res)=>{

console.log(req.query.productId);

MongoClient.connect('mongodb://localhost:27017/myProductdb', function(err, db) {
  if (err) throw err;
  var dbo = db.db("myProductdb");
console.log(req.query.productId);

  dbo.collection("productCollection").findOne({productId:req.query.productId}, function(err, result) {
    if (err) throw err;
    console.log("1 document find");
    console.log(res);
    res.send(result);
    db.close();
  });
});
});


/*******************delete data on Id***************/





exp.route('/rest/api/delete',cors()).delete((req,res)=>{
    console.log((req.body));

        MongoClient.connect('mongodb://localhost:27017/myProductdb', function(err, db) {
        if (err) throw err;
        var dbo = db.db("myProductdb");
       
        dbo.collection("productCollection").deleteOne(req.body, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.send(obj);
            db.close();
        });
        });
});


/*********************update data on ID**********************/


exp.route('/rest/api/put',cors()).put((req,res)=>{

console.log(req.body.productId);
console.log(req.body.productName);

MongoClient.connect('mongodb://localhost:27017/myProductdb', function(err, db) {
  if (err) throw err;
  var dbo = db.db("myProductdb");
  var myquery = { productId: req.body.productId };
  var newvalues = { $set: {productName:req.body.productName} };
  dbo.collection("productCollection").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});
});





exp.use(cors()).listen(3000, () => console.log("RUNNING...."));