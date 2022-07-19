import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose;
const required = true;
// const trim = true
// const unique = true
// const lowercase = true

const lokaImage='https://firebasestorage.googleapis.com/v0/b/baimimages.appspot.com/o/files%2Fimage%2FLOKA2.jpg?alt=media&token=41828a67-7287-4afb-9ac2-cf21339aa29e'

const artsCraftSchema = Schema(
  {
    author:           { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:     { type: String},
    authorProfileName:{ type: String}, 
    type:             { type: String, required, default: "artsCraft" },
    title:            { type: String, required },
    description:      { type: String, required },
    video:            { type: String },
    image:            { type: String, default: lokaImage},
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
