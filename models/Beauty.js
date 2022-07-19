import mongoose from "mongoose";
import Comment from "./Comment.js";
import User from "./User.js";

const { Schema, model } = mongoose
const required = true
// const trim = true
// const unique = true
// const lowercase = true

const lokaImage='https://firebasestorage.googleapis.com/v0/b/baimimages.appspot.com/o/files%2Fimage%2FLOKA2.jpg?alt=media&token=41828a67-7287-4afb-9ac2-cf21339aa29e'

const beautySchema = Schema({
    author:           { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:     { type: String},
    authorProfileName:{ type: String}, 
    type:             { type: String, required, default: "beauty" },
    title:            { type: String, required },
    description:      { type: String, required },
    video:            { type: String },
    image:            { type: String, default: lokaImage},
    link:             { type: String },
    category:         { type: [String], default: [], enum: ["hygiene","skin", "hair", "face", "anti-aging","makeup","other"] },
    tags:             { type: [String], default: [] },
    comments:         { type: [Object], default: [] },
    likes:            { type: [Schema.Types.ObjectId], default: [], ref: "user" },
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