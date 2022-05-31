import mongoose from "mongoose";

const { Schema, model } = mongoose
const required = true
// const trim = true
// const unique = true
// const lowercase = true

const diySchema = Schema({
    author:       { type: Schema.Types.ObjectId, ref: "user", required },
    type:         { type: String, required, default: "diy" },
    title:        { type: String, required },
    description:  { type: String, required },
    video:        { type: String },
    image:        { type: String },
    link:         { type: String },
    tags:         { type: [String], default: [] },
    comments:     { type: [Object], default: [] },
    likes:        { type: [String], default: [] },
}, { timestamps: true })

const Diy = model("Diy", diySchema)

export default Diy