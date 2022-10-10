const {response} = require('express');
const Hospital= require('../models/hospital')

const getHospitales= async (req,res=response)=>{
   const hospitales =  await Hospital.find()
                        .populate('usuario','nombre email');
   return res.status(200).json({
        ok:true,
        hospitales
    });
}


const crearHospital= async (req,res=response)=>{
    const uid= req.uid;
    const hospital = new Hospital({
        usuario:uid,
        ...req.body
    });
   
    try{

        const hospitalDB = await hospital.save();

        return res.status(200).json({
            ok:true,
            hospital:hospitalDB
        });
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error en el servidor'
        });
    }
 }

 const actualizarHospital=(req,res=response)=>{
    return res.json({
         ok:true,
         msg:'actualizar hospitales'
     });
 }

 const borrarHospital=(req,res=response)=>{
    return res.json({
         ok:true,
         msg:'actualizar hospitales'
     });
 }

 module.exports={
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
 }