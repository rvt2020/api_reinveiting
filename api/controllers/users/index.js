const BD = require("../../database/pg/postgres");
const bitacora = require("../../../utils/bitacora")


const GET = async (req, res) => {
    try {
        const query = `select 1`;
        bitacora.control(query, req.url, 1)
        console.log(JSON.stringify(query));
        const get = await BD.storePostgresql(query);
        console.log(get);
        res.send(get);
        // res.json({
        //     codRes: "00",
        //     data: "Todo Bien"
        // })
        // if (get.co_estado == "00") {
        //     res.json({
        //         codRes: get.co_estado,
        //         data: get.message
        //     });
        // } else {
        //     throw { message: eva };
        // }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            codRes: 99,
            detalle: e.message
        });
    }
};

module.exports = {
    GET
};
