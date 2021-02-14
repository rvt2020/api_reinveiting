const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    ///////////////////////////////////////////// TCSERVIC ///////////////////////////////////
    // mostrar tcservic
    app.get(`/api/${process.env.VERSION}/operac/tcservic/:nom_ser`, async (req, res, next) => {
        try {
            let query;
            var nom_ser = req.params.nom_ser;
            if (nom_ser == null || nom_ser.trim() =='' || nom_ser == '-1') {
                query = `select * from reoperac.tcservic`;
            } else {
                query = `select * from reoperac.tcservic 
                where no_servic ilike '%${nom_ser}%'`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para insertar o modificar tcservic
    app.post(`/api/${process.env.VERSION}/operac/tcservic`, async (req, res, next) => {
        try {
            let query;
            var nom_ser = req.body.nom_ser;
            var cod_ser = req.body.cod_ser;

            if (cod_ser == null || cod_ser.trim() =='') { // INSERTAR
                query = `select * from reoperac.fb_ins_act_tcservic(
                    NULL, 
                    '${nom_ser}'
                )`;
            } else {
                query = `select * from reoperac.fb_ins_act_tcservic(
                    cast (${cod_ser} as integer), 
                    '${nom_ser}'
                )`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                if (operac[0].co_respue == '-1') {
                    res.json({ res: 'ko', message: operac[0].no_respue }).status(500)
                }else{
                    res.json({ res: 'ok', message: operac[0].no_respue }).status(200)
                }
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // ELIMINAR 
    app.delete(`/api/${process.env.VERSION}/operac/tcservic`, async (req, res, next) => {
        try {
            let query;
            var cod_ser = req.body.cod_ser;

            query = `delete from reoperac.tcservic where co_servic = ${cod_ser}`;
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Se eliminó el dato."} ).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })


    /////////////////////////////////////TCTIPSER///////////////////////////////////
    // mostrar 
    app.get(`/api/${process.env.VERSION}/operac/tctipser/:nom_ser`, async (req, res, next) => {
        try {
            let query;
            var nom_ser = req.params.nom_ser;
            if (nom_ser == null || nom_ser.trim() =='' || nom_ser == '-1') {
                query = `select * from reoperac.tctipser`;
            } else {
                query = `select * from reoperac.tctipser 
                where no_tipser ilike '%${nom_ser}%'`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            //para agregar una fila al array y/o una columna al estilo BENN
            /*
            const benja = [];
            for(var i=0; i<operac.length; i++) {
                benja.push({
                    ti_servic: operac[i].ti_servic, 
                    no_tipser: operac[i].no_tipser,
                    no_agrega: 'placa_vehiculo'
                });
            }
            */
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para insertar o modificar TCTIPSER
    app.post(`/api/${process.env.VERSION}/operac/tctipser`, async (req, res, next) => {
        try {
            let query;
            var nom_ser = req.body.nom_ser;
            var tip_ser = req.body.tip_ser;

            if (tip_ser == null || tip_ser.trim() =='') { // INSERTAR
                query = `select * from reoperac.fb_ins_act_tctipser(
                    NULL, 
                    '${nom_ser}'
                )`;
            } else {
                query = `select * from reoperac.fb_ins_act_tctipser(
                    cast (${tip_ser} as integer), 
                    '${nom_ser}'
                )`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                if (operac[0].co_respue == '-1') {
                    res.json({ res: 'ko', message: operac[0].no_respue }).status(500)
                }else{
                    res.json({ res: 'ok', message: operac[0].no_respue }).status(200)
                }
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // ELIMINAR 
    app.delete(`/api/${process.env.VERSION}/operac/tctipser`, async (req, res, next) => {
        try {
            let query;
            var tip_ser = req.body.tip_ser;

            query = `delete from reoperac.tctipser where ti_servic = ${tip_ser}`;
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Se eliminó el dato."} ).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    ///////////////////////////////////////////// TCTIPTRA ///////////////////////////////////
    // mostrar 
    app.get(`/api/${process.env.VERSION}/operac/tctiptra/:nom_tra`, async (req, res, next) => {
        try {
            let query;
            var nom_tra = req.params.nom_tra;
            if (nom_tra == null || nom_tra.trim() =='' || nom_tra == '-1') {
                query = `select * from reoperac.tctiptra`;
            } else {
                query = `select * from reoperac.tctiptra 
                where no_tiptra ilike '%${nom_tra}%'`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })


    // para insertar o modificar 
    app.post(`/api/${process.env.VERSION}/operac/tctiptra`, async (req, res, next) => {
        try {
            let query;
            var tip_tra = req.body.tip_tra;
            var nom_tra = req.body.nom_tra;
            var sub_tra = req.body.sub_tra;
            var cod_uni = req.body.cod_uni;

            if (tip_tra == null || tip_tra.trim() =='') { // INSERTAR
                if (nom_tra == null || nom_tra.trim() ==''){
                    res.json({ res: 'ko', message: "Definir nom_tra: nombre del tipo de trabajo" }).status(500)
                }
                if (sub_tra == null || sub_tra.trim() ==''){
                    res.json({ res: 'ko', message: "Definir sub_tra: subnombre del tipo de trabajo" }).status(500)
                }
                if (cod_uni == null || cod_uni.trim() ==''){
                    res.json({ res: 'ko', message: "Definir cod_uni: unidad de medida del tipo de trabajo" }).status(500)
                }
                query = `select * from reoperac.fb_ins_act_tctiptra(
                    NULL, 
                    '${nom_tra}',
                    '${sub_tra}',
                    cast (${cod_uni} as smallint)
                )`;
            } else {
                if (nom_tra == null || nom_tra.trim() ==''){
                    nom_tra = '&';
                }
                if (sub_tra == null || sub_tra.trim() ==''){
                    sub_tra = '&';
                }
                if (cod_uni == null || cod_uni.trim() ==''){
                    cod_uni = '-1';
                }
                query = `select * from reoperac.fb_ins_act_tctiptra(
                    cast (${tip_tra} as integer), 
                    '${nom_tra}',
                    '${sub_tra}',
                    cast (${cod_uni} as smallint)
                )`;
            }
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                if (operac[0].co_respue == '-1') {
                    res.json({ res: 'ko', message: operac[0].no_respue }).status(500)
                }else{
                    res.json({ res: 'ok', message: operac[0].no_respue }).status(200)
                }
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // ELIMINAR 
    app.delete(`/api/${process.env.VERSION}/operac/tctiptra`, async (req, res, next) => {
        try {
            let query;
            var tip_tra = req.body.tip_tra;

            query = `delete from reoperac.tctiptra where ti_tratal = ${tip_tra}`;
            bitacora.control(query, req.url)
            const operac = await BD.storePostgresql(query);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Se eliminó el dato."} ).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })


}