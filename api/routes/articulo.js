const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10
// ``

module.exports = async (app) => {
    // para traer todos los articulos
    app.get(`/api/${process.env.VERSION}/articulo/:nombre/:barras`, async (req, res, next) => {
        try {
            let query;
            var nom_art = req.params.nombre;
            var cod_bar = req.params.barras;

            nom_art = nom_art.toUpperCase() == 'ALL' ? '' : nom_art;
            cod_bar = cod_bar.toUpperCase() == 'ALL' ? '' : cod_bar;

            query = `select * from wfarticu.fb_mostrar_articu(
                '${nom_art}',
                '${cod_bar}'
            )`;
            console.log(req.params.nombre);
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            // con esto muestro msj
            if (articulo.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", articulo }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // para traer articulo por codigo
    app.get(`/api/${process.env.VERSION}/articulo_codigo/:cod_art`, async (req, res, next) => {
        try {
            let query;
            var cod_art = req.params.cod_art;

            query = `select * from wfarticu.fb_mostrar_articu(
                cast('${cod_art}' as integer)
            )`;
            console.log(req.params.nombre);
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            // con esto muestro msj
            if (articulo.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", articulo }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // Para Traer MOSTRAR Empresas
    app.get(`/api/${process.env.VERSION}/articulo/empresas`, async (req, res, next) => {
        try {
            let query;

            query = `select co_empres, pbperson.f_no_person(co_empres) no_empres 
                from wfpublic.tcempres em;`;
            bitacora.control(query, req.url)
            const empresa = await BD.storePostgresql(query);
            // con esto muestro msj
            if (empresa.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", empresa }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", empresa }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // Para Traer TODAS LAS CATEGORIAS (COMBO)
    app.get(`/api/${process.env.VERSION}/articulo_categorias/:cod_emp`, async (req, res, next) => {
        try {
            let query;
            var cod_emp = req.params.cod_emp;

            query = `select 
                co_catego, (select wfarticu.f_no_hiscat (co_catego)) no_catego 
                from wfarticu.tbcatego
                where co_empres = cast('${cod_emp}' as integer)
                order by co_catego desc, no_catego
            `;
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            // con esto muestro msj
            if (articulo.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", articulo }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // Para insertar o modificar ARTICULOS
    app.post(`/api/${process.env.VERSION}/articulo`, async (req, res, next) => {
        try {
            console.log(req.body);
            let query;
            var cod_art = req.body.cod_art;
            var nom_art = req.body.nom_art;
            var cod_bar = req.body.cod_bar;
            var cod_emp = req.body.cod_emp;
            var cod_cat = req.body.cod_cat;

            if (nom_art == null || nom_art.trim() == ''){
                res.json({ res: 'ko', message: "Nombre del artículo NO esta definido."}).status(500)
            }
            if (cod_emp == null){
                res.json({ res: 'ko', message: "Código de empresa NO esta definido."}).status(500)
            }
            if (cod_cat == null){
                res.json({ res: 'ko', message: "Código de categoría NO esta definido."}).status(500)
            }

            console.log("cod_art", cod_art);

            if (cod_art == null) { // para insertar 
                query = `select * from wfarticu.fbinserta_articu(
                    '${nom_art}',
                    cast (${cod_emp} as integer),
                    cast (${cod_cat} as integer)
                )`;
            } else { // para modificar
                if (cod_bar == null || cod_bar.trim() == ''){
                    res.json({ res: 'ko', message: "Código de barras NO esta definido."}).status(500)
                }
                query = `select * from wfarticu.pbarticu(
                    '${nom_art}',
                    '${cod_bar}',
                    cast (${cod_art} as integer),
                    cast (${cod_emp} as integer),
                    cast (${cod_cat} as integer)
                 )`;           
            }
            
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            if (articulo.codRes != 99) {
                if (articulo[0].co_respue == '-1') {
                    res.json({ res: 'ko', message: articulo[0].no_respue }).status(500)
                }else{
                    res.json({ res: 'ok', message: articulo[0].no_respue }).status(200)
                }
            }
            res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado...", error }).status(500)
        }

    })

    // CATEGORIAS -- FAMILIAS  SUBFAMILIAS----------------------------------

    // Para Traer MOSTRAR Categorias Padre e Hijos
    app.post(`/api/${process.env.VERSION}/articulo/familia`, async (req, res, next) => {
        try {
            let query;
            var cod_emp = req.body.cod_emp;
            var cod_art = req.body.cod_art;

            if (cod_emp == null || cod_emp.trim() ==''){
                res.json({ res: 'ko', message: "Por favor definir código de empresa."}).status(500)
            }else if (cod_art == null){
                query = `select * from wfarticu.fb_mostrar_catpadre(
                    cast ('${cod_emp}' as integer)
                )`;
            }else if (cod_art.trim() ==''){
                res.json({ res: 'ko', message: "Poner un valor en código de articulo."}).status(500)
            }else{
                query = `select * from wfarticu.fb_mostrar_cathijos(
                    cast ('${cod_emp}' as integer),
                    cast ('${cod_art}' as integer)
                )`;
            };
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            // con esto muestro msj
            if (articulo.codRes != 99) {
                // con esto muestro msj
                res.json({ res: 'ok', message: "Success", articulo }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    // Para INSERTAR O ACTUALIZAR Categorias Padre e Hijos
    app.put(`/api/${process.env.VERSION}/articulo/familia`, async (req, res, next) => {
        try {
            let query;
            var cod_art = req.body.cod_art;
            var nom_art = req.body.nom_art;
            var cod_emp = req.body.cod_emp;
            var cat_pad = req.body.cat_pad;

            if (cod_art == null || cod_art.trim() == ''){ // INSERTAR
                if (cod_emp == null || cod_emp.trim() == ''){
                    res.json({ res: 'ko', message: "El código de empresa NO esta definido."}).status(500)
                }else if(cat_pad == null || cat_pad.trim()==''){
                    query = `select * from wfarticu.fb_insertar_act_categoria(
                        null,
                        '${nom_art}',
                        cast ('${cod_emp}' as integer),
                        cast (null as integer)
                    );`;
                }else{
                    query = `select * from wfarticu.fb_insertar_act_categoria(
                        null,
                        '${nom_art}',
                        cast ('${cod_emp}' as integer),
                        cast ('${cat_pad}' as integer)
                    );`;
                }
            }else{ // MODIFICAR
                query = `select * from wfarticu.fb_insertar_act_categoria(
                    cast ('${cod_art}' as integer),
                    '${nom_art}',
                    null,
                    null
                );`;
            };
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            // con esto muestro msj
            if (articulo.codRes != 99) {
                // con esto muestro msj
                if (articulo[0].co_respue == '-1'){
                    res.json({ res: 'ko', message: articulo[0].no_respue }).status(500)
                }
                res.json({ res: 'ok', message: articulo[0].no_respue }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

    app.delete(`/api/${process.env.VERSION}/articulo/familia`, async (req, res, next) => {
        try {
            let query;
            var cod_emp = req.body.cod_emp;
            var cod_cat = req.body.cod_cat;
            if (cod_emp == null || cod_emp.trim() == ''){
                res.json({ res: 'ko', message: "El código de empresa NO esta definido."}).status(500)
            }else if (cod_cat == null || cod_cat.trim() == ''){
                res.json({ res: 'ko', message: "El código de articulo NO esta definido."}).status(500)
            }else{
                query = `select * from wfarticu.fb_eliminar_categoria(
                    cast (${cod_cat} as integer),
                    cast (${cod_emp} as integer)
                )`;
            }
            bitacora.control(query, req.url)
            const articulo = await BD.storePostgresql(query);
            if (articulo.codRes != 99) {
                // con esto muestro msj
                if (articulo[0].co_respue == '-1'){
                    res.json({ res: 'ko', message: articulo[0].no_respue }).status(500)
                }
                res.json({ res: 'ok', message: articulo[0].no_respue }).status(200)
            } else {
                res.json({ res: 'ko', message: "Error en la query", articulo }).status(500)
            }
        } catch (error) {
            res.json({ res: 'ko', message: "Error controlado", error }).status(500)
        }

    })

}