// *** The db.js file sets the connection to our Postgres database using Sequelize

//Imports and requires the use of Sequelize
const Sequelize = require('sequelize');
//Create an instance of Sequelize with the variable sequelize 
    // & use the constructor to make a new Sequelize object with your information 
    // 1:Name of db table to connect to, 2:Username for the db, 3:Password for the db
    //                         (          1          ,     2     ,      3
const sequelize = new Sequelize('journal-walkthrough', 'postgres', 'YOUR_PASSWORD_HERE', {
    // host points to the local port being used
    host: 'localhost',
    // identifies the QL dialect being used
    dialect: 'postgres'
});

//Uses sequelize variable to access and call authenticate method
// authenticate() returns a promise, thus .then fires contained functions
sequelize.authenticate().then(
    //function that shows a successful connection
    function() {
        console.log('Connected to journal-walkthrough postgres database');
    },
    //function to show error if unsuccessful 
    function(err){
        console.log(err);
    }
);

//Exports the module to be used/accessed by other files
module.exports = sequelize; 