const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Get the token from cookies
    const { token } = req.cookies;
    // If token is missing, throw an error
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    // Verify the token and extract the user ID
    const decodedObj = await jwt.verify(token, "DEV@Tinder$1994");
    const { _id } = decodedObj;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Attach the user object to the request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Send 401 Unauthorized for token issues
    return res.status(401).send("Error: " + error.message);
  }
};

module.exports = userAuth
