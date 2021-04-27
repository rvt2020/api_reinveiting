const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
    // INSERTAR BOLETA O FACTURA
    app.post(`/api/${process.env.VERSION}/finanz/insert_factur`, async (req, res, next) => {
        try {
            let query1;
            var pn_regist = req.body.pn_regist;
            var fe_emisio = req.body.fe_emisio;
            var ti_docume = req.body.ti_docume;
            var nu_docume = req.body.nu_docume;
            var co_person = req.body.co_person;
            
            query1 = `select * from wffactur.fb_insert_factur(
                ${pn_regist},
                '${fe_emisio}',
                ${ti_docume},
                '${nu_docume}',
                ${co_person}
            )`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
            if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac[0].no_respue }).status(500);
            }
            res.json({ res: "ok", message: operac[0].no_respue }).status(200);
        } else {
            res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    // ACTUALIZAR BOLETA O FACTURA

    // ANULAR BOLETA O FACTURA

    // LISTA DE FACTURAS ///
    app.post(`/api/${process.env.VERSION}/finanz/listar_factur`, async (req, res, next) => {
        try {
            let query1;
            var fe_regdes = req.body.fe_regdes;
            var fe_reghas = req.body.fe_reghas;
            var no_client = req.body.no_client;
            var nu_factur = req.body.nu_factur;
            var co_operac = req.body.co_operac;

            if(fe_regdes == null || fe_regdes.trim() == ''){fe_regdes = '';}
            if(fe_reghas == null || fe_reghas.trim() == ''){fe_reghas = '';}
            if(no_client == null || no_client.trim() == ''){no_client = '';}
            if(nu_factur == null || nu_factur.trim() == ''){nu_factur = '';}
            if(co_operac == null || co_operac.trim() == ''){co_operac = '';}

            query1 = `
            select 
                co_factur,
                fe_emisio,
                co_docide,
                no_client,
                nu_docume,
                no_estado,
                im_basimp,
                im_impigv,
                im_totfac 
            from wffactur.fb_listar_factur(
                '${fe_regdes}', 
                '${fe_reghas}', 
                '${no_client}', 
                '${nu_factur}', 
                '${co_operac}'
            )`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
            // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res.json({ res: "ko", message: "Error en la query", operac }).status(500);
            }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    // INFORMACIÓN DE LA BOLETA O FACTURA
    app.post(`/api/${process.env.VERSION}/finanz/inform_factur`, async (req, res, next) => {
        try {
            let query1;
            var co_factur = req.body.co_factur;

            query1 = `select * from wffactur.fb_inform_factur(${co_factur})`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res
                .json({ res: "ko", message: "Error en la query", operac })
                .status(500);
            }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    // LISTAR PENDIENTE DE COBRANZA


    // DETALLE DE CADA BOLETA O FACTURA
    app.post(`/api/${process.env.VERSION}/finanz/listar_detall_factur`, async (req, res, next) => {
        try {
            let query1;
            var co_factur = req.body.co_factur;

            query1 = `select * from wffactur.fb_listar_detall_factur( '${co_factur}' )`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res
                .json({ res: "ko", message: "Error en la query", operac })
                .status(500);
            }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    // LISTAR OPERACIONES ENCOTRADOS FACTURAS
    app.post(`/api/${process.env.VERSION}/finanz/listar_operac_encont`, async (req, res, next) => {
        try {
            let query1;

            var co_factur = req.body.co_factur;
            var co_operac = req.body.co_operac;
            var co_plaveh = req.body.co_plaveh;
            var no_client = req.body.no_client;

            query1 = `select * from wffactur.fb_listar_operac_encont(
                ${co_factur},
                '${co_operac}',
                '${co_plaveh}',
                '${no_client}'
            )`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
            // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res.json({ res: "ko", message: "Error en la query", operac }).status(500);
            }
        } catch (error) {
            res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });


    // MANTENIMIENTO DE PRODUCTOS TRAMITE DOCUMENTARIO ///
    app.post(`/api/${process.env.VERSION}/finanz/manten_detall_factur_operac`, async (req, res, next) => {
        try {
            let query1;
            
            var co_factur = req.body.co_factur;
            var co_operac = req.body.co_operac;
            var ti_accion = req.body.ti_accion;

            query1 = `select * from wffactur.fb_manten_detall_factur_operac(
                ${co_factur},
                ${co_operac},
                '${ti_accion}'
            )`;

            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res.json({ res: "ko", message: "Error en la query", operac }).status(500);
            }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    
    // CLIENTE
    app.get(`/api/${process.env.VERSION}/finanz/catalogo/tcclient`, async (req, res, next) => {
        try {
            let query1;

            query1 = `
                select pe.co_person, pbperson.f_no_person(pe.co_person) no_person
                from pbperson.tbperson pe, reoperac.tbopecli oc
                where pe.co_person = oc.co_client
                group by 1,2
                order by 2
            `;
            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res
                .json({ res: "ko", message: "Error en la query", operac })
                .status(500);
            }
        } catch (error) {
            res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });
    
    /// CATALOGO ENTIDAD FINANCIERA ///
    app.get(`/api/${process.env.VERSION}/finanz/catalogo/tcentfin`, async (req, res, next) => {
        try {
            let query1;

            query1 = `
            select co_entfin, no_entfin
            from wfpublic.tcentfin
            order by 2
            `;
            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res
                .json({ res: "ko", message: "Error en la query", operac })
                .status(500);
            }
        } catch (error) {
            res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });
    // TIPO DE MONEDA
    app.get(`/api/${process.env.VERSION}/finanz/catalogo/tcmoneda`, async (req, res, next) => {
        try {
            
            let query1;
            query1 = `
                select mo.co_moneda, mo.no_moneda
                from wfpublic.tcmoneda mo
                where mo.co_moneda in (15, 28)
                order by mo.co_moneda desc
            `;
        
            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res.json({ res: "ko", message: "Error en la query", operac }).status(500);
            }
        } catch (error) {
             res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

  /// TIPO DOCUMENTO
    app.get(`/api/${process.env.VERSION}/finanz/catalogo/tctipdoc`, async (req, res, next) => {
        try {
            let query1;
      
            query1 = `
                select ti_docume, no_docume
                from wfpublic.tcdocume
                where ti_docume in (11, 4)
                order by 2 
            `;
            bitacora.control(query1, req.url);
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                res.json({ res: "ok", message: "Success", operac }).status(200);
            } else {
                res
                .json({ res: "ko", message: "Error en la query", operac })
                .status(500);
            }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    // CON IGV

};
