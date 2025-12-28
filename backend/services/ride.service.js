const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');

async function calculateFare(pickupLocation, dropLocation) {
    if (!pickupLocation || !dropLocation) {
        throw new Error('Invalid locations provided for fare calculation');
    }

    const distanceTime = await mapService.getDistanceTime(pickupLocation, dropLocation);

    const baseFares = {
        auto: 30,
        car: 50,
        moto: 10
    };

    const perKmRate = {
        auto: 14,
        car: 18,
        moto: 8
    };

    const perMinuteRate = {
        auto: 3,
        car: 5,
        moto: 2
    };

    const fares = {};

    Object.keys(baseFares).forEach(vehicleType => {
        const distance = distanceTime.distanceKm; // Convert meters to km
        const time = distanceTime.durationMin; // Convert seconds to minutes

        fares[vehicleType] = Math.round(
            baseFares[vehicleType] + 
            (distance * perKmRate[vehicleType]) + 
            (time * perMinuteRate[vehicleType])
        );
    });

    return fares;
}

module.exports.calculateFare = calculateFare;

async function getOtp(num){
    if (!Number.isInteger(num) || num <= 0) {
        throw new Error('num must be a positive integer');
    }

    let otp = "";

    for (let i = 0; i < num; i++) {
        otp += crypto.randomInt(0, 10).toString();
    }

    return otp;
}


module.exports.createRide = async ({
    userId,
    pickupLocation,
    dropLocation,
    vehicleType
}) => {
    if (!userId || !pickupLocation || !dropLocation || !vehicleType) {
        throw new Error('Missing required fields');
    }

    try{
    const fares = await calculateFare(pickupLocation, dropLocation);

    const fare = fares[vehicleType];

    const newRide = rideModel.create({
        user: userId,
        pickupLocation,
        otp: await getOtp(4),
        dropLocation,
        fare,
    })

    return newRide;
    }
    catch(err){
        throw new Error("something went wrong!!");
    }
}

module.exports.confirmRide = async ({rideId, captain}) => {
    if (!rideId || !captain) {
        throw new Error('Missing required fields');
    }

    await rideModel.findByIdAndUpdate(rideId, { captain: captain._id, status: 'accepted' });

    const ride = await rideModel.findById(rideId).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({rideId, otp, captain}) => {
    if (!rideId || !otp || !captain) {
        throw new Error('Missing required fields');
    }
    const ride = await rideModel.findById(rideId).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    if(ride.status !== 'accepted'){
        throw new Error('Ride is not accepted');
    }

    await rideModel.findByIdAndUpdate(rideId, { status: 'ongoing' });

    sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-started',
        data: ride
    });

    return ride;
}

module.exports.endRide = async ({rideId, captain}) => {
    if (!rideId) {
        throw new Error('Missing required fields');
    }

    const ride = await rideModel.findById(rideId).populate('user').populate('captain');

    if (!ride) {
        throw new Error('Ride not found');
    }

    await rideModel.findByIdAndUpdate(rideId, { status: 'completed' });

    return ride;
}
