import mongoose from "mongoose";

const { Schema, model } = mongoose
const required = true
const trim = true
// const unique = true
// const lowercase = true

const addressSchema = new Schema({
    street:  { type: String, trim },
    zip:     { type: Number, trim, required },
    city:    { type: String, trim, required },
    country: { type: String, trim, required },
}, { _id: false })

const eventSchema = Schema({
    profile:      { type: Schema.Types.ObjectId, ref: "user", required },
    type:         { type: String, required, default: "beauty" },
    title:        { type: String, required },
    description:  { type: String, required },
    address:      { type: addressSchema, required },
    video:        { type: String },
    image:        { type: String },
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
}, { timestamps: true })

const Event = model("Event", eventSchema)

export default Event