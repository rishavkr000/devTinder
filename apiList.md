

## Auth API
- POST /signup
- POST /login
- POST /logout
- POST /forgotPassword

## Profile API
- GET /feed
- GET /profile
- PATCH /profile
- DELETE /profile

## Connection API
- POST /connection/ignored/:userId
- POST /connection/interested/:userId
- POST /connection/rejected/:userId
- POST /connection/accepted/:userId

## Connection Receive API
- POST /receive/connection/:requestId



status: ignored, interested, accept, reject, pending