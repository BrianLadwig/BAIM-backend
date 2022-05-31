import mongoose from "mongoose";
import User from "./User.js";

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
    author: { type: Schema.Types.ObjectId, ref: "user", required },
    type: {default:"recipe"},
    title: { type: String, required, trim },
    prepTime: { type: String },
    // ingredients: { type: [ingredientsSchema] },
    instructions: { type: [String], required, trim },
    tags:{type:[String]},
    comments:{type:[Object]},
    likes:{type:[String]}
  },
  { timestamps }
);

recipeSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("Recipe is being removed " + id);

  const author = await User.findById(this.author);

  if (author) {
    author.recipe = author.recipe.filter((x) => x.toString() !== id);
    await author.save();
  }
});

const Recipe = model("recipe", recipeSchema);
export default Recipe;
