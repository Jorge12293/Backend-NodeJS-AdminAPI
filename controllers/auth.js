
const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google_verify');

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


const googleSingIn = async (req,res=response)=>{

    try {
        const {email,name,picture} = await googleVerify(req.body.token);
        
        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        if(!usuarioDB){
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@',
                img:picture,
                google:true,
            });
        }else{
            usuario = usuarioDB;
            usuario.google=true;
        }

        await usuario.save();
        const token = await generarJWT(usuario.id);
        return res.status(200).json({
            ok:true,
            email,name,picture,
            token
        });   
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok:false,
            msg:"Error en la verificación del token"
        });  
    
    }
}


const renewToken = async (req,res=response)=>{

    const uid = req.uid;

    const token = await generarJWT(uid);
    res.json({
        ok:true,
        token
    });
}


module.exports={
    login,
    googleSingIn,
    renewToken
}