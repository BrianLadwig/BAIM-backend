import mongoose from "mongoose";

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
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
    going:        { type: [Object], default: [] }
}, { timestamps: true })

const Event = model("Event", eventSchema)

export default Event