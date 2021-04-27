const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
  /// INSERTAR FACTURA
  app.post(`/api/${process.env.VERSION}/factur/insert_factur`, async (req, res, next) => {
    try {
        pn_regist = req.body.pn_regist;
        fe_emisio = req.body.fe_emisio;
        ti_docume = req.body.ti_docume;
        nu_docume = req.body.nu_docume;
        co_client = req.body.co_client;
        

        console.log(pn_regist);
        console.log(fe_emisio);
        console.log(ti_docume);
        console.log(nu_docume);
        console.log(co_client);

      //insert
      query1 = `select * from refactur.fb_insert_factur(
        ${pn_regist},
        '${fe_emisio}',
        ${ti_docume},
        '${nu_docume}',
        ${co_client}
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

  /// ACTUALIZAR FACTURA
  app.post(`/api/${process.env.VERSION}/factur/update_factur`, async (req, res, next) => {
    try {
      var co_factur = req.body.co_factur;
      var ti_estado = req.body.ti_estado;
    
    //update
    query1 = `select * from refactur.fb_update_factur(
      ${co_factur},
      ${ti_estado}
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

  /// AMORTIZAR FACTURA
  app.post(`/api/${process.env.VERSION}/factur/amorti_factur`, async (req, res, next) => {
    try {
      let query1;
      
      pn_regist = req.body.pn_regist;
      co_factur = req.body.co_factur;
      fe_amorti = req.body.fe_amorti;
      co_entfin = req.body.co_entfin;
      im_amorti = req.body.im_amorti;
      im_detrac = req.body.im_detrac;
      no_coment = req.body.no_coment;

      query1 = `select * from refactur.fb_amorti_factur(
        ${pn_regist},
        ${co_factur},
        '${fe_amorti}',
        ${co_entfin},
        ${im_amorti},
        ${im_detrac},
        '${no_coment}'
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

  /// ELIMINAR FACTURA
  app.post(`/api/${process.env.VERSION}/factur/delete_factur`, async (req, res, next) => {
    try {
      let query1;

      var co_factur = req.body.co_factur;
      var co_person = req.body.co_person;

      query1 = `select * from refactur.fb_delete_factur(
            ${co_factur},
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

  /// LISTA DE FACTURAS ///
  app.post(`/api/${process.env.VERSION}/factur/listar_factur`, async (req, res, next) => {
    try {
      console.log("1");
      let query1;
      var fe_regdes = req.body.fe_regdes;
      var fe_reghas = req.body.fe_reghas;
      var no_client = req.body.no_client;
      var nu_factur = req.body.nu_factur;
      var ti_estado = req.body.ti_estado;
      var co_operac = req.body.co_operac;
      var ti_bandej = req.body.ti_bandej;
      
      query1 = `select * from refactur.fb_listar_factur(
            '${fe_regdes}', 
            '${fe_reghas}',
            '${no_client}', 
            '${nu_factur}', 
            '${ti_estado}', 
            '${co_operac}', 
            cast (${ti_bandej} as integer)
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
  /// INFORMACIÓN DE FACTURA SELECCIONADA
  app.post(`/api/${process.env.VERSION}/factur/inform_factur`, async (req, res, next) => {
    try {
      let query1;
      var co_factur = req.body.co_factur;

      query1 = `select * from refactur.fb_inform_factur( 
                cast (${co_factur} as integer)
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

  /// DETALLE DE CADA FACTURA ///
  app.post(`/api/${process.env.VERSION}/factur/listar_detall_factur`, async (req, res, next) => {
    try {
      let query1;
      var co_factur = req.body.co_factur;

      query1 = `select * from refactur.fb_listar_detall_factur( 
                cast (${co_factur} as integer)
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

  /// DETALLE DE AMORTIZACIONES ///
  app.post(`/api/${process.env.VERSION}/factur/listar_amorti`, async (req, res, next) => {
    try {
      let query1;
      var co_factur = req.body.co_factur;

      query1 = `select * from refactur.fb_listar_amorti_factur( 
                cast (${co_factur} as integer)
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

  
  /// LISTAR OPERACIONNES ENCOTRADOS FACTURAS ///
  app.post(`/api/${process.env.VERSION}/factur/listar_operac_encont`, async (req, res, next) => {
    try {
      let query1;
      var co_factur = req.body.co_factur ? parseInt(req.body.co_factur) : null;
      var no_client = req.body.no_client ? req.body.no_client : "";
      var co_plaveh = req.body.co_plaveh ? req.body.co_plaveh : "";
      var co_operac = req.body.co_operac ? req.body.co_operac : "";

      query1 = `select * from refactur.fb_listar_operac_encont(
            ${co_factur},
            '${no_client}',
            '${co_plaveh}',
            '${co_operac}'
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

  /// MANTENIMIENTO DE DETALLE FACTURA ///
  app.post(`/api/${process.env.VERSION}/factur/manten_detalle_factur`, async (req, res, next) => {
    try {
      let query1;
    
      var co_factur = req.body.co_factur;
      var co_operac = req.body.co_operac;
      var ti_accion = req.body.ti_accion;

      query1 = `select * from refactur.fb_manten_detalle_factur(
            cast (${co_factur} as integer),
            cast (${co_operac} as integer),
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

  ///ELIMINAR DETALLE DE LA FACTURA
  app.post(`/api/${process.env.VERSION}/factur/delete_detalle_factur`, async (req, res, next) => {
    try {
      let query1;
    
      var co_facdet = req.body.co_facdet;

      query1 = `select * from refactur.fb_delete_detalle_factur(
            cast (${co_facdet} as integer)
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

  
  ///ELIMINAR DETALLE DE LA FACTURA
  app.post(`/api/${process.env.VERSION}/factur/update_estado`, async (req, res, next) => {
    try {
      let query1;
      
      var co_factur = req.body.co_factur;
      var ti_estado = req.body.ti_estado;
      var co_person = req.body.co_person;

      query1 = `select * from refactur.fb_update_estado(
            cast (${co_factur} as integer),
            cast (${ti_estado} as integer),
            cast (${co_person} as integer)
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
  /// CATALOGO ENTIDAD FINANCIERA ///
  app.get(`/api/${process.env.VERSION}/factur/catalogo/tcentfin`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
        select 1, 2
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

  /// CATALOGO PROVEEDOR ///
  app.get(`/api/${process.env.VERSION}/factur/catalogo/tctipdoc`, async (req, res, next) => {
    try {
      let query1;

      query1 = `
          select co_entfin, no_entfin
          from wfpublic.tcentfin
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

  

  // CLIENTE
    app.get(`/api/${process.env.VERSION}/factur/catalogo/tcclient`, async (req, res, next) => {
        try {
            let query1;

            query1 = `
                select 
                  pe.co_person, 
                  (pbperson.f_no_person(pe.co_person)||' - '||pbperson.f_co_docide(pe.co_person)) no_person
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
};
