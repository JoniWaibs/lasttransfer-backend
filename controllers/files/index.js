/* eslint-env node */
const fs = require("fs");
const path = require("path");

const multer = require("multer");
const shortid = require("shortid");
const linkModel = require("../../models/links/Links");

module.exports = {
  /**
   * Create a new file uploaded,
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  uploadFile: async (req, res, next) => {
    const multerSettings = {
      limits: { fileSize: req.userVerified ? 1024 * 1024 * 10 : 1024 * 1024 },
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, __dirname + "/../../uploads/");
        },
        filename: (req, file, cb) => {
          const extension = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
          );
          cb(null, `${shortid.generate()}${extension}`);
        },
      }),
    };

    /**
     * Upload settings
     */
    const upload = multer(multerSettings).single("fileToStorage");

    /**
     * Upload file an return responses
     */
    upload(req, res, async (error) => {
      const isError = error instanceof Error;
      if (!isError) {
        res.status(200).json({ newFile: req.file.filename });
      } else {
        res.status(500).json({ message: error.message });
        return next();
      }
    });
  },
  /**
   * Download a file.
   * it will recived an dinamic slug from params,
   * that slug must be a URL, that corresponds an file saved
   * Then, it slug will be removed from the ddbb
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  downloadFile: async (req, res, next) => {
    const { slug } = req.params;
    //find the file
    const result = await linkModel.findOne({ link_name: slug });
    const { link_quantity_downloads, link_name, _id } = result;
    console.log(link_name);

    //return for download
    const fileToDownload = __dirname + `/../../uploads/${slug}`;
    res.download(fileToDownload);

    if (link_quantity_downloads === 1) {
      /**
       * Set new paramas for delete file from server
       * and then, delete link from ddbb
       */
      req.fileToDelete = slug;
      await linkModel.findByIdAndRemove(_id);
      console.log("File deleted");
      next();
    } else {
      result.link_quantity_downloads--;
      await result.save();
      console.log("Aun quedan descargas disponibles:", link_quantity_downloads);
    }
  },
  /**
   * The file saved in the server will be removed automatically
   * it method is called in the middleware, after the download
   * @param {*} req
   * @param {*} res
   */
  deleteFile: async (req, res) => {
    try {
      await fs.unlinkSync(__dirname + `/../../uploads/${req.fileToDelete}`);
      console.log(
        `The file - ${req.fileToDelete} was deleted from the server.`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
