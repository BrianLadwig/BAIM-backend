import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import userRegisterValidators from "../validators/userRegisterValidators.js"
// import userLoginValidators from "../validators/userLoginValidator.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
	try {
		const query = User.find(req.query);
		const users = await query.exec();
		res.send(users);
	} catch (error) {
		next(error);
	}
});

userRouter.get("/:id", async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw createError(404, "User not found");
		}
		res.send(user);
	} catch (error) {
		next(error);
	}
});

userRouter.post("/register", userRegisterValidators, async (req, res, next) => {
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
		res.status(500).send({ errors: [error.message] });
	}
});

userRouter.post("/login", userLoginValidators, async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send({
			errors: errors.array().map((e) => e.msg),
		});
	}
	try {
		const { password, email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			throw createError(404, "User not found");
		}
		const loginPassword = user.password;
		console.log(password);
		if (password !== loginPassword) {
			throw createError(401, "Invalid password");
		}
		res.status(200).send({
			message: `Welcome ${user.firstName} ${user.lastName}`,
			user,
		});
	} catch (error) {
		res.status(500).send({ errors: [error.message] });
	}
});

userRouter.delete("/:id", async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			throw createError(404, "User not found");
		}
		res.status(200).send({
			message: "User deleted successfully.",
		});
	} catch (error) {
		next(error);
	}
});

export default userRouter;
