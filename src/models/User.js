const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: String,
    email: String,
    password: String
});

// vamos a extender sus datos creando metodos
userSchema.methods.encryptPassword = async (password) => {
    // ciframos la pass con el modulo bcrypt
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);

}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

// para crear en la base de datos vamos a tener que usar la funcion model
module.exports = model('User', userSchema);