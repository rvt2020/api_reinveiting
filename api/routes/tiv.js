const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {

  // LISTA GENERAL DE VEHICULOS QUE SERÁN O ESTÁN VENDIDOS
  app.post(`/api/${process.env.VERSION}/tiv/bandeja_general`, async (req, res, next) => {
    try {
      let query1;
      
      query1 = `select * from regestiv.fb_bandeja_general()`;

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

  // LISTADO DE BANDEJA POR ESTADO
  app.post(`/api/${process.env.VERSION}/tiv/bandeja_tramite_estado`, async (req, res, next) => {
    try {
      let query1;
      var co_bandej = req.body.co_bandej;

      query1 = `select * from regestiv.fb_listado_vehiculo( 
                cast (${co_bandej} as integer)
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

  // INFORMACIÓN DEL VEHICULO SELECCIONADO
  app.post(`/api/${process.env.VERSION}/tiv/datos_vehiculo`, async (req, res, next) => {
    try {
      let query1;
      var co_vehicu = req.body.co_vehicu;

      query1 = `select * from regestiv.fb_datos_vehiculo_tramite( 
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
  });

  
};
