import { body } from "express-validator";

const BDRG = [
  body("title")
    .notEmpty()
    .withMessage("title should not be empty")
    .trim()
    .isLength({ min: 4, max: 150 })
    .withMessage("your title should not be bigger then 150 characters long")
    .matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
    .withMessage(
      "we only accept he following characters including whitespace: !@#*()+\"-;':,.?"
    ),

  body("description")
    .notEmpty()
    .withMessage("description should not be empty")
    .isLength({ max: 5000 })
    .withMessage("no more then 5000 characters including whitespace")
    .matches(/^[a-zA-Z0-9äöüÄÖÜßéÉèÈáÁàÀóÓòÒ\n\!@#*()+\-;':"\ |,.\/?°º]*$/)
    .withMessage(
      "We only accept the following special characters including whitespace: !@#*()+\"-;':,.?°º"
    ),

  body("video")
    .trim()
    .optional({ checkFalsy: true })
    .isURL({ protocols: ["http", "https"] }),

  body("image")
    .trim()
    .optional({ checkFalsy: true })
    .isURL({ protocols: ["http", "https"] }),

  body("link")
    .trim()
    .optional({ checkFalsy: true })
    .isURL({ protocols: ["http", "https"] }),

  body("tags")
    .isArray()
    .optional({ checkFalsy: true })
    .custom((value) => {
      const array = value;
      const err = array.find(
        (element) =>
          !element.match(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
      );
      if (err) {
        return Promise.reject(
          "We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"
        );
      }
      return Promise.resolve();
    }),
];

export default BDRG;
