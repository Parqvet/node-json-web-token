const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

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

router.get('/me', async (req, res, next) => {

    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }

    const decoded = jwt.verify(token, config.secret);
    
    const user = await User.findById(decoded.id, { password: 0 })
    if (!user) {
        return res.status(404).send('No user found');
    }

    res.json(user);
})

router.post('/signin', (req, res, next) => {
    res.json('signin');

})


module.exports = router;