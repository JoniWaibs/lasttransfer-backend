const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authMiddle = require("../../middlewares/auth");
const { createLink, getAllLinks, getLink } = require("../../controllers/links");


router.post(
  "/",
  [
    check("link_name", "You must add a name to your file").not().isEmpty(),
    check("link_original_name", "You must add a name to your file")
      .not()
      .isEmpty(),
  ],
  authMiddle,
  createLink
);

router.get("/", getAllLinks);
/**
 * The dinamic slug is associated with url attached a link saved in te mongoDB
 */
router.get("/:slug", getLink);

module.exports = router;
