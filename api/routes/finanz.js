const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = async app => {
    // INSERTAR BOLETA O FACTURA
    app.post(`/api/${process.env.VERSION}/finanz/insert_factur`, async (req, res, next) => {
        try {
            let query1;
            var pn_regist = req.body.pn_regist;
            var fe_emisio = req.body.fe_emisio;
            var ti_docume = req.body.ti_docume;
            var nu_docume = req.body.nu_docume;
            var co_person = req.body.co_person;
            
            query1 = `select * from wffactur.fb_insert_factur(
                ${pn_regist},
                '${fe_emisio}',
                ${ti_docume},
                '${nu_docume}',
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
        // }
        } catch (error) {
        res.json({ res: "ko", message: "Error controlado", error }).status(500);
        }
    });

    
    // CON IGV

};
