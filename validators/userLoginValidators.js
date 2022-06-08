import { body } from "express-validator";

// Custom error messages enable easier translation in the frontend
const userLoginValidators = [
	body("email")
		.notEmpty()
		.withMessage("Email should not be empty")
		.isEmail()
		.withMessage("Not a valid email address")
,
	body("password")
		.notEmpty()
		.withMessage("Password should not be empty")
		
];

export default userLoginValidators;