require('dotenv').config();

const express = require('express');
const  cors = require('cors');

const {dbConnection} = require('./database/config')


// SERVIDOR EXPRESS
const app = express();

// Configurar Cors
app.use(cors());

// LECTURA Y PARSEO DEL BODY
app.use(express.json());

// Base de datos
dbConnection();

// RUTAS
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/login',require('./routes/auth'));

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo '+process.env.PORT);
});
