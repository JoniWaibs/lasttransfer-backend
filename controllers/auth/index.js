const userModel = require("../../models/users/Users");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

module.exports = {
  logIn: async (req, res, next) => {
    const { email, password } = req.body;
    let user;

    /**
     * Intercept body errors whit express validator,
     * if exists errors, it will create a new array with them
     */
    const hasErrors = validationResult(req);
    if (!hasErrors.isEmpty()) {
      return res.status(403).json({ message: hasErrors.array() });
    }

    /**
     * Search this user in data base.
     * if exists, it will log in user
     * if not exists, it will return alert
     */
    user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "User does not exists" });
      return next();
    }

    /**
     * Compare password received with password saved and hashed in db
     * and return jwt if the user enters her credentials correctly
     * else return error
     */
    const comparePasswords = bcrypt.compareSync(password, user.password);

    if (comparePasswords) {
      /**
       * create Jason web Token for sessions an return in res.json({})
       */
      const token = jwt.sign(
        {
          uid: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.PRIVATE_KEY,
        { expiresIn: "8h" }
      );
      res.status(200).json({ access_token: token, message: "User logged successfully" });
    } else {
      res.status(401).json({ message: "Invalid password" });
      return next();
    }
  },

  getUser: async (req, res, next) => {
    if (req.userVerified) {
      res.status(200).json({ user: req.userVerified });
    } else {
      res.status(404).json({ message: "Login error, user not founded" });
    }
    next();
  },
};
