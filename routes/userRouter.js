import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import checkLogin from "../middlewares/checkLogin.js";
import userRegisterValidators from "../validators/userRegisterValidators.js";
import userLoginValidators from "../validators/userLoginValidators.js";
import requestValidator from "../middlewares/requestValidator.js";
import { hash, compare } from "../lib/crypto.js";

const userRouter = express.Router();

userRouter
	.get("/", async (req, res, next) => {
		try {
			const query = User.find(req.query, "-__v");
			const users = await query.exec();
			res.status(200).send(users);
		} catch (errors) {
			next({ status: 404, errors });
		}
	})
	.get("/:id", async (req, res, next) => {
		try {
			const user = await User.findById(req.params.id);
			if (!user) {
				return next({ status: 404, errors: "User not found"})
			}
			res.status(200).send(user);
		} catch (error) {
			next({ status: 404, errors: error.message });
		}
	})
	.post("/register", requestValidator(userRegisterValidators), async (req, res, next) => {
		try {
			req.body.password = await hash(req.body.password);

			const user = await User.create(req.body);
			res.status(201).send({
				message: "Registered successfully"
			});
		} catch (error) {
			next({ status: 400, errors: error.message });
		}
	})
	.post("/login", requestValidator(userLoginValidators), async (req, res, next) => {

		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return next({ status: 404, errors: {email: "User not found"} })
			}
			const isValid = await compare(req.body.password, user.password);
			if (!isValid) {
				return next({ status: 401, errors: {password: "Incorrect password"} })
			}

			const token = jwt.sign({ id: user._id }, process.env.SECRET, {
				expiresIn: "7 days",
			});
			console.log("test",token);

			res.cookie("token", token, { httpOnly: true })
			res.cookie("avatar", req.body.profilePicture )
			res.cookie("profileName", req.body.profileName )

			res.status(200).send({
				message: `Welcome back ${user.firstName} ${user.lastName}`,
				user,
				token
			});
		} catch (error) {
			next({ status: 400, errors: error.message });
		}
	})
	.patch("/:id", checkLogin, async (req, res, next) => {
		try {
			const user = await User.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
			});
			if (!user) {
				return next({ status: 404, errors: "User not found"})
			}
			res.status(200).send({
				message: "User updated successfully.",
				user,
			});
		} catch (error) {
			next({ status: 400, errors: error.message });
		}
	})
	.delete("/:id", checkLogin, async (req, res, next) => {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			if (!user) {
				return next({ status: 404, errors: "User not found"})
			}
			res.status(200).send({
				message: "User deleted successfully.",
			});
		} catch (error) {
			next({ status: 400, errors: error.message });
		}
	})
	.post("/logout", checkLogin, async (req, res, next) => {
		try {
	
			// set to empty 
			res.cookie("token", "", { httpOnly: true })
			res.status(200).json({ message: "You have logged out" });
			
		} catch (error) {
			next({ status: 400, errors: error.message });
		}

	})

export default userRouter;
