Create a .env file in the root directory.
Define environment variables if needed.

Database Setup

Ensure MongoDB is installed and running.
Configure database settings if necessary in config/database.js (or the relevant configuration file).

Running the Application

Start the server: npm run start:dev 
The server should now be running on http://localhost:5000 (or the defined port).

My Credintial file:
BCRYPT_SALT_ROUNDS=5
JWT_ACCESS_SECRET=secret
JWT_ACCESS_EXPIRES_IN=30d
JWT_REFRESH_SECRET=refreshsecret
JWT_REFRESH_EXPIRES_IN=1y
