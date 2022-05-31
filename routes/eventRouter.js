import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js"
import User from "../models/User.js"
import requestValidator from "../middlewares/requestValidator.js"
import eventValidator from "../validators/eventValidator.js"
import eventUpdateValidator from "../validators/eventUpdateValidator.js"

const eventRouter = express.Router();

eventRouter
    .get("/", async (req, res) => {
        try {
            const events = await Event.find()
            res.status(200).json(events)
        } catch (error) {
            res.status(404).json({ errors: [error.message] })
        }
    })
    .post("/", requestValidator(eventValidator), async (req, res) => {
        const event = req.body;
        const newEvent = new Event(event)
        const user = await User.findById(req.body.author)
        if(!user) {
            return res.status(404).json({ errors: ["User is not found"] })
        }

        try {
            await newEvent.save()
            // need to push the post to the user's post array
            user.event.push(newEvent)
            await user.save()

            res.status(200).json(newEvent)
        } catch (error) {
            res.status(409).json({ errors: [error.message]})
        }
    })
    .patch("/:id",requestValidator(eventUpdateValidator), async (req, res) => {
        const { id:_id } = req.params

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: ['No post with that id'] })
        }
        // console.log(req.body);
        const updatedEvent = await Event.findByIdAndUpdate(_id, req.body, { new: true })
        res.json({message: 'Updated'})
    })
    .delete("/:id", async(req, res) => {
        const { id:_id } = req.params
        const event = await Event.findById(_id)
        console.log('event :>> ', event);
        const user = await User.findById(event.author)
        if(!user) {
            return res.status(404).json({ errors: ["User is not found"] })
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: 'No post with that id'})
        }
        
        const postIndex = user.event.indexOf(_id)
        user.event.splice(postIndex, 1)
        await user.save()
        await event.remove()
        // await Post.findByIdAndDelete(_id)
        res.json({ message: "Deleted", deleted: event })
    })
    .patch("/:id/like",async (req, res) => {
        const { id:_id } = req.params

        if(!req.body.author) {
            return res.status(401).json({ errors: "Unauthenticated"})
        }

        if(!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ errors: 'No post with that id'})
        }

        const event = await Event.findById(_id)

        const index = event.likes.findIndex(id => id === String(req.body.author))
        if(index === -1) {
            // like
            event.likes.push(req.body.author)
        } else {
            // dislike
            event.likes = event.likes.filter(id => id !== String(req.body.author))
        }

        const updatedEvent = await Event.findByIdAndUpdate(_id, event, { new: true })
        res.json({message: "toggle like"})
    })

export default eventRouter