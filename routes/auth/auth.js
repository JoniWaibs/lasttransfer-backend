const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authMiddle = require("../../middlewares/auth");
const { logIn, getUser } = require("../../controllers/auth");

router.post(
  "/",
  [
    check("email", "Invalid Email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  logIn
);

router.get("/", authMiddle, getUser);

module.exports = router;
