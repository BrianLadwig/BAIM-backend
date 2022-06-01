import express from "express";
import mongoose from "mongoose";
import createError from "http-errors";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import requestValidator from "../middlewares/requestValidator.js"
import postValidator from "../validators/postValidators.js"
import updatedPostValidator from "../validators/updatePostValidators.js"

const recipeRouter = express.Router();

recipeRouter
        .get("/", async (req, res) => {
          try {
              const recipes = await Recipe.find()
              res.status(200).json(recipes)
          } catch (error) {
              res.status(404).json({ errors: [error.message] })
          }
        })
        .post("/", requestValidator(postValidator), async (req, res) => {
          const post = req.body;
          const newPost = new Recipe(post)
          const user = await User.findById(req.body.author)

          if(!user) {
              return res.status(404).json({ errors: ["User is not found"] })
          }
          
          try {
              await newPost.save()
              // need to push the post to the user's post array
              user.recipe.push(newPost)
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
          const updatedPost = await Recipe.findByIdAndUpdate(_id, req.body, { new: true })
          res.json({message: 'Updated'})
        })
        .delete("/:id", async (req, res) => {
          const { id:_id } = req.params
          const post = await Recipe.findById(_id)
          const user = await User.findById(post.author)

          if(!user) {
              return res.status(404).json({ errors: ["User is not found"] })
          }

          if(!mongoose.Types.ObjectId.isValid(_id)) {
              return res.status(404).json({ errors: 'No post with that id'})
          }
          
          const postIndex = user.recipe.indexOf(_id)
          user.recipe.splice(postIndex, 1)
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

          const post = await Recipe.findById(_id)

          const index = post.likes.findIndex(id => id === String(req.body.author))
          if(index === -1) {
              // like
              post.likes.push(req.body.author)
          } else {
              // dislike
              post.likes = post.likes.filter(id => id !== String(req.body.author))
          }

          const updatedPost = await Recipe.findByIdAndUpdate(_id, post, { new: true })
          res.json({message: "toggle like"})
        })

export default recipeRouter;


  // .get("/", async (req, res, next) => {
  //   try {
  //     const query = Recipe.find(req.query);
  //     query.populate("author", "userName");

  //     const recipes = await query.exec();
  //     res.send(recipes);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  // .get("/:id", async (req, res, next) => {
  //   try {
  //     const query = Recipe.findById(req.params.id);
  //     query.populate("author", "userName");

  //     const recipe = await query.exec();
  //     if (!recipe) {
  //       return next(createError(404, "Recipe not found"));
  //     }
  //     res.send(recipe);
  //   } catch (error) {
  //     next(error);
  //   }
  // })
  // .post("/", async (req, res, next) => {
  //   try {
  //     const author = await User.findById(req.body.author);
  //     if (!author) {
  //       return next(createError(404, "User not found"));
  //     }

  //     const recipe = await Recipe.create(req.body);
  //     author.recipe.push(recipe);
  //     await author.save();

  //     res.send(recipe);
  //   } catch (error) {
  //     next(createError(400, error.message));
  //   }
  // })
  // .patch("/:id", async (req, res, next) => {
  //   try {
   
  //     const query = Recipe.findByIdAndUpdate(id, req.body, queryOptions);
  //     query.populate("author", "name");

  //     const recipe = await query.exec();

  //     if (!recipe) {
  //       return next(createError(404, "Recipe not found"));
  //     }

  //     res.send(recipe);
  //   } catch (error) {
  //     next(createError(400, error.message));
  //   }
  // })
  // .delete("/:id", async (req, res, next) => {
  //   try {
  //     const recipe = await Recipe.findById(req.params.id);

  //     if (!recipe) {
  //       return next(createError(404, "Recipe not found"));
  //     }

  //     await recipe.remove();
  //     res.send({ ok: true, deleted: recipe });
  //   } catch (error) {
  //     next(createError(400, error.message));
  //   }
  // });