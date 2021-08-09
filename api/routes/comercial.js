const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    
    // MUESTRA LA LISTA DE VEHICULOS
    app.post(`/api/${process.env.VERSION}/comercial/listado_vehiculo`, async (req, res, next) => {
        try {   
            var co_plaveh = req.body.co_plaveh;         
            var query;
            query = `   
                select co_vehicu,
                co_plaveh,
                no_marveh,
                no_modveh,
                no_verveh,
                nu_anomod,
                nu_anofab,
                no_colveh,
                nu_serveh,
                nu_motveh,
                nu_asiveh
                from reventas.fb_listado_vehiculo(
                    '${co_plaveh}'
                );`;
                
            bitacora.control(query, req.url)
            const resultado = await BD.storePostgresql(query);
            if (resultado.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", resultado}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
            }            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }
    
    })

    
    /// INFORMACIÓN DEL VEHICULO SELECCIONADO
    app.post(`/api/${process.env.VERSION}/comercial/datos_vehiculo`, async (req, res, next) => {
        try {
        let query1;
        var co_vehicu = req.body.co_vehicu;

        query1 = `select * from reventas.fb_datos_vehiculo( 
                    cast (${co_vehicu} as integer)
                )`;

        bitacora.control(query1, req.url);
        const resultado = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (resultado.codRes != 99) {
            // con esto muestro msj
            res.json({ res: "ok", message: "Success", resultado }).status(200);
        } else {
            res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

}