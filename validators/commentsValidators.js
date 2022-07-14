import { body } from "express-validator";

const commentsValidators = [
  body("message").notEmpty().withMessage("Comment should not be empty!"),
];

export default commentsValidators;
