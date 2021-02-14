const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
  /// LISTAR PRODUCTOS QUE INGRESARÁN DE ORDEN DE COMPRA O TRAMITE DOCUMENTARIO
  app.post(
    `/api/${process.env.VERSION}/almace/listar_produc_ordtra_ingres`,
    async (req, res, next) => {
      try {
        let query1;

        var fe_regdes = req.body.fe_regdes;
        var fe_reghas = req.body.fe_reghas;
        var no_provee = req.body.no_provee;
        var nu_ordtra = req.body.nu_ordtra;
        var co_barras = req.body.co_barras;
        var il_ordtra = req.body.il_ordtra;

        // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
        // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
        // else {
        query1 = `select * from wfalmace.fb_listar_produc_ordtra_ingres(
            '${fe_regdes}',
            '${fe_reghas}',
            '${no_provee}',
            '${nu_ordtra}',
            '${co_barras}',
            '${il_ordtra}'
        )`;

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        console.log("operac:", operac.codRes);
        // con esto muestro msj
        if (operac.codRes != 99) {

          // console.log("siempre entra:", operac[0].co_respue);
          // con esto muestro msj
          // if (operac[0].co_respue == "-1") {
            // res.json({ res: "ko", message: operac }).status(500);
          // }
          res.json({ res: "ok", message: operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// LISTAR PRODUCTOS QUE SERÁN DESPACHADOS DE OPERACIONES
  app.post(
    `/api/${process.env.VERSION}/almace/listar_produc_operac_salida`,
    async (req, res, next) => {
      try {
        let query1;

        var fe_regdes = req.body.fe_regdes;
        var fe_reghas = req.body.fe_reghas;
        var co_operac = req.body.co_operac;
        var co_plaveh = req.body.co_plaveh;
        var il_despac = req.body.il_despac;

        // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
        // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
        // else {
        query1 = `select * from wfalmace.fb_listar_produc_operac_salida(
            '${fe_regdes}',
            '${fe_reghas}',
            '${co_operac}',
            '${co_plaveh}',
            '${il_despac}'
        )`;

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac.codRes != 99) {
          // con esto muestro msj
          if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac }).status(500);
          }
          res.json({ res: "ok", message: operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// INSERTAR PRODUCTOS QUE INGRESAN O SALES DE ORDEN DE COMPRA, TRAMITE DOCUMENTARIO y OPERACIONES
  app.post(`/api/${process.env.VERSION}/almace/insert_produc_ingsal`, async (req, res, next) => {
    try {
      let query1;

      var co_person = req.body.co_person;
      var fe_regist = req.body.fe_regist;
      var co_prikey = req.body.co_prikey;
      var co_articu = req.body.co_articu;
      var ca_articu = req.body.ca_articu;
      var il_unineg = req.body.il_unineg;
      var ti_ingsal = req.body.ti_ingsal;

      // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
      // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
      // else {
      query1 = `select * from wfalmace.fb_insert_produc_ingsal(
            ${co_person},
            '${fe_regist}',
            ${co_prikey},
            ${co_articu},
            ${ca_articu},
            '${il_unineg}',
            ${ti_ingsal}
        )`;

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (operac.codRes != 99) {
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
          res.json({ res: "ko", message: operac }).status(500);
        }
        res.json({ res: "ok", message: operac }).status(200);
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

  /// QUITAR PRODUCTOS QUE INGRESAN O SALES DE ORDEN DE COMPRA, TRAMITE DOCUMENTARIO y OPERACIONES
  app.post(
    `/api/${process.env.VERSION}/almace/quitar_produc_agrega_ingsal`,
    async (req, res, next) => {
      try {
        let query1;

        var co_person = req.body.co_person;
        var fe_regist = req.body.fe_regist;
        var co_prikey = req.body.co_prikey;
        var co_articu = req.body.co_articu;
        var ca_articu = req.body.ca_articu;
        var il_unineg = req.body.il_unineg;
        var ti_ingsal = req.body.ti_ingsal;

        // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
        // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
        // else {
        query1 = `select * from wfalmace.fb_quitar_produc_agrega_ingsal(
            ${co_person},
            '${fe_regist}',
            ${co_prikey},
            ${co_articu},
            ${ca_articu},
            '${il_unineg}',
            ${ti_ingsal}
        )`;

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac.codRes != 99) {
          // con esto muestro msj
          if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac }).status(500);
          }
          res.json({ res: "ok", message: operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// LISTAR DOCUMENTOS AGREGADOS PARA EL INGRESO o SALIDA
  app.post(
    `/api/${process.env.VERSION}/almace/listar_docume_agrega_ingsal`,
    async (req, res, next) => {
      try {
        let query1;

        var fe_regist = req.body.fe_regist;
        var co_person = req.body.co_person;
        var il_unineg = req.body.il_unineg;
        var ti_ingsal = req.body.ti_ingsal;

        // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
        // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
        // else {
        query1 = `select * from wfalmace.fb_listar_docume_agrega_ingsal(
            '${fe_regist}',
            ${co_person},
            '${il_unineg}',
            ${ti_ingsal}
        )`;

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac.codRes != 99) {
          // con esto muestro msj
          if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac }).status(500);
          }
          res.json({ res: "ok", message: operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// LISTAR PRODUCTOS AGREGADOS DEL DOCUMENTO PARA EL INGRESO o SALIDA
  app.post(
    `/api/${process.env.VERSION}/almace/listar_produc_agrega_ingsal`,
    async (req, res, next) => {
      try {
        let query1;

        var fe_regist = req.body.fe_regist;
        var co_person = req.body.co_person;
        var il_unineg = req.body.il_unineg;
        var ti_ingsal = req.body.ti_ingsal;

        // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
        // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
        // else {
        query1 = `select * from wfalmace.fb_listar_produc_agrega_ingsal(
            '${fe_regist}',
            ${co_person},
            '${il_unineg}',
            ${ti_ingsal}
        )`;

        bitacora.control(query1, req.url);
        const operac = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (operac.codRes != 99) {
          // con esto muestro msj
          if (operac[0].co_respue == "-1") {
            res.json({ res: "ko", message: operac }).status(500);
          }
          res.json({ res: "ok", message: operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac })
            .status(500);
        }
        // }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// GRABA EL DOCUMENTO TRANSACCIONAL CON SUS PRODUCTOS AGREGADOS DE INGRESO o SALIDA
  app.post(`/api/${process.env.VERSION}/almace/grabar_transa_ingsal`, async (req, res, next) => {
    try {
      let query1;

      var fe_regist = req.body.fe_regist;
      var co_person = req.body.co_person;
      var il_unineg = req.body.il_unineg;
      var ti_ingsal = req.body.ti_ingsal;
      var co_empres = req.body.co_empres;
      var co_almace = req.body.co_almace;
      var no_coment = req.body.no_coment;
      var nu_guirem = req.body.nu_guirem;
      var co_arcadj = req.body.co_arcadj;

      // if (fe_tradoc == null || fe_tradoc.trim() == ''){res.json({ res: 'ko', message: "Fecha de Trámite NO esta definido."}).status(500)}
      // else if (de_mottra == null || de_mottra.trim() == ''){res.json({ res: 'ko', message: "Motivo de T/D NO definido."}).status(500)}
      // else {
      query1 = `select * from wfalmace.fb_grabar_transa_ingsal(
          '${fe_regist}',
          ${co_person},
          '${il_unineg}',
          ${ti_ingsal},
          ${co_empres},
          ${co_almace},
          '${no_coment}',
          '${nu_guirem}',
          '${co_arcadj}'
        )`;

      bitacora.control(query1, req.url);
      const operac = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (operac.codRes != 99) {
        // con esto muestro msj
        if (operac[0].co_respue == "-1") {
          res.json({ res: "ko", message: operac }).status(500);
        }
        res.json({ res: "ok", message: operac }).status(200);
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
};
