import { body } from "express-validator";

// Custom error messages enable easier translation in the frontend
const userLoginValidators = [
	body("email")
		.notEmpty()
		.withMessage("email should not be empty")
		.isEmail()
		.withMessage("Not a valid email address")
		//custom validator will check if the username exists in the database, else it will throw an error
		.custom((value, { req }) => {
			if (value !== req.body.email) {
				throw new Error("email does not match");
			}
			return true;
		})
		.withMessage("email does not exists!")
		.trim()
		.escape(),
	body("password")
		.notEmpty()
		.withMessage("Password should not be empty")
		.trim(),
];

export default userLoginValidators;
