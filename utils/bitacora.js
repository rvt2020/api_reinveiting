const mongoDB = require("../api/database/mdb/mongodb")
const fechaperse = `${new Date().toISOString().substr(0, 10)}`
console.log(fechaperse);
const control = async (query, url) => {
    console.log(query);
    console.log(url);
    const data = {
        "query": query,
        "url": url
    }
    mongoDB.INSERT_ONE(data, `bitacora_${fechaperse}`)
}


module.exports = {
    control
}