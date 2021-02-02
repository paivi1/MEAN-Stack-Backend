const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1]; // Throws error if token does'nt exist in header
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); // Also throws error if verification fails
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next(); // Allows us to move forward in our route
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated." });
  }

};
