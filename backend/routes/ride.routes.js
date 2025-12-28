const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-ride',
    authMiddleware.authUser,
    body('pickupLocation').isString().isLength({ min: 3 }).withMessage('Pickup location must be at least 3 characters long'),
    body('dropLocation').isString().isLength({ min: 3 }).withMessage('Dropoff location must be at least 3 characters long'),
    body('vehicleType').isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    rideController.createRide
);

router.get('/fare', 
    authMiddleware.authUser,
    query('pickupLocation').isString().isLength({ min: 3 }).withMessage('Pickup location must be at least 3 characters long'),
    query('dropLocation').isString().isLength({ min: 3 }).withMessage('Dropoff location must be at least 3 characters long'),
    rideController.getFare
);

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.confirmRide
);

router.post('/start-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be between 4 and 6 characters long'),
    rideController.startRide
);

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    rideController.endRide
);

module.exports = router;