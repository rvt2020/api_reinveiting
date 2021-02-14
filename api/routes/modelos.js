const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // TRAER MODELOS
    app.get(`/api/${process.env.VERSION}/modelos/:modveh`, async (req, res, next) => {
        try {
            let query;
            const no_modveh = req.params.modveh;
            console.log(no_modveh);
            if (no_modveh == 'all') {
                query = `select * from wfvehicu.sp_mostrar_modveh('')`;
            } else {
                query = `select * from wfvehicu.sp_mostrar_modveh('${no_modveh}')`;
            }
            bitacora.control(query, req.url)
            const modelos = await BD.storePostgresql(query);
            // con esto muestro msj
            if (modelos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", modelos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", modelos }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })
    
    //TRAER MODELOS POR MARCA
    app.get(`/api/${process.env.VERSION}/modelos/marcas/:modmar`, async (req, res, next) => {
        try {
            let query;
            const co_marveh = req.params.modmar;
            console.log(co_marveh);
            
            query = `select * from wfvehicu.sp_mostrar_modmar('${co_marveh}')`;
            
            bitacora.control(query, req.url)
            const modmar = await BD.storePostgresql(query);
            // con esto muestro msj
            if (modmar.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", modmar }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", modmar }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // AGREGAR MODELOS
    app.post(`/api/${process.env.VERSION}/modelos`, async (req, res, next) => {
        try {
            const co_modveh = req.body.co_modveh;
            var no_modveh = req.body.no_modveh;
            var co_marveh = req.body.co_marveh;

            const query = `select wfvehicu.sp_manten_modveh(
                cast (null as integer),
                '${no_modveh}',
                '${co_marveh}'
            )`;
            // console.log(query);
            bitacora.control(query, req.url)
            const modelos = await BD.storePostgresql(query);
            if (modelos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", modelos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", modelos }).status(500)
            }
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)    
        }
    })

    // ACTUALIZAR MODELO
    app.put(`/api/${process.env.VERSION}/modelos`, async (req, res, next) => {
        try {
            const co_modveh = req.body.co_modveh;
            const no_modveh = req.body.no_modveh;
            var co_marveh = req.body.co_marveh;

            if (co_modveh == 'undefined') {
                miExcepcionModelo = new miExcepcionModelo("Falta definir código de Modelo.");
                throw miExcepcionModelo;
            }
            const query = `select wfvehicu.sp_manten_modveh(
                cast (${co_modveh} as integer),
                '${no_modveh}',
                '${co_marveh}'
            )`;
            bitacora.control(query, req.url)
            const modelos = await BD.storePostgresql(query);
            if (modelos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", modelos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", modelos }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)     
        }

    })

    // para borrar DELETE asdasdasdfasdf
    //app.delete("/api/modelos`, async (req, res, next) => {
    //    try {
       //    } catch (error) {
    //    }
    //})



}