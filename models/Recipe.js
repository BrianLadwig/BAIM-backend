import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const trim = true;

// const ingredientsSchema = new Schema({
//   amount: { type: Number, required },
//   unit: { type: String, required, trim },
//   ingredient: { type: String, required },
// });

const recipeSchema = new Schema(
  {
    author:      { type: Schema.Types.ObjectId, ref: "user", required },
    type:        { type:String, required, default:"recipe"},
    title:       { type: String, required, trim },
    // prepTime: { type: String },
    // ingredients: { type: [ingredientsSchema] },
    description:  { type: String, required },
    video:        { type: String },
    image:        { type: String },
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
  },
  { timestamps }
);

recipeSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("Post is being removed " + id);

  const author = await User.findById(this.author);

  if (author) {
    author.recipe = author.recipe.filter((x) => x.toString() !== id);
    await author.save();
  }
  await Comment.deleteMany({ recipe: this._id })
});

const Recipe = model("recipe", recipeSchema);
export default Recipe;
