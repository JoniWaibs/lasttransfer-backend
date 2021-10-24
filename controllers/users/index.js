const userModel = require("../../models/users/Users");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

module.exports = {
  createUser: async (req, res) => {
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
     * if exists it will return alert
     * if not exists, it will create a new user.
     */
    user = await userModel.findOne({ email });
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    }

    /**
     * Create new user schema
     */
    user = await new userModel(req.body);

    /**
     * Hash the password and change the first password with password hashed
     */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    /**
     * Save new user
     */
    try {
      await user.save();
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(403).json({
        message: "Error! user not created, try again in a few minutes",
      });
      console.log(error);
    }
  },
};
