/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { JWTValidator } = require('../middlewares/jwt-validator');


router.post(
    '/new',
    [ // middlewares
        check('name', 'name is required').not().isEmpty(),
        check('email', 'email is required').isEmail(),
        check('password', 'password must be longer than 6 characters').isLength({ min: 6}),
        fieldValidator
    ], 
    createUser  
);

router.post(
    '/',
    [ // middlewares
        check('email', 'email is required').isEmail(),
        check('password', 'password must be longer than 6 characters').isLength({ min: 6}),
        fieldValidator
    ], 
    loginUser
);

router.get('/renew', JWTValidator ,revalidateToken);



module.exports = router;