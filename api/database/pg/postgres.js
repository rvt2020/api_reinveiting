var Pool = require('pg-pool')
// var Pool = require('pg')

// by default the pool uses the same
// configuration as whatever `pg` version you have installed
// var pool = new Pool()

// you can pass properties to the pool
// these properties are passed unchanged to both the node-postgres Client constructor
// and the node-pool (https://github.com/coopernurse/node-pool) constructor
// allowing you to fully configure the behavior of both
const conex = {
    user: process.env.USER_DATABASE,
    host: process.env.IP_DATABASE,
    database: process.env.DATABASE,
    password: process.env.PASS_DATABASE,
    port: process.env.PORT_DATABASE,
    ssl: false,
    max: 120, // set pool max size to 20
    idleTimeoutMillis: 3000, // close idle clients after 1 second
    connectionTimeoutMillis: 3000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
}

// const storePostgresql = async (query) => {

//     var client = new Pool(conex)
//     client.connect()
//     return client.query(query)
//         .then(response => {
//             // console.log(response.rows)
//             // client.end()
//             client.end()
//             return response.rows
//         })
//         .catch(err => {
//             console.error("err", err);
//             client.end()
//             return {
//                 ...err,
//                 codRes: 99
//             };
//         })
// }

// const storePostgresql = async (queryCustom) => {
//     var pool = new Pool(conex)
//     var client = await pool.connect()
//     // var time = await pool.query('SELECT NOW()')
//     var name = await pool.query(queryCustom)
//     client.release()
//     // await pool.end()
//     return name.rows
// }

const storePostgresql = async (queryCustom) => {
    try {
        var pool = new Pool(conex)
        // var time = await pool.query('SELECT NOW()')
        var name = await pool.query(queryCustom)
        // console.log(time.rows)
        // console.log(name.rows)
        return name.rows
    } catch (error) {
        console.log("error", error);
        return {
            ...error,
            codRes: 99
        };
    }
}

// const pool = new Pool(conex)


// const storePostgresql = (query) => {
//     pool.connect((err, client, release) => {
//         if (err) {
//             console.error('Error acquiring client', err.stack)
//         }
//         return client.query(query, (err, result) => {
//             release()
//             if (err) {
//                 return console.error('Error executing query', err.stack)
//             }
//             console.log(result.rows)
//             return result.rows
//         })
//     })
// }
// const conexionPostgres = {
//     user: process.env.USER_DATABASE,
//     host: process.env.IP_DATABASE,
//     database: process.env.DATABASE,
//     password: process.env.PASS_DATABASE,
//     port: 5432
// }

// const storePostgresql = async (query) => {
//     const client = new pg.Client(conexionPostgres)
//     // console.log(client);
//     client.connect();
//     return client.query(query)
//         .then(response => {
//             // console.log(response.rows)
//             client.end()
//             return response.rows
//         })
//         .catch(err => {
//             console.error("err", err);
//             client.end()
//             return {
//                 ...err,
//                 codRes: 99
//             };
//         })
// }

module.exports = {
    storePostgresql
}
