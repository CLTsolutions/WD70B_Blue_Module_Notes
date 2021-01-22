// Access the jsonwebtoken for use
const jwt = require('jsonwebtoken');
// Import the user model through the db.js and store in variable User
const User = require('../db').import('../models/user');

// creating a variable to hold a function that will run when called
const validateSession = (req, res, next) => {
    // set token variable to require the authorization from headers
    const token = req.headers.authorization;
    // console.log message for verification if working, read in browser console upon page inspection(commented out to keep terminal uncluttered after testing)
    //console.log('token ---> ', token);

    // conditional if, first {}'s run if token is not present 
    if (!token) {
        // return a message stating no token given
        return res.status(403).send({ auth: false, message: 'No token provided' })
    // else case if token is present, runs code to decode and match tokens
    } else {
        // verify method to compare token passed in the request against the token in the db and running the decoding success case callback func process
        jwt.verify(token, process.env.JWT_SECRET, (err, decodeToken) => {
            // console.log message for verification if working(commented out to keep terminal uncluttered)
            //console.log('decodeToken ---> ', decodeToken);
            // if conditional to check case if no error w/ token to to proceed with decoding
            if (!err && decodeToken) {
                // find a user id that matches the decoded token associated id
                User.findOne({
                    where: {
                        id: decodeToken.id
                    }
                })
                    // if user is found
                    .then(user => {
                        // console.log message for verification of user(commented out to keep terminal uncluttered)
                        //console.log('user ---> ', user);
                        // if no user match respond with an error
                        if (!user) throw err;
                        // console.log message for verification of req(commented out to keep terminal uncluttered)
                        //console.log('req ---> ', req);
                        // if user passed in is the same as user in db
                        req.user = user;
                        // return next method to continue 
                        return next();
                    })
                    // catch for fail case of finding a user
                    .catch(err => next(err));
            // else case err from no value for decodeToken 
            } else {
                // uses the err parameter from line 18 to make key-value pair with req
                req.errors = err;
                // returns not authorized error message
                return res.status(500).send('Not Authorized');
            }
        });
    }
};

// exports validateSession to make it accessible to other files
module.exports = validateSession;