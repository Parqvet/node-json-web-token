const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');
const verifyToken = require('./verify.token');

const User = require('../models/User');

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;
    
    // con los datos recibidos creamos un modelo de usuario
    const user = new User({
        username,
        email,
        password
    });

    // le pasamos la pass para cifrarlo y lo reescribimos en el mismo lugar
    // como el metodo es asincrono tengo que usar await
    user.password = await user.encryptPassword(user.password);

    // para guardarlo, desde user mongoose nos ofrece un metodo llamado save
    await user.save()

    // creamos un token para el user, le pasamos el id del user como parametro y un secretKey
    // a su vez le podemos pasar un objeto para decirle cuando va a expirar el token
    const token = jwt.sign({id: user._id}, config.secret, {
        // para que expire en un dia
        expiresIn: 60 * 60 * 24
    });

    // como ya hay un dato guardado en la base de datos, le podemos decir al usuario que ya puede navegar en la app porque ya esta autenticado
    // cada vez que se registre un usuario, el servidor le responde con un auth true y le devuelve un token para que pueda navegar en el mismo
    res.json({auth: true, token});
})

router.get('/me', verifyToken, async (req, res, next) => {
    
    const user = await User.findById(req.UserId, { password: 0 })
    if (!user) {
        return res.status(404).send('No user found');
    }

    res.json(user);
})

router.post('/signin', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({email: email})

    if (!user) {
        return res.status(404).send("The email doesn't exists");
    }

    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
        return res.status(401).json({auth: false, token: null});
    }

    const token = jwt.sign({id: user._id}, config.secret, {
        expiresIn: 60 * 60 * 24
    });

    res.json({auth: true, token});
})


module.exports = router;