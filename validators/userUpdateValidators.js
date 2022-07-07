import { body } from "express-validator";
import User from "../models/User.js";

// Custom error messages enable easier translation in the frontend
const userUpdateValidators = [
	body("firstName")
		.optional({checkFalsy: true})
		.matches(/^([a-zA-Z]{3,20})*$/)
		.withMessage("First name should be between 3 and 20 characters")
		.bail()
		.trim()
		.escape(),
	body("lastName")
		.optional({checkFalsy: true})
		.matches(/^([a-zA-Z]{4,20})*$/)
		.withMessage("Last name should be between 4 and 20 characters")
		.bail()
		.trim()
		.escape(),
	body("profileName")
		.optional({checkFalsy: true})
		.trim() //trim removes whitespace from the beginning and end of the string
		.custom( value =>{
            return User.find({profileName: value}).then(user =>{
                if(user.length !== 0){
                    return Promise.reject('Profile name already exists!')
                }
            })
        })
		.matches(/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/).withMessage("Not a valid username").bail()
		.escape(), //escape will remove all the special characters from the string and replace them with their escaped version (e.g. \n and \r).
	// body("profilePicture")
	// 	.isURL()
	// 	.withMessage("Profile picture should be a valid URL")
	// 	.trim()
	// 	.escape(),
	body("email")
		.optional({checkFalsy: true})
		.isEmail()
		.withMessage("Not a valid email address")
		.bail()
		.trim()
		.escape(),
		//normalizeEmail will convert the email to lowercase and remove all the special characters from the string and replace them with their escaped version (e.g. \n and \r).
		// .normalizeEmail(),
	body("password")
		.optional({checkFalsy: true})
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters long")
		.bail()
		//isStrongPassword will check if the password is strong enough and has at least one lowercase, one uppercase, one number and one special character and returns true or false
		.isStrongPassword()
		.withMessage("Password must contain at least 1 uppercase letter and 1 special character")
		.bail()
		.trim()
		.escape(),
	body("confirmPassword")
		.optional({checkFalsy: true})
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true;
		})
		.withMessage("Passwords do not match"),
	body("userAddress.street")
		.optional({checkFalsy: true}),
	body('userAddress.streetNumber')
		.optional({checkFalsy: true})
		.matches(/^[a-zA-Z0-9äöüÄÖÜß\ !@#*+\-;':"\ |,.\/?]*$/)
		.withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),
	body("userAddress.city")
		.optional({checkFalsy: true})
		.isAlpha()
		.withMessage("City can only contain letters"),
	body("userAddress.zip")
		.optional({checkFalsy: true})
		.isNumeric()
		.withMessage("Zip code can only contain numbers"),
	body("userAddress.country")
		.optional({checkFalsy: true})
		.isAlpha()
		.withMessage("Country can only contain letters"),
	body("status")
		.optional({checkFalsy: true})
		.isLength({max:5000})
		.withMessage('no more then 5000 characters including whitespace')
		.matches(/^[a-zA-Z0-9äöüÄÖÜß\!@#*+\-;':"\ |,.\/?]*$/)
		.withMessage("We only accept the following special characters including whitespace: !@#*()+\"-;':,.?"),
	// body("agree")
	// 	.isIn(["true"])
	// 	.withMessage("You must agree to the terms and conditions")
	// 	.trim()
	// 	.escape(),
];

export default userUpdateValidators;

		//(?=.{4,20}$) username is 4-20 characters's long
		//(?![_.]) username does not start with _ or .
		//(?!.*[_.]{2}) username does not have 2 _ or . in a row
		//[a-zA-Z0-9._] username is alphanumeric, _ or .
		//+(?<![_.]) no _ or . at the end
		// .exists().withMessage("Profile name already exists!").bail()