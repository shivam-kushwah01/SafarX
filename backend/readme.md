
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


