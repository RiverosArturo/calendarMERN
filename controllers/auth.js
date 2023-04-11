const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {

        let usuario = await Usuario.findOne({ email });
        // console.log( usuario );
        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo.'
            });
        }
        
        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        //grabar datos en la DB
        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
    

}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        // console.log( usuario );
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: `No existe un usario con email: ${ email }`
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto.'
            });
        }

        //Gererar nuestro JWT (Json Web Token):
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }

}

const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );

    res.json({
        ok:true,
        token
    });

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}