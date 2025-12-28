const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickupLocation, dropLocation, vehicleType } = req.body;

        const newRide = await rideService.createRide({
            userId: req.user._id,
            pickupLocation,
            dropLocation,
            vehicleType
        });

        res.status(201).json(newRide);

        const pickupCordinate = await mapService.getAddressCordinate(pickupLocation);

        const captainsInRedius = await mapService.getCaptainsNearLocation(pickupCordinate.lat, pickupCordinate.lon, 100); 

        newRide.otp = "";

        captainsInRedius.map(async captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: await rideModel.findById(newRide._id).populate('user')
            });
        });



        console.log('Captains in radius:', captainsInRedius);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickupLocation, dropLocation } = req.query;

    try {
        const fares = await rideService.calculateFare(pickupLocation, dropLocation);
        res.status(200).json({ fares });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, captain } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });
        
        res.status(200).json({ message: "Ride confirmed successfully", ride });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId, otp, captain } = req.body;

    try {
        const ride = await rideService.startRide({
            rideId,
            otp,
            captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        res.status(200).json({ message: "Ride started successfully", ride });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId, captain } = req.body;
    
    try {
        const ride = await rideService.endRide({rideId, captain});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        res.status(200).json({ message: "Ride ended successfully", ride });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}