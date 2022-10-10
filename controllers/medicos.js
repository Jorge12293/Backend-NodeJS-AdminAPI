const {response} = require('express');
const Medico = require('../models/medico')

const getMedicos=async (req,res=response)=>{
   const medicos = await Medico.find()
   .populate('usuario')
   .populate('hospital');
   return res.json({
        ok:true,
        medicos
    });
}


const crearMedico=async (req,res=response)=>{

    const uid= req.uid;
    const medico = new Medico({
        usuario:uid,
        ...req.body
    });
   
    try{
        const medicoDB = await medico.save();
        return res.status(200).json({
            ok:true,
            medico:medicoDB
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        });
    }
 }

 const actualizarMedico=(req,res=response)=>{
    return res.json({
         ok:true,
         msg:'actualizar medico'
     });
 }

 const borrarMedico=(req,res=response)=>{
    return res.json({
         ok:true,
         msg:'actualizar hospitales'
     });
 }

 module.exports={
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
 }