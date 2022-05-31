import express from "express";
import mongoose from "mongoose";
import Diy from "../models/Diy.js"
import User from "../models/User.js"

const diyRouter = express.Router();

diyRouter
    .get("/", async (req, res) => {
        try {
            const diyPosts = await Diy.find()
            res.status(200).json(diyPosts)
        } catch (error) {
            res.status(404).json({ message: error.message })
        }
    })
    .post("/", async (req, res) => {
        const post = req.body;
        const newPost = new Diy(post)
        const user = await User.findById(req.body.user)
        try {
            await newPost.save()
            // need to push the post to the user's post array
            user.diy.push(newPost)
            await user.save()

            res.status(200).json(newPost)
        } catch (error) {
            res.status(409).json({ message: error.message })
        }
    })
    .patch("/:id", async (req, res) => {
        const { id:_id } = req.params

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that id')
        }
        // console.log(req.body);
        const updatedPost = await Diy.findByIdAndUpdate(_id, req.body, { new: true })
        res.json({message: 'Updated'})
    })
    .delete("/:id", async (req, res) => {
        const { id:_id } = req.params
        const post = await Diy.findById(_id)
        const user = await User.findById(post.user)

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that id')
        }
        
        const postIndex = user.posts.indexOf(_id)
        user.posts.splice(postIndex, 1)
        await user.save()
        await post.remove()
        // await Post.findByIdAndDelete(_id)
        res.json({ message: "Deleted", deleted: post })
    })
    .patch("/:id/like",async (req, res) => {
        const { id:_id } = req.params

        if(!req.userId) {
            return res.status(401).json({ message: "Unauthenticated"})
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send('No post with that id')
        }

        const post = await Diy.findById(_id)

        const index = post.likes.findIndex(id => id === String(req.userId))
        if(index === -1) {
            // like
            post.likes.push(req.userId)
        } else {
            // dislike
            post.likes = post.likes.filter(id => id !== String(req.userId))
        }

        const updatedPost = await Diy.findByIdAndUpdate(_id, post, { new: true })
        res.json({message: "Liked"})
    })

export default diyRouter