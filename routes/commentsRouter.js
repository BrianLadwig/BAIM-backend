import express from "express";
import User from "../models/User.js";
import ArtsCraft from "../models/ArtsCraft.js";
import Beauty from "../models/Beauty.js";
import Event from "../models/Event.js";
import Garden from "../models/Garden.js";
import Recipe from "../models/Recipe.js";
import Comments from "../models/Comments.js";

const commentsRouter = express.Router();

commentsRouter
  .get("/", async (req, res, next) => {
    try {
      const comments = await Comments.find();

      res.send(comments);
    } catch (error) {
      next(error);
    }
  })
  .post("/", async (req, res) => {
    try {
      const author = await User.findById(req.body.author);

      if (!author) {
        return next({ status: 404, error});
      }

      const type = req.body.type;

      if (type === "beauty") {
        const post = await Beauty.findById(req.body.post);

        if (!post) {
          return next({ status: 404, error});
        }
        const comment = await Comments.create(req.body);

        author.comments.push(comment);
        await author.save();

        post.comments.push(comment);
        await post.save();

        res.send(post);
      } else if (type === "recipe") {
        const post = await Recipe.findById(req.body.post);

        if (!post) {
          return next(createError(404, "Post not found"));
        }
        const comment = await Comments.create(req.body);

        author.comments.push(comment);
        await author.save();

        post.comments.push(comment);
        await post.save();

        res.send(post);
      } else if (type === "artsCraft") {
        const post = await ArtsCraft.findById(req.body.post);

        if (!post) {
          return next(createError(404, "Post not found"));
        }
        const comment = await Comments.create(req.body);

        author.comments.push(comment);
        await author.save();

        post.comments.push(comment);
        await post.save();

        res.send(post);
      } else if (type === "garden") {
        const post = await Garden.findById(req.body.post);

        if (!post) {
          return next({ status: 404, error});
        }
        const comment = await Comments.create(req.body);

        author.comments.push(comment);
        await author.save();

        post.comments.push(comment);
        await post.save();

        res.send(post);
      } else if (type === "event") {
        const post = await Event.findById(req.body.post);

        if (!post) {
          return next({ status: 404, error});
        }
        const comment = await Comments.create(req.body);

        author.comments.push(comment);
        await author.save();

        post.comments.push(comment);
        await post.save();

        res.send(post);
      }
    } catch (error) {
      next({ status: 404, errors });
    }
  })
  .patch("/:id", async (req, res, next) => {
    try {
      const comment = await Comments.findByIdAndUpdate(req.body.message);

      if (!comment) {
        throw next({ status: 404, error});
      }


    } catch (error) {
      next({ status: 404, errors });
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const comment = await Comments.findById(req.params.id);

      if (!comment) {
        throw next({ status: 404, error});
      }

      await comment.remove();
      res.send({ ok: true, deleted: comment });
    } catch (error) {
      next({ status: 404, errors });
    }
  })
 

export default commentsRouter;
