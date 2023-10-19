const { response } = require('express');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');



const createUser = async(req, res = response ) => {

    const { email, password } = req.body  

    try {

        let user = await User.findOne({ email })

        if( user ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'A user already exists with this email address'
            })
        }

        user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar JWT
        const token =  await generateJWT( user.id, user.name )
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the admin',
        })  
    }
    
}

const loginUser = async(req, res = response ) => {

    const { email, password } = req.body   

    try {

        let user = await User.findOne({ email })
        console.log(user);

        if( !user ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Incorrect email or password'
            })
        }

        // Confirmar los password
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Incorrect password'
            })
        }

        // Generar JWT
        const token =  await generateJWT( user.id, user.name )


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please tlak to the admin',
        })  
    }
}

const revalidateToken = async(req, res = response ) => {

    const { uid, name } = req;

    const token =  await generateJWT( uid, name )

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}