import express from "express";
// import mongoose from "mongoose";
// import createError from "http-errors";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import checkLogin from "../middlewares/checkLogin.js";
import requestValidator from "../middlewares/requestValidator.js"
import postValidator from "../validators/postValidators.js"
import updatedPostValidator from "../validators/updatePostValidators.js"

const recipeRouter = express.Router();

// const query = Recipe.find()
// query.populate("author", "profilePicture")
// const recipes = await query.exec()

recipeRouter
        .get("/", async (req, res, next) => {
          try {
              const recipes = await Recipe.find()
              res.status(200).json(recipes)
          } catch (error) {
              next({ status: 404, errors: error.message })
          }
        })
        .get("/authorProfileName/:option", async (req, res, next) => {
            try {
                const option = req.params.option;
                const searchResult = await Recipe.find({
                    authorProfileName:   { $regex: ".*" + option + ".*" },
                })
                res.status(200).send(searchResult);
            } catch (errors) {
                next({ status: 404, errors });
            }
        })
        .get("/title/:option", async (req, res, next) => {
            try {
                const option = req.params.option;
                const searchResult = await Recipe.find({
                    title:   { $regex: ".*" + option + ".*" },
                })
                res.status(200).send(searchResult);
            } catch (errors) {
                next({ status: 404, errors });
            }
        })
        .get("/description/:option", async (req, res, next) => {
            try {
                const option = req.params.option;
                const searchResult = await Recipe.find({
                    description:   { $regex: ".*" + option + ".*" },
                })
                res.status(200).send(searchResult);
            } catch (errors) {
                next({ status: 404, errors });
            }
        })
        .get("/category/:option", async (req, res, next) => {
            try {
                const option = req.params.option;
                const searchResult = await Recipe.find({
                    category:   { $regex: ".*" + option + ".*" },
                })
                res.status(200).send(searchResult);
            } catch (errors) {
                next({ status: 404, errors });
            }
        })
        .get("/tags/:option", async (req, res, next) => {
            try {
                const option = req.params.option;
                const searchResult = await Recipe.find({
                    tags:   { $regex: ".*" + option + ".*" },
                })
                res.status(200).send(searchResult);
            } catch (errors) {
                next({ status: 404, errors });
            }
        })
        .post("/", checkLogin, requestValidator(postValidator), async (req, res, next) => {
            try {
                const post = req.body;
                post.authorAvatar = req.user.avatar
                post.authorProfileName = req.user.profileName
                post.author = req.user._id // the id is in the cookie
                const newPost = new Recipe(post)
                const user = await User.findById(req.body.author)
                await newPost.save()
                // need to push the post to the user's post array
                user.recipe.push(newPost)
                await user.save()
                res.status(200).json(newPost)
            } catch (error) {
                next({ status: 409, errors: error.message })
            }
        })
        .patch("/:id", checkLogin, requestValidator(updatedPostValidator), async (req, res, next) => {
            const { id:_id } = req.params
            const updatedPost = await Recipe.findByIdAndUpdate(_id, req.body, { new: true })
            if(!updatedPost){
                return next({ status: 404, errors: "Post not found" })
            }
            res.json({message: 'Updated', updatedPost})
        })
        .delete("/:id", checkLogin, async (req, res, next) => {
            try {
                const { id:_id } = req.params
                const post = await Recipe.findById(_id)
                post.author = req.user._id //adding the userId from cookies
                const user = await User.findById(post.author)
                const postIndex = user.recipe.indexOf(_id)
                user.recipe.splice(postIndex, 1)
                await user.save()
                await post.remove()
                // await Post.findByIdAndDelete(_id)
                res.json({ message: "Deleted", deleted: post })
            } catch (error) {
                next({ status: 400, errors: error.message })
            }
        })
        .patch("/:id/like", checkLogin, async (req, res, next) => {
            try {
                const { id:_id } = req.params
                req.body.author = req.user._id
                const post = await Recipe.findById(_id)
                const index = post.likes.findIndex(id => id === String(req.body.author))
                if(index === -1) {
                    // like
                    post.likes.push(req.body.author)
                } else {
                    // dislike
                    post.likes = post.likes.filter(id => id !== String(req.body.author))
                }
                const updatedPost = await Recipe.findByIdAndUpdate(_id, post, { new: true })
                res.json({message: "toggle like"})
            } catch (error) {
                next({ status: 400, errors: error.message })
            }
        })

export default recipeRouter;