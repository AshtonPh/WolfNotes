const mySql = require('mysql');
let connection;

/**
    * Get the current database connection, or if one doesn't exist,
    * connect to the database and return the new connection
    * 
    * @returns {Promise<mySql.Connection>} a promise of a database connection
    */
function getCon() {
    return new Promise((res, rej) => {
        if (connection === undefined) {
            connection = mySql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                charset: process.env.DB_CHARSET
            });

            connection.connect((err) => {
                if (err) {
                    console.log(`CRITICAL: Failed to connect to db (${err})`);
                    rej(err);
                }
            });
        }

        res(connection);
    });
}

/**
 * Make a database query
 * 
 * @param {string} qString the query string to execute
 * @param {[]} params query parameters
 * @returns {Promise<{results, fields}>} the results and fields 
 */
function query(qString, params = []) {
    return new Promise((res, rej) => {
        this.getCon().then(con => {
            con.query(qString, params, (err, results, fields) => {
                if (err) {
                    if (err.code == 'PROTOCOL_CONNETION_LOST') {
                        console.log(`ERROR: Database connection lost, attempting to reconnect`);
                        connection = undefined;
                        getCon().then(() => query(qString, params));
                    }
                    else {
                        console.log(`ERROR: Failed to execute '${qString}' (${err.code})`);
                        rej(err);
                    }
                }

                res({ results, fields });
            })
        })
    });
}

module.exports = { getCon, query }