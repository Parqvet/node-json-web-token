const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});

// para crear en la base de datos vamos a tener que usar la funcion model
module.exports = model('User', userSchema);