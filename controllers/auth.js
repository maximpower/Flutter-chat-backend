const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const user = require('../models/user');
const { validationResult } = require('express-validator');

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                ok: false,
                msg: 'This email is alredy in use'
            });
        }

        const user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);


        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const userDB = await user.findOne({ email });
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password

        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validationResult) {
            return res.status(400).json({
                ok: false,
                msg: 'Password not valid'
            });
        }

        // Generar el JWT 
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            userDB,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });


    }
}

const renewToken = async (req, res = response) => {

    // const uid
    const uid = req.uid;

    const token = await generateJWT(uid);

    const userDB = await user.findById(uid);

    if( userDB ){
        return res.json({
            ok: true,
            userDB,
            token
        });
    }else{
        return res.status(404).json({
            ok : false,
            msg: ' Something went wrong '
        });
    }



}


module.exports = {

    createUser,
    login,
    renewToken

}