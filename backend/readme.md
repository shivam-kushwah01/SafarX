
## POST /users/register

### Description
Create a new user account and return an authentication token plus the created user object.

### Method
POST

### Request body (application/json)
```
{
  "fullname": {
    "firstname": "string (required, min 3 chars)",
    "lastname": "string (optional, min 3 chars)"
  },
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

### Validation rules
- `fullname.firstname` — required, minimum length 3
- `fullname.lastname` — optional, minimum length 3 if provided
- `email` — required, must be a valid email format
- `password` — required, minimum length 6

### Responses / Status Codes
- **201 Created**
  - Returned when a user is successfully created.
  - Body example:
    ```json
    {
      "token": "<jwt token>",
      "user": {
        "_id": "<user id>",
        "fullname": { "firstname": "Jane", "lastname": "Doe" },
        "email": "jane@example.com",
        "socketId": null
      }
    }
    ```
- **400 Bad Request**
  - Returned when validation fails or required data is missing.
  - Body example:
    ```json
    {
      "errors": [
        { "msg": "Invalid email address", "param": "email", "location": "body" },
        { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
      ]
    }
    ```
- **409 Conflict** (possible)
  - When the supplied email already exists in the database. The current code does not explicitly return 409, but duplicate-email errors from the database may be mapped to this status in future improvement.
- **500 Internal Server Error**
  - Unexpected server or database errors.

---

## GET /users/profile

### Description
Return the authenticated user's profile information. This route is protected and requires a valid JWT. The project uses an `authMiddleware.authUser` middleware to verify the token and attach the user to `req.user`.

### Method
GET

### Authentication
- Requires a valid JWT. Token may be provided in either:
  - Authorization header: `Authorization: Bearer <token>`
  - Cookie named `token`

### Request body
- None

### Responses / Status Codes
- **200 OK**
  - Returned when the token is valid and the user is found.
  - Body example:
    ```json
    {
      "user": {
        "_id": "<user id>",
        "fullname": { "firstname": "Jane", "lastname": "Doe" },
        "email": "jane@example.com",
        "socketId": null
      }
    }
    ```
- **401 Unauthorized**
  - Returned when authentication is missing or invalid.
  - Body example (implementation-dependent):
    ```json
    { "error": "Authentication required" }
    ```
- **500 Internal Server Error**
  - Unexpected server/database errors.

---

## GET /users/logout

### Description
Log out the authenticated user. The controller clears the `token` cookie (if present) and adds the token to a blacklist collection (`blacklistTokenModel`) so that it cannot be reused. This route is protected and requires authentication.

### Method
GET

### Authentication
- Requires a valid JWT. Token can be provided in the `token` cookie or the `Authorization` header (`Bearer <token>`).

### Request body
- None

### Responses / Status Codes
- **200 OK**
  - Returned when logout is successful.
  - Body example:
    ```json
    { "message": "Logged out successfully" }
    ```
- **401 Unauthorized**
  - Returned when authentication is missing or invalid.
  - Body example (implementation-dependent):
    ```json
    { "error": "Authentication required" }
    ```
- **500 Internal Server Error**
  - Returned when there is a failure clearing the cookie or saving the token to the blacklist.

### Notes
- The current `logoutUser` implementation expects the token to be available either in `req.cookies.token` or in the `Authorization` header. Make sure your server is configured to parse cookies (e.g., using `cookie-parser`) if you intend to rely on cookie-based logout.
- Consider returning 204 No Content for logout in future iterations, or adding server-side token invalidation TTL logic for the blacklist.


## POST /users/login

### Description
Authenticate a user and return an authentication token plus the user object if credentials are valid.

### Method
POST

### Request body (application/json)
```
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

### Validation rules
- `email` — required, must be a valid email format
- `password` — required, minimum length 6

### Responses / Status Codes
- **200 OK**
  - Returned when login is successful.
  - Body example:
    ```json
    {
      "token": "<jwt token>",
      "user": {
        "_id": "<user id>",
        "fullname": { "firstname": "Jane", "lastname": "Doe" },
        "email": "jane@example.com",
        "socketId": null
      }
    }
    ```
- **400 Bad Request**
  - Returned when validation fails (express-validator).
  - Body example:
    ```json
    {
      "errors": [
        { "msg": "Invalid email address", "param": "email", "location": "body" },
        { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
      ]
    }
    ```
- **401 Unauthorized**
  - Returned when email or password is incorrect.
  - Body example:
    ```json
    {
      "error": "Invalid email or password"
    }
    ```
- **500 Internal Server Error**
  - Unexpected server or database errors.

---

## POST /captain/register

### Description
Register a new captain (driver) with vehicle details. The endpoint validates captain data, hashes the password, saves the captain record and returns a JWT plus the created captain object.

### Method
POST

### URL (when routes are mounted)
- If the captain router is mounted at `/captain`, the full path is: `/captain/register`.

### Request body (application/json)
```
{
  "fullname": { "firstname": "string (required, min 3)", "lastname": "string (optional)" },
  "email": "string (required, valid email)",
  "password": "string (required, min 6)",
  "vehicle": {
    "color": "string (required, min 3)",
    "plate": "string (required, min 3)",
    "capacity": number (required, min 1),
    "vehicleType": "string (required)" // one of: "car", "bike", "auto"
  }
}
```

### Validation rules (express-validator & Mongoose)
- `fullname.firstname` — required, minimum length 3
- `email` — required, must be a valid email
- `password` — required, minimum length 6
- `vehicle.color` — required, minimum length 3
- `vehicle.plate` — required, minimum length 3
- `vehicle.capacity` — required, integer >= 1
- `vehicle.vehicleType` — required, one of `car`, `bike`, `auto`

### Controller / Service behavior
- The controller uses `validationResult` to return `400` when request validation fails.
- It checks for an existing captain by email and returns `400` if found.
- Password is hashed using `captainModel.hashPassword` before creating the record.
- The service creates and `save()`s a `Captain` document (throws an Error if required fields are missing).

### Responses / Status Codes
- **201 Created**
  - Successful registration. Returns a JWT and the created captain object (including `_id`, `fullname`, `email`, `vehicle`, etc.).
  - Example body:
    ```json
    {
      "token": "<jwt token>",
      "captain": {
        "_id": "<captain id>",
        "fullname": { "firstname": "John", "lastname": "Smith" },
        "email": "john.smith@example.com",
        "vehicle": { "color": "red", "plate": "ABC123", "capacity": 4, "vehicleType": "car" },
        "status": "inactive",
        "socketId": null
      }
    }
    ```
- **400 Bad Request**
  - Returned when validation fails (express-validator), when the email is already used, or when the service throws a 'Missing required fields' Error.
  - Example (validation errors):
    ```json
    { "errors": [ { "msg": "First name must be at least 3 characters long", "param": "fullname.firstname" } ] }
    ```
- **500 Internal Server Error**
  - Unexpected server/database errors (e.g., DB connection or save failure).

### Example requests
- curl:
```bash
curl -X POST http://localhost:3000/captain/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname": "John", "lastname": "Smith"},
    "email": "john.smith@example.com",
    "password": "s3cretpass",
    "vehicle": {"color":"red","plate":"ABC123","capacity":4,"vehicleType":"car"}
  }'
```

- PowerShell:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/captain/register -ContentType 'application/json' -Body (
  '{"fullname":{"firstname":"John","lastname":"Smith"},"email":"john.smith@example.com","password":"s3cretpass","vehicle":{"color":"red","plate":"ABC123","capacity":4,"vehicleType":"car"}}'
)
```

### Tips
- Ensure `Content-Type: application/json` is set in Postman.
- Make sure `vehicle.vehicleType` is one of the allowed values: `car`, `bike`, or `auto`.
- If you see `Missing required fields` logged from the service, verify the JSON shape in the request (fields under `fullname` and `vehicle`).
- Consider returning `409 Conflict` for duplicate emails in future for clearer semantics.

---

## Captain Authentication Endpoints

### POST /captain/login

#### Description
Authenticate a captain and return a JWT and the captain object. The controller sets a cookie named `token` and also returns the token in the response body.

#### Method
POST

#### Request body (application/json)
```
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}
```

#### Validation rules
- `email` — required, must be a valid email
- `password` — required, minimum length 6

#### Responses / Status Codes
- **200 OK**
  - Login successful. Response includes a `token` and the `captain` object. The server also sets a cookie: `token`.
  - Example:
    ```json
    {
      "token": "<jwt token>",
      "captain": {
        "_id": "<captain id>",
        "fullname": { "firstname": "John", "lastname": "Smith" },
        "email": "john.smith@example.com",
        "vehicle": { "color": "red", "plate": "ABC123", "capacity": 4, "vehicleType": "car" }
      }
    }
    ```
- **400 Bad Request**
  - Returned when request validation fails. Example body uses the `errors` array from `express-validator`.
- **401 Unauthorized** (or 400 in current implementation)
  - Returned when credentials are invalid. The current controller returns a 400 with `{ error: 'Invalid email or password' }` for invalid credentials; consider using 401 for clarity.
- **500 Internal Server Error**
  - Unexpected server error.

#### Notes
- The controller sets a cookie via `res.cookie('token', token)` — ensure `cookie-parser` (or equivalent) is configured if you rely on cookie-based auth.

---

### GET /captain/profile

#### Description
Return the authenticated captain's profile. This route is protected by `authMiddleware.authCaptain`, which should verify the JWT and attach the captain to `req.captain`.

#### Method
GET

#### Authentication
- Requires a valid JWT provided in either:
  - `Authorization: Bearer <token>` header, OR
  - Cookie named `token`

#### Request body
- None

#### Responses / Status Codes
- **200 OK**
  - Returns `{ captain: <captainObject> }` when authentication succeeds.
- **401 Unauthorized**
  - When authentication is missing or invalid.
- **500 Internal Server Error**
  - Unexpected server errors.

#### Example
```json
{ "captain": { "_id": "<captain id>", "fullname": { "firstname": "John" }, "email": "john@example.com" } }
```

---

### GET /captain/logout

#### Description
Logs out the authenticated captain. The controller blacklists the token (saves it to `blacklistTokenModel`), clears the `token` cookie, and returns a success message.

#### Method
GET

#### Authentication
- Requires a valid JWT (cookie or Authorization header).

#### Request body
- None

#### Responses / Status Codes
- **200 OK**
  - `{ "message": "Logged out successfully" }` when logout completes and token is saved to blacklist.
- **401 Unauthorized**
  - When authentication is missing or invalid.
- **500 Internal Server Error**
  - When saving to blacklist or clearing cookie fails.

#### Notes
- The logout controller reads the token from `req.cookies.token` or from `Authorization` header. Ensure your app parses cookies if you rely on cookie-based auth.
- Consider returning `204 No Content` for logout in the future. Also consider adding TTL or automatic cleanup for blacklisted tokens.




