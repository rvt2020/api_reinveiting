const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
  /// INSERTAR TRAMITE DOCUMENTARIO
  app.post(`/api/${process.env.VERSION}/tradoc/insert_tradoc`, async (req, res, next) => {
    try {
      let query1;

      var pn_regist = req.body.pn_regist;
      var pn_solici = req.body.pn_solici;
      var co_perjur = req.body.co_perjur;
      var co_moneda = req.body.co_moneda;
      var de_mottra = req.body.de_mottra;
      var fe_tradoc = req.body.fe_tradoc;
      var il_conigv = req.body.il_conigv;
      var ti_docume = req.body.ti_docume;
      var co_arcadj = req.body.co_arcadj;

      // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
      // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
      // else {
      query1 = `select * from retradoc.fb_insert_tradoc(
                    ${pn_regist},
                    ${pn_solici},
                    ${co_perjur},
                    ${co_moneda},
                    '${de_mottra}',
                    '${fe_tradoc}',
                    ${il_conigv},
                    ${ti_docume},
                    '${co_arcadj}'
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

  /// ACTUALIZAR TRAMITE DOCUMENTARIO
  app.post(`/api/${process.env.VERSION}/tradoc/update_tradoc`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_solici = req.body.co_solici;
      var co_provee = req.body.co_provee;
      var co_moneda = req.body.co_moneda;
      var no_motcom = req.body.no_motcom;
      var co_conigv = req.body.co_conigv;

      if (no_motcom == null || no_motcom.trim() == "") {
        res
          .json({ res: "ko", message: "Motivo de compra NO está definido." })
          .status(500);
      }

      query1 = `select * from retradoc.fb_update_tradoc(
                cast (${co_tradoc} as integer),
                cast (${co_solici} as integer),
                cast (${co_provee} as integer),
                cast (${co_moneda} as integer),
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
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// ELIMINAR TRÁMITE DOCUMENTARIO
  app.post(`/api/${process.env.VERSION}/tradoc/delete_tradoc`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_person = req.body.co_person;

      // if (co_tradoc == null || co_tradoc.trim() == "") {
      //   res
      //     .json({ res: "ko", message: "Código de TD NO está definido." })
      //     .status(500);
      // }
      // if (co_person == null || co_person.trim() == "") {
      //   res
      //     .json({ res: "ko", message: "Código de persona NO está definido." })
      //     .status(500);
      // }

      query1 = `select * from retradoc.fb_delete_tradoc(
                ${co_tradoc},
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
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// LISTA DE TRÁMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/listar_tradoc`, async (req, res, next) => {
    try {
      let query1;
      var fe_emides = req.body.fe_emides;
      var fe_emihas = req.body.fe_emihas;
      var no_provee = req.body.no_provee;
      var nu_tramit = req.body.nu_tramit;
      var co_barras = req.body.co_barras;

      // if(fe_emides == null || fe_emides.trim() == ''){fe_emides = '';}
      // if(fe_emihas == null || fe_emihas.trim() == ''){fe_emihas = '';}
      // if(no_provee == null || no_provee.trim() == ''){no_provee = '';}
      // if(nu_tramit == null || nu_tramit.trim() == ''){nu_tramit = '';}
      // if(ti_estado == null || ti_estado.trim() == ''){ti_estado = '';}
      // if(co_barras == null || co_barras.trim() == ''){co_barras = '';}

      query1 = `select * from retradoc.fb_listar_tradoc(
                '${fe_emides}', 
                '${fe_emihas}',
                '${no_provee}', 
                '${nu_tramit}', 
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
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// INFORMACIÓN DE TRAMITE DOCUMENTARIO SELECCIONADO
  app.post(`/api/${process.env.VERSION}/tradoc/inform_tradoc`, async (req, res, next) => {
    try {
      let query1;
      var co_tradoc = req.body.co_tradoc;

      query1 = `select * from retradoc.fb_inform_tradoc( 
               ${co_tradoc}
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

  /// LISTAR PENDIENTE DE VISADO TRÁMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/listar_pendie_visado`, async (req, res, next) => {
    try {
      let query1;
      var co_tradoc = req.body.co_tradoc;
      var co_tipvis = req.body.co_tipvis;

      query1 = `select * from retradoc.fb_listar_pendie_visado(
                '${co_tradoc}',
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

  /// VISADO O RECHAZO DE TRÁMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/visrec_tradoc`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_person = req.body.co_person;
      var ti_person = req.body.ti_person;
      var ti_visado = req.body.ti_visado;

      query1 = `select * from retradoc.fb_visrec_tradoc(
                ${co_tradoc},
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

  /// INSERTAR EL ARCADJ DE TRAMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/insert_arcadj`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_arcadj = req.body.co_arcadj;
      var ti_accion = req.body.ti_accion;

      query1 = `select * from retradoc.fb_insert_arcadj(
                ${co_tradoc},
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

  /// DETALLE DE CADA TRAMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/listar_detall_tradoc`, async (req, res, next) => {
    try {
      let query1;
      var co_tradoc = req.body.co_tradoc;

      query1 = `select * from retradoc.fb_listar_detall_tradoc( '${co_tradoc}' )`;

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

  /// LISTAR PRODUCTOS ENCOTRADOS TRAMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/listar_produc_encont`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_catego = req.body.co_catego;
      var co_subcat = req.body.co_subcat;
      var no_produc = req.body.no_produc;

      query1 = `select * from retradoc.fb_listar_produc_encont(
                '${co_tradoc}',
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

  /// ADJUNTOS DEL TRAMITE DOCUMENTARIO SELECCIONADA
  app.post(`/api/${process.env.VERSION}/tradoc/listar_arcadj_tradoc`, async (req, res, next) => {
    try {
      let query1;
      var co_tradoc = req.body.co_tradoc;

      query1 = `select * from retradoc.fb_listar_arcadj_tradoc( 
                cast (${co_tradoc} as integer)
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

  /// MANTENIMIENTO DE PRODUCTOS TRAMITE DOCUMENTARIO ///
  app.post(`/api/${process.env.VERSION}/tradoc/manten_produc_tradoc`, async (req, res, next) => {
    try {
      let query1;

      var co_tradoc = req.body.co_tradoc;
      var co_articu = req.body.co_articu;
      var ca_articu = req.body.ca_articu;
      var co_moneda = req.body.co_moneda;
      var im_preuni = req.body.im_preuni;
      var ti_accion = req.body.ti_accion;

      query1 = `select * from retradoc.fb_manten_produc_tradoc(
                ${co_tradoc},
                ${co_articu},
                ${ca_articu},
                ${co_moneda},
                ${im_preuni},
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

  /// | PROVEEDOR ///
  app.get(`/api/${process.env.VERSION}/tradoc/catalogo/tcprovee`, async (req, res, next) => {
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

  /// SOLICITANTE ///
  app.get(`/api/${process.env.VERSION}/tradoc/catalogo/tcsolici`, async (req, res, next) => {
    try {
      let query;

      query = `select co_pernat as co_solici, pbperson.f_no_person(co_pernat) as no_solici
            from pbemplea.tbemplea
            where co_pernat in (12, 129)
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

  /// TIPO DE MONEDA
  app.get(`/api/${process.env.VERSION}/tradoc/catalogo/tcmoneda`, async (req, res, next) => {
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

  /// TIPO DOCUMENTO
  app.get(`/api/${process.env.VERSION}/tradoc/catalogo/tctipdoc`, async (req, res, next) => {
    try {
      let query1;
      //var cod_ord = req.params.cod_ord;

      query1 = `
                select 0 ti_docume, '[Ninguno]' no_docume, 1 union
                select ti_docume, no_docume, 2
                from wfpublic.tcdocume
                where ti_docume in (11, 4, 10, 13)
                order by 3 
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

  /// CON IGV
  app.get(`/api/${process.env.VERSION}/tradoc/catalogo/tcconigv`, async (req, res, next) => {
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
