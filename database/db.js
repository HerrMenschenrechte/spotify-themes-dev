const mysql = require('promise-mysql')

exports.createPool = async function () {

    let dbPool
    if (!dbPool) {
        dbPool = await mysql.createPool({
            connectionLimit: 30,
            acquireTimeout: 100000,
            port: 3306,
            host: 'localhost:3306',
            user: 'root',
            password: ':Dbvb909',
            database: 'Spotify',
            ssl: true,
            debug: false,
            charset: "utf8mb4",
            trace: false,
            supportBigNumbers: true

        }).catch(error => console.log(error))

    }
    return dbPool
}


