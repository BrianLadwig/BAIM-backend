import express from "express";
// import mongoose from "mongoose";
import Garden from "../models/Garden.js"
import User from "../models/User.js"
import checkLogin from "../middlewares/checkLogin.js";
import requestValidator from "../middlewares/requestValidator.js"
import postValidator from "../validators/postValidators.js"
import updatedPostValidator from "../validators/updatePostValidators.js"

const gardenRouter = express.Router();

gardenRouter
    .get("/", async (req, res, next) => {
        try {
            const gardenPosts = await Garden.find()
            res.status(200).json(gardenPosts)
        } catch (error) {
            next({ status: 404, errors: error.message })
        }
    })
    .post("/", checkLogin, requestValidator(postValidator), async (req, res, next) => {
        try {
            const post = req.body;
            post.author = req.user._id // the id is in the cookie
            const newPost = new Garden(post)
            const user = await User.findById(req.body.author)
            await newPost.save()
            // need to push the post to the user's post array
            user.garden.push(newPost)
            await user.save()
            res.status(200).json(newPost)
        } catch (error) {
            next({ status: 409, errors: error.message })
        }
    })
    .patch("/:id", checkLogin, requestValidator(updatedPostValidator), async (req, res, next) => {
        const { id:_id } = req.params
        const updatedPost = await Garden.findByIdAndUpdate(_id, req.body, { new: true })
        if(!updatedPost){
            return next({ status: 404, errors: "Post not found" })
        }
        res.json({message: 'Updated', updatedPost})
    })
    .delete("/:id", checkLogin, async (req, res, next) => {
        try {
            const { id:_id } = req.params
            const post = await Garden.findById(_id)
            post.author = req.user._id //adding the userId from cookies
            const user = await User.findById(post.author)
            const postIndex = user.garden.indexOf(_id)
            user.garden.splice(postIndex, 1)
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
            const post = await Garden.findById(_id)
            const index = post.likes.findIndex(id => id === String(req.body.author))
            if(index === -1) {
                // like
                post.likes.push(req.body.author)
            } else {
                // dislike
                post.likes = post.likes.filter(id => id !== String(req.body.author))
            }
            const updatedPost = await Garden.findByIdAndUpdate(_id, post, { new: true })
            res.json({message: "toggle like"})
        } catch (error) {
            next({ status: 400, errors: error.message })
        }
    })

export default gardenRouter