import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import userRegisterValidators from "../validators/userRegisterValidators.js";
import userLoginValidators from "../validators/userLoginValidators.js";
import { hash, compare } from "../lib/crypto.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter
	.get("/", async (req, res, next) => {
		try {
			const query = User.find(req.query, "-__v");
			const users = await query.exec();
			res.send(users);
		} catch (errors) {
			next({ status: 404, errors });
		}
	})
	.get("/:id", async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id);
			if (!user) {
				throw Error("User not found");
			}
			res.send(user);
		} catch (errors) {
			next({ status: 404, errors });
		}
	})
	.post("/register", userRegisterValidators, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({
				errors: errors.array().map((e) => e.msg),
			});
		}
		try {
			req.body.password = await hash(req.body.password);

			const user = await User.create(req.body);
			res.status(201).send({
				message: "User created successfully.",
			});
		} catch (errors) {
			res.status(500).send({ errors });
		}
	})
	.post("/login", userLoginValidators, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).send({
				errors: errors.array().map((e) => e.msg),
			});
		}
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				throw Error("User not found");
			}
			const isValid = await compare(req.body.password, user.password);
			if (!isValid) {
				throw Error("Incorrect password");
			}


			const token = jwt.sign({ id: user._id }, process.env.SECRET, {
				expiresIn: "15s",
			});

			res.cookie("token", token, { httpOnly: true })

			res.status(200).send({
				message: `Welcome back ${user.firstName} ${user.lastName}`,
				user,
				token,
			});
		} catch (errors) {
			res.status(500).send({ errors });
		}
	})
	.patch("/:id", async (req, res, next) => {
		try {
			req.body.password = await hash(req.body.password);
			const user = await User.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});
			if (!user) {
				throw Error("User not found");
			}
			res.status(200).send({
				message: "User updated successfully.",
				user,
			});
		} catch (errors) {
			res.status(500).send({ errors });
		}
	})
	.delete("/:id", async (req, res, next) => {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			if (!user) {
				throw Error("User not found");
			}
			res.status(200).send({
				message: "User deleted successfully.",
			});
		} catch (errors) {
			next({ errors });
		}
	});

export default userRouter;
