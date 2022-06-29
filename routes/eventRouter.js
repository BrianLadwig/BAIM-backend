import express from "express";
import Event from "../models/Event.js"
import User from "../models/User.js"
import checkLogin from "../middlewares/checkLogin.js";
import requestValidator from "../middlewares/requestValidator.js";
import eventValidator from "../validators/eventValidator.js";
import eventUpdateValidator from "../validators/eventUpdateValidator.js";

const eventRouter = express.Router();

eventRouter
    .get("/", async (req, res, next) => {
        try {
            const events = await Event.find()
            res.status(200).json(events)
        } catch (error) {
            next({ status: 404, errors: error.message })
        }
    })
    .get("/author/:profileName", checkLogin, async (req, res, next) => {
        const author = req.params.profileName
        const result = await Event.find({
            authorProfileName: author,
        })
        if(!result){
            return next({ status: 404, errors: "Post not found" })
        }
        res.status(200).json(result)
    })
    .get("/:id", checkLogin, async (req, res, next) => {
        const { id:_id } = req.params
        const result = await Event.findById(_id)
        if(!result){
            return next({ status: 404, errors: "Post not found" })
        }
        res.status(200).json(result)
    })
    .get("/authorProfileName/:option", async (req, res, next) => {
		try {
			const option = req.params.option;
			const searchResult = await Event.find({
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
			const searchResult = await Event.find({
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
			const searchResult = await Event.find({
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
			const searchResult = await Event.find({
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
			const searchResult = await Event.find({
				tags:   { $regex: ".*" + option + ".*" },
			})
			res.status(200).send(searchResult);
		} catch (errors) {
			next({ status: 404, errors });
		}
	})
    .post("/", checkLogin, requestValidator(eventValidator), async (req, res, next) => {
        try {
            const post = req.body;
            post.authorAvatar = req.user.avatar
            post.authorProfileName = req.user.profileName
            post.author = req.user._id // the id is in the cookie
            const newPost = new Event(post)
            const user = await User.findById(req.body.author)
            await newPost.save()
            // need to push the post to the user's post array
            user.event.push(newPost)
            await user.save()
            res.status(200).json(newPost)
        } catch (error) {
            next({ status: 409, errors: error.message })
        }
    })
    .patch("/:id", checkLogin, requestValidator(eventUpdateValidator), async (req, res, next) => {
        const { id:_id } = req.params
        const updatedPost = await Event.findByIdAndUpdate(_id, req.body, { new: true })
        if(!updatedPost){
            return next({ status: 404, errors: "Event not found" })
        }
        res.status(200).json({message: 'Updated', updatedPost})
    })
    .delete("/:id", checkLogin, async(req, res, next) => {
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
            res.status(200).json({ message: "Deleted", deleted: post })
        } catch (error) {
            next({ status: 400, errors: error.message })
        }
    })
    .patch("/:id/like", checkLogin, async (req, res, next) => {
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
            res.status(200).json({message: "toggle like"})
        } catch (error) {
            next({ status: 400, errors: error.message })
        }
    })

export default eventRouter