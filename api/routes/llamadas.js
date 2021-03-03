const BD = require("../database/pg/postgres");
const bitacora = require("../../utils/bitacora")
const bcrypt = require('bcrypt');
const saltRounds = 10

module.exports = async (app) => {

/// INSERTAR DE GESTIONES DE LLAMADAS
  app.post(`/api/${process.env.VERSION}/llamad/insert_llamad`, async (req, res, next) => {
    try {
      let query1;
      
      var co_usuari = req.body.co_usuari;
      var co_person = req.body.co_person;
      var co_estlla = req.body.co_estlla;
      var co_resges = req.body.co_resges;
      var fe_vollla = req.body.fe_vollla; // fecha cita -> tipo fecha
      var no_coment = req.body.no_coment;

      console.log(co_usuari);
      console.log(co_person);
      console.log(co_estlla);
      console.log(co_resges);
      console.log(fe_vollla);
      console.log(no_coment);
      
      //insert
      query1 = `select * from rellamad.fb_insert_llamad(
        ${co_usuari},
        ${co_person},
        ${co_estlla},
        ${co_resges},
        '${fe_vollla}',
        '${no_coment}'
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

  // MUESTRA LA LISTA DE LLAMADAS
  app.post(`/api/${process.env.VERSION}/llamad/listar_llamad`, async (req, res, next) => {
    try {            
      var no_client = req.body.no_client;

      var query;
      
      query = `select 
                co_client, no_client, nu_telefo, co_plaveh, no_marveh,
                no_modveh, no_tipcli, no_tipser, km_manten, fe_ulttra, 
                ti_estado
              from reoperac.fb_listar_seguim_manten(
                  '${no_client}'
              );`;
          
              bitacora.control(query, req.url)
          const resultado = await BD.storePostgresql(query);
          if (resultado.codRes != 99) {
              // con esto muestro msj
              res.json({ res: 'ok', message: "Success", resultado}).status(200)
          } else {
              res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
          }
    } catch (error) {
        res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
    }
  });

  // MUESTRA LA LISTA DE BITÁCORA
  app.post(`/api/${process.env.VERSION}/llamad/listar_bitlla`, async (req, res, next) => {
    try {   
        var co_person = req.body.co_person;         
        var query;
        query = `   
            select  
              co_llamad, fe_llamad, no_usuari, no_person,
              co_plaveh, no_estlla, no_resges, fe_vollla,
              no_coment
            from rellamad.fb_listar_bitlla(
                ${co_person}
            );`;
            
        bitacora.control(query, req.url)
        const resultado = await BD.storePostgresql(query);
        if (resultado.codRes != 99) {
            // con esto muestro msj
            res.json({ res: 'ok', message: "Success", resultado}).status(200)
        } else {
            res.json({ res: 'ko', message: "Error en la query", resultado }).status(500)
        }            
    } catch (error) {
        res.json({ res: 'ko', message: "Error controlado chamo", error }).status(500)
    }

  });
    
}