const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// ``

module.exports = async app => {
  // para traer todos los usuarios
  app.get(
    `/api/${process.env.VERSION}/pdf/actadeservicio/:orden`,
    async (req, res, next) => {
      try {
        let query;
        const doc_ide = req.params.orden;
        query = `select * from pbperson.sp_mostrar_pernat('${doc_ide}');`;
        bitacora.control(query, req.url);
        const personas = await BD.storePostgresql(query);

        // con esto muestro msj
        if (personas.codRes != 99) {
          // con esto muestro msj
          res.json({ res: "ok", message: "Success", personas }).status(200);
        } else {
          res
            .json({ res: "ko", message: "Error en la query", personas })
            .status(500);
        }
      } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
      }
    }
  );
};
