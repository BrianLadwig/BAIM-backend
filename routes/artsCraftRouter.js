import express from "express";
import mongoose from "mongoose";
import ArtsCraft from "../models/ArtsCraft.js"
import User from "../models/User.js"
import requestValidator from "../middlewares/requestValidator.js"
import postValidator from "../validators/postValidators.js"
import updatedPostValidator from "../validators/updatePostValidators.js"


const artsCraftRouter = express.Router();

artsCraftRouter
    .get("/", async (req, res) => {
        try {
            const artsCrafts = await ArtsCraft.find()
            res.status(200).json(artsCrafts)
        } catch (error) {
            res.status(404).json({ errors: [error.message] })
        }
    })
    .post("/", requestValidator(postValidator), async (req, res) => {
        try {
            const post = req.body;
            post.author = req.user._id // the id is in the cookie
            const newPost = new ArtsCraft(post)
            const user = await User.findById(req.body.author)
            await newPost.save()
            // need to push the post to the user's post array
            user.artsCraft.push(newPost)
            await user.save()
            res.status(200).json(newPost)
        } catch (error) {
            res.status(409).json({ errors: error.message})
        }
    })
    .patch("/:id", requestValidator(updatedPostValidator), async (req, res) => {
        const { id:_id } = req.params
        const updatedPost = await ArtsCraft.findByIdAndUpdate(_id, req.body, { new: true })
        if(!updatedPost){
            return res.status(404).json({ errors : "Post not found" })
        }
        res.json({message: 'Updated', updatedPost})
    })
    .delete("/:id", async (req, res) => {
        try {
            const { id:_id } = req.params
            const post = await ArtsCraft.findById(_id)
            post.author = req.user._id //adding the userId from cookies
            const user = await User.findById(post.author)
            const postIndex = user.artsCraft.indexOf(_id)
            user.artsCraft.splice(postIndex, 1)
            await user.save()
            await post.remove()
            // await Post.findByIdAndDelete(_id)
            res.json({ message: "Deleted", deleted: post })
        } catch (error) {
            res.status(404).json({ errors: error.message})
        }
    })
    .patch("/:id/like",async (req, res) => {
        try {
            const { id:_id } = req.params
            req.body.author = req.user._id
            const post = await ArtsCraft.findById(_id)
            const index = post.likes.findIndex(id => id === String(req.body.author))
            if(index === -1) {
                // like
                post.likes.push(req.body.author)
            } else {
                // dislike
                post.likes = post.likes.filter(id => id !== String(req.body.author))
            }
            const updatedPost = await ArtsCraft.findByIdAndUpdate(_id, post, { new: true })
            res.json({message: "toggle like"})
        } catch (errors) {
            res.status(404).json({ errors : errors.message })
        }
    })

export default artsCraftRouter