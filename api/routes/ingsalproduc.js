const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {

/******************   FUJO DE INGRESO Y SALIDA DE PRODUCTOS  *************************/


/// LISTAR ORDENES DE COMPRA PARA DAR EL INGRESO  ///
app.post(`/api/${process.env.VERSION}/ingsalmat/listar_ordcom_ingres`, async (req, res, next) => {
    try {
        let query1;
        
        var fe_regdes = req.body.fe_regdes;
        var fe_reghas = req.body.fe_reghas;
        var no_provee = req.body.no_provee;
        var nu_ordcom = req.body.nu_ordcom;

        if(fe_regdes == null || fe_regdes.trim() == ''){fe_regdes = '';}
        else if(fe_reghas == null || fe_reghas.trim() == ''){fe_reghas = '';}
        else if(no_provee == null || no_provee.trim() == ''){no_provee = '';}
        else if(nu_ordcom == null || nu_ordcom.trim() == ''){nu_ordcom = '';}
        else {
            query1 = `select * from wfalmace.fb_listar_ordcom_ingres(
                '${fe_regdes}', 
                '${fe_reghas}',
                '${no_provee}', 
                '${nu_ordcom}'
            )`;
            
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        }
    } catch (error) {
        res.json({ res: 'ko', message: "Error controlado", error }).status(500)
    }

})

///  LISTAR TRAMITES DOCUMENTARIO PARA DAR EL INGRESO
app.post(`/api/${process.env.VERSION}/ingsalmat/listar_tradoc_ingres`, async (req, res, next) => {
    try {
        let query1;
        
        var fe_regdes = req.body.fe_regdes;
        var fe_reghas = req.body.fe_reghas;
        var no_provee = req.body.no_provee;
        var nu_tradoc = req.body.nu_tradoc;

        if(fe_regdes == null || fe_regdes.trim() == ''){fe_regdes = '';}
        else if(fe_reghas == null || fe_reghas.trim() == ''){fe_reghas = '';}
        else if(no_provee == null || no_provee.trim() == ''){no_provee = '';}
        else if(nu_tradoc == null || nu_ordcom.trim() == ''){nu_tradoc = '';}
        else {
            query1 = `select * from wfalmace.fb_listar_tradoc_ingres(
                '${fe_regdes}', 
                '${fe_reghas}',
                '${no_provee}', 
                '${nu_tradoc}'
            )`;
            
            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", operac}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        }
    } catch (error) {
        res.json({ res: 'ko', message: "Error controlado", error }).status(500)
    }

})

///  INGRESO POR ORDEN DE COMPRA  ///






///  INGRESO POR TRAMITE DOCUMENTARIO  ///



///  LISTAR LAS OPERACIONES PARA DAR SALIDA



///  SALIDA POR OPERACIONES  ///


///// BUSCAR OPERACION
    app.post(`/api/${process.env.VERSION}/operacflujo/buscar_operacion`, async (req, res, next) => {
        try {
            let query1;
            var cod_ope = req.body.cod_ope;
            var pla_veh = req.body.pla_veh;
            var fec_ini = req.body.fec_ini;
            var fec_fin = req.body.fec_fin;

            if (cod_ope == null || cod_ope.trim() == ''){
                cod_ope = '';
            }
            if (pla_veh == null || pla_veh.trim() == ''){
                pla_veh = '';
            }      
            if (fec_ini == null || fec_ini.trim() == ''){
                fec_ini = '';
            }       
            if (fec_fin == null || fec_fin.trim() == ''){
                fec_fin = '';
            }
            query1 = `
                select * from reoperac.fbmostrar_lista_operaciones(
                    '${cod_ope}',
                    '${pla_veh}',
                    '${fec_ini}',
                    '${fec_fin}'
                );
            `;
            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", result}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })


}