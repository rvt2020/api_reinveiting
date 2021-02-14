const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {
    
    /// INSERTAR LANDING
    app.post(`/api/${process.env.VERSION}/comerc/insert_landin`, async (req, res, next) => {
        try {
        let query1;
            
        var ti_landin = req.body.ti_landin;
        var no_apepat = req.body.no_apepat;
        var no_apemat = req.body.no_apemat;
        var no_nombre = req.body.no_nombre;
        var co_docide = req.body.co_docide;
        var ti_docide = req.body.ti_docide;
        var ti_nacion = req.body.ti_nacion;
        var fe_nacimi = req.body.fe_nacimi;
        var no_correo = req.body.no_correo;
        var nu_telefo = req.body.nu_telefo;
        var va_experi = req.body.va_experi ? req.body.va_experi : null;
        var ti_liccon = req.body.ti_liccon ? req.body.ti_liccon : null;
        var co_ubigeo = req.body.co_ubigeo;
        var co_plaveh = req.body.co_plaveh;
        var co_modveh = req.body.co_modveh ? req.body.co_modveh : null;
        var ti_vehper = req.body.ti_vehper;
        var ti_combus = req.body.ti_combus ? req.body.ti_combus : null;
        var co_estciv = req.body.co_estciv;
        var co_nivedu = req.body.co_nivedu ? req.body.co_nivedu : null;
        var ti_perfil = req.body.ti_perfil ? req.body.ti_perfil : null;

        console.log(ti_landin);
        console.log(no_apepat);
        console.log(no_apemat);
        console.log(no_nombre);
        console.log(co_docide);
        console.log(ti_docide);
        console.log(ti_nacion);
        console.log(fe_nacimi);
        console.log(no_correo);
        console.log(nu_telefo);
        console.log(va_experi);
        console.log(ti_liccon);
        console.log(co_ubigeo);
        console.log(co_plaveh);
        console.log(co_modveh);
        console.log(ti_vehper);
        console.log(ti_combus);
        console.log(co_estciv);
        console.log(co_nivedu);
        console.log(ti_perfil);
    
        //INSERT LANDING
        query1 = `select * from recomerc.fb_insert_landin(
            ${ti_landin},
            '${no_apepat}',
            '${no_apemat}',
            '${no_nombre}',
            '${co_docide}',
            ${ti_docide},
            '${ti_nacion}',
            '${fe_nacimi}',
            '${co_estciv}',
            '${no_correo}',
            '${nu_telefo}',
            ${va_experi},
            ${ti_liccon},
            ${co_ubigeo},
            '${co_plaveh}',
            ${co_modveh},
            '${ti_vehper}',
            ${ti_combus},
            ${co_nivedu},
            '${ti_perfil}'
        );`;

        console.log(query1);

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: operac[0].no_respue }).status(200);
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });


    /// INSERTAR DE BITÁCORA DE GESTIÓN
    app.post(`/api/${process.env.VERSION}/comerc/insert_bitges`, async (req, res, next) => {
        try {
        let query1;
        
        var co_landin = req.body.co_landin; // id landing
        var ps_regist = req.body.ps_regist; // persona registra
        var co_estlla = req.body.co_estlla ? req.body.co_estlla : null; // estado de la llamada -> tcestlla
        var co_resges = req.body.co_resges ? req.body.co_resges : null; // resultado de la gestion -> tcresges
        var no_coment = req.body.no_coment; // comentario
        var co_estdoc = req.body.co_estdoc ? req.body.co_estdoc : null; // estado del documento -> tcestdoc
        var ti_expsis = req.body.ti_expsis ? req.body.ti_expsis : null; // tipo de exé de sistema -> tcexpsis
        var co_expedi = req.body.co_expedi; // codigo de expediente
        var il_conver = req.body.il_conver ? `${req.body.il_conver}` : null; // converus -> tcvalcvr
        var fe_citcvr = req.body.fe_citcvr ? req.body.fe_citcvr : null; // fecha cita -> tipo fecha
        var co_rescvr = req.body.co_rescvr ? req.body.co_rescvr : null; // resultado converus -> tcrescvr
        var co_result = req.body.co_result ? req.body.co_result : null; // resultado de gestion -> tcresult
        
        console.log(co_landin);
        console.log(ps_regist);
        console.log(co_estlla);
        console.log(co_resges);
        console.log(no_coment);
        console.log(co_estdoc);
        console.log(ti_expsis);
        console.log(co_expedi);
        console.log(il_conver);
        console.log(fe_citcvr);
        console.log(co_rescvr);
        console.log(co_result);



        //INSERT LANDING
        query1 = `select * from recomerc.fb_insert_bitges(
            ${co_landin},
            ${ps_regist},
            ${co_estlla},
            ${co_resges},
            '${no_coment}',
            ${co_estdoc},
            ${ti_expsis},
            '${co_expedi}',
            ${il_conver},
            ${fe_citcvr},
            ${co_rescvr},
            ${co_result}
        );`;

        console.log(query1);

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: operac[0].no_respue }).status(200);
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    
    // MUESTRA LA LISTA DE LANDING
    app.post(`/api/${process.env.VERSION}/comerc/listar_landin`, async (req, res, next) => {
        try {            
            var fe_regdes = req.body.fe_regdes;
            var fe_reghas = req.body.fe_reghas;            
            var ti_landin = req.body.ti_landin;
            var co_person = req.body.co_person;

            var query;
            
            
            if (fe_regdes == null || fe_regdes.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha inicio."}).status(500)
            }else if(fe_reghas == null || fe_reghas.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha Hasta."}).status(500)
            }else if(ti_landin == null || ti_landin.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina el tipo de landing"}).status(500)
            }else{
                if(ti_landin.toUpperCase() == '1' || ti_landin.toUpperCase() == '2'){ // Chapa tu Taxi || Moto Chamba || Moto Lineal 
                    query = `select 
                        co_landin, no_tiplan, fe_regist, no_tipdoc, co_docide, no_apepat, 
                        no_apemat, no_nombre, fe_nacimi, no_estciv, nu_telefo, no_correo,
                        no_nivedu, no_perfil, no_liccon, de_experi, no_depart, no_provin, 
                        no_distri, no_estado, no_respon
                    from recomerc.fb_listar_landin(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person}
                    );`;
                }else if(ti_landin.toUpperCase() == '3'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, no_tipnac, no_tipdoc, 
                        co_docide, no_apepat, no_apemat, no_nombre, fe_nacimi, 
                        nu_telefo, no_liccon, no_correo, no_estado, no_respon
                    from recomerc.fb_listar_landin(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person}
                    );`;   
                }else if(ti_landin.toUpperCase() == '4'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, co_docide, no_apepat,
                        no_apemat, no_nombre, no_tipdoc, fe_nacimi, nu_telefo, 
                        co_plaveh, no_tipcom, no_vehper, no_estado, no_respon
                    from recomerc.fb_listar_landin(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person}
                    );`;   
                }
                
                bitacora.control(query, req.url)
                const resultado = await BD.storePostgresql(query);
                if (resultado.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Success", resultado}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
                }
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }
    
    })

    // REPORTE DE GESTIONES
    app.post(`/api/${process.env.VERSION}/comerc/report_gestio`, async (req, res, next) => {
        try {            
            var fe_regdes = req.body.fe_regdes;
            var fe_reghas = req.body.fe_reghas;            
            var ti_modrep = req.body.ti_modrep;

            var query;
            
            
            if (fe_regdes == null || fe_regdes.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha inicio."}).status(500)
            }else if(fe_reghas == null || fe_reghas.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha Hasta."}).status(500)
            }else if(ti_modrep == null || ti_modrep.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina el tipo de Reporte"}).status(500)
            }else{
                if(ti_modrep.toUpperCase() == '1'){ // Chapa tu Taxi || Moto Chamba || Moto Lineal 
                    query = `select 
                        ti_landin, no_tiplan, 
                        ca_precal, ca_rechaz, 
                        ca_singes, ca_totges
                    from recomerc.fb_report_gestio(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_modrep}'
                    );`;
                }else if(ti_modrep.toUpperCase() == '2'){
                    query = `select 
                        ti_landin, no_tiplan, no_zongeo,
                        ca_precal, ca_rechaz, 
                        ca_singes, ca_totges
                    from recomerc.fb_report_gestio(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_modrep}'
                    );`;   
                }else if(ti_modrep.toUpperCase() == '3'){
                    query = `select 
                        ti_landin, no_tiplan, no_asesor,
                        no_zongeo, ca_precal, ca_rechaz, 
                        ca_singes, ca_totges
                    from recomerc.fb_report_gestio(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_modrep}'
                    );`;   
                }
                
                bitacora.control(query, req.url)
                const resultado = await BD.storePostgresql(query);
                if (resultado.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Success", resultado}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
                }
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
        }
    
    })
    
    // MUESTRA LA LISTA DE BITÁCORA
    app.post(`/api/${process.env.VERSION}/comerc/listar_bitaco`, async (req, res, next) => {
        try {   
            var co_landin = req.body.co_landin;         
            var query;
            query = `   
                select co_landin, fe_regist, no_person, no_estlla, no_resges,
                    no_coment, no_estdoc, no_expsis, co_expedi, il_conver, fe_citcvr,
                    no_rescvr, no_result
                from recomerc.fb_listar_bitaco(
                    ${co_landin}
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

    // COMBO DE TIPO DE LANDING
    app.get(`/api/${process.env.VERSION}/comerc/tctiplan`, async (req, res, next) => {
        try {            
            var query;
            query = `   
                select ti_landin, no_tiplan
                from recomerc.tctiplan
                order by 1;
            `;  
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
    // --------------------------------- COMBOS DE BITÁCORA ---------------------------------------------------
    
    // COMBO DE ESTADO DE LA LLAMADA
    app.get(`/api/${process.env.VERSION}/comerc/tcestlla`, async (req, res, next) => {
        try {            
            var query;
            query = `   
                select co_estlla, no_estlla
                from recomerc.tcestlla
                order by 1;
            `;  
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

    // COMBO DE ESTADO DE DOCUMENTACIÓN
    app.get(`/api/${process.env.VERSION}/comerc/tcestdoc`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as co_estdoc, '' as no_estdoc union    
                select co_estdoc, no_estdoc
                from recomerc.tcestdoc
                order by 1;
            `;  
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
    
    // COMBO DE EXPEDIENTE EN SISTEMA
    app.get(`/api/${process.env.VERSION}/comerc/tcexpsis`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as ti_expsis, '' as no_expsis union    
                select ti_expsis, no_expsis
                from recomerc.tcexpsis
                order by 1;
            `;  
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

    // COMBO DE SI FUE O NO CONVERUS
    app.get(`/api/${process.env.VERSION}/comerc/tcvalcvr`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as ti_valcvr, '' as no_valcvr union    
                select 1 as ti_valcvr, 'SI' as no_valcvr union
                select 2 as ti_valcvr, 'NO' as no_valcvr
                order by 1;
            `;  
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

    // COMBO DE RESULTADO CONVERUS
    app.get(`/api/${process.env.VERSION}/comerc/tcrescvr`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as co_rescvr, '' as no_rescvr union    
                select co_rescvr, no_rescvr
                from recomerc.tcrescvr
                order by 1;
            `;  
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

    // COMBO DE RESULTADO LA GESTIÓN
    app.get(`/api/${process.env.VERSION}/comerc/tcresges`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as co_resges, '' as no_resges union    
                select co_resges, no_resges
                from recomerc.tcresges
                order by 1;
            `;  
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

    // COMBO DE RESULTADO FINAL
    app.get(`/api/${process.env.VERSION}/comerc/tcresult`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select 0 as co_result, '' as no_result union    
                select co_result, no_result
                from recomerc.tcresult
                order by 1;
            `;  
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

    

}