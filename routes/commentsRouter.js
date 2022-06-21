import express from "express";
import User from "../models/User.js";
import ArtsCraft from "../models/ArtsCraft.js";
import Beauty from "../models/Beauty.js";
import Event from "../models/Event.js";
import Garden from "../models/Garden.js";
import Recipe from "../models/Recipe.js";
import Comment from "../models/Comment.js";
import checkLogin from "../middlewares/checkLogin.js";
import commentsValidators from "../validators/commentsValidators.js";
import requestValidator from "../middlewares/requestValidator.js";

const commentsRouter = express.Router();

commentsRouter
  .get("/", async (req, res, next) => {
    try {
      const comments = await Comment.find();

      res.status(200).send(comments);
    } catch (error) {
      next({ status: 404, errors: error.message })
    }
  })
  .post(
    "/",
    checkLogin,
    requestValidator(commentsValidators),
    async (req, res, next) => {
      try {
        const post = req.body;
        post.authorAvatar = req.user.avatar
        post.authorProfileName = req.user.profileName
        post.author = req.user._id; // the id is in the cookie

        const author = await User.findById(req.body.author);

        if (!author) {
          return next({ status: 404, error });
        }

        const type = req.body.type;
        console.log("type:", type);
        
        if (type === "beauty") {
          const beauty = await Beauty.findById(req.body.beauty);

          if (!beauty) {
            return next({ status: 404, errors: "Post not found" });
          }
          const comment = await Comment.create(req.body);

          beauty.comments.push(comment);
          await beauty.save();

          res.status(201).send(comment);
        } else if (type === "recipe") {
          const recipe = await Recipe.findById(req.body.recipe);

          if (!recipe) {
            return next({ status: 404, errors: "Post not found" });
          }
          const comment = await Comment.create(req.body);

          recipe.comments.push(comment);
          await recipe.save();

          res.status(201).send(comment);
        } else if (type === "artsCraft") {
          const artsCraft = await ArtsCraft.findById(req.body.artsCraft);

          if (!artsCraft) {
            return next({ status: 404, errors: "Post not found" });
          }
          const comment = await Comment.create(req.body);

          artsCraft.comments.push(comment);
          await artsCraft.save();

          res.status(201).send(comment);
        } else if (type === "garden") {
          const garden = await Garden.findById(req.body.garden);

          if (!garden) {
            return next({ status: 404, errors: "Post not found" });
          }
          const comment = await Comment.create(req.body);

          garden.comments.push(comment);
          await garden.save();

          res.status(201).send(comment);
        } else if (type === "event") {
          const event = await Event.findById(req.body.event);

          if (!event) {
            return next({ status: 404, errors: "Post not found" });
          }
          const comment = await Comment.create(req.body);

          event.comments.push(comment);
          await event.save();

          res.status(201).send(comment);
        }
      } catch (error) {
        next({ status: 404, errors: error.message });
      }
    }
  )
  .patch(
    "/:id",
    checkLogin,
    requestValidator(commentsValidators),
    async (req, res, next) => {
      try {
        const { id: _id } = req.params;
        const comment = await Comment.findByIdAndUpdate(_id, req.body, {
          new: true,
        });

        if (!comment) {
          throw next({ status: 404, errors: "Comment not found." });
        }

        // To also update the reference in the related Post
        const type = req.body.type;

        if (type === "beauty") {
          const beauty = await Beauty.findById(req.body.beauty);

          if (!beauty) {
            return next({ status: 404, errors: "Post not found" });
          }

          beauty.comments = beauty.comments.filter(
            (x) => x._id.toString() !== _id
          );
          beauty.comments.push(comment);
          await beauty.save();
        } else if (type === "recipe") {
          const recipe = await Recipe.findById(req.body.recipe);

          if (!recipe) {
            return next({ status: 404, errors: "Post not found" });
          }

          recipe.comments = recipe.comments.filter(
            (x) => x._id.toString() !== _id
          );
          recipe.comments.push(comment);
          await recipe.save();
        } else if (type === "artsCraft") {
          const artsCraft = await ArtsCraft.findById(req.body.artsCraft);

          if (!artsCraft) {
            return next({ status: 404, errors: "Post not found" });
          }

          artsCraft.comments = artsCraft.comments.filter(
            (x) => x._id.toString() !== _id
          );
          artsCraft.comments.push(comment);
          await artsCraft.save();
        } else if (type === "garden") {
          const garden = await Garden.findById(req.body.garden);

          if (!garden) {
            return next({ status: 404, errors: "Post not found" });
          }

          garden.comments = garden.comments.filter(
            (x) => x._id.toString() !== _id
          );
          garden.comments.push(comment);
          await garden.save();
        } else if (type === "event") {
          const event = await Event.findById(req.body.event);
          console.log(event);

          if (!event) {
            return next({ status: 404, errors: "Post not found" });
          }

          event.comments = event.comments.filter(
            (x) => x._id.toString() !== _id
          );
          event.comments.push(comment);
          await event.save();
        }
        // /////////////////////////////////////////////////

        res.json({ message: "Updated", comment });
      } catch (error) {
        next({ status: 404, errors: "something went wrong" });
      }
    }
  )
  .delete("/:id", checkLogin, async (req, res, next) => {
    try {
      const { id: _id } = req.params;
      const comment = await Comment.findById(_id);

      if (!comment) {
        throw next({ status: 404, errors: errors.message });
      }

      await comment.remove();
      res.send({ ok: true, deleted: comment });
    } catch (error) {
      next({ status: 404, errors: error.message });
    }
  })
  .patch("/:id/like", checkLogin, async (req, res, next) => {
    try {
      const { id: _id } = req.params;
      req.body.author = req.user._id;
      const comment = await Comment.findById(_id);
      const index = comment.likes.findIndex(
        (id) => id === String(req.body.author)
      );
      if (index === -1) {
        // like
        comment.likes.push(req.body.author);
      } else {
        // dislike
        comment.likes = comment.likes.filter(
          (id) => id !== String(req.body.author)
        );
      }
      const updatedcomment = await Comment.findByIdAndUpdate(_id, comment, {
        new: true,
      });
      res.json({ message: "toggle like" });
    } catch (error) {
      next({ status: 400, errors: error.message });
    }
  });

export default commentsRouter;
