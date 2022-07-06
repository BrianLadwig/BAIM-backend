import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import checkLogin from "../middlewares/checkLogin.js";
import userRegisterValidators from "../validators/userRegisterValidators.js";
import userLoginValidators from "../validators/userLoginValidators.js";
import userUpdateValidators from "../validators/userUpdateValidators.js";
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
  .get("/search/:option", async (req, res, next) => {
    try {
      const option = req.params.option;
      const searchResult = await User.find({
        profileName: { $regex: ".*" + option + ".*" },
      });
      res.status(200).send(searchResult);
    } catch (errors) {
      next({ status: 404, errors });
    }
  })
  .get("/:profileName", async (req, res, next) => {
    try {
      const user = await User.findOne({profileName: req.params.profileName });
      if (!user) {
        return next({ status: 404, errors: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      next({ status: 404, errors: error.message });
    }
  })
  .post("/register",
    requestValidator(userRegisterValidators),
    async (req, res, next) => {
      try {
        req.body.password = await hash(req.body.password);

        const user = await User.create(req.body);

        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: "7 days",
        });
         console.log("test",token);
         console.log('user :>> ', user);
        res.cookie("token", token, { httpOnly: true });
        res.cookie("avatar", user.avatar);
        res.cookie("profileName", user.profileName);

        res.status(201).send({
          message: "Registered successfully",
          user,
          token,
        });
      } catch (error) {
        next({ status: 400, errors: error.message });
      }
    }
  )
  .post("/login",
    requestValidator(userLoginValidators),
    async (req, res, next) => {
      try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return next({ status: 404, errors: { email: "User not found" } });
        }
        const isValid = await compare(req.body.password, user.password);
        if (!isValid) {
          return next({
            status: 401,
            errors: { password: "Incorrect password" },
          });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: "7 days",
        });
        // console.log("test",token);
        // console.log('user :>> ', user);
        res.cookie("token", token, { httpOnly: true });
        res.cookie("avatar", user.avatar);
        res.cookie("profileName", user.profileName);

        res.status(200).send({
          message: `Welcome back ${user.firstName} ${user.lastName}`,
          user,
          token,
        });
      } catch (error) {
        next({ status: 400, errors: error.message });
      }
    }
  )
  .post("/collection/:id", checkLogin, async (req, res, next) => {
    console.log("hello");

    try {
      const user = await User.findById(req.params.id);

      if (user) {
        user.pin.push(req.body);
        res.status(200).send({
          message: "Added Post to User Collection",
        });
      }
    } catch (error) {
      next({ status: 400, errors: error.message });
    }
  })
  .post("/logout", checkLogin, async (req, res, next) => {
	try {
	  // set to empty
	  res.clearCookie("token");
	  res.clearCookie("avatar");
	  res.clearCookie("profileName");
	  res.status(200).json({ message: "You have logged out" });
	} catch (error) {
	  next({ status: 400, errors: error.message });
	}
  })
  .patch("/:id", checkLogin, async (req, res, next) => {
    try {

      if(req.body.password){

        req.body.password = await hash(req.body.password);
        
      }

      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!user) {
        return next({ status: 404, errors: "User not found" });
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
      const user = await User.findById(req.params.id)
      await user.remove()
      // const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return next({ status: 404, errors: "User not found" });
      }
      res.status(200).send({
        message: "User deleted successfully.",
      });
    } catch (error) {
      next({ status: 400, errors: error.message });
    }
  })
  .patch("/:id/following", checkLogin, requestValidator(userUpdateValidators), async (req, res, next) => {
    try {
      const { id: _id } = req.params; // the user you want to follow
      const loggedInUser = await User.findById(req.user._id);
      const followedUser = await User.findById(_id);

      const isFollowed = loggedInUser.following.find(
        id => id.toString() === _id.toString()
      );

      if (!isFollowed) {
        loggedInUser.following.push(followedUser);
        followedUser.followers.push(loggedInUser);
      } else {
        loggedInUser.following = loggedInUser.following.filter(
          id => id.toString() !== _id.toString()
        );

        followedUser.followers = followedUser.followers.filter(
          id => id.toString() !== req.user._id.toString()
          
        );
      }

      await loggedInUser.save();
      await followedUser.save();
      res.json({ message: "toggle follow" });
    } catch (error) {
      next({ status: 400, errors: error.message });
    }
  });

export default userRouter;

// Getting user by id
// .get("/:id", async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return next({ status: 404, errors: "User not found" });
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     next({ status: 404, errors: error.message });
//   }
// })