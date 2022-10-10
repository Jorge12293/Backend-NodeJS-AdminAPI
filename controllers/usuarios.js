const {response} = require('express');
const bcrypt =require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req,res)=>{
    const usuarios = await Usuario.find({},'nombre email role');
    res.json({
        ok:true,
        usuarios,
        uid:req.uid
    })
}


const crearUsuario = async (req, res=response)=>{
    const {email,password,nombre} =req.body;
    try{
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya está registrado.'
            })
        }
        const usuario = new Usuario(req.body);
        
        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt);
        //Guardar usuario
        await usuario.save();
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            usuario,
            token
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inseperado ... revisar logs'
        })
    }
}


const actualizarUsuario= async(req,res=response)=>{
    const uid= req.params.id;
    try{
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe usuario con ese id'
            });
        }

        // Actualizar 
        const {password,google,email,...campos} = req.body;
        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'Ya existe usuario con ese email.'
                });
            }
        }
        campos.email=email;
        const usuarioAztualizado = await Usuario.findByIdAndUpdate(uid,campos,{new:true});

        res.json({
            ok:true,
            usuario:usuarioAztualizado
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Errror inesperado'
        });
    }

}

const borrarUsuario = async (req,res=response)=>{
    const uid = req.params.id; 
    try {
        const usuarioDB = await Usuario.findById(uid);
        
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario no existe'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        return res.status(200).json({
            ok:true,
            msg:'Usuario borrado correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Ocurrio un error en el servidor'
        });
    }
}


module.exports={
    getUsuarios,
    crearUsuario,
    borrarUsuario,
    actualizarUsuario
}

