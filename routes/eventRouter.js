import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js"
import User from "../models/User.js"

const eventRouter = express.Router();

eventRouter
    .get("/", async (req, res) => {
        try {
            const events = await Event.find()
            res.status(200).json(events)
        } catch (error) {
            res.status(404).json({ errors: error.message })
        }
    })
    .post("/", async (req, res) => {
        try {
            const post = req.body;
            post.author = req.user._id // the id is in the cookie
            const newPost = new Event(post)
            const user = await User.findById(req.body.author)
            await newPost.save()
            // need to push the post to the user's post array
            user.event.push(newPost)
            await user.save()
            res.status(200).json(newPost)
        } catch (error) {
            res.status(409).json({ errors: error.message})
        }
    })
    .patch("/:id",async (req, res) => {
        const { id:_id } = req.params
        const updatedPost = await Event.findByIdAndUpdate(_id, req.body, { new: true })
        if(!updatedPost){
            return res.status(404).json({ errors : "Event not found" })
        }
        res.json({message: 'Updated', updatedPost})
    })
    .delete("/:id", async(req, res) => {
        try {
            const { id:_id } = req.params
            const post = await Event.findById(_id)
            post.author = req.user._id //adding the userId from cookies
            const user = await User.findById(post.author)
            const postIndex = user.event.indexOf(_id)
            user.event.splice(postIndex, 1)
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
            const post = await Event.findById(_id)
            const index = post.likes.findIndex(id => id === String(req.body.author))
            if(index === -1) {
                // like
                post.likes.push(req.body.author)
            } else {
                // dislike
                post.likes = post.likes.filter(id => id !== String(req.body.author))
            }
            const updatedPost = await Event.findByIdAndUpdate(_id, post, { new: true })
            res.json({message: "toggle like"})
        } catch (errors) {
            res.status(404).json({ errors : errors.message })
        }
    })

export default eventRouter