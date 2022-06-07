import { body } from "express-validator";
import { compare } from "../lib/crypto.js";
import User from "../models/User.js";

// Custom error messages enable easier translation in the frontend
const userLoginValidators = [
	body("email")
		.notEmpty()
		.withMessage("Email should not be empty")
		.isEmail()
		.withMessage("Not a valid email address")
		//custom validator will check if the username exists in the database, else it will throw an error
		.custom(value => {
			return User.find({email: value}).then(user =>{
                if(user.length === 0){
                    return Promise.reject('Email is not registered')
                }
            })
		}),
	body("password")
		.notEmpty()
		.withMessage("Password should not be empty")
		// .custom(value => {
		// 	return User.find({password: value}).then(user =>{
		// 		console.log('value, user :>> ', value, user);
		// 		const isPasswordCorrect = compare(value, user.password)		
        //         if(!isPasswordCorrect){
        //             return Promise.reject('Incorrect password')
        //         }
        //     })
		// }),
];

export default userLoginValidators;