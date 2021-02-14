const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
  /// INSERTAR ORDEN DE COMPRA
  app.post(`/api/${process.env.VERSION}/ordcom/insert_ordcom`, async (req, res, next) => {
    try {
      let query1;

      var pn_regist = req.body.pn_regist;
      var pj_provee = req.body.pj_provee;
      var co_moneda = req.body.co_moneda;
      var ti_compra = req.body.ti_compra;
      var de_motcom = req.body.de_motcom;
      var fe_ordcom = req.body.fe_ordcom;
      var pn_solici = req.body.pn_solici;
      var il_conigv = req.body.il_conigv;
      var co_tippro = req.body.co_tippro;

      console.log(pn_regist);
      console.log(pj_provee);
      console.log(co_moneda);
      console.log(ti_compra);
      console.log(de_motcom);
      console.log(fe_ordcom);
      console.log(pn_solici);
      console.log(il_conigv);
      console.log(co_tippro);

      //insert
      query1 = `select * from reordcom.fb_insert_ordcom(
        ${pn_regist},
        ${pj_provee},
        ${co_moneda},
        '${de_motcom}',
        '${ti_compra}',
        '${fe_ordcom}',
        ${pn_solici},
        ${il_conigv},
        ${co_tippro}
        )`;
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

  /// ACTUALIZAR ORDEN DE COMPRA
  app.post(`/api/${process.env.VERSION}/ordcom/update_ordcom`, async (req, res, next) => {
    try {
      let query1;

      var nu_ordcom = req.body.nu_ordcom;
      var co_provee = req.body.co_provee;
      var co_tippro = req.body.co_tippro;
      var co_moneda = req.body.co_moneda;
      var ti_compra = req.body.ti_compra;
      var no_motcom = req.body.no_motcom;
      var co_conigv = req.body.co_conigv;

      if (nu_ordcom == null || nu_ordcom.trim() == "") {
        res
          .json({ res: "ko", message: "Código de OC NO está definido." })
          .status(500);
      } else if (co_provee == null || co_provee.trim() == "") {
        res
          .json({ res: "ko", message: "Código de proveedor NO está definido." })
          .status(500);
      } else if (co_tippro == null || co_tippro.trim() == "") {
        res
          .json({ res: "ko", message: "Tipo de Producto NO está definido." })
          .status(500);
      } else if (co_moneda == null || co_moneda.trim() == "") {
        res
          .json({ res: "ko", message: "Moneda NO esta definido." })
          .status(500);
      } else if (ti_compra == null || ti_compra.trim() == "") {
        res
          .json({ res: "ko", message: "Tipo de compra NO está definido." })
          .status(500);
      } else if (no_motcom == null || no_motcom.trim() == "") {
        res
          .json({ res: "ko", message: "Motivo de compra NO está definido." })
          .status(500);
      } else if (co_conigv == null || co_conigv.trim() == "") {
        res
          .json({ res: "ko", message: "Con IGV NO está definido." })
          .status(500);
      } else {
        query1 = `select * from reordcom.fb_update_ordcom(
                    cast (${nu_ordcom} as integer),
                    cast (${co_provee} as integer),
                    cast (${co_tippro} as integer),
                    cast (${co_moneda} as integer),
                    '${ti_compra}',
                    '${no_motcom}',
                    cast (${co_conigv} as integer)
                    
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
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// ADJUNTAR DOCUMENTO DE ORDEN DE COMPRA
  app.post(`/api/${process.env.VERSION}/ordcom/insert_arcadj`, async (req, res, next) => {
    try {
      let query1;

      var nu_ordcom = req.body.nu_ordcom;
      var co_arcadj = req.body.co_arcadj;
      var ti_accion = req.body.ti_accion;

      if (nu_ordcom == null || nu_ordcom.trim() == "") {
        res
          .json({ res: "ko", message: "Código de OC NO está definido." })
          .status(500);
      } else if (co_arcadj == null || co_arcadj.trim() == "") {
        res
          .json({ res: "ko", message: "Código de Archivo NO está definido." })
          .status(500);
      } else if (ti_accion == null || ti_accion.trim() == "") {
        res
          .json({ res: "ko", message: "La acción NO está definido." })
          .status(500);
      } else {
        query1 = `select * from reordcom.fb_insert_arcadj(
                    cast (${nu_ordcom} as integer),
                    '${co_arcadj}',
                    '${ti_accion}'
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
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// ADJUNTOS DE LA ORDEN ORDEN DE COMPRA SELECCIONADA
  app.post(`/api/${process.env.VERSION}/ordcom/listar_arcadj_ordcom`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom;

      query1 = `select * from reordcom.fb_listar_arcadj_ordcom( 
                cast (${co_ordcom} as integer)
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

  /// ELIMINAR ORDEN DE COMPRA
  app.post(`/api/${process.env.VERSION}/ordcom/delete_ordcom`, async (req, res, next) => {
    try {
      let query1;

      var co_ordcom = req.body.co_ordcom;
      var co_person = req.body.co_person;

      // if (nu_ordcom == null || nu_ordcom.trim() == "") {
      //   res
      //     .json({ res: "ko", message: "Código de OC NO está definido." })
      //     .status(500);
      // }
      // if (co_person == null || co_person.trim() == "") {
      //   res
      //     .json({ res: "ko", message: "Código de persona NO está definido." })
      //     .status(500);
      // }

      query1 = `select * from reordcom.fb_delete_ordcom(
                ${co_ordcom},
                ${co_person}
             )`;

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(operac);
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
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// LISTA DE ORDENES DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/listar_ordcom`, async (req, res, next) => {
    try {
      console.log("1");
      let query1;
      var fe_emides = req.body.fe_emides;
      var fe_emihas = req.body.fe_emihas;
      var no_provee = req.body.no_provee;
      var nu_ordcom = req.body.nu_ordcom;
      var ti_estado = req.body.ti_estado;
      var co_barras = req.body.co_barras;
      // if(fe_emides == null || fe_emides.trim() == ''){fe_emides = '';}
      // else if(fe_emihas == null || fe_emihas.trim() == ''){fe_emihas = '';}
      // else if(no_provee == null || no_provee.trim() == ''){no_provee = '';}
      // else if(nu_ordcom == null || nu_ordcom.trim() == ''){nu_ordcom = '';}
      // else if(ti_estado == null || ti_estado.trim() == ''){ti_estado = '';}
      // else if(co_barras == null || co_barras.trim() == ''){co_barras = '';}
      // else {
      query1 = `select * from reordcom.fb_listar_ordcom(
                    '${fe_emides}', 
                    '${fe_emihas}',
                    '${no_provee}', 
                    '${nu_ordcom}', 
                    '${ti_estado}', 
                    '${co_barras}'
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
      // }
      console.log("3");
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });
  /// INFORMACIÓN DE ORDEN DE COMPRA SELECCIONADA
  app.post(`/api/${process.env.VERSION}/ordcom/inform_ordcom`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom;

      query1 = `select * from reordcom.fb_inform_ordcom( 
                cast (${co_ordcom} as integer)
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

  /// DETALLE DE CADA ORDEN DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/listar_detall_ordcom`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom;

      query1 = `select * from reordcom.fb_listar_detall_ordcom( 
                cast (${co_ordcom} as integer)
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

  /// LISTAR PENDIENTE DE VISADO ORDEN DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/listar_pendie_visado`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom;
      var co_tipvis = req.body.co_tipvis;

      query1 = `select * from reordcom.fb_listar_pendie_visado(
                '${co_ordcom}',
                '${co_tipvis}'
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

  /// LISTAR PRODUCTOS ENCOTRADOS ORDEN DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/listar_produc_encont`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom ? parseInt(req.body.co_ordcom) : null;
      var co_catego = req.body.co_catego ? req.body.co_catego : "";
      var co_subcat = req.body.co_subcat ? req.body.co_subcat : "";
      var no_produc = req.body.no_produc ? req.body.no_produc : "";

      console.log(typeof co_ordcom);
      console.log(typeof co_catego);
      console.log(typeof co_subcat);
      console.log(typeof no_produc);

      query1 = `select * from reordcom.fb_listar_produc_encont(
                ${co_ordcom},
                '${co_catego}',
                '${co_subcat}',
                '${no_produc}'
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

  /// MANTENIMIENTO DE PRODUCTOS ORDEN DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/manten_produc_ordcom`, async (req, res, next) => {
    try {
      let query1;

      var co_ordcom = req.body.co_ordcom;
      var co_articu = req.body.co_articu;
      var ca_articu = req.body.ca_articu;
      var co_moneda = req.body.co_moneda;
      var im_preuni = req.body.im_preuni;
      var ti_accion = req.body.ti_accion;

      query1 = `select * from reordcom.fb_manten_produc_ordcom(
                cast (${co_ordcom} as integer),
                cast (${co_articu} as integer),
                cast (${ca_articu} as numeric),
                cast (${co_moneda} as integer),
                cast (${im_preuni} as numeric),
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

  /// VISADO O RECHAZO DE ORDEN DE COMPRA ///
  app.post(`/api/${process.env.VERSION}/ordcom/visrec_ordcom`, async (req, res, next) => {
    try {
      let query1;

      var co_ordcom = req.body.co_ordcom;
      var co_person = req.body.co_person;
      var ti_person = req.body.ti_person;
      var ti_visado = req.body.ti_visado;

      query1 = `select * from reordcom.fb_visrec_ordcom(
                ${co_ordcom},
                ${co_person},
                '${ti_person}',
                '${ti_visado}'
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

  /******************************************** CATALOGOS ************************************/

  /// CATALOGO PROVEEDOR ///
  app.get(`/api/${process.env.VERSION}/ordcom/catalogo/tcprovee`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
                select pj.co_perjur, pj.no_razsoc
                from pbperson.tbperjur pj, reordcom.tbprovee pr
                where pj.co_perjur = pr.pj_provee
                and pr.il_activo
                order by pj.no_razsoc asc
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

  /// TIPO DE MONEDA
  app.get(`/api/${process.env.VERSION}/ordcom/catalogo/tcmoneda`, async (req, res, next) => {
    try {
      let query1;
      //var cod_ord = req.params.cod_ord;

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
        res
          .json({ res: "ko", message: "Error en la query", operac })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// SOLICITANTE ///
  app.get(`/api/${process.env.VERSION}/ordcom/catalogo/tcsolici`, async (req, res, next) => {
    try {
      let query;

      query = `select co_pernat as co_solici, pbperson.f_no_person(co_pernat) as no_solici
            from pbemplea.tbemplea
            where co_emplea not in (1, 2, 8)
            order by 2
        `;
      bitacora.control(query, req.url);
      const operac = await BD.storePostgresql(query);
      console.log("chamex:" + operac[0]);
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

  /// TIPO DE COMPRA ///
  app.get(`/api/${process.env.VERSION}/ordcom/tcservic`, async (req, res, next) => {
    try {
      let query;

      query = `
                select ti_compra, no_tipcom
                from (
                    select 1 as ti_compra, 'Materiales' as no_tipcom
                    union select 2 , 'Servicios'
                    union select 3 , 'Activo Fijo'
                ) as tx`;
      bitacora.control(query, req.url);
      const operac = await BD.storePostgresql(query);
      console.log("chamex:" + operac[0]);
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

  /// CON IGV
  app.get(`/api/${process.env.VERSION}/ordcom/catalogo/tcconigv`, async (req, res, next) => {
    try {
      let query1;
      //var cod_ord = req.params.cod_ord;

      query1 = `
                select 1 co_conigv, 'SI' no_conigv union
                select 2 co_docume, 'NO'
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
};
