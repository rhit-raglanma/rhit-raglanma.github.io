console.log("todo");

// var figlet = require('figlet');

// figlet('CSSE280 using node.js', function(err, data) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data)
// });

const imgToAscii = require('ascii-img-canvas-nodejs')

const opts = {}



const asciiImgLocal = imgToAscii('files/node.svg.png', opts);
asciiImgLocal.then( (asciiImgLocal) => {
    console.log(asciiImgLocal);
})
