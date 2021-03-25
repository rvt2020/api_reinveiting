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
        var ti_combus2 = req.body.ti_combus2 ? req.body.ti_combus2 : null;
        var nu_anoveh = req.body.nu_anoveh ? req.body.nu_anoveh : null;
        var no_marveh = req.body.no_marveh ? req.body.no_marveh : null;
        var no_modveh = req.body.no_modveh ? req.body.no_modveh : null;


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
        console.log(ti_combus2);
        console.log(nu_anoveh);
        console.log(no_marveh);
        console.log(no_modveh);
        
        //INSERT LANDINGS
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
            '${ti_perfil}',
	        ${ti_combus2},
            ${nu_anoveh},
            '${no_marveh}',
            '${no_modveh}'
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
        var co_result = req.body.co_result ? req.body.co_result : null; // resultado de gestion -> tcresult
        
        console.log(co_landin);
        console.log(ps_regist);
        console.log(co_estlla);
        console.log(co_resges);
        console.log(no_coment);
        console.log(co_result);

        //INSERT LANDING DE BITACORAS
        query1 = `select * from recomerc.fb_insert_bitges(
            ${co_landin},
            ${ps_regist},
            ${co_estlla},
            ${co_resges},
            '${no_coment}',
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

    
    // MUESTRA LA LISTA DE LANDING SIN GESTIONAR O SIN FINALIZAR
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
                }else if(ti_landin.toUpperCase() == '5'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, co_docide, no_apepat,
                        no_apemat, no_nombre, no_tipdoc, fe_nacimi, nu_telefo, 
                        co_plaveh, no_marmod, nu_anoveh, no_depart, no_provin, no_distri, 
                        no_tipcom, no_tipcom2, no_estado, no_respon
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
    
    app.post(`/api/${process.env.VERSION}/comerc/listar_landin_result`, async (req, res, next) => {
        try {            
            var fe_regdes = req.body.fe_regdes;
            var fe_reghas = req.body.fe_reghas;            
            var ti_landin = req.body.ti_landin;
            var co_person = req.body.co_person;
            var ti_estado = req.body.ti_estado;
            var query;
            
            
            if (fe_regdes == null || fe_regdes.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha inicio."}).status(500)
            }else if(fe_reghas == null || fe_reghas.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina Fecha Hasta."}).status(500)
            }else if(ti_landin == null || ti_landin.trim() == ''){
                res.json({ res: 'ko', message: "Por favor defina el tipo de landing"}).status(500)
            }else{
                if(ti_landin.toUpperCase() == '1' || ti_landin.toUpperCase() == '2'){ // Chapa tu Taxi || Moto Chamba || Moto Lineal 
                    if (ti_estado.toUpperCase() == '1' || ti_estado.toUpperCase() == '2') {
                        query = `select 
                            co_landin, no_tiplan, fe_regist, no_tipdoc, co_docide, no_apepat, 
                            no_apemat, no_nombre, fe_nacimi, no_estciv, nu_telefo, no_correo,
                            no_nivedu, no_perfil, no_liccon, de_experi, no_depart, no_provin, 
                            no_distri, no_estado, no_respon
                        from recomerc.fb_listar_landin_result(
                            '${fe_regdes}',
                            '${fe_reghas}',
                            '${ti_landin}',
                            ${co_person},
                            ${ti_estado}
                        );`;
                    } else if (ti_estado.toUpperCase() == '3' || ti_estado.toUpperCase() == '6') {
                        query = `select 
                            co_landin, no_tiplan, fe_regist, no_tipdoc, co_docide, no_apepat, 
                            no_apemat, no_nombre, fe_nacimi, no_estciv, nu_telefo, no_correo,
                            de_experi, no_depart, no_provin, no_distri, no_produc, no_tippla,
                            no_entida, no_estado, no_respon
                        from recomerc.fb_listar_landin_result(
                            '${fe_regdes}',
                            '${fe_reghas}',
                            '${ti_landin}',
                            ${co_person},
                            ${ti_estado}
                        );`;
                    } else if (ti_estado.toUpperCase() == '4' || ti_estado.toUpperCase() == '7') {
                        query = `select 
                            co_landin, no_tiplan, fe_regist, no_tipdoc, co_docide, no_apepat, 
                            no_apemat, no_nombre, fe_nacimi, no_estciv, nu_telefo, no_correo,
                            de_experi, no_depart, no_provin, no_distri, no_produc, no_tippla,
                            no_entida, no_exacvr, no_estado, no_respon
                        from recomerc.fb_listar_landin_result(
                            '${fe_regdes}',
                            '${fe_reghas}',
                            '${ti_landin}',
                            ${co_person},
                            ${ti_estado}
                        );`;
                    } else if (ti_estado.toUpperCase() == '5' || ti_estado.toUpperCase() == '8') {
                        query = `select 
                            co_landin, no_tiplan, fe_regist, no_tipdoc, co_docide, no_apepat, 
                            no_apemat, no_nombre, fe_nacimi, no_estciv, nu_telefo, no_correo,
                            de_experi, no_depart, no_provin, no_distri, no_produc, no_tippla,
                            no_entida, no_exacvr, fe_activa, fe_desemb, no_estado, no_respon
                        from recomerc.fb_listar_landin_result(
                            '${fe_regdes}',
                            '${fe_reghas}',
                            '${ti_landin}',
                            ${co_person},
                            ${ti_estado}
                        );`;
                    }
                }else if(ti_landin.toUpperCase() == '3'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, no_tipnac, no_tipdoc, 
                        co_docide, no_apepat, no_apemat, no_nombre, fe_nacimi, 
                        nu_telefo, no_liccon, no_correo, no_estado, no_respon
                    from recomerc.fb_listar_landin_result(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person},
                        ${ti_estado}
                    );`;   
                }else if(ti_landin.toUpperCase() == '4'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, co_docide, no_apepat,
                        no_apemat, no_nombre, no_tipdoc, fe_nacimi, nu_telefo, 
                        co_plaveh, no_tipcom, no_vehper, no_estado, no_respon
                    from recomerc.fb_listar_landin_result(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person},
                        ${ti_estado}
                    );`;   
                }else if(ti_landin.toUpperCase() == '5'){
                    query = `select 
                        co_landin, no_tiplan, fe_regist, co_docide, no_apepat,
                        no_apemat, no_nombre, no_tipdoc, fe_nacimi, nu_telefo, 
                        co_plaveh, no_marmod, nu_anoveh, no_depart, no_provin, no_distri, 
                        no_tipcom, no_tipcom2, no_estado, no_respon
                    from recomerc.fb_listar_landin_result(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_landin}',
                        ${co_person},
                        ${ti_estado}
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
                    ti_landin, no_tiplan, ca_precal, 
                    ca_rechaz, ca_sinter, ca_singes, 
                    ca_totges
                    from recomerc.fb_report_gestio(
                        '${fe_regdes}',
                        '${fe_reghas}',
                        '${ti_modrep}'
                    );`;
                }else if(ti_modrep.toUpperCase() == '2'){
                    query = `select 
                    ti_landin, no_tiplan, no_zongeo,
                    ca_precal, ca_rechaz, ca_sinter, 
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
                    ca_sinter, ca_singes, ca_totges
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

    // COMBO SI o NO
    app.get(`/api/${process.env.VERSION}/comerc/tcafirma`, async (req, res, next) => {
        try {            
            var query;
            query = `   
                select co_afirma, no_afirma
                from (
                    select 1 co_afirma, 'SI' as no_afirma union 
                    select 2, 'NO'
                ) as tx
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

    // COMBO APROBADO o RECHAZADO
    app.get(`/api/${process.env.VERSION}/comerc/tcaprrec`, async (req, res, next) => {
        try {            
            var query;
            query = `   
                select co_aprrec, no_aprrec
                from (
                    select 1 co_aprrec, 'APROBADO' as no_aprrec union 
                    select 2, 'RECHAZADO'
                ) as tx
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

    /// INSERTAR EL ARCADJ DE LANDING ///
    app.post(`/api/${process.env.VERSION}/comerc/insert_arcadj`, async (req, res, next) => {
        try {
        let query1;

        var co_landin = req.body.co_landin;
        var ti_docume = req.body.ti_docume;
        var co_arcadj = req.body.co_arcadj;
        var ti_accion = req.body.ti_accion;

        query1 = `select * from recomerc.fb_insert_arcadj(
            ${co_landin},
            ${ti_docume},
            '${co_arcadj}',
            '${ti_accion}'
        )`;

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
    
    /// INSERTAR EL ARCADJ DE LANDING ///
    app.post(`/api/${process.env.VERSION}/comerc/update_landin`, async (req, res, next) => {
        try {
        let query1;

        var co_landin = req.body.co_landin;
        var co_produc = req.body.co_produc;
        var co_entida = req.body.co_entida;
        var co_tippla = req.body.co_tippla;
        var il_exacvr = req.body.il_exacvr;
        var ti_estcvr = req.body.ti_estcvr;
        var il_comite = req.body.il_comite;
        var ti_estcmt = req.body.ti_estcmt;
        var es_carapr = req.body.es_carapr;
        var fe_activa = req.body.fe_activa;
        var fe_desemb = req.body.fe_desemb;

        query1 = `select * from recomerc.fb_update_landin(
                    ${co_landin},
                    ${co_produc},
                    ${co_entida},
                    ${co_tippla},
                    ${il_exacvr},
                    ${ti_estcvr},
                    ${il_comite},
                    ${ti_estcmt},
                    ${es_carapr},
                    '${fe_activa}',
                    '${fe_desemb}'
                )`;

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
    
    app.post(`/api/${process.env.VERSION}/comerc/listar_arcadj_landin`, async (req, res, next) => {
        try {
          let query1;
          var co_landin = req.body.co_landin;
    
          query1 = `select * from recomerc.fb_listar_arcadj_landin( 
                    cast (${co_landin} as integer)
                )`;
    
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

    // COMBO DE TIPO DE PRODUCTO
    app.get(`/api/${process.env.VERSION}/comerc/tcproduc`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select co_produc, no_produc
                from recomerc.tcproduc
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

    // COMBO DE TIPO DE PLAN
    app.get(`/api/${process.env.VERSION}/comerc/tctippla`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select co_tippla, no_tippla
                from recomerc.tctippla
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
    
    // COMBO DE ENTIDAD
    app.get(`/api/${process.env.VERSION}/comerc/tcentida`, async (req, res, next) => {
        try {            
            var query;
            query = `
                select pj.co_perjur, pj.no_comerc 
                from pbperson.tbperjur pj, pbperson.tbperson pe 
                where pj.co_perjur = pe.co_person 
                and pe.co_docide in ('20606118687','20438563084','20102881347')
                order by 2;
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
    
    // COMBO DE DOCUMENTOS
    app.get(`/api/${process.env.VERSION}/comerc/tcdocume`, async (req, res, next) => {
        try {  
            
            //8	"DNI"
            //14	"Licencia de Conducir"
            //9	"Recibo de Luz / Agua"
            //17  "Tarjeta de Propiedad"
            //16	"Carta de la asociación de la mototaxi"
            var query;
            query = `
                select ti_docume, no_docume
                from wfpublic.tcdocume
                where ti_docume in (8, 9, 14, 16, 17) 
                order by no_docume;
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
    
    // COMBO DE DOCUMENTOS DE ACTIVACION PRECALIFICADOS
    app.get(`/api/${process.env.VERSION}/comerc/tcdocumeactivapre`, async (req, res, next) => {
        try {  
            
            //8	"DNI"
            //14	"Licencia de Conducir"
            //9	"Recibo de Luz / Agua"
            //17  "Tarjeta de Propiedad"
            //16	"Carta de la asociación de la mototaxi"
            var query;
            query = `
                select ti_docume, no_docume
                from wfpublic.tcdocume
                where ti_docume in (4, 19, 20) 
                order by no_docume;
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

    // COMBO DE DOCUMENTOS RECHAZADOS
    app.get(`/api/${process.env.VERSION}/comerc/tcdocumerechaz`, async (req, res, next) => {
        try {  
            
            //8	"DNI"
            //14	"Licencia de Conducir"
            //9	"Recibo de Luz / Agua"
            //17  "Tarjeta de Propiedad"
            //16	"Carta de la asociación de la mototaxi"
            var query;
            query = `
                select ti_docume, no_docume
                from wfpublic.tcdocume
                where ti_docume in (8, 9) 
                order by no_docume;
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