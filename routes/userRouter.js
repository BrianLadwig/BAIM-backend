import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import userRegisterValidators from "../validators/userRegestrationValidator.js"
// import userLoginValidators from "../validators/userLoginValidator.js";

const userRouter = express.Router();

userRouter.post(
	"/register",
	userRegisterValidators,
	async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({
				errors: errors.array().map((e) => e.msg),
			});
		}
		try {
			const user = await User.create(req.body);
			res.status(201).send({
				message: "User created successfully.",
			});
		} catch (error) {
			next(
				createError({
					status: 400,
					message: error.message,
					originalError: error,
				})
			);
		}
	}
);


export default userRouter

