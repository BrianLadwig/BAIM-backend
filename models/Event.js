import mongoose from "mongoose";
import User from "./User.js";
import Comment from "./Comment.js"

const { Schema, model } = mongoose
const required = true
const trim = true
// const unique = true
// const lowercase = true

const lokaImage=lokaImage

const addressSchema = new Schema({
    street:       { type: String, trim, required },
    streetNumber: { type: String, trim, required },
    zip:          { type: Number, trim, required },
    city:         { type: String, trim, required },
    country:      { type: String, trim, required },
}, { _id: false })

const eventSchema = Schema({
    author:             { type: Schema.Types.ObjectId, ref: "user", required },
    authorAvatar:       { type: String},
    authorProfileName:  { type: String},   
    type:               { type: String, required, default: "event" },
    title:              { type: String, required },
    description:        { type: String, required },
    start:              { type: Date,   required }, // "Wed Jun 29 2022 16:59:00 GMT+0200 (Central European Summer Time)"
    end:                { type: Date,   required },
    address:            { type: addressSchema, required },
    video:              { type: String },
    image:              { type: String, default: lokaImage },
    category:           { type: [String], default: [],enum: ["market", "tasting", "workshop", "charity","sit-in","meet-and-greet","fair", "other" ] },
    link:               { type: String },
    tags:               { type: [String], default: [] },
    comments:           { type: [Object], default: [] },
    likes:              { type: [Schema.Types.ObjectId], default: [], ref: "user" },
    attendingUsers:     { type: [Schema.Types.ObjectId], ref: "user" }
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