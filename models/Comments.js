import mongoose from "mongoose";
import User from "../models/User.js";
import ArtsCraft from "../models/ArtsCraft.js";
import Beauty from "../models/Beauty.js";
import Event from "../models/Event.js";
import Garden from "../models/Garden.js";
import Recipe from "../models/Recipe.js";
import Comments from "../models/Comments.js";
import Beauty from "../models/Beauty.js";

const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const trim = true;

const commentSchema = Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "user", required },
    type: {
      type: String,
      enum: ["beauty", "recipe", "artsCraft", "garden", "event"],
    },
    beauty: { type: [Schema.Types.ObjectId], ref: "beauty" },
    recipe: { type: [Schema.Types.ObjectId], ref: "recipe" },
    artsCraft: { type: [Schema.Types.ObjectId], ref: "artsCraft" },
    garden: { type: [Schema.Types.ObjectId], ref: "garden" },
    event: { type: [Schema.Types.ObjectId], ref: "event" },
    message: { type: String, required, trim },
  },
  { timestamps }
);

commentSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("comment is being removed " + id);

  const author = await User.findById(this.author);
  if (author) {
    author.comments = author.comments.filter((x) => x.toString() !== id);
    await author.save();
  }

  if (this.type === "beauty") {
    const beauty = await Beauty.findById(this.beauty);
    if (beauty) {
      beauty.comment = beauty.comment.filter((x) => x.toString() !== id);
      await beauty.save();
    }
  }else if (this.type === "recipe"){
    const recipe = await Recipe.findById(this.recipe);
    if (recipe) {
      recipe.comment = recipe.comment.filter((x) => x.toString() !== id);
      await recipe.save();
    }
  }else if (this.type === "artsCraft"){
    const artsCraft = await ArtsCraft.findById(this.artsCraft);
    if (artsCraft) {
      artsCraft.comment = artsCraft.comment.filter((x) => x.toString() !== id);
      await artsCraft.save();
    }
  }else if (this.type === "garden"){
    const garden = await Garden.findById(this.garden);
    if (garden) {
      garden.comment = garden.comment.filter((x) => x.toString() !== id);
      await garden.save();
    }
  }else if (this.type === "event"){
    const event = await Event.findById(this.event);
    if (event) {
      event.comment = event.comment.filter((x) => x.toString() !== id);
      await event.save();
    }
  }
});

const Comments = model("Comment", commentSchema);

export default Comments;
