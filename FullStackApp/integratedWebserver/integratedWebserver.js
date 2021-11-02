var express = require("express");
var app = express();

let data=[];

const logger = require("morgan");
app.use(logger('dev')); //helpful info serverside when requests come in

const fs = require("fs");
const serverSideStorage = "../data/db.json"


fs.readFile(serverSideStorage, function(err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
        if (data.length != 0) {
            counter = data[data.length-1];
        }
    }
    console.log("data read from file");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err, buf) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("data saved");
        }
    });
}

app.use('/static', express.static("public"));
 



//middleware
var bodyParser = require("body-parser");

app.use('/api/', bodyParser.urlencoded({extended: true}));
app.use('/api/', bodyParser.json() );

// const { appendFile } = require("fs");

// appendFile


app.post('/pug/hello', function(req, res) {
    counter = req.body.count || counter;
    data.push(counter);
    saveToServer(data);

    res.render('hello', {title: "Hello Button", count: counter});

});

app.get('/pug/history', function(req, res) {
    res.render('history', {title: 'Count history', data: data});
    
});

app.listen(3000);