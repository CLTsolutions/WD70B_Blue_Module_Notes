// Models define the data we want to store, the server model will be nearly identical to the data table in the database
// Sequelize creates an id #, created timestamp, and updated timestamp per data row given


// Module is exported so sequelize can create the user table
// This is an anonymous function with the parameters sequelize and DataTypes
module.exports = (sequelize, DataTypes) => {
    // We use the sequelize object to call the define method & pass in the string 'user' which will become a table called users in Postgres
    const User = sequelize.define('user', {
        // object of the define method, creates title of data column 
        email: {
            // this is the value type, thus email must always be a string to be added to the database
            type: DataTypes.STRING,
            // optional property to allow null data to be sent; false means an input is required to be given for email
            allowNull: false,
            // optional property that means all data has to be unique with no duplicates
            unique: true
        },
        // object of the define method, creates title of data column
        password: {
            // see above notes on line 12
            type: DataTypes.STRING,
            // see above notes on line 14
            allowNull: false
        },
    })
    // returns the defined User table 
    return User;
}