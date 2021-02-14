const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")

// ``

module.exports = async (app) => {
    // TRAER VEHICULOS
    app.get(`/api/${process.env.VERSION}/vehiculos/:plaveh`, async (req, res, next) => {
        try {
            let query;
            const co_plaveh = req.params.plaveh;
            console.log(co_plaveh);
            if (co_plaveh == 'all') {
                query = `select * from wfvehicu.sp_mostrar_vehicu('')`;
            } else {
                query = `select * from wfvehicu.sp_mostrar_vehicu('${co_plaveh}')`;
            }
            bitacora.control(query, req.url)
            const vehiculos = await BD.storePostgresql(query);
            // con esto muestro msj
            if (vehiculos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", vehiculos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", vehiculos }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // AGREGAR VEHICULOS
    app.post(`/api/${process.env.VERSION}/vehiculos`, async (req, res, next) => {
        try {
            const co_plaveh = req.body.co_plaveh;
            var co_modveh = req.body.co_modveh;
            var nu_anofab = req.body.nu_anofab;
            var nu_serveh = req.body.nu_serveh;
            var nu_motveh = req.body.nu_motveh;
            var no_colveh = req.body.no_colveh;

            const query = `select wfvehicu.sp_manten_vehicu(
                cast (null as integer),
                '${co_plaveh}',
                '${co_modveh}',
                '${nu_anofab}',
                '${nu_serveh}',
                '${nu_motveh}',
                '${no_colveh}'
            )`;
            // console.log(query);
            bitacora.control(query, req.url)
            const vehiculos = await BD.storePostgresql(query);
            if (vehiculos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", vehiculos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", vehiculos }).status(500)
            }
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })

    // ACTUALIZAR VEHICULOS
    app.put(`/api/${process.env.VERSION}/vehiculos`, async (req, res, next) => {
        try {
            const co_vehicu = req.body.co_vehicu;
            const co_plaveh = req.body.co_plaveh;
            var co_modveh = req.body.co_modveh;
            var nu_anofab = req.body.nu_anofab;
            var nu_serveh = req.body.nu_serveh;
            var nu_motveh = req.body.nu_motveh;
            var no_colveh = req.body.no_colveh;

            if (co_vehicu == 'undefined') {
                miExcepcionVehiculo = new miExcepcionVehiculo("Falta definir código de vehiculo.");
                throw miExcepcionVehiculo;
            }
            const query = `select wfvehicu.sp_manten_vehicu(
                cast (${co_vehicu} as integer),
                '${co_plaveh}',
                '${co_modveh}',
                '${nu_anofab}',
                '${nu_serveh}',
                '${nu_motveh}',
                '${no_colveh}'
            )`;
            bitacora.control(query, req.url)
            const vehiculos = await BD.storePostgresql(query);
            if (vehiculos.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", vehiculos }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", vehiculos }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para borrar DELETE asdasdasdfasdf
    //app.delete("/api/vehiculos`, async (req, res, next) => {
    //    try {
       //    } catch (error) {
    //    }
    //})



}