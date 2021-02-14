const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // LISTA DE TIPO DE OPERACION
    app.get(`/api/${process.env.VERSION}/tipocita`, async (req, res, next) => {
        try {
            let query;
            query = `select * from recitope.sp_mostrartipope()`;
            
            bitacora.control(query, req.url)
            const marcas = await BD.storePostgresql(query);
            // con esto muestro msj
            if (marcas.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", marcas }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", marcas }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })


}