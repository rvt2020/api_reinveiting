var bcrypt = require('bcrypt');
const BD = require("../database/pg/postgres");

module.exports = async (app) => {
    app.post(`/api/${process.env.VERSION}/login`, async (req, res, next) => {
        
        const username = req.body.username;
        const password = req.body.password;

        console.log(username);
        console.log(password);

        const query = `SELECT * from fwconacc.tbusuari where no_usuari = '${username}'`;
        console.log(query);
        const getuser = await BD.storePostgresql(query);
        console.log(getuser);
        const user = getuser[0]
        if (!user) {
            res.json({ res: "ko", message: "El usuario no se ha identificado" }).status(404)
        } else {
            // if (password == user.pw_usuari) {
            //     // req.session.userID = user.id
            //     // req.session.username = user.username
            //     // req.session.logged = true
            //     delete user.pw_usuari
            //     res.json({ res: 'ok', message: "Wellcome", user }).status(200)
            // } else {
            //     res.json({ res: 'ko', message: "Password Incorrecto" }).status(400)
            // }
            console.log(user.pw_usuari);
            res.json({ res: 'ok', message: "Wellcome", user }).status(200)
            // bcrypt.compare(password, user.pw_usuari, (err, result) => {
            //     if (result == true) {
            //         // req.session.userID = user.id
            //         // req.session.username = user.username
            //         // req.session.logged = true
            //         delete user.pw_usuari
            //         res.json({ res: 'ok', message: "Wellcome", user }).status(200)
            //     } else {
            //         res.json({ res: 'ko', message: "Password Incorrecto", result, err }).status(400)
            //     }
            // })
        }
    })

    app.post(`/api/${process.env.VERSION}/register`, async (req, res) => {

    })

    app.post(`/api/${process.env.VERSION}/logout`, async (req, res) => {

        req.session.userID = null
        req.session.username = null
        req.session.logged = false
        res.json({ res: 'ok', message: "Session cerrada correctamente" }).status(200)

    })

}

