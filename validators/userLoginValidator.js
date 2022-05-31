import { body } from "express-validator";

// Custom error messages enable easier translation in the frontend
const userLoginValidators = [
	body("username")
		.notEmpty()
		.withMessage("Username should not be empty")
		//custom validator will check if the username exists in the database, else it will throw an error
		.custom((value, { req }) => {
			if (value !== req.body.username) {
				throw new Error("Username does not match");
			}
			return true;
		})
		.withMessage("Username does not exists!")
		.trim()
		.escape(),
	body("password")
		.notEmpty()
		.withMessage("Password should not be empty")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Password does not match");
			}
			return true;
		})
		.withMessage("Password does not match")
		.trim()
		.escape(),
];

export default userLoginValidators;
