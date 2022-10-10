const {response} = require('express');
const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')

const getTodo = async (req,res=response)=>{

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');

    const [usuarios,medicos,hospitales] = await Promise.all([
        Usuario.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Hospital.find({nombre:regex})
    ]);

    return res.status(200).json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    });
}


const getDocumentosColeccion= async (req,res=response)=>{
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');

    let data =[];

    switch(tabla){
        case 'usuarios':
            data = await Usuario.find({nombre:regex});
            break;
        case 'medicos':
            data = await Medico.find({nombre:regex})
            .populate('usuario')
            .populate('hospital');
            break;
        case 'hospitales':
            data = await Hospital.find({nombre:regex})
            .populate('usuario');
            break;
        default:
            return res.status(400).json({
                ok:true,
                msg:'Error servidor'
            });
    }

    res.json({
        ok:true,
        resultado:data
    });
}

module.exports={
    getTodo,
    getDocumentosColeccion
}