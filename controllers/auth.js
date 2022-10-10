
const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt')

const login = async(req,res=response)=>{
    const {email,password} = req.body;
    try {

        const usuarioBD = await Usuario.findOne({email});

        if(!usuarioBD){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }

        const validPassword = bcrypt.compareSync(password,usuarioBD.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Contraseña incorrecta'
            });
        }

        const token = await generarJWT(usuarioBD.id);

        return res.status(200).json({
            ok:true,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        })
    }

}

module.exports={
    login
}