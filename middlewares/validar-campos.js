const { response } = require('express');
const { validationResult } = require('express-validator');

//next se llama si toda la funcion se ejecuto satisfactoriamente
const validarCampos = ( req, res = response, next ) => {

    //manejo de errores
    const errors = validationResult( req );
    // console.log(errors);
    //Si hay errores
    if( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    next();
}

module.exports = {
    validarCampos,
}

