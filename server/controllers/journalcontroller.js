//Require the use of Express
let express = require('express');
// Create a variable to use the express framework AND the Router() method to return a router object for us.
let router = express.Router();

// See controllerNotes.txt for CRUD Router method definitions 

//Use the get method to use the GET request to receive the response from the /practice endpoint
//  1: First argument creates/is the endpoint path to use
//  2: Callback/"Handler" function listens for the request and responds when it receives the matched call
//        (     1     ,        2        ) 
router.get('/practice', function(req, res)
{
    //sends response of the string
    res.send('Hey this is a practice route!')
})

//Exports the router to be used/accessed by app.js or imported into other files
module.exports = router;