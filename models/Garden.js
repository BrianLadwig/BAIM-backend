import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose
const required = true
// const trim = true
// const unique = true
// const lowercase = true

const gardenSchema = Schema({
    author:       { type: Schema.Types.ObjectId, ref: "user", required },
    type:         { type: String, required, default: "garden" },
    title:        { type: String, required },
    description:  { type: String, required },
    video:        { type: String },
    image:        { type: String },
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
}, { timestamps: true })

gardenSchema.pre("remove", async function () {
    const id = this._id.toString()
    console.log("Post is being removed " + id);

    const author = await User.findById(this.author)
    if (author) {
        author.garden = author.garden.filter( x => x.toString() !== id)
        await author.save()
    }

    await Comment.deleteMany({ garden: this._id })
});

const Garden = model("Garden", gardenSchema)

export default Garden