const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { response } = require("express");

// Setup
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.urlencoded({
    extended: true
}));
app.use('/api/', bodyParser.json());

// Data from a file.
let data = [];
const serverSideStorage = "../data/db.json";
fs.readFile(serverSideStorage, function (err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
    }
    console.log("Data read from file.");
});

function saveToServer(data) {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function (err, buf) {
        if (err) {
            console.log("error: ", err);
        } else {
            console.log("Data saved successfully!");
        }
    })
}

// ------------------------------------------------------------------------
// Admin API - Note: the Admin api tells you words.  You are an admin.
// ------------------------------------------------------------------------

/**
 * Create - Add a word to the word list (i.e. the data array)
 *   method:                    POST
 *   path:                      /api/admin/add
 *   expected request body:     {"word": "..."}
 *   side effects:              saves the word onto the data array
 *   response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.

app.post("/api/admin/add", (req, res) => {

    console.log(req.body);

    data.push(req.body.word);
    saveToServer(data);



    res.send({"word": req.body.word, "index": data.length-1});


});


/**
 * Read all	- Get all words
 *   method:                    GET
 *   path:                      /api/admin/words
 *   expected request body:     none
 *   side effects:              none (as is the case for all GETs)
 *   response:                  {"words": ["...", "..."], "length": #}
 */

// TODO: Add your code here.

app.get("/api/admin/words", (req, res) => {

    const words = data;

    res.send({"words": words});


});

/**
 *  Read one - Get a single word at index
 *    method:                    GET
 *    path:                      /api/admin/word/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.

app.get("/api/admin/word/:id", (req, res) => {
    const index = req.params.id;
    const word = data[index];
    res.send({"word": word, "index": index});
});

/**
 *  Update - Update a word at index
 *    method:                    PUT
 *    path:                      /api/admin/word/:id
 *    expected request body:     {"word": "..."} (notice the path parameter is also present)
 *    side effects:              saves the new word into that location in the data array
 *    response:                  {"word": "...", "index": #}
 */

// TODO: Add your code here.

app.put("/api/admin/word/:id", (req, res) => {
    const index = req.params.id;

    data[index] = req.body.word;

    saveToServer(data);

    res.send({"word": req.body.word, "index": index});
});


/**
 *  Delete
 *    method:                    DELETE
 *    path:                      /api/admin/word/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              deletes the new word at that index from the data array
 *    response:                  {"index": #}  (i.e. the index that got deleted)
 */

// TODO: Add your code here.

app.delete("/api/admin/word/:id", (req, res) => {

    const index = req.params.id;
    data.splice(index, 1);

    saveToServer(data);

    res.send({"index": index});

});


// ------------------------------------------------------------------------
// Player API - Never shares the word. It is a secret.
// ------------------------------------------------------------------------
/**
 *  Num Words - Get the number of words (i.e. the size of the data array).
 *    method:                    GET
 *    path:                      /api/player/numwords
 *    expected request body:     none
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"length": #}
 */

// TODO: Add your code here.

app.get("/api/player/numwords", (req, res) => {
    res.send({"length": data.length});
});

/**
 *  Word Length - Get the length of a single word at the given index.
 *    method:                    GET
 *    path:                      /api/player/wordlength/:id
 *    expected request body:     none (notice the path parameter instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"length": #, "index": #}
 */

// TODO: Add your code here.

app.get("/api/player/wordlength/:id", (req, res) => {
    const index = req.params.id;
    res.send({"length": data[index].length});
});

/**
 *  Guess - Allow the player to make a guess and return where that letter is found in the word.
 *    method:                    GET
 *    path:                      /api/player/guess/:id/:letter
 *    expected request body:     none (notice multiple path parameters instead)
 *    side effects:              none (as is the case for all GETs)
 *    response:                  {"letter": ".", "length": #, "index": #, "locations": [#, #, #]}
 *     example real response:    {"letter": "A", "length": 6, "index": 7, "locations": [0]}
 *     notice the length and index are repeat info like Word Length would give.
 *     the interesting field is locations which is always an array, but could be an empty array [].
 */

// TODO: Add your code here.

app.get("/api/player/guess/:id/:letter", (req, res) => {
    const index = req.params.id;
    const letter = req.params.letter;

    const word = data[index];
    const locations = [];

    for (let i = 0; i < word.length; i++) {
        if (word[i].toUpperCase() == letter.toUpperCase()) {
            locations.push(i);
        }
    }

    res.send({"letter": letter, "length": word.length, "index": index, "locations": locations})
})


app.listen(3000);