/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

module.exports = (req, res, next) => {
  if (req.get("Authorization")) {
    const access_token = req.get("Authorization").split(" ")[1];

    /**
     * verify token with JWT and return associated user or error
     */
    try {
      req.userVerified = jwt.verify(access_token, process.env.PRIVATE_KEY);
    } catch (error) {
      console.log(error);
    }
  }
  return next();
};
