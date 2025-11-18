## POST /users/register

## Description

Create a new user account and return an authentication token plus the created user object.

## Method

POST

## '/users/register' Endpoint

## Request body (application/json)

{
  "fullname": {
    "firstname": "string (required, min 3 chars)",
    "lastname": "string (optional, min 3 chars)"
  },
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)"
}

## Validation rules (applied by express-validator and Mongoose)

- `fullname.firstname` — required, minimum length 3
- `fullname.lastname` — optional, minimum length 3 if provided
- `email` — required, must be a valid email format
- `password` — required, minimum length 6

## Responses / Status Codes

- 201 Created
  - Returned when a user is successfully created.
  - Body example:
    {
      "token": "<jwt token>",
      "user": {
        "_id": "<user id>",
        "fullname": { "firstname": "Jane", "lastname": "Doe" },
        "email": "jane@example.com",
        "socketId": null
      }
    }

- 400 Bad Request
  - Returned when validation fails (express-validator) or required data is missing.
  - Body example (validation errors):
    {
      "errors": [
        { "msg": "Invalid email address", "param": "email", "location": "body" },
        { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
      ]
    }

- 409 Conflict (possible)
  - When the supplied email already exists in the database. The current code does not explicitly return 409, but duplicate-email errors from the database may be mapped to this status in future improvement.

- 500 Internal Server Error
  - Unexpected server or database errors. Example: database connection failure or uncaught exceptions.


