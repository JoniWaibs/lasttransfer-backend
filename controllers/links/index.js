const linkModel = require("../../models/links/Links");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const shortId = require("shortid");

module.exports = {
  /**
   * Create a link for X downloads, this is has a file attached
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  createLink: async (req, res, next) => {
    let link;
    const { link_original_name, link_name } = req.body;

    /**
     * Intercept body errors whit express validator,
     * if exists errors, it will create a new array with them
     */
    const hasErrors = validationResult(req);
    if (!hasErrors.isEmpty()) {
      return res.status(403).json({ message: hasErrors.array() });
    }

    /**
     * Generate a new mongodb schema for link,
     */
    link = new linkModel({
      link_url: shortId.generate(),
      link_name,
      link_original_name,
    });

    /**
     * Get token, of headers request if it has
     * then, decodificate user with jwt and validate another extra data
     * thenm update schema info with hashed paassword
     */

    if (req.userVerified) {
      const { link_quantity_downloads, link_password } = req.body;

      link.link_owner = req.userVerified.uid;

      if (link_quantity_downloads) {
        link.link_quantity_downloads = link_quantity_downloads;
      }

      if (link_password) {
        const salt = await bcrypt.genSalt(10);
        link.link_password = await bcrypt.hash(link_password, salt);
      }
    }

    /**
     * Save new link
     */
    try {
      await link.save();
      return res.status(200).json({ new_link: link.link_url });
    } catch (error) {
      res.status(500).json({ message: "Server error, can not save link" });
    }
    return next();
  },
  /**
   * Obtain all links previous saved
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  getAllLinks: async () => {},
  /**
   * Obtain only a link, it can be encrypted or not
   * it will recived a dinamic slug from params,
   * that slug must be a URL Saved with link in de DDBB
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns only the name of the file, NOT password
   * then, that name wil be shared for the users
   */
  getLink: async (req, res, next) => {
    const { slug } = req.params;
    const result = await linkModel.findOne({ link_url: slug });

    if (!result) {
      res.status(404).json({ message: "The file does not exist" });
      return next();
    }

    res.status(200).json({
      link_name: result.link_name,
      link_password: false,
    });
  },
};
