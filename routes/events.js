const express = require('express');
const { check } = require("express-validator");
const router = express.Router();

const { JWTValidator } = require('../middlewares/jwt-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { fieldValidator } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

/*
    Rutas de Eventos / events
    host + /api/events
*/

// Todas las rutas tiene que pasar por la validacion del JWT
router.use( JWTValidator ); // De aca para abajo se aplica


// Obtener evento
router.get( '/', getEvents);

// Crear evento
router.post(
    '/',
    [
        check('title','Title is required').not().isEmpty(),
        check('start','Start date is required').custom( isDate ),
        check('end','End date is required').custom( isDate ),
        fieldValidator
    ], 
    createEvent
);

// Actualizar evento
router.post( '/:id', updateEvent);

// Borrar evento
router.delete( '/:id',  deleteEvent);


module.exports = router