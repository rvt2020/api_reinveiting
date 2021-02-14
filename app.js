const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const log = require("./utils/logger");
const app = express();
const cors = require("cors");

// Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({ path: `.env.${process.env.NODE_ENV}` });

// Usamos body-parse para revisar el body cuando los request son post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MIDDLEWARE
app.use(cors());


// simple route
app.get("/", (req, res) => {
  console.log("Webservices Reinventing.");
  res.json({ message: "Webservices Reinventing Pro." });
});


// Rutas
require('./api/routes/auth')(app)
require('./api/routes/users')(app)
require('./api/routes/vehiculos')(app)
require('./api/routes/marcas')(app)
require('./api/routes/modelos')(app)
require('./api/routes/personas')(app)
require('./api/routes/articulo')(app)
require('./api/routes/citas')(app)
require('./api/routes/operac')(app)
require('./api/routes/ordcom')(app)
require('./api/routes/tradoc')(app)
require('./api/routes/tipocita')(app)
require('./api/routes/operacflujo')(app)
require('./api/routes/reportes')(app)
require('./api/routes/almacen')(app)
require('./api/routes/comerc')(app)

// Registro de puerto y servidor.
app.disable("x-powered-by");
app.set("port", process.env.PORT);
app.set("host", process.env.NODEJS_IP);

// Iniciando Servidor.
app.listen(app.get("port"), app.get("host"), () => {
  log.info(`MS on http://${app.get("host")}:${app.get("port")}`);
});
