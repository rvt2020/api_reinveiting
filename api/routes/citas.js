const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora");

// ``


module.exports = async app => {
  // LISTA DE CITAS
  app.get("/api/v1.0/citas", async (req, res, next) => {
    try {
      let query;
      query = `select * from recitope.sp_mostrar_citas('', '')`;
      bitacora.control(query, req.url);
      const citas = await BD.storePostgresql(query);
      // con esto muestro msj
      if (citas.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", citas }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", citas })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  app.get("/api/v1.0/citas/:no_busque/:ti_busque", async (req, res, next) => {
    try {
      let query;
      const no_busque = req.params.no_busque;
      const ti_busque = req.params.ti_busque;

      console.log(no_busque);
      console.log(ti_busque);

      query = `select * from recitope.sp_mostrar_citas('${no_busque}', '${ti_busque}')`;
      bitacora.control(query, req.url);
      const citas = await BD.storePostgresql(query);
      // con esto muestro msj
      if (citas.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", citas }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", citas })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // AGREGAR CITA
  app.post("/api/v1.0/citas", async (req, res, next) => {
    try {
      var co_usuari = req.body.co_usuari;
      var co_docide = req.body.co_docide;
      var no_person = req.body.no_person;
      var nu_telefo = req.body.nu_telefo;
      var co_plaveh = req.body.co_plaveh;
      var co_modveh = req.body.co_modveh;
      var no_colveh = req.body.no_colveh;
      var fe_progra = req.body.fe_progra;
      var co_tipope = req.body.co_tipope;

      const query = `select * from recitope.sp_manten_citope(

                cast (null as integer),
                '${co_usuari}',
                '${co_docide}',
                '${no_person}',
                '${nu_telefo}',
                '${co_plaveh}',
                '${co_modveh}',
                '${no_colveh}',
                '${fe_progra}',
                '${co_tipope}'
            )`;
      // console.log(query);
      bitacora.control(query, req.url);
      const citas = await BD.storePostgresql(query);
      if (citas.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", citas }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", citas })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // INGRESAR VEHICULO
  app.post("/api/v1.0/citas/ingresar_vehicu", async (req, res, next) => {
    try {
      console.log(req.body);
      var per_reg = req.body.per_reg;
      var pla_veh = req.body.pla_veh;
      var mod_veh = req.body.mod_veh;
      var ano_veh = req.body.ano_veh;
      var col_veh = req.body.col_veh;
      var ser_veh = req.body.ser_veh;
      var mot_veh = req.body.mot_veh;
      var val_kil = req.body.val_kil;
      var doc_ide = req.body.doc_ide;
      var ape_pat = req.body.ape_pat;
      var ape_mat = req.body.ape_mat;
      var nom_cli = req.body.nom_cli;
      var cen_ope = req.body.cen_ope;
      var direcci = req.body.direcci;
      var det_ing = req.body.det_ing;
      var swt_sal = req.body.swt_sal;
      var fec_sal = req.body.fec_sal;
      var co_citope = req.body.co_citope;

      console.log(per_reg);
      console.log(pla_veh);
      console.log(mod_veh);
      console.log(ano_veh);
      console.log(col_veh);

      query = `
                select * from readuana.fb_ingreso_vehicular_citas(
                    cast('${per_reg}' as integer),
                    '${pla_veh}',
                    '${mod_veh}',
                    '${ano_veh}',
                    '${col_veh}',
                    '${ser_veh}',
                    '${mot_veh}',
                    cast('${val_kil}' as integer),
                    '${doc_ide}',
                    '${ape_pat}',
                    '${ape_mat}',
                    '${nom_cli}',
                    cast('${cen_ope}' as integer),
                    '${direcci}',
                    '${det_ing}',
                    '${swt_sal}',
                    '${fec_sal}',
                    ${co_citope}
                );
            `;

      console.log(query);
      bitacora.control(query, req.url);
      const citas = await BD.storePostgresql(query);
      console.log("citas", citas);
      if (citas.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", citas }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", citas })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });

  // ACTUALIZAR CITAS
  app.put("/api/v1.0/citas", async (req, res, next) => {
    try {
      const co_citope = req.body.co_citope;
      var co_usuari = req.body.co_usuari;
      var co_docide = req.body.co_docide;
      var no_person = req.body.no_person;
      var nu_telefo = req.body.nu_telefo;
      var co_plaveh = req.body.co_plaveh;
      var co_modveh = req.body.co_modveh;
      var no_colveh = req.body.no_colveh;
      var fe_progra = req.body.fe_progra;
      var co_tipope = req.body.co_tipope;

      if (co_citope == "undefined") {
        miExcepcionMarca = new miExcepcionMarca(
          "Falta definir código de la cita."
        );
        throw miExcepcionMarca;
      }
      const query = `select * from recitope.sp_manten_citope(
                cast (${co_citope} as integer),
                '${co_usuari}',
                '${co_docide}',
                '${no_person}',
                '${nu_telefo}',
                '${co_plaveh}',
                '${co_modveh}',
                '${no_colveh}',
                '${fe_progra}',
                '${co_tipope}'
            )`;

      bitacora.control(query, req.url);
      const citas = await BD.storePostgresql(query);
      if (citas.codRes != 99) {
        // con esto muestro msj
        res.json({ res: "ok", message: "Success", citas }).status(200);
      } else {
        res
          .json({ res: "ko", message: "Error en la query", citas })
          .status(500);
      }
    } catch (error) {
      res.json({ res: "ko", message: "Error controlado", error }).status(500);
    }
  });
};
