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

const lokaImage=lokaImage

const recipeSchema = new Schema(
  {
    author:           { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:     { type: String},
    authorProfileName:{ type: String}, 
    type:             { type: String, required, default:"recipe"},
    title:            { type: String, required, trim },
    // prepTime: { type: String },
    // ingredients: { type: [ingredientsSchema] },
    description:      { type: String, required },
    video:            { type: String },
    image:            { type: String, default: lokaImage },
    link:             { type: String },
    category:         { type: [String], default: [],enum: ["juice","smoothie", "breakfast", "sandwiches", "main-dish", "soup", "salad", "appetizer", "dessert", "other"] },
    tags:             { type: [String], default: [] },
    comments:         { type: [Object], default: [] },
    likes:            { type: [Schema.Types.ObjectId], default: [], ref: "user" },
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
