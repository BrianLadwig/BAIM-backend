import express from "express";
import mongoose from "mongoose";
import Beauty from "../models/Beauty.js"
import User from "../models/User.js"
import requestValidator from "../middlewares/requestValidator.js"
import postValidator from "../validators/postValidators.js"
import updatedPostValidator from "../validators/updatePostValidators.js"

const beautyRouter = express.Router();

beautyRouter
    .get("/", async (req, res) => {
        try {
            const beautyPosts = await Beauty.find()
            res.status(200).json(beautyPosts)
        } catch (error) {
            res.status(404).json({ errors: [error.message] })
        }
    })
    .post("/", requestValidator(postValidator), async (req, res) => {
        const post = req.body;
        const newPost = new Beauty(post)
        const user = await User.findById(req.body.author)
   
        if(!user) {
            return res.status(404).json({ errors: ["User is not found"] })
        }
        
        try {
            await newPost.save()
            // need to push the post to the user's post array
            user.beauty.push(newPost)
            await user.save()

            res.status(200).json(newPost)
        } catch (error) {
            res.status(409).json({ errors: [error.message] })
        }
    })
    .patch("/:id", requestValidator(updatedPostValidator), async (req, res) => {
        const { id:_id } = req.params

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: ['No post with that id'] })
        }
        // console.log(req.body);
        const updatedPost = await Beauty.findByIdAndUpdate(_id, req.body, { new: true })
        res.json({message: 'Updated'})
    })
    .delete("/:id", async (req, res) => {
        const { id:_id } = req.params
        const post = await Beauty.findById(_id)
        const user = await User.findById(post.author)

        if(!user) {
            return res.status(404).json({ errors: ["User is not found"] })
        }
    
        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: 'No post with that id'})
        }
        
        const postIndex = user.beauty.indexOf(_id)
        user.beauty.splice(postIndex, 1)
        await user.save()
        await post.remove()
        // await Post.findByIdAndDelete(_id)
        res.json({ message: "Deleted", deleted: post })
    })
    .patch("/:id/like", async (req, res) => {
        const { id:_id } = req.params

        if(!req.body.author) {
            return res.status(401).json({ errors: "Unauthenticated"})
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: 'No post with that id'})
        }

        const post = await Beauty.findById(_id)

        const index = post.likes.findIndex(id => id === String(req.body.author))
        if(index === -1) {
            // like
            post.likes.push(req.body.author)
        } else {
            // dislike
            post.likes = post.likes.filter(id => id !== String(req.body.author))
        }

        const updatedPost = await Beauty.findByIdAndUpdate(_id, post, { new: true })
        res.json({message: "toggle like"})
    })

export default beautyRouter