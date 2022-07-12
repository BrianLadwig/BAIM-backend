import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose;
const required = true;
// const trim = true
// const unique = true
// const lowercase = true

const artsCraftSchema = Schema(
  {
    author:           { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:     { type: String},
    authorProfileName:{ type: String}, 
    type:             { type: String, required, default: "artsCraft" },
    title:            { type: String, required },
    description:      { type: String, required },
    video:            { type: String },
    image:            { type: String , default: 'https://firebasestorage.googleapis.com/v0/b/baimimages.appspot.com/o/files%2Fimage%2FLokaWhite_forPosts.png?alt=media&token=006943af-6798-4067-aca2-ce0de5771391'},
    link:             { type: String },
    category:         { type: [String], default: [], enum: ["upcycling", "refashion", "decor", "ceramic", "textile", "drawings", "zero-waste", "other"] },
    tags:             { type: [String], default: [] },
    comments:         { type: [Object], default: [] },
    likes:            { type: [Schema.Types.ObjectId], default: [], ref: "user"  },
  },
  { timestamps: true }
);

artsCraftSchema.pre("remove", async function () {
    const id = this._id.toString()
    console.log("Post is being removed " + id);

    const author = await User.findById(this.author)
    if (author) {
        author.artsCraft = author.artsCraft.filter( x => x.toString() !== id) 
    }

    await Comment.deleteMany({ artsCraft: this._id })
});

const ArtCraft = model("ArtCraft", artsCraftSchema);

export default ArtCraft;
