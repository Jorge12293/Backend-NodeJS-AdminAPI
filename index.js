require('dotenv').config();

const express = require('express');
const  cors = require('cors');

const {dbConnection} = require('./database/config')


// SERVIDOR EXPRESS
const app = express();

// Configurar Cors
app.use(cors());

// Base de datos
dbConnection();

// RUTAS
app.get('/',(req,res)=>{
    res.json({
        ok:true,
        msg:'Hola Mundo'
    })
});


app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo '+process.env.PORT);
});
