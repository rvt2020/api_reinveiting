const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {

  // LISTA DE COMPRA DE VEHICULOS QUE SERÁN VENDIDOS
  app.post(`/api/${process.env.VERSION}/comercial/lista_compra_vehiculo`, async (req, res, next) => {
    try {
      let query1;
      
      query1 = `select * from reordcom.fb_listar_compra_vehicu()`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // TIPO DE MONEDA
  app.get(`/api/${process.env.VERSION}/comercial/lista_tcmoneda`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
        select co_moneda, no_moneda
        from wfpublic.tcmoneda
        where co_moneda in (15, 28)
        order by 2 
      `;
            
      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // TIPO DE VEHICULO
  app.get(`/api/${process.env.VERSION}/comercial/lista_tctipveh`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
        select ti_vehicu, no_tipveh
        from wfvehicu.tctipveh
        order by 2 
      `;
            
      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // TIPO DE DESCUENTO
  app.get(`/api/${process.env.VERSION}/comercial/lista_tctipdct`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
        select co_tipdct, no_tipdct
        from wfpublic.tctipdct
        order by 2 
      `;
            
      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// MUESTRA EL RESULTADO DEL CALCULO DE LA VENTA ///
  app.post(`/api/${process.env.VERSION}/comercial/resultado_calculo`, async (req, res, next) => {
    try {
      let query1;
      var co_vehicu = req.body.co_vehicu;

      query1 = `select * from reventas.fb_result_calcul(cast (${co_vehicu} as integer))`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // MUESTRA LA LISTA DE VEHICULOS
  app.post(`/api/${process.env.VERSION}/comercial/listado_vehiculo`, async (req, res, next) => {
    try {
      let query1;
      var no_marveh = req.body.no_marveh ? req.body.no_marveh : "";
      var no_modveh = req.body.no_modveh ? req.body.no_modveh : "";
      var no_colveh = req.body.no_colveh ? req.body.no_colveh : "";
      var nu_anoveh = req.body.nu_anoveh ? req.body.nu_anoveh : "";
      
      query1 = `select * from reventas.fb_listado_vehiculo(
        '${no_marveh}',
        '${no_modveh}',
        '${no_colveh}',
        '${nu_anoveh}'
        )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });
  
  //INFORMACIÓN DE LA COMPRA
  app.post(`/api/${process.env.VERSION}/comercial/datos_compra`, async (req, res, next) => {
    try {
      let query1;
      var co_ordcom = req.body.co_ordcom;
      var co_comart = req.body.co_comart;

      query1 = `select * from reordcom.fb_inform_ordcom( 
                cast (${co_ordcom} as integer),
                cast('${co_comart}' as integer)
            )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      if (resultado.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", resultado }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// INFORMACIÓN DEL VEHICULO SELECCIONADO
  app.post(
    `/api/${process.env.VERSION}/comercial/datos_vehiculo`,
    async (req, res, next) => {
      try {
        let query1;
        var co_vehicu = req.body.co_vehicu;

        query1 = `select * from reventas.fb_datos_vehiculo( 
                    cast (${co_vehicu} as integer)
                )`;

        bitacora.control(query1, req.url);
        const resultado = await BD.storePostgresql(query1);
        // con esto muestro msj
        if (resultado.codRes != 99) {
          // con esto muestro msj
          res.json({ res: "ok", message: "Success", resultado }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", resultado })
            .status(500);
        }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );

  /// ACTUALIZA PLACA
  app.post(`/api/${process.env.VERSION}/comercial/update_vehiculo`, async (req, res, next) => {
    try {
      let query1;

      var co_vehicu = req.body.co_vehicu;
      var co_plaveh = req.body.co_plaveh;

      query1 = `select * from reventas.fb_update_vehicu(
            ${co_vehicu},
            '${co_plaveh}'
        )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(resultado);
      if (resultado.codRes != 99) {
        // con esto muestro msj
        if (resultado[0].co_respue == "-1") {
          res.json({ res: "ko", message: resultado[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: resultado[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// GENERAR VEHICULO PARA VENDER
  app.post(`/api/${process.env.VERSION}/comercial/insert_vehicu`, async (req, res, next) => {
    try {
      let query1;

      var co_ordcom = req.body.co_ordcom;
      var co_comart = req.body.co_comart;
      var co_modveh = req.body.co_modveh;
      var nu_anomod = req.body.nu_anomod;
      var nu_serveh = req.body.nu_serveh;
      var nu_motveh = req.body.nu_motveh;
      var no_colveh = req.body.no_colveh;
      var ti_vehicu = req.body.ti_vehicu;
      var fe_emisio = req.body.fe_emisio;
      var nu_docume = req.body.nu_docume;
      var co_moneda = req.body.co_moneda;
      var im_preven = req.body.im_preven;
      var co_arcadj = req.body.co_arcadj;

      if (im_preven == null || im_preven.trim() == ''){
        im_preven = '';
      }
      
      query1 = `select * from reventas.fb_insert_vehicu(
        ${co_ordcom},
        ${co_comart},
        ${co_modveh},
        ${nu_anomod},
        '${nu_serveh}',
        '${nu_motveh}',
        '${no_colveh}',
        ${ti_vehicu},
        '${fe_emisio}',
        '${nu_docume}',
        ${co_moneda},
        '${im_preven}',
        '${co_arcadj}'
      )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(resultado);
      if (resultado.codRes != 99) {
        // con esto muestro msj
        if (resultado[0].co_respue == "-1") {
          res.json({ res: "ko", message: resultado[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: resultado[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// GENERAR OPERACION
  app.post(`/api/${process.env.VERSION}/comercial/insert_operac_venta`, async (req, res, next) => {
    try {
      let query1;

      var co_vehicu = req.body.co_vehicu;
      var co_client = req.body.co_client;
      var co_person = req.body.co_person;
      var co_usuari = req.body.co_usuari;
      var co_moneda = req.body.co_moneda;

      query1 = `select * from reventas.fb_insert_operac_venta(
            ${co_vehicu},
            ${co_client},
            ${co_person},
            ${co_usuari},
            ${co_moneda}
        )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(resultado);
      if (resultado.codRes != 99) {
        // con esto muestro msj
        if (resultado[0].co_respue == "-1") {
          res.json({ res: "ko", message: resultado[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: resultado[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// CALCULA EL MONTO QUE SE DESEE VENDER
  app.post(`/api/${process.env.VERSION}/comercial/insert_calculo_venta`, async (req, res, next) => {
    try {
      let query1;
      
      var co_vehicu = req.body.co_vehicu;
      var va_tipcam = req.body.va_tipcam;
      var ti_desven = req.body.ti_desven;
      var va_desven = req.body.va_desven;
      var ti_desini = req.body.ti_desini;
      var va_cuoini = req.body.va_cuoini;

      query1 = `select * from reventas.fb_calcul_operac(
            ${co_vehicu},
            ${va_tipcam},
            ${ti_desven},
            ${va_desven},
            ${ti_desini},
            ${va_cuoini}
        )`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(resultado);
      if (resultado.codRes != 99) {
        // con esto muestro msj
        if (resultado[0].co_respue == "-1") {
          res.json({ res: "ko", message: resultado[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: resultado[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  /// RESETEA EL CALCULO
  app.post(`/api/${process.env.VERSION}/comercial/reseteo_calculo`, async (req, res, next) => {
    try {
      let query1;
      
      var co_vehicu = req.body.co_vehicu;

      query1 = `delete from reventas.tmcalculven where co_vehicu = (${co_vehicu})`;

      bitacora.control(query1, req.url);
      const resultado = await BD.storePostgresql(query1);
      // con esto muestro msj
      console.log(resultado);
      if (resultado.codRes != 99) {
        // con esto muestro msj
        if (resultado[0].co_respue == "-1") {
          res.json({ res: "ko", message: resultado[0].no_respue }).status(500);
        }
        res.json({ res: "ok", message: resultado[0].no_respue }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", resultado })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

};
