const express = require("express");
const router = express.Router();
const { check } = require('express-validator');

const { createUser } = require("../../controllers/users");

router.post("/",[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({min: 6}),
], createUser);

module.exports = router;
