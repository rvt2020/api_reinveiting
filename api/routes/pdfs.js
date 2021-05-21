const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// ``

module.exports = async app => {
  // para traer todos los usuarios
  app.get(
    `/api/${process.env.VERSION}/pdf/js_acta_operac/:co_operac`,
    async (req, res, next) => {
      try {
        let query;
        const co_operac = req.params.co_operac;
        query = `select * from reoperac.f_js_acta_operac('${co_operac}');`;
        bitacora.control(query, req.url);
        const operac = await BD.storePostgresql(query);

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
    }
  );
};
