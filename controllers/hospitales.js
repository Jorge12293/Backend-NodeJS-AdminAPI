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

 const actualizarHospital= async (req,res=response)=>{
    const id = req.params.id;
    const uid = req.uid;
    try {
        
        const hospitalBD = await Hospital.findById(id);
        if(!hospitalBD){
            return res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado'
            });
        }

        const cambiosHospital={
            ...req.body,
            usuario:uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambiosHospital,{new:true});

        return res.status(200).json({
            ok:true,
            msg:'Hospital Actualizado',
            hospitalActualizado
        });      

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Errror en el servidor'
        });
    }
 }

 const borrarHospital = async (req,res=response)=>{
    const id = req.params.id;

    try {
        
        const hospitalBD = await Hospital.findById(id);
        if(!hospitalBD){
            return res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado por id'
            });
        }
        await Hospital.findByIdAndDelete(id);
        return res.status(200).json({
            ok:true,
            msg:'Hospital Eliminado',
        });      
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Errror en el servidor'
        });
    }
 }

 module.exports={
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
 }