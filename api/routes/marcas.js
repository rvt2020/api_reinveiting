const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // LISTA DE MARCAS
    app.get(`/api/${process.env.VERSION}/marcas/:marveh`, async (req, res, next) => {
        try {
            let query;
            const no_marveh = req.params.marveh;
            console.log(no_marveh);
            if (no_marveh == 'all') {
                query = `select * from wfvehicu.sp_mostrar_marveh('')`;
            } else {
                query = `select * from wfvehicu.sp_mostrar_marveh('${no_marveh}')`;
            }
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

    // AGREGAR MARCA
    app.post(`/api/${process.env.VERSION}/marcas`, async (req, res, next) => {
        try {
            const no_marveh = req.body.no_marveh;

            const query = `select wfvehicu.sp_manten_marveh(
                cast (null as integer),
                '${no_marveh}'
            )`;
            // console.log(query);
            bitacora.control(query, req.url)
            const marcas = await BD.storePostgresql(query);
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

    // ACTUALIZAR MARCA
    app.put(`/api/${process.env.VERSION}/marcas`, async (req, res, next) => {
        try {
            const co_marveh = req.body.co_marveh;
            const no_marveh = req.body.no_marveh;
            
            if (co_marveh == 'undefined') {
                miExcepcionMarca = new miExcepcionMarca("Falta definir código de Marca.");
                throw miExcepcionMarca;
            }
            const query = `select wfvehicu.sp_manten_marveh(
                cast (${co_marveh} as integer),
                '${no_marveh}'
            )`;

            bitacora.control(query, req.url)
            const marcas = await BD.storePostgresql(query);
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