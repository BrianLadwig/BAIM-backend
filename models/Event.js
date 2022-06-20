import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose
const required = true
const trim = true
// const unique = true
// const lowercase = true

const addressSchema = new Schema({
    street:       { type: String, trim, required },
    streetNumber: { type: String, trim, required },
    zip:          { type: Number, trim, required },
    city:         { type: String, trim, required },
    country:      { type: String, trim, required },
}, { _id: false })

const eventSchema = Schema({
    author:       { type: Schema.Types.ObjectId, ref: "user", required },
    type:         { type: String, required, default: "event" },
    title:        { type: String, required },
    description:  { type: String, required },
    startDate:    { type: Date,   required }, // "yyyy-mm-dd"
    startTime:    { type: String, required },
    endDate:      { type: Date,   required },
    endTime:      { type: String, required },
    address:      { type: addressSchema, required },
    video:        { type: String },
    image:        { type: String },
    category:     { type: [String], default: [],enum: ["markt", "tasting", "workshop", "soli","sit in","meet and greet","fair", "other" ] },
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
    going:        { type: [Object], default: [] }
}, { timestamps: true })


eventSchema.pre("remove", async function () {
    const id = this._id.toString()
    console.log("Post is being removed " + id);

    const author = await User.findById(this.author)
    if (author) {
        author.event = author.event.filter( x => x.toString() !== id)
        await author.save()
    }

    await Comment.deleteMany({ event: this._id })
});

const Event = model("Event", eventSchema)

export default Event