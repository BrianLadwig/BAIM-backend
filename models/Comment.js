import mongoose from "mongoose";
import User from "./User.js";
import ArtsCraft from "./ArtsCraft.js";
import Beauty from "./Beauty.js";
import Event from "./Event.js";
import Garden from "./Garden.js";
import Recipe from "./Recipe.js";



const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const trim = true;

const commentSchema = Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:     { type: String},
    authorProfileName:{ type: String}, 
    type: {
      type: String,
      enum: ["beauty", "recipe", "artsCraft", "garden", "event"],
    },
    beauty:     { type: Schema.Types.ObjectId, ref: "beauty" },
    recipe:     { type: Schema.Types.ObjectId, ref: "recipe" },
    artsCraft:  { type: Schema.Types.ObjectId, ref: "artsCraft" },
    garden:     { type: Schema.Types.ObjectId, ref: "garden" },
    event:      { type: Schema.Types.ObjectId, ref: "event" },
    message:    { type: String, required, trim },
    likes:      { type: [String], default: [] }
  },
  { timestamps }
);

commentSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("comment is being removed " + id);

  if (this.type === "beauty") {
    const beauty = await Beauty.findById(this.beauty);
    if (beauty) {
      beauty.comments = beauty.comments.filter((x) => x.toString() !== id);
      await beauty.save();
    }
  }else if (this.type === "recipe"){
    const recipe = await Recipe.findById(this.recipe);
    if (recipe) {
      recipe.comments = recipe.comments.filter((x) => x.toString() !== id);
      await recipe.save();
    }
  }else if (this.type === "artsCraft"){
    const artsCraft = await ArtsCraft.findById(this.artsCraft);
    if (artsCraft) {
      artsCraft.comments = artsCraft.comments.filter((x) => x.toString() !== id);
      await artsCraft.save();
    }
  }else if (this.type === "garden"){
    const garden = await Garden.findById(this.garden);
    if (garden) {
      garden.comments = garden.comments.filter((x) => x.toString() !== id);
      await garden.save();
    }
  }else if (this.type === "event"){
    const event = await Event.findById(this.event);
    if (event) {
      event.comments = event.comments.filter((x) => x.toString() !== id);
      await event.save();
    }
  }
});

const Comment = model("comment", commentSchema);

export default Comment;
