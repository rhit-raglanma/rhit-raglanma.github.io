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


//READ ALL
app.get("/api/", function(req, res) {
    res.send(data);
    res.end();
});


//CREATE
app.post("/api/", function(req, res) {
    let name = req.body.name;
    let counter = req.body.count;
    data.push({"name": name, "count": counter});
    saveToServer(data);
    res.send("post successful");
    res.end();
});

//READ ONE
app.get("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let result = data[id];
    res.send(result);
    res.end();
}).put("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);

    let name = req.body.name;
    let counter = req.body.count;
    data[id] = {"name": name, "count": counter};
    saveToServer(data);
    res.send("put successful");
    res.end();
}).delete("/api/id/:id", function(req, res) {
    let id = parseInt(req.params.id);
    data.splice(id,1);
    saveToServer(data);
    res.send("delete successful");
    res.end();
})


// app.post('/pug/hello', function(req, res) {
//     counter = req.body.count || counter;
//     data.push(counter);
//     saveToServer(data);

//     res.render('hello', {title: "Hello Button", count: counter});

// });

// app.get('/pug/history', function(req, res) {
//     res.render('history', {title: 'Count history', data: data});
    
// });

app.listen(3000);