var mysql = require('mysql');

module.exports = {
    _connection: null,
    connection: function () {
        if (!this._connection) {
            this._connection = mysql.createConnection({
                host: process.env.host,
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });
        }
        return this._connection;
    }
};