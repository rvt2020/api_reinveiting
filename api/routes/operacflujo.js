const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {

// MODULO NUEVA OPERACIÓN/////////////////
    //mostrar ingresos de vehiculos
    app.post(`/api/${process.env.VERSION}/operacflujo/mostrar_ingreso`, async (req, res, next) => {
        try {
            let query;
            var fec_ini = req.body.fec_ini;
            var fec_fin = req.body.fec_fin;
            var pla_veh = req.body.pla_veh;

            if (fec_ini == null || fec_ini.trim() =='') { 
                fec_ini = '';
            };
            if (fec_fin == null || fec_fin.trim() =='') {
                fec_fin = '';
            }
            if (pla_veh == null || pla_veh.trim() =='') {
                pla_veh = '';
            }
            query = `select * from readuana.fbmostrar_ing_veh(
                '${fec_ini}',
                '${fec_fin}',
                '${pla_veh}'
            )`;

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

    ///// para ingresar nueva operación

    //combo cliente
    app.get(`/api/${process.env.VERSION}/operacflujo/combo_cliente`, async (req, res, next) => {
        try {
            let query1 = `
            select 
                pe.co_person, 
                pe.co_docide,
                pn.no_apepat,
                pn.no_apemat,
                pn.no_nombre,
                (pbperson.f_no_person(pe.co_person) || '  -  ' || pe.co_docide)  as no_person
            from pbperson.tbperson pe
            left join pbperson.tbpernat pn on pe.co_person = pn.co_pernat 
            order by 2
        `;
            bitacora.control(query1, req.url)
            const client = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (client.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", client}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", client }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    //combo REFERIDO
    app.get(`/api/${process.env.VERSION}/operacflujo/combo_referido`, async (req, res, next) => {
        try {
            let query1 = `
            select 
                co_pernat as co_referi,
                (
                    no_apepat||' '||no_apemat||' '||no_nombre
                )  as no_referi
            from pbperson.tbpernat
            where co_pernat not in (1, 2, 5)
            order by co_pernat, no_apepat
        `;
            bitacora.control(query1, req.url)
            const client = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (client.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", client}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", client }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })


    // listado que muestra vehiculos enlazados al ingreso VEH. 
    app.get(`/api/${process.env.VERSION}/operacflujo/lista_vehiculo_ingreso/:cod_adu`, async (req, res, next) => {
        try {
            var cod_adu = req.params.cod_adu;
            let query1 = `
                select 
                    tv.co_aduana, tb.fe_aduana, vh.co_plaveh, vma.no_marveh, vm.no_modveh, 
                    vh.nu_anomod, vh.no_colveh, vh.nu_serveh, vh.nu_motveh
                from readuana.tbaduana tb
                left join readuana.tbaduveh tv on tb.co_aduana = tv.co_aduana
                left join wfvehicu.tbvehicu vh on tv.co_vehicu = vh.co_vehicu
                left join wfvehicu.tcverveh vv on vh.co_verveh = vv.co_verveh
                left join wfvehicu.tcmodveh vm on vv.co_modveh = vm.co_modveh
                left join wfvehicu.tcmarveh vma on vm.co_marveh = vma.co_marveh
                where tb.co_aduana = cast ('${cod_adu}' as integer);
            `;
            bitacora.control(query1, req.url)
            const vehic = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (vehic.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", vehic}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", vehic }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    //// nueva operacion
    app.post(`/api/${process.env.VERSION}/operacflujo/nueva_operacion`, async (req, res, next) => {
        try {
            let query1;
            var cod_adu = req.body.cod_adu;
            var cod_per = req.body.cod_per;
            var cod_usu = req.body.cod_usu;
            var cod_ref = req.body.cod_ref;

            if (cod_adu == null || cod_adu.trim() == ''){
                res.json({ res: 'ko', message: "El código aduana NO esta definido."}).status(500)
            }
            if (cod_per == null || cod_per.trim() == ''){
                res.json({ res: 'ko', message: "El código de persona NO esta definido."}).status(500)
            }
            if (cod_usu == null || cod_usu.trim() == ''){
                res.json({ res: 'ko', message: "El codigo de usuario NO esta definido."}).status(500)
            }
    
            query1 = `select * from readuana.fb_genera_opera(
                cast ('${cod_adu}' as integer),
                cast ('${cod_per}' as integer),
                cast ('${cod_usu}' as integer),
                ${cod_ref}
             )`;

            bitacora.control(query1, req.url)
            const operac = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (operac.codRes != 99) {
                // con esto muestro msj
                if (operac[0].co_respue == '-1'){
                    res.json({ res: 'ko', message: operac[0].no_respue }).status(500)
                }
                res.json({ res: 'ok', message: operac[0].co_respue }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", operac }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })

    //////////////////// mostrar info de operacion (ABRIR OPERACION)

    // listado que muestra vehiculos enlazados al ingreso VEHICULO
    app.get(`/api/${process.env.VERSION}/operacflujo/abrir_operacion/:cod_ope`, async (req, res, next) => {
        try {
            var cod_ope = req.params.cod_ope;

            let q_opera = `select * from reoperac.fbmostrar_datos_operac(
                cast ('${cod_ope}' as integer)
            );`;
            
            let q_vehic = `
                select 
                    ve.co_plaveh, ma.no_marveh,
                    mo.no_modveh, vv.no_verveh,
                    ve.nu_anomod, ve.no_colveh,
                    ve.nu_serveh, ve.nu_motveh,
                    pe.co_docide, pbperson.f_no_person(pe.co_person) no_client,
                    pbperson.f_no_person(oc.co_referi) no_referi
                from pbperson.tbperson pe, reoperac.tbopecli oc, reoperac.tbopeveh op, wfvehicu.tbvehicu ve
                left join wfvehicu.tcverveh vv on ve.co_verveh = vv.co_verveh
                left join wfvehicu.tcmodveh mo on vv.co_modveh = mo.co_modveh
                left join wfvehicu.tcmarveh ma on mo.co_marveh = ma.co_marveh
                where pe.co_person = oc.co_client 
                and oc.co_operac = op.co_operac
                and op.co_vehicu = ve.co_vehicu
                and op.co_operac = cast ('${cod_ope}' as integer)
            `;
            let q_clien = `
                select tp.ti_person, tp.no_tipper, pe.co_person, 
                    pbperson.f_no_person(pe.co_person) no_person, pe.co_docide,
                    pbperson.f_no_person(op.co_referi) no_referi
                from reoperac.tbopecli op, pbperson.tbperson pe, pbperson.tcdocide td, pbperson.tctipper tp
                where op.co_client = pe.co_person
                and pe.ti_docide = td.ti_docide
                and pe.ti_person = tp.ti_person
                and op.co_operac = cast ('${cod_ope}' as integer)
            `; 
            let q_servi = `select * from reoperac.fbmostrar_servicios_operac(
                cast ('${cod_ope}' as integer)
            )`; 
            let q_mater = `select * from reoperac.fbmostrar_materiales_operac(
                cast ('${cod_ope}' as integer)
            )`; 

            let q_matve = `select * from reoperac.fbmostrar_materventa_operac(
                cast ('${cod_ope}' as integer)
            )`; 
            
            

            bitacora.control(q_opera, req.url)
            bitacora.control(q_vehic, req.url)
            bitacora.control(q_clien, req.url)
            bitacora.control(q_servi, req.url)
            bitacora.control(q_mater, req.url)
            bitacora.control(q_matve, req.url)
            
            const operac = await BD.storePostgresql(q_opera);
            const vehicu = await BD.storePostgresql(q_vehic);
            const client = await BD.storePostgresql(q_clien);
            const servic = await BD.storePostgresql(q_servi);
            const materi = await BD.storePostgresql(q_mater);
            const matven = await BD.storePostgresql(q_matve);
            // con esto muestro msj
            if (operac.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query operacio", operac }).status(500)
            };
            if (vehicu.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query vehiculos", vehicu }).status(500)
            };
            if (client.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query cliente", client }).status(500)
            };
            if (servic.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query servicio", servic }).status(500)
            };
            if (materi.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query material", materi }).status(500)
            };
            if (matven.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query material", matven }).status(500)
            };
            
            res.json({ res: 'ok', message: "Success", operac, vehicu, client, servic, materi, matven}).status(200)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })
    
//////////////////////MODULO: SERVICIOS Y MATERIALES (MOSTRAR)
    app.post(`/api/${process.env.VERSION}/operacflujo/serv_mater_mostrar_buscar`, async (req, res, next) => {
        try {
            var cod_ope = req.body.cod_ope;
            var tip_fil = req.body.tip_fil;
            var descrip = req.body.descrip;
            const lis_bus_ser = [];
            const lis_bus_mat = [];

            if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "El código de operacion NO esta definido."}).status(500)
            }
            if (tip_fil == null || tip_fil.trim() == ''){
                res.json({ res: 'ko', message: "Tipo de filtro NO esta definido."}).status(500)
            }
            if (tip_fil.toUpperCase() != 'S' & tip_fil.toUpperCase() != 'M'){
                res.json({ res: 'ko', message: "Tipo de filtro debe ser solo S o M."}).status(500)
            }
            let q_vehope = `
                select ov.co_opeveh, ve.co_vehicu, ve.co_plaveh 
                from reoperac.tbopeveh ov, 
                wfvehicu.tbvehicu ve
                where ov.co_vehicu = ve.co_vehicu
                and ov.co_operac = cast ('${cod_ope}' as integer)
                limit 1;      
            `;
            bitacora.control(q_vehope, req.url);
            const vehope = await BD.storePostgresql(q_vehope);
            if (vehope.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query q_vehope!", vehope }).status(500)
            };

            // parte para lista de la bpusqueda
            if (tip_fil.toUpperCase() == 'S') { // SERVICIO
                let q_lisser = `
                    select
                        sv.co_servic, st.ti_servic, ts.no_tipser,
                        st.ti_tratal, tt.no_tiptra, sv.no_servic,
                        um.no_unimed, st.im_preuni
                    from reoperac.tcservic sv, 
                        reoperac.trsertra st, 
                        reoperac.tctipser ts, 
                        reoperac.tctiptra tt, 
                        wfpublic.tcunimed um
                    where sv.co_servic = st.co_servic
                    and st.ti_servic = ts.ti_servic
                    and st.ti_tratal = tt.ti_tratal
                    and tt.co_unimed = um.co_unimed
                    and sv.no_servic ilike '%'|| '${descrip}' ||'%'
                    and (sv.co_servic, st.ti_servic, st.ti_tratal) not in (
                        select co_servic, ti_servic, ti_tratal
                        from reoperac.tbopeser
                        where co_operac = cast ('${cod_ope}' as integer)
                    );
                `;
                bitacora.control(q_lisser, req.url);
                const lisser = await BD.storePostgresql(q_lisser);
                if (lisser.codRes == 99) {
                    res.json({ res: 'ko', message: "Error en la query q_lisser", lisser }).status(500)
                };                
                for(var i=0; i<lisser.length; i++) {
                    lis_bus_ser.push({
                        co_operac: cod_ope, 
                        co_servic: lisser[i].co_servic,
                        ti_servic: lisser[i].ti_servic,
                        no_tipser: lisser[i].no_tipser,
                        ti_tratal: lisser[i].ti_tratal,
                        no_tiptra: lisser[i].no_tiptra,
                        no_servic: lisser[i].no_servic,
                        no_unimed: lisser[i].no_unimed,
                        im_preuni: lisser[i].im_preuni,
                        co_opeveh: vehope[0].co_opeveh,
                        co_plaveh: vehope[0].co_plaveh
                    });
                }
            }
            if (tip_fil.toUpperCase() == 'M') { // MATERIAL
                let q_lismat = `
                    select
                        ar.co_articu, ar.co_barras,
                        wfarticu.f_no_catart(ar.co_articu) as no_catpad,
                        ar.no_articu, 0 as im_preuni, 0 as va_cantid, 'C' as ti_opcion
                    from wfarticu.tbarticu ar
                    where ar.no_articu ilike '%'|| '${descrip}' ||'%'
                `;
                bitacora.control(q_lismat, req.url);
                const lismat = await BD.storePostgresql(q_lismat);
                if (lismat.codRes == 99) {
                    res.json({ res: 'ko', message: "Error en la query q_lismat!", lismat }).status(500)
                };
                for(var i=0; i<lismat.length; i++) {
                    lis_bus_mat.push({
                        co_operac: cod_ope, 
                        co_articu: lismat[i].co_articu,
                        co_barras: lismat[i].co_barras,
                        no_catpad: lismat[i].no_catpad,
                        no_articu: lismat[i].no_articu,
                        co_vehicu: vehope[0].co_vehicu,
                        co_plaveh: vehope[0].co_plaveh,
                        im_preuni: lismat[i].im_preuni,
                        va_cantid: lismat[i].va_cantid,
                        ti_opcion: lismat[i].ti_opcion
                    });
                } 
            }
            // lista de Servicios agregados a la operacion
            let q_lisseradd = `
                select
                    co_operac, co_vehicu, co_plaveh, co_opeser, no_tiptra, no_servic,
                    no_unimed, no_tipser, ca_uniori, im_preori, va_totori, ca_uniaju, 
                    im_preaju, va_totaju, co_estado, no_estado
                from reoperac.fbmostrar_servicios_operac(cast ('${cod_ope}' as integer));
            `;
            bitacora.control(q_lisseradd, req.url);
            const lisseradd = await BD.storePostgresql(q_lisseradd);
            if (lisseradd.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query q_lisseradd", lisseradd }).status(500)
            };

            // lista de Materiales agregados a la operación
            let q_lismatadd = `
                select 
                    co_operac, co_vehicu, co_plaveh, co_opemat, no_articu,
                    co_materi, no_materi, ca_uniori, im_preori, im_totori,
                    ca_uniaju, im_preaju, im_totaju, no_estmat, il_costos
                from reoperac.fbmostrar_materiales_operac(cast ('${cod_ope}' as integer));
            `;
            bitacora.control(q_lismatadd, req.url);
            const lismatadd = await BD.storePostgresql(q_lismatadd);
            if (lismatadd.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query q_lisseradd", lismatadd }).status(500)
            };
            // resultado
            res.json({ res: 'ok', message: "Success", lis_bus_ser, lis_bus_mat, lisseradd, lismatadd}).status(200)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    ///////////////////// Agregar servicio a la operación
    app.post(`/api/${process.env.VERSION}/operacflujo/add_servic_opera`, async (req, res, next) => {
        try {
            let query1;
            var ope_veh = req.body.ope_veh;
            var cod_ope = req.body.cod_ope;
            var tip_tra = req.body.tip_tra;
            var cod_ser = req.body.cod_ser;
            var imp_uni = req.body.imp_uni;
            var tip_ser = req.body.tip_ser;

            if (ope_veh == null || ope_veh.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion-vehiculo NO esta definido."}).status(500)
            }
            if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            if (tip_tra == null || tip_tra.trim() == ''){
                res.json({ res: 'ko', message: "Tipo de trabajo NO esta definido."}).status(500)
            }
            if (cod_ser == null || cod_ser.trim() == ''){
                res.json({ res: 'ko', message: "El codigo de servicio NO esta definido."}).status(500)
            }
            if (imp_uni == null || imp_uni.trim() == ''){
                res.json({ res: 'ko', message: "Importe por unidad NO esta definido."}).status(500)
            }
            if (tip_ser == null || tip_ser.trim() == ''){
                res.json({ res: 'ko', message: "Tipo de servicio NO esta definido."}).status(500)
            }
    
            query1 = `
                insert into reoperac.tbopeser (
                    co_opeveh, co_operac, 
                    ti_tratal, co_servic,
                    ca_uniori, im_preori, 
                    ca_uniaju, im_preaju,
                    co_moneda, ti_servic
                ) values (
                    cast('${ope_veh}' as integer), cast('${cod_ope}' as integer), 
                    cast('${tip_tra}' as smallint), cast('${cod_ser}' as smallint),
                    1, cast('${imp_uni}' as numeric(12,2)), 
                    1, cast('${imp_uni}' as numeric(12,2)),
                    28, cast('${tip_ser}' as smallint)
                );
            `;

            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Servicio Agregado."}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })

    /////////////// agregando materiales a la operacion 
    app.post(`/api/${process.env.VERSION}/operacflujo/add_materi_opera`, async (req, res, next) => {
        try {

            let query0;
            let query1;
            let query2;
            var cod_ope = req.body.cod_ope;
            var cod_mat = req.body.cod_mat;
            var cantida = req.body.cantida;
            var imp_uni = req.body.imp_uni;
            var cos_ven = req.body.cos_ven;
            var ope_veh;
            cod_ven = cos_ven.toUpperCase();

            if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            if (cod_mat == null || cod_mat.trim() == ''){
                res.json({ res: 'ko', message: "Codigo de material NO esta definido."}).status(500)
            }
            if (cantida == null || cantida.trim() == ''){
                res.json({ res: 'ko', message: "Cantidad NO esta definido."}).status(500)
            }
            if (cos_ven == null || cos_ven.trim() == ''){
                res.json({ res: 'ko', message: "Switch Costo/Venta NO esta definido."}).status(500)
            }
            if (cos_ven != 'C' & cos_ven != 'V'){
                res.json({ res: 'ko', message: "Switch Costo venta solo debe tener V O C."}).status(500)
            }
            if (cos_ven == 'V' & (imp_uni == null || imp_uni <= 0)){
                res.json({ res: 'ko', message: "Por favor ingrese importe precio de Venta."}).status(500)
            }
            if (cos_ven == 'C'){
                imp_uni = 0.00;
            }
            query0 = `
                select ov.co_opeveh
                from reoperac.tbopeveh ov
                where ov.co_operac = cast('${cod_ope}' as integer);     
            `;
            bitacora.control(query0, req.url)
            const result_0 = await BD.storePostgresql(query0);
            if (result_0.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query ope_veh", result_0 }).status(500)
            };
            ope_veh = result_0[0].co_opeveh;
            //validar si existe material en la op.
            query2 =`
                select 1 cod_res from reoperac.tbopemat
                where co_operac = cast('${cod_ope}' as integer)
                and co_materi = cast('${cod_mat}' as integer);
            `;
            bitacora.control(query2, req.url)
            const result_2 = await BD.storePostgresql(query2);
            if (result_2.codRes == 99) {
                res.json({ res: 'ko', message: "Error en la query ope_mat", result_2 }).status(500)
            };
            if (result_2[0] == null){
                var v_opemat = 0;
            }else{
                var v_opemat = 1;
            };
            /*if (v_opemat == 1){
                res.json({ res: 'ko', message: "El material seleccionado ya se encuntra agregado a la operacion."}).status(500)
            }else{*/         
                query1 = `
                    insert into reoperac.tbopemat (
                        co_opeveh, co_operac, 
                        co_materi, ca_uniori, 
                        im_preori, ca_uniaju, 
                        im_preaju, co_moneda,  
                        il_costos
                    ) values (
                        cast('${ope_veh}' as integer), cast('${cod_ope}' as integer), 
                        cast('${cod_mat}' as integer), cast('${cantida}' as numeric),
                        cast('${imp_uni}' as numeric(12,2)), cast('${cantida}' as numeric),
                        cast('${imp_uni}' as numeric(12,2)), 28, 
                        (case when '${imp_uni}' = 'C' then true else false end)
                    );
                `;

                bitacora.control(query1, req.url)
                const result = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (result.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Material Agregado a la operacion."}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", result }).status(500)
                }
            //}
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })

/////////////////// Actualiza servicio enlazado a operacion
    app.post(`/api/${process.env.VERSION}/operacflujo/servic_opera`, async (req, res, next) => {
        try {
            let query1;
            var ope_ser = req.body.ope_ser;
            var cod_ope = req.body.cod_ope;
            var cantida = req.body.cantida;
            var imp_uni = req.body.imp_uni;

            if (ope_ser == null || ope_ser.trim() == ''){
                res.json({ res: 'ko', message: "Codigo servicio NO esta definido."}).status(500)
            }
            if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            if (cantida == null || cantida.trim() == ''){
                res.json({ res: 'ko', message: "Cantidad NO esta definido."}).status(500)
            }
            if (imp_uni == null || imp_uni.trim() == ''){
                res.json({ res: 'ko', message: "Importe por unidad NO esta definido."}).status(500)
            }
    
            query1 = `
                update reoperac.tbopeser set 
                    ca_uniori = cast('${cantida}' as numeric),
                    im_preori = cast('${imp_uni}' as numeric),
                    ca_uniaju = cast('${cantida}' as numeric),
                    im_preaju = cast('${imp_uni}' as numeric)
                where co_operac = cast('${cod_ope}' as integer)
                and co_opeser = cast('${ope_ser}' as integer);
            `;

            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Servicio Actualizado."}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    
    })

////////////////////eliminar servicio enlazado a operacion
    app.post(`/api/${process.env.VERSION}/operacflujo/del_servic_opera`, async (req, res, next) => {
        try {
            console.log(req.body);
            let query1;
            var ope_ser = req.body.ope_ser;
            var cod_ope = req.body.cod_ope;

            console.log(ope_ser);
            console.log(cod_ope);

            // if (ope_ser == null || ope_ser.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo servicio NO esta definido."}).status(500)
            // }
            // if (cod_ope == null || cod_ope.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            // }

            query1 = `
                select * 
                from recomisi.fb_delete_comisi(
                    cast('${cod_ope}' as integer),
                    cast('${ope_ser}' as integer)
                );

                delete from reoperac.tbopeser 
                where co_operac = cast('${cod_ope}' as integer)
                and co_opeser = cast('${ope_ser}' as integer);

                
            `;

            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Servicio Eliminado."}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

/////////////////// Actualiza materiales enlazado a operacion
    app.post(`/api/${process.env.VERSION}/operacflujo/materi_opera`, async (req, res, next) => {
        try {
            let query1;
            var ope_mat = req.body.ope_mat;
            var cod_ope = req.body.cod_ope;
            var cantida = req.body.cantida;
            var imp_uni = req.body.imp_uni;

            if (ope_mat == null || ope_mat.trim() == ''){
                res.json({ res: 'ko', message: "Codigo Material NO esta definido."}).status(500)
            }
            if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            if (cantida == null || cantida.trim() == ''){
                res.json({ res: 'ko', message: "Cantidad NO esta definido."}).status(500)
            }
            if (imp_uni == null || imp_uni.trim() == ''){
                res.json({ res: 'ko', message: "Importe por unidad NO esta definido."}).status(500)
            }

            query1 = `
                update reoperac.tbopemat set 
                    ca_uniori = cast('${cantida}' as numeric),
                    im_preori = cast('${imp_uni}' as numeric),
                    ca_uniaju = cast('${cantida}' as numeric),
                    im_preaju = cast('${imp_uni}' as numeric)
                where co_operac = cast('${cod_ope}' as integer)
                and co_opemat = cast('${ope_mat}' as integer);
            `;

            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Material Actualizado."}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    ////////////////////eliminar material enlazado a operacion
    app.post(`/api/${process.env.VERSION}/operacflujo/del_materi_opera`, async (req, res, next) => {
        try {
            let query1;
            var ope_mat = req.body.ope_mat;
            var cod_ope = req.body.cod_ope;

            // if (ope_mat == null || ope_mat.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo material NO esta definido."}).status(500)
            // }
            // if (cod_ope == null || cod_ope.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            // }

            query1 = `
                delete from reoperac.tbopemat
                where co_operac = cast('${cod_ope}' as integer)
                and co_opemat = cast('${ope_mat}' as integer);
            `;

            bitacora.control(query1, req.url)
            const result = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (result.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Material Eliminado."}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", result }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

/////////////////////////////////// EVALUAR OPERACION OPCION 3
// mostrar lista de operaciones para evaluar
    app.post(`/api/${process.env.VERSION}/operacflujo/lista_operaci_evalua`, async (req, res, next) => {
        try {
            let query1;
            var nom_cli = req.body.nom_cli;
            var pla_veh = req.body.pla_veh;
 
            if (nom_cli == null || nom_cli.trim() == ''){
                nom_cli = '';
            }
            if (pla_veh == null || pla_veh.trim() == ''){
                pla_veh = '';
            }            
            query1 = `
                select * from readuana.fbmostrar_operaci_estados(
                    '${nom_cli}',
                    '${pla_veh}',
                    '1'
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

// mostrar servicio-material de operacion a evaluar
    app.get(`/api/${process.env.VERSION}/operacflujo/lista_sermat_evalua/:cod_ope`, async (req, res, next) => {
        try {
            var cod_ope = req.params.cod_ope;
            let query1 = `
                select co_operac, co_vehicu, co_plaveh, co_opeser,
                    no_servic, no_tipser, ca_uniori, im_preori, va_totori,
                    ca_uniaju, im_preaju, va_totaju, no_estado, no_tiptra, ti_servic
                from reoperac.fbmostrar_sermat_operac_evaluar(cast ('${cod_ope}' as integer));
            `;
            bitacora.control(query1, req.url)
            const sermat = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (sermat.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", sermat}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", sermat }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// recalcular servicio-material de operación a evaluar
    app.post(`/api/${process.env.VERSION}/operacflujo/recalcula_sermat`, async (req, res, next) => {
        try {
            let query1;
            var ser_mat = req.body.ser_mat;
            var cod_ope = req.body.cod_ope;
            var tip_ser = req.body.tip_ser;
            var cantida = req.body.cantida;
            var imp_uni = req.body.imp_uni;

            if (ser_mat == null || ser_mat.trim() == ''){
                res.json({ res: 'ko', message: "Codigo Servicio-Material NO esta definido."}).status(500)
            }
            else if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            else if (tip_ser == null || tip_ser.trim() == ''){
                res.json({ res: 'ko', message: "Tipo de servicio NO esta definido."}).status(500)
            }
            else if (cantida == null || cantida.trim() == ''){
                res.json({ res: 'ko', message: "Cantidad NO esta definido."}).status(500)
            }
            else if (imp_uni == null || imp_uni.trim() == ''){
                res.json({ res: 'ko', message: "Importe por unidad NO esta definido."}).status(500)
            }else {
                if (tip_ser.toUpperCase() == '0'){ //materiales
                    query1 = `
                        update reoperac.tbopemat set
                            ca_uniaju = cast('${cantida}' as numeric),
                            im_preaju = cast('${imp_uni}' as numeric)
                        where co_opemat = cast('${ser_mat}' as integer)
                        and co_operac = cast('${cod_ope}' as integer);
                    `;
                }else{ // servicio
                    query1 = `
                        update reoperac.tbopeser set
                            ca_uniaju = cast('${cantida}' as numeric),
                            im_preaju = cast('${imp_uni}' as numeric)
                        where co_opeser = cast('${ser_mat}' as integer)
                        and co_operac = cast('${cod_ope}' as integer);
                    `;
                }

                bitacora.control(query1, req.url)
                const result = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (result.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Item Recalculado."}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", result }).status(500)
                }
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// evaluar cada item de la operacion (servicios y materiales)
    app.post(`/api/${process.env.VERSION}/operacflujo/evalua_item_sermat`, async (req, res, next) => {
        try {
            let query1;
            var ser_mat = req.body.ser_mat;
            var cod_ope = req.body.cod_ope;
            var tip_ser = req.body.tip_ser;
            var tip_opc = req.body.tip_opc;
            var cod_per = req.body.cod_per;

            // if (ser_mat == null || ser_mat.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo Servicio-Material NO esta definido."}).status(500)
            // }
            // else if (cod_ope == null || cod_ope.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            // }
            // else if (tip_ser == null || tip_ser.trim() == ''){
            //     res.json({ res: 'ko', message: "Tipo de servicio NO esta definido."}).status(500)
            // }
            // else if (tip_opc == null || tip_opc.trim() == ''){
            //     res.json({ res: 'ko', message: "Tipo de opcion (accion) NO esta definido."}).status(500)
            // }
            // else if (cod_per == null || cod_per.trim() == ''){
            //     res.json({ res: 'ko', message: "Codigo del personal NO esta definido."}).status(500)
            // }else {
                if (tip_ser.toUpperCase() == '0'){ //materiales
                    if (tip_opc.toUpperCase() == 'A'){
                        query1 = `
                            update reoperac.tbopemat set
                                co_evaope = cast('${cod_per}' as integer),
                                il_aprser = TRUE,
                                fe_aprmat = current_timestamp
                            where co_opemat = cast('${ser_mat}' as integer)
                            and co_operac = cast('${cod_ope}' as integer);
                        `;
                    } else if (tip_opc.toUpperCase() == 'R'){
                        query = `
                            update reoperac.tbopemat set
                                co_evaope = cast('${cod_per}' as integer),
                                il_aprser = FALSE,
                                fe_aprmat = current_timestamp
                            where co_opemat = cast('${ser_mat}' as integer)
                            and co_operac = cast('${cod_ope}' as integer);  
                        `;
                    };                    
                }else{ // servicio
                    if (tip_opc.toUpperCase() == 'A'){
                        query1 = `
                            update reoperac.tbopeser set
                                co_evaope = cast('${cod_per}' as integer),
                                il_aprser = TRUE,
                                fe_aprser = current_timestamp
                            where co_opeser = cast('${ser_mat}' as integer)
                            and co_operac = cast('${cod_ope}' as integer); 

                            update recomisi.tbcomref cr set
                                ti_estado = 2
                            from recomisi.trcomope co
                            where cr.co_comref = co.co_comref
                            and co.co_operac = cast('${cod_ope}' as integer); 
                        `;
                    } else if (tip_opc.toUpperCase() == 'R'){
                        query1 = `
                            update reoperac.tbopeser set
                                co_evaope = cast('${cod_per}' as integer),
                                il_aprser = FALSE,
                                fe_aprser = current_timestamp
                            where co_opeser = cast('${ser_mat}' as integer)
                            and co_operac = cast('${cod_ope}' as integer); 
                        `;          
                    }
                }

                bitacora.control(query1, req.url)
                const result = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (result.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Item evaluado."}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", result }).status(500)
                }
            // }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })

////////////////////////////////// ASIGNACIÓN DE SERVICIO OPCION 4
// mostrar lista de operaciones pendientes a asignar tecnico a sus servicios
    app.post(`/api/${process.env.VERSION}/operacflujo/lista_operaci_asignar`, async (req, res, next) => {
        try {
            let query1;
            var nom_cli = req.body.nom_cli;
            var pla_veh = req.body.pla_veh;

            if (nom_cli == null || nom_cli.trim() == ''){
                nom_cli = '';
            }
            if (pla_veh == null || pla_veh.trim() == ''){
                pla_veh = '';
            }            
            query1 = `
                select * from readuana.fbmostrar_operaci_estados(
                    '${nom_cli}',
                    '${pla_veh}',
                    '2'
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

// mostrar servicios para asignar persona que ejecutará
    app.get(`/api/${process.env.VERSION}/operacflujo/lista_sermat_asignar/:cod_ope`, async (req, res, next) => {
        try {
            var cod_ope = req.params.cod_ope;
            let query1 = `
                select co_operac, co_vehicu, co_plaveh, co_opeser, no_servic, no_unimed,
                    no_tipser, ca_uniori, im_preori, va_totori, ca_uniaju, im_preaju, va_totaju,
                    co_estado, no_estado, ti_servic
                from reoperac.fbmostrar_servicios_operac_asignar(cast ('${cod_ope}' as integer));
            `;
            bitacora.control(query1, req.url)
            const servic = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (servic.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", servic}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", servic }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// COMBO DE TECNICOS QUE SERÁN ASIGNADOS
    app.get(`/api/${process.env.VERSION}/operacflujo/combo_tecnico`, async (req, res, next) => {
        try {
            let query1 = `
                select  0 as co_tecaut, '[Ninguno]' no_person union
                select
                ta.co_tecaut,
                pbperson.f_no_person(pe.co_person) as no_person
                from pbperson.tbperson pe, reoperac.tctecaut ta
                where pe.co_person = ta.co_pernat
                order by 1, 2
            `;
            bitacora.control(query1, req.url)
            const tecnico = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (tecnico.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", tecnico}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", tecnico }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// ASIGNAR AL TECNICO
    app.post(`/api/${process.env.VERSION}/operacflujo/asigna_tecnico_servicio`, async (req, res, next) => {
        try {
            let query1;
            var cod_ope = req.body.cod_ope;
            var ope_ser = req.body.ope_ser;
            var tec_aut = req.body.tec_aut;
            
            if (ope_ser == null || ope_ser.trim() == ''){
                res.json({ res: 'ko', message: "Codigo servicio NO esta definido."}).status(500)
            }
            else if (cod_ope == null || cod_ope.trim() == ''){
                res.json({ res: 'ko', message: "Codigo operacion NO esta definido."}).status(500)
            }
            else if (tec_aut == null || tec_aut.trim() == '' || tec_aut.trim() == '0'){
                res.json({ res: 'ko', message: "Tecnico NO esta definido."}).status(500)
            }else {
                query1 = `
                    select * from reoperac.pbasigna_tecnico(
                        cast('${cod_ope}' as bigint),
                        cast('${ope_ser}' as bigint),
                        cast('${tec_aut}' as integer)
                    );
                `;

                bitacora.control(query1, req.url)
                const result = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (result.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: result[0].no_respue}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", result }).status(500)
                }
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// LISTAR SERVICIOS INICIO Y FIN DE LA OPERACION

    app.post(`/api/${process.env.VERSION}/operacflujo/lista_opeser_ini_fin`, async (req, res, next) => {
        try {
            let query1;
            var cod_ope = req.body.cod_ope;
            var pla_veh = req.body.pla_veh;
            var tec_aut = req.body.tec_aut;

            if (cod_ope == null || cod_ope.trim() == ''){
                cod_ope = '';
            }
            if (pla_veh == null || pla_veh.trim() == ''){
                pla_veh = '';
            }      
            if (tec_aut == null || tec_aut.trim() == ''){
                tec_aut = '';
            }       
            query1 = `
                select * from reoperac.fbmostrar_opeser_inicio_fin(
                    '${cod_ope}',
                    '${pla_veh}',
                    '${tec_aut}'
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

//  INICIO DEL TRABAJO
    app.post(`/api/${process.env.VERSION}/operacflujo/iniciar_servicio_ordser`, async (req, res, next) => {
        try {
            let query1;
            var ord_ser = req.body.ord_ser;
            var ope_ser = req.body.ope_ser;

            if (ord_ser == null || ord_ser.trim() == ''){
                res.json({ res: 'ko', message: "Definir orden de servicio ord_ser" }).status(500);
            }else if (ope_ser == null || ope_ser.trim() == ''){
                res.json({ res: 'ko', message: "Definir servicio de operacion ope_ser ord_ser" }).status(500);
            } else {           
                query1 = `
                    select * from reoperac.pbinicia_finaliza_servicio(
                        cast('${ord_ser}' as bigint),
                        cast('${ope_ser}' as bigint),
                        'I'
                    );

                    update recomisi.tbcomref cr set
                        ti_estado = 3
                    from recomisi.trcomope co
                    where cr.co_comref = co.co_comref
                    and co.co_operac = (
                        select os.co_operac
                        from reoperac.tbordser os    
                        where os.co_ordser = cast('${ord_ser}' as integer)
                    );
                `;
                bitacora.control(query1, req.url)
                const resulta = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (resulta.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Success", resulta}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", resulta }).status(500)
                }    
            }        
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })

// FIN DE OPERACION
    app.post(`/api/${process.env.VERSION}/operacflujo/finalizar_servicio_ordser`, async (req, res, next) => {
        try {
            let query1;
            var ord_ser = req.body.ord_ser;
            var ope_ser = req.body.ope_ser;

            if (ord_ser == null || ord_ser.trim() == ''){
                res.json({ res: 'ko', message: "Definir orden de servicio ord_ser" }).status(500);
            }else if (ope_ser == null || ope_ser.trim() == ''){
                res.json({ res: 'ko', message: "Definir servicio de operacion ope_ser ord_ser" }).status(500);
            } else {           
                query1 = `
                    select * from reoperac.pbinicia_finaliza_servicio(
                        cast('${ord_ser}' as bigint),
                        cast('${ope_ser}' as bigint),
                        'F'
                    );

                    update recomisi.tbcomref cr set
                        ti_estado = 4
                    from recomisi.trcomope co
                    where cr.co_comref = co.co_comref
                    and co.co_operac = (
                        select os.co_operac
                        from reoperac.tbordser os    
                        where os.co_ordser = cast('${ord_ser}' as integer)
                    );
                `;
                bitacora.control(query1, req.url)
                const resulta = await BD.storePostgresql(query1);
                // con esto muestro msj
                if (resulta.codRes != 99) {
                    // con esto muestro msj
                    res.json({ res: 'ok', message: "Success", resulta}).status(200)
                } else {
                    res.json({ res: 'ko', message: "Error en la query", resulta }).status(500)
                }    
            }        
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })

// TERMINADOS PARA FACTURAR OPERACION
    app.post(`/api/${process.env.VERSION}/operacflujo/insert_factur_operac`, async (req, res, next) => {
        try {
            let query1;
            var pn_regist = req.body.pn_regist;
            var fe_emisio = req.body.fe_emisio;
            var nu_docume = req.body.nu_docume;
            var co_docide = req.body.co_docide;
            var no_direcc = req.body.no_direcc;
            var ti_descri = req.body.ti_descri;
            var no_descri = req.body.no_descri;
            var no_coment = req.body.no_coment;
            var co_operac = req.body.co_operac;
            
            /*
            query1 = `
                select * from reoperac.fb_insert_factur(
                    ${pn_regist},
                    '${fe_emisio}',
                    '${nu_docume}',
                    '${co_docide}',
                    '${no_direcc}',
                    ${ti_descri},
                    '${no_descri}',
                    '${no_coment}',
                    '${co_operac}'
                    
                );
            `;
            */
           
           query1 = `
                select * from wffactur.fb_insert_factur_operac(
                    cast('${pn_regist}' as integer),
                    '${fe_emisio}',    
                    '${nu_docume}',
                    '${co_docide}',
                    '${no_direcc}',
                    cast('${ti_descri}' as integer),
                    '${no_descri}',
                    '${no_coment}',
                    '${co_operac}'
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

    // FACTURAR OPERACION
    app.post(`/api/${process.env.VERSION}/operacflujo/listar_operac_termin`, async (req, res, next) => {
        try {
            let query1;
            var co_operac = req.body.co_operac;
            var co_plaveh = req.body.co_plaveh;
            var fe_ciedes = req.body.fe_ciedes;
            var fe_ciehas = req.body.fe_ciehas;

            if (co_operac == null || co_operac.trim() == ''){
                co_operac = '';
            }
            if (co_plaveh == null || co_plaveh.trim() == ''){
                co_plaveh = '';
            }      
            if (fe_ciedes == null || fe_ciedes.trim() == ''){
                fe_ciedes = '';
            }      
            if (fe_ciehas == null || fe_ciehas.trim() == ''){
                fe_ciehas = '';
            } 

            query1 = `
                select 
                    co_operac,
                    fe_termin,
                    co_docide,
                    no_person,
                    id_operac,
                    co_plaveh,
                    no_marveh,
                    no_modveh,
                    no_colveh,
                    im_basimp,
                    im_totigv,
                    im_totope
                from reoperac.fb_listar_operac_termin(
                    '${co_operac}', 
                    '${co_plaveh}',
                    '${fe_ciedes}',
                    '${fe_ciehas}'
                );
            `;
            bitacora.control(query1, req.url)
            const resultado = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (resultado.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", resultado}).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
            }            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })


// TIPO DE DOCUMENTO
    app.get(`/api/${process.env.VERSION}/operacflujo/tipdoc`, async (req, res, next) => {
        try {
            let query;
            query = `select * from wfpublic.tcdocume where ti_docume in (4, 11)`;
            
            bitacora.control(query, req.url)
            const resultado = await BD.storePostgresql(query);
            // con esto muestro msj
            if (resultado.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", resultado }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

// TIPO DE DESCRIPCION
app.get(`/api/${process.env.VERSION}/operacflujo/tipdes`, async (req, res, next) => {
    try {
        let query;
        query = `
            select * from (
                select 1 as co_tipdes, 'General' as no_tipdes union
                select 2, 'Detallado'     
            ) as tx`;
        
        bitacora.control(query, req.url)
        const resultado = await BD.storePostgresql(query);
        // con esto muestro msj
        if (resultado.codRes != 99) {
            // con esto muestro msj
            res.json({ res: 'ok', message: "Success", resultado }).status(200)
        } else {
            res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
        }
    } catch (error) {
        res.json({ res: 'ko', message: "Error controlado", error }).status(500)
    }

})


// INGRESO VEHICULAR
    app.post(`/api/${process.env.VERSION}/operacflujo/ingreso_vehicular`, async (req, res, next) => {
        try {
            let query1;
            var per_reg = req.body.per_reg;
            var cod_veh = req.body.cod_veh;
            var val_kil = req.body.val_kil;
            var doc_ide = req.body.doc_ide;
            var ape_pat = req.body.ape_pat;
            var ape_mat = req.body.ape_mat;
            var nom_cli = req.body.nom_cli;
            var cen_ope = req.body.cen_ope;
            var direcci = req.body.direcci;
            var det_ing = req.body.det_ing;
            var swt_sal = req.body.swt_sal;
            var fec_sal = req.body.fec_sal;

            query1 = `
                select * from readuana.fb_ingreso_vehicular(
                    cast('${per_reg}' as integer),
                    cast('${cod_veh }' as integer),
                    cast('${val_kil }' as integer),
                    '${doc_ide}',
                    '${ape_pat}',
                    '${ape_mat}',
                    '${nom_cli}',
                    cast('${cen_ope}' as integer),
                    '${direcci}',
                    '${det_ing}',
                    '${swt_sal}',
                    '${fec_sal}'
                );
            `;
                
            bitacora.control(query1, req.url)
            const resulta = await BD.storePostgresql(query1);
            // con esto muestro msj
            if (resulta.codRes != 99) {
                // con esto muestro msj
                if (resulta[0].co_respue == '-1'){
                    res.json({ res: 'ko', message: resulta[0].no_respue }).status(500)
                }else{
                    res.json({ res: 'ok', message: resulta[0].no_respue}).status(200)
                }
            } else {
                res.json({ res: 'ko', message: "Error en la query", resulta }).status(500)
            }           
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }
    })

// BUSCAR OPERACION
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