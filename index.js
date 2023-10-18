const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config');
require('dotenv').config();


// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public'))

// Lectura y parseo del body
app.use( express.json() );

// Rutas
    // auth
    app.use('/api/auth', require('./routes/auth') );
    // CRUD: Eventos
//

// Escuchar peticiones 
app.listen( process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})