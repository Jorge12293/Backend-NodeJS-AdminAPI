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

 const actualizarMedico = async (req,res=response)=>{
    const id = req.params.id;
    const uid = req.uid;
    
    try {
        
        const medico = await Medico.findById(id);
        if(!medico){
            return res.status(404).json({
                ok:false,
                msg:'Medico no encontrado'
            });
        }

        const cambiosMedico={
            ...req.body,
            usuario:uid
        }

        const MedicoActualizado = await Medico.findByIdAndUpdate(id,cambiosMedico,{new:true});

        return res.status(200).json({
            ok:true,
            msg:'Medico Actualizado',
            MedicoActualizado
        });      

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Errror en el servidor'
        });
    }
 }

 const borrarMedico= async (req,res=response)=>{
    const id = req.params.id;

    try {
        
        const medicoBD = await Medico.findById(id);
        if(!medicoBD){
            return res.status(404).json({
                ok:false,
                msg:'Medico no encontrado por id'
            });
        }
        await Medico.findByIdAndDelete(id);
        return res.status(200).json({
            ok:true,
            msg:'Medico Eliminado',
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
 }