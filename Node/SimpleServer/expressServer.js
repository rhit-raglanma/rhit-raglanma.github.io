var express = require("express");
var app = express();

let counter = 0;

app.use('/static', express.static("public"));

app.get("/hello", function(req, res) {

    let name = req.query.name;

    let age = req.query.age;



    res.send("<h1>Hello " + name + "!</h1>" + "You are "+ age + " years old.")

});

app.post("/users/:username", function(req, res) {
    let username = req.params.username;
    res.send(username);
});

app.post("/myPost", function(req, res) {
    res.send("HTML code. Done via a post request");

});

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/pug/', function(req, res) {
    res.render('index', {title: 'Hey', message:"Hello there"});
});

app.get('/pug/hello', function(req, res) {
    res.render('hello', {title: 'Hey', count: counter});
    
});

var bodyParser = require("body-parser");

app.use('/pug/hello', bodyParser.urlencoded({extended: false}));

// const { appendFile } = require("fs");

// appendFile

app.post('/pug/hello', function(req, res) {
    counter = req.body.count || counter;

    res.render('hello', {title: "Hello Button", count: counter});

});



app.listen(3000);