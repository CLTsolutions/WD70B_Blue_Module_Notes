// Create a variable require the use of express framework AND the Router() method to return a router object for us.
// This was two lines of code in previous files that can be combined into one
const router = require('express').Router();
// Import the user model through the db.js and store in variable User
const User = require('../db').import('../models/user');
// Access the jsonwebtoken for use
const jwt = require('jsonwebtoken');
// Access bycryptjs package in our app through variable
const bcrypt = require('bcryptjs');

// See controllerNotes.txt for CRUD Router method definitions 

/*  -------  USER SIGNUP  ---------  */
// Use router variable from above with the post method
// Takes in two parameters: a string to create the sub-route of the endpoint('/create) & a callback request and response function
router.post('/create', function (req, res) {
    // Uses the User variable above to access the model and db, 
        // and can use the sequelize method .create() to create an instance of User to send to the database
    User.create({
        // 1: Left side of the object needs to match the column/object title specified in our model
        // 2: Right side is the request(req), body where data is held, user(property of body), and email/password(properties of user)
            // req.body is middleware provided by Express to append two properties or key-value pairs to it
        // 3: Add bcrypt hashSync method to take in the string value of what to make secure and the number of times we want it salted (13x's)
        //(1)         (2)
        email: req.body.user.email,
        //  (1)        (3)                 (2)
        password: bcrypt.hashSync(req.body.user.password, 13)
    })
        // Because this function returns a Promise, .then is used to capture/show the success of the request 
        .then(
            // Fires off function of successful user creation
            function createSuccess(user) {
                // create token variable to create/store a web token per user w/ parameters of
                    //(payload of data(key-value pair) we're sending, signature to encode/decode token, any callbacks like expiration)
                let token = jwt.sign( {id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24} );

                // res.json() will convert non objects into valid json, works like res.send()
                res.json({
                    // user response object will be returned, a string, and the session token 
                    // user is the name of the object on the left and the user on the right is the parameter passed from createSuccess function
                    user: user,
                    message: 'User successfully created!',
                    sessionToken: token
                })
            }
        )
        // A .catch handler is added to catch a fail case(rejected Promise) or error
        .catch(err => res.status(500).json({ error: err }))
});


/*  -------  USER LOGIN  ---------  */
// router variable using post to build the sub-route path of /login and it's callback function to the request and response
router.post('/login', function(req, res) {
    // findOne() is a Sequelize method to find and retrieve data from the db
    User.findOne({ 
        // where is a Sequelize object that directs the db to find matching properties
        where: {
            // looks to the email column to find matching email we sent through the /user/login request from client/Postman
            email : req.body.user.email
        }
    })
    // .then() Promise resolver for successful request case 
    .then(function loginSuccess(user) {
        // Conditional if else statement is used for a success(true) or null(false) response when searching the db
        if (user) {
            // This is now decrypting and checking if the password matches the db password (password from request, password in db, comparing function)
            bcrypt.compare(req.body.user.password, user.password, function(err, matches) {
                // if else to run login, if match is successful then true will run 
                if (matches) {
                    // encode login as we did /create above
                    let token = jwt.sign( {id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24} );

                    // gives a success status code as the response
                    res.status(200).json({
                    // returns user object upon login
                    user: user,
                    // displays additional conformation string in console
                    message: 'User successfully logged in!',
                    // displays token as well
                    sessionToken: token
                    })
                // fail case if password does not match
                } else {
                    // error message sent in console
                    res.status(502).send({ error: 'Login failed'});
                }
            })
        // fail case if user is not located in db
        } else {
            // error message sent in console
            res.status(500).json({ error: 'User does not exist.' })
        }
    })
    // .catch for fail request case(request doesn't go through, etc.)
    .catch(err => res.status(500).json({ error: err }))
});

// Exports the router to be used/accessed by app.js or imported into other files
module.exports = router;