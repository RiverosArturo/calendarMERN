const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//procesos que estan corriendo en env
// console.log( process.env );

//crear servidor de express
const app = express();

//Base de datos:
dbConnection();

//CORS
app.use(cors());

//Directorio publico:
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );


//Rutas:
//aqui van a estar nuestras rutas de localhost:4000/api/auth/+nombre que le demos
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events'));
// app.use('/api/events', require('./routes/events') );
//TODO: auth // crear, login, renew
//TODO: CRUD: Eventos




//Escuchar peticiones:
app.listen( process.env.PORT,() => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );