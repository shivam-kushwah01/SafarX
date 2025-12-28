const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCordinate = async (address) => {
        if (!address) {
            throw new Error('Address is required');
        }

        const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json"
      },
      headers: {
        "User-Agent": "uber-clone-app"
      }
    }
  );

  if (!res.data.length) {
    throw new Error(`No location found for: ${address}`);
  }

  return {
    lat: parseFloat(res.data[0].lat),
    lon: parseFloat(res.data[0].lon)
  };

}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and Destination are required');
    }
    
    const originCoords = await axios.get("https://nominatim.openstreetmap.org/search", {
  params: {
    q: origin,
    format: "json"
  },
  headers: {
    "User-Agent": "uber-clone-app"
  }
})
    const destinationCoords = await axios.get("https://nominatim.openstreetmap.org/search", {
  params: {
    q: destination,
    format: "json"
  },
  headers: {
    "User-Agent": "uber-clone-app"
  }
})

  const url = `https://router.project-osrm.org/route/v1/driving/` +
    `${originCoords.data[0].lon},${originCoords.data[0].lat};` +
    `${destinationCoords.data[0].lon},${destinationCoords.data[0].lat}`;

  const res = await axios.get(url, {
    params: { overview: "false" }
  });

  const route = res.data.routes[0];

  return {
    distanceKm: (route.distance / 1000).toFixed(2),
    durationMin: (route.duration / 60).toFixed(1)
  };


}

module.exports.getSuggestions = async (input) => {
  if (!input) {
      throw new Error('Input is required');
  }

  const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: input,
        format: "json",
        addressdetails: 1,
        limit: 5
      },
      headers: {
        "User-Agent": "uber-clone-app"
      }
    }
  );
  
  // Return an array of readable suggestion strings (display_name)
  if (!Array.isArray(res.data) || res.data.length === 0) return [];

  return res.data.map(item => item.display_name);
}

module.exports.getCaptainsNearLocation = async (lat, lon, radiusKiloMeters) => {
   const radiusMeters = radiusKiloMeters * 1000;
   const captains = await captainModel.find({
    location: {
        $geoWithin: {
            $centerSphere: [ [ lon, lat ], radiusMeters / 63781.0 ]
        }
    }
   });
    return captains;
}