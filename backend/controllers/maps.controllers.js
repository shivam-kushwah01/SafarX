const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCordinate(address);
        res.json(coordinates);
    } catch (error) {
        res.status(404).json({ error: 'Unable to fetch coordinates'});
    }
}

module.exports.getDistanceTime = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { origin, destination } = req.query;

    try {
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.json(distanceTime);
    } catch (error) {
        res.status(404).json({ error: 'Unable to fetch distance and time'});
    }
}

module.exports.getSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

        const { input } = req.query;

        const suggestions = await mapService.getSuggestions(input);

        res.status(200).json({ suggestions });
    }
    catch (error) {
        res.status(404).json({ error: 'Unable to fetch suggestions'});
    }
}