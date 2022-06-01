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
        const event = req.body;
        const newEvent = new Event(evebt)
        const user = await User.findById(req.body.user)
        try {
            await newEvent.save()
            // need to push the post to the user's post array
            user.event.push(newEvent)
            await user.save()

            res.status(200).json(newEvent)
        } catch (error) {
            res.status(409).json({ errors: error.message })
        }
    })
    .patch("/:id",async (req, res) => {
        const { id:_id } = req.params

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send({ errors: 'No post with that id' })
        }
        // console.log(req.body);
        const updatedEvent = await Event.findByIdAndUpdate(_id, req.body, { new: true })
        res.json({message: 'Updated'})
    })
    .delete("/:id", async(req, res) => {
        const { id:_id } = req.params
        const event = await Event.findById(_id)
        const user = await User.findById(post.user)

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send({ errors: 'No post with that id' })
        }
        
        const postIndex = user.garden.indexOf(_id)
        user.event.splice(postIndex, 1)
        await user.save()
        await event.remove()
        // await Post.findByIdAndDelete(_id)
        res.json({ message: "Deleted", deleted: post })
    })
    .patch("/:id/like",async (req, res) => {
        const { id:_id } = req.params

        if(!req.userId) {
            return res.status(401).json({ errors: "Unauthenticated"})
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).send({ errors: 'No post with that id'})
        }

        const event = await Event.findById(_id)

        const index = event.likes.findIndex(id => id === String(req.userId))
        if(index === -1) {
            // like
            event.likes.push(req.userId)
        } else {
            // dislike
            event.likes = event.likes.filter(id => id !== String(req.userId))
        }

        const updatedEvent = await Event.findByIdAndUpdate(_id, post, { new: true })
        res.json({message: "Liked"})
    })

export default eventRouter