// ...existing code...
# API Reference (routes)

This document describes all backend HTTP routes and where they are implemented.

Notes:
- Routes are mounted in [backend/app.js](backend/app.js).
- Authentication middleware: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js) and [`authMiddleware.authCaptain`](backend/middlewares/auth.middleware.js).
- Route definitions:
  - [backend/routes/user.routes.js](backend/routes/user.routes.js)
  - [backend/routes/captain.routes.js](backend/routes/captain.routes.js)
  - [backend/routes/maps.routes.js](backend/routes/maps.routes.js)
  - [backend/routes/ride.routes.js](backend/routes/ride.routes.js)

Authentication
- Token may be supplied in the Authorization header: `Authorization: Bearer <token>` or in a cookie named `token`.
- Blacklisted tokens are stored via [backend/models/blacklistToken.model.js](backend/models/blacklistToken.model.js).

---

## Users (/users)

Files:
- Routes: [backend/routes/user.routes.js](backend/routes/user.routes.js)
- Controller: [`userController` functions](backend/controllers/user.controller.js)
- Model: [backend/models/user.model.js](backend/models/user.model.js)

1) POST /users/register
- Description: Create a new user and return JWT + user.
- Validation: `fullname.firstname` min 3, `email` valid, `password` min 6 (see route validators).
- Body (application/json):
  {
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane@example.com",
    "password": "s3cret"
  }
- Success: 201 Created — { token, user }
- Errors: 400 validation or duplicate email; 500 server error.
- Implementation: [`userController.registerUser`](backend/controllers/user.controller.js)

2) POST /users/login
- Description: Authenticate user and return JWT + user.
- Body:
  { "email": "jane@example.com", "password": "s3cret" }
- Success: 200 OK — { token, user }
- Errors: 400 validation; 401 invalid credentials.
- Implementation: [`userController.loginUser`](backend/controllers/user.controller.js)

3) GET /users/profile
- Description: Return authenticated user's profile.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Success: 200 — { user }
- Implementation: [`userController.getUserProfile`](backend/controllers/user.controller.js)

4) GET /users/logout
- Description: Logout user, blacklist token and clear cookie.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Success: 200 — { message: "Logged out successfully" }
- Implementation: [`userController.logoutUser`](backend/controllers/user.controller.js)

---

## Captains (/captains)

Files:
- Routes: [backend/routes/captain.routes.js](backend/routes/captain.routes.js)
- Controller: [`captainController` functions](backend/controllers/captain.controller.js)
- Model: [backend/models/captain.model.js](backend/models/captain.model.js)

1) POST /captains/register
- Description: Register a captain (driver) with vehicle details. Returns JWT + captain.
- Validation: `fullname.firstname` min 3, `email` valid, `password` min 6, `vehicle.color` min 3, `vehicle.plate` min 3, `vehicle.capacity` int >=1, `vehicle.vehicleType` in [`car`,`bike`,`auto`] (see route validators).
- Body example:
  {
    "fullname": {"firstname":"John","lastname":"Smith"},
    "email":"john@example.com",
    "password":"s3cret",
    "vehicle":{"color":"red","plate":"ABC123","capacity":4,"vehicleType":"car"}
  }
- Success: 201 Created — { token, captain }
- Errors: 400 validation or duplicate email; 500 server error.
- Implementation: [`captainController.registerCaptain`](backend/controllers/captain.controller.js)

2) POST /captains/login
- Description: Authenticate captain; sets `token` cookie and returns token + captain.
- Body: { "email":"john@example.com", "password":"s3cret" }
- Success: 200 OK — { token, captain } and cookie `token`
- Errors: 400 validation; 400 invalid credentials.
- Implementation: [`captainController.loginCaptain`](backend/controllers/captain.controller.js)

3) GET /captains/profile
- Description: Return authenticated captain profile.
- Auth: [`authMiddleware.authCaptain`](backend/middlewares/auth.middleware.js)
- Success: 200 — { captain }
- Implementation: [`captainController.getCaptainProfile`](backend/controllers/captain.controller.js)

4) GET /captains/logout
- Description: Blacklist token and clear cookie.
- Auth: [`authMiddleware.authCaptain`](backend/middlewares/auth.middleware.js)
- Success: 200 — { message: "Logged out successfully" }
- Implementation: [`captainController.logoutCaptain`](backend/controllers/captain.controller.js)

Note: captain model vehicle type enum is [`car`,`bike`,`auto`] in [backend/models/captain.model.js](backend/models/captain.model.js).

---

## Maps (/maps)

Files:
- Routes: [backend/routes/maps.routes.js](backend/routes/maps.routes.js)
- Controller: [`mapsController` functions](backend/controllers/maps.controllers.js)
- Service: [backend/services/maps.service.js](backend/services/maps.service.js)

1) GET /maps/get-coordinates?address=...
- Description: Returns { lat, lon } for the address (uses Nominatim).
- Validation: query `address` string min 3.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Success: 200 — { lat, lon }
- Errors: 400 validation; 404 not found.
- Implementation: [`mapsController.getCoordinates`](backend/controllers/maps.controllers.js)

2) GET /maps/get-distance-time?origin=...&destination=...
- Description: Returns distance (km) and duration (min) using OSRM + Nominatim.
- Validation: `origin` and `destination` string min 3.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Success: 200 — { distanceKm, durationMin }
- Errors: 400 validation; 404 not found.
- Implementation: [`mapsController.getDistanceTime`](backend/controllers/maps.controllers.js)

3) GET /maps/get-suggestions?input=...
- Description: Returns address suggestions (array of display_name strings).
- Validation: `input` string min 3.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Success: 200 — { suggestions: [ ... ] }
- Errors: 400 validation; 404 not found.
- Implementation: [`mapsController.getSuggestions`](backend/controllers/maps.controllers.js)

---

## Rides (/rides)

Files:
- Routes: [backend/routes/ride.routes.js](backend/routes/ride.routes.js)
- Controller: [`rideController` functions](backend/controllers/ride.controller.js)
- Service: [backend/services/ride.service.js](backend/services/ride.service.js)
- Model: [backend/models/ride.model.js](backend/models/ride.model.js)

1) POST /rides/create-ride
- Description: Create a ride request (generates OTP, fare) and returns created ride.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Validation (body):
  - `pickupLocation` string min 3
  - `dropLocation` string min 3
  - `vehicleType` in route validator: one of [`auto`,`car`,`moto`] (see [backend/routes/ride.routes.js](backend/routes/ride.routes.js))
- Body example:
  { "pickupLocation":"A st","dropLocation":"B st","vehicleType":"car" }
- Success: 201 Created — ride object (includes otp stored, fare, user)
- Errors: 400 validation; 500 server error.
- Implementation: [`rideController.createRide`](backend/controllers/ride.controller.js) -> [`rideService.createRide`](backend/services/ride.service.js)

2) GET /rides/fare?pickupLocation=...&dropLocation=...
- Description: Calculate fare estimates for supported vehicle types using distance/time from maps service.
- Auth: [`authMiddleware.authUser`](backend/middlewares/auth.middleware.js)
- Validation: query `pickupLocation` and `dropLocation` string min 3.
- Success: 200 — { fares } where fares contains keys for vehicle types (service uses keys: `auto`, `car`, `moto`)
- Implementation: [`rideController.getFare`](backend/controllers/ride.controller.js) -> [`rideService.calculateFare`](backend/services/ride.service.js)

Note: There is a naming discrepancy between captain vehicle types (`bike`) and ride vehicle types (`moto`) — see:
- [backend/models/captain.model.js](backend/models/captain.model.js)
- [backend/routes/ride.routes.js](backend/routes/ride.routes.js)
- [backend/services/ride.service.js](backend/services/ride.service.js)
Consider unifying `bike` vs `moto` to avoid mismatches.

---

## Errors & Validation
- Validation is performed with `express-validator` in each route file.
- Controllers return 400 for validation errors using `validationResult`.
- Authentication failures return 401 Unauthorized from middleware.
- Unexpected server errors return 500.

---

## Helpful files
- Server entry: [backend/server.js](backend/server.js)
- App initialization & route mounting: [backend/app.js](backend/app.js)
- Database connect: [backend/db/db.js](backend/db/db.js)

--- 

For route implementations, see the linked route files and controller functions above (e.g. [`userController.registerUser`](backend/controllers/user.controller.js), [`captainController.registerCaptain`](backend/controllers/captain.controller.js), [`mapsController.getSuggestions`](backend/controllers/maps.controllers.js), [`rideService.calculateFare`](backend/services/ride.service.js)).