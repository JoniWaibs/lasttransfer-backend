const express = require("express");
const router = express.Router();

const authMiddle = require("../../middlewares/auth");
const {
  uploadFile,
  downloadFile,
  deleteFile,
} = require("../../controllers/files");

router.post("/", authMiddle, uploadFile);

router.get("/:slug", downloadFile, deleteFile);

module.exports = router;
