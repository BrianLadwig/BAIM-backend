import mongoose from "mongoose";
import Comment from "./Comment.js";
import User from "./User.js";

const { Schema, model } = mongoose
const required = true
// const trim = true
// const unique = true
// const lowercase = true

const beautySchema = Schema({
    author:       { type: Schema.Types.ObjectId, ref: "user", required },
    type:         { type: String, required, default: "beauty" },
    title:        { type: String, required },
    description:  { type: String, required },
    video:        { type: String },
    image:        { type: String },
    link:         { type: String },
    category:     { type: [String], default: [], enum: ["skin", "hair", "face", "anti aging","make up","other"] },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
}, { timestamps: true })

beautySchema.pre("remove", async function () {
    const id = this._id.toString()
    console.log("Post is being removed " + id);

    const author = await User.findById(this.author)
    if (author) {
        author.beauty = author.beauty.filter( x => x.toString() !== id)
        await author.save()
    }

    await Comment.deleteMany({ beauty: this._id })
});

const Beauty = model("Beauty", beautySchema)

export default Beauty