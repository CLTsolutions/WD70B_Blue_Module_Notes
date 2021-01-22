//Require the use of Express
let express = require('express');
// Create a variable to use the express framework AND the Router() method to return a router object for us.
let router = express.Router();
// Accesses validateSession through variable
let validateSession = require('../middleware/validate-session');
// Access journal model through variable
const Journal = require('../db').import('../models/journal');

// See controllerNotes.txt for CRUD Router method definitions 

/*  -------  PRACTICE ROUTE  ---------  */
// Use the get() method to use the GET request to receive the response from the "/practice" endpoint; http://localhost:3000/journal/practice
//  1: First argument creates/is the endpoint path to use
//  2: Using validateSession to secure certain endpoint routes so only accessible to valid logged in user
//  3: Callback/"Handler" function listens for the request and responds when it receives the matched call
//        (     1     ,        2       ,       3        ) 
router.get('/practice', validateSession, function(req, res)
{
    //sends response of the string
    res.send('Hey this is a practice route!')
})

/*  -------  JOURNAL CREATE ROUTE  ---------  */
// Use the post() method to use the CREATE request to receive the response from the "/create" endpoint; http://localhost:3000/journal/create
router.post('/create', validateSession, (req, res) => {
    // create a variable to be our journal object and hold it's objects and values, assigning the value pair
    const journalEntry = {
        // Object name on left of : value given from client/Postman body on right
        title: req.body.journal.title,
        // same as above
        date: req.body.journal.date,
        // same as above
        entry: req.body.journal.entry,
        // object: value coming from the user object accessed through our validateSession information
        owner: req.user.id
    }
    // We access the Journal variable to use our model to create a new instance of a journal and send it the journalEntry object to the db
    Journal.create(journalEntry)
        // Promise resolver sends an ok status and the json-ified journal entry
        .then(journal => res.status(200).json(journal))
        // Promise rejector method in case of error
        .catch(err => res.status(500).json({ error: err }))
});

/*  -------  GET ALL JOURNAL ENTRIES ROUTE  ---------  */
// Use the get() method to use the GET request to receive the response from the "/" endpoint; http://localhost:3000/journal/
router.get('/', (req, res) => {
    // findAll() is a sequelize method to find all item and returns a promise
    Journal.findAll()
        // Promise resolver success case that gives response object of journals
        .then(journals => res.status(200).json(journals))
        // Promise rejection case with error message as response
        .catch(err =>res.status(500).json({ error: err }))
});

/*  -------  GET ALL JOURNAL ENTRIES BY USER ROUTE  ---------  */
// Use the get() method to use the GET request to receive the response from the "/mine" endpoint; http://localhost:3000/journal/mine
router.get('/mine', validateSession, (req, res) => {
    // create variable that has value of our user id from validateSession
    let userid = req.user.id

    // Look to the journal table and use sequelize findAll() method
    Journal.findAll({
        // use the sequelize where attribute to indicate where to look to find matching data from the db
        where: { owner: userid }
    })
        // Success promise resolver
        .then(journals => res.status(200).json(journals))
        // Fail promise rejector
        .catch(err => res.status(500).json({ error: err }))
});

/*  -------  GET JOURNAL ENTRY BY TITLE ROUTE  ---------  */
// Use the get() method to use the GET request to receive the response from the "/:title" endpoint; http://localhost:3000/journal/MyJournalEntry
// When testing, the : indicates that we will be changing the url used to call/request to the server by giving it a parameter such as http://localhost:3000/journal/Escapade in order to find the title 
router.get('/:title', function (req, res) {
    // create a variable that holds the value we pass into the URL's parameter(whatever is after the end / such as Escapade)
    let title = req.params.title;

    // Look to the journal table and use sequelize findAll() method
    Journal.findAll({
        // use the sequelize where attribute to indicate where to look to find matching data from the db
        where: { title: title }
    })
        // Success promise resolver
        .then(journals => res.status(200).json(journals))
        // Fail promise rejector
        .catch(err => res.status(500).json({ error: err }))
});

/*  -------  UPDATE JOURNAL ENTRY ROUTE  ---------  */
// Use the put() method to use the UPDATE request to receive the response from the "/update/:entryId" endpoint; http://localhost:3000/journal/update/:entryId (written http://localhost:3000/journal/update/1 in Postman to test)
router.put('/update/:entryId', validateSession, function (req, res) {
    // Create a variable to be our updated journal object and hold it's objects and values
    const updateJournalEntry = {
        // Object name on left of : value given from client/Postman body on right, assigning the value pair
        title: req.body.journal.title,
        // same as above
        date: req.body.journal.date,
        // same as above
        entry: req.body.journal.entry
    };

    // Entry id is passed through the url endpoint and user id from the token and checked against the labeled columns of the db(using the where attribute); all is then contained in a variable name
    const query = { where: { id: req.params.entryId, owner: req.user.id } };

    // The update() method takes two arguments the first being the object holding the new values we want in the db(updateJournalEntry) and the second being where the new values/data will go in the db if they match(query)
    Journal.update(updateJournalEntry, query)
        // Success promise resolver if update works
        .then((journals) => res.status(200).json(journals))
        // Fail promise rejector
        .catch((err) => res.status(500).json({ error: err}))
});

/*  -------  DELETE JOURNAL ENTRY ROUTE  ---------  */
// Use the delete() method to use the DELETE/DESTROY request to receive the response from the "/delete/:id" endpoint; http://localhost:3000/journal/delete/:id (written http://localhost:3000/journal/delete/2 in Postman to test)
router.delete('/delete/:id', validateSession, function (req, res) {
    // Entry id is passed through the url endpoint and user id from the token to be checked against the labeled columns of the db(using the where attribute); all is then contained in a variable name
    const query = { where: { id: req.params.id, owner: req.user.id }};

    // The destroy() method removes an item/data from the database(the row) and looks to the query variable to find what information/data to delete
    Journal.destroy(query)
        // Success promise resolver if delete works
        .then(() => res.status(200).json({ message: 'Journal Entry Removed'}))
        // Fail promise rejector
        .catch((err) => res.status(500).json({ error: err}))

});

//Exports the router to be used/accessed by app.js or imported into other files
module.exports = router;