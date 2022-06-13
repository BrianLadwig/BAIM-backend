import { body } from "express-validator";

const commentsValidators = [
  body("message").notEmpty().withMessage("Message should not be empty!"),
];

export default commentsValidators;
