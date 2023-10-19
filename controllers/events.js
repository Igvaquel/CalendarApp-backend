const { response } = require("express");
const Event = require('../models/Event')

const getEvents = async( req, res = response ) => {

    const events = await Event.find().populate('user','name');

    return res.status(201).json({
        ok: true,
        events
    })
}

const createEvent = async( req, res = response ) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;
        const savedEvent = await event.save();

        return res.status(201).json({
            ok: true,
            event: savedEvent
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the admin',
        })  
    }
    
}

const updateEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg:'No event with this id'
            })
        }
        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg:'Has no editing privileges for this event'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }
         
        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(201).json({
            ok: true,
            updatedEvent
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the admin',
        })  
    }
}

const deleteEvent = async( req, res = response, ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );

        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg:'No event with this id'
            })
        }
        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg:'Has no deleting privileges for this event'
            })
        }
         
        await Event.findByIdAndDelete( eventId );

        res.status(201).json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please talk to the admin',
        })  
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}