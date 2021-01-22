// Module is exported so sequelize can create the journal table
// This is an anonymous function with the parameters sequelize and DataTypes
module.exports = (sequelize, DataTypes) => {
    // We use the sequelize object to call the define method & pass in the string 'journal' which will become a table called journals in Postgres
    const Journal = sequelize.define('journal', {
        // object of the define method, creates title of data column
        title: {
            // this is the value type, thus title must always be a string to be added to the database
            type: DataTypes.STRING,
            // optional property to allow null data to be sent; false means an input is required to be given for email
            allowNull: false
        },
        // same as noted above on line 10
        date: {
            // same as noted above on line 12
            type: DataTypes.STRING,
            // same as noted above on line 14
            allowNull: false
        },
        // same as noted above on line 10
        entry: {
            // same as noted above on line 12
            type: DataTypes.STRING,
            // same as noted above on line 14
            allowNull: false
        },
        // same as noted above on line 10
        owner: {
            // same as noted above on line 12
            type: DataTypes.INTEGER
        }
    })
    // returns the defined Journal table 
    return Journal;
};