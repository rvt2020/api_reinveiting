const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// ``

module.exports = async app => {
  // Extraer Acta 
  app.get(
    `/api/${process.env.VERSION}/pdf/js_acta_operac/:co_operac`,
    async (req, res, next) => {
      try {
        let query;
        const co_operac = req.params.co_operac;
        query = `select * from reoperac.f_js_acta_operac('${co_operac}');`;
        bitacora.control(query, req.url);
        const operac = await BD.storePostgresql(query);

        // Se entrega el vehículo en funcionamiento y en buenas condiciones por los trabajos 
        // realizados en el taller. 
        // En señal de conformidad del servicio, el cliente firma el presente documento ....fecha...
        
        if (operac.codRes != 99) {
          // con esto muestro msj
          res.json({ res: "ok", message: "Success", operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac})
            .status(500);
        }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  )

  app.get(
    `/api/${process.env.VERSION}/pdf/js_proforma_operac/:co_operac`,
    async (req, res, next) => {
      try {
        let query;
        const co_operac = req.params.co_operac;
        query = `select * from reoperac.f_js_proforma_operac('${co_operac}');`;
        bitacora.control(query, req.url);
        const operac = await BD.storePostgresql(query);

        // Se entrega el vehículo en funcionamiento y en buenas condiciones por los trabajos 
        // realizados en el taller. 
        // En señal de conformidad del servicio, el cliente firma el presente documento ....fecha...
        
        if (operac.codRes != 99) {
          // con esto muestro msj
          res.json({ res: "ok", message: "Success", operac }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", operac})
            .status(500);
        }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  )

  app.get(
    `/api/${process.env.VERSION}/pdf/f_js_docume_ordcom/:co_ordcom`,
    async (req, res, next) => {
      try {
        let query;
        const co_ordcom = req.params.co_ordcom;
        query = `select * from reordcom.f_js_docume_ordcom('${co_ordcom}');`;
        bitacora.control(query, req.url);
        const ordcom = await BD.storePostgresql(query);

        // Se entrega el vehículo en funcionamiento y en buenas condiciones por los trabajos 
        // realizados en el taller. 
        // En señal de conformidad del servicio, el cliente firma el presente documento ....fecha...
        
        if (ordcom.codRes != 99) {
          // con esto muestro msj
          res.json({ res: "ok", message: "Success", ordcom }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", ordcom})
            .status(500);
        }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  )
};
