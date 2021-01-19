// The app.js file is the main "hub" of the server
// At the top of the file we bring in our frameworks, database, and controllers
// Require the dotenv package
require('dotenv').config();
// Require the use of Express(defined in NOTES.txt)
let express = require('express');
// Create an instance of express to create an Express app
let app = express();
// Create a sequelize variable that imports the db file
let sequelize = require('./db');
// Create variable to access controller for endpoint sub-routes & their CRUD capabilities 
let journal = require('./controllers/journalcontroller');
// Create variable to access user controller
let user = require('./controllers/usercontroller');


// Use the variable to call .sync() which syncs defined models to the DB
sequelize.sync();
//sequelize.sync({force: true})

// This app.use MUST GO ABOVE ROUTES(the endpoint routes brought in below) because JS reads top to bottom
// Express needs to JSON-ify the request to parse and interpret the data being sent and given
// app.use(express.json()) tells the application that we want json to be used as we process this request
app.use(express.json());

// User Endpoint:
// Call app.use() to create a base URL endpoint with /user, http://localhost:3000/user
app.use('/user', user);


// Journal Endpoint:
// Call app.use() to create a base URL endpoint with /journal, http://localhost:3000/journal
//   1: First parameter is the endpoint string
//   2: Second parameter uses the variable journal created above 
    //  to call & use the journalcontroller.js endpoint sub-routes like: /practice /create 
    // (    1     ,    2   )
app.use('/journal', journal);


// Test Endpoint Code:
// Creates an endpoint to make a request, client uses http://localhost:3000/test per route indicated in the string 
app.use('/test', function(req, res){
    //res.send is an express func that sends a response message
    //res(response) packs up the response object
    //.send() sends the response back to the client
    res.send('This is a message from the test endpoint on the server.');
})


// Listens for the connections on the given path which here is localhost:3000
app.listen(3000, function(){
    // Prints this string in the terminal on successful server start/connection to port 3000
    console.log('App is listening on port 3000.');
})