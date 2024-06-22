import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  id_problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const Comment = mongoose.model("Comment", commentSchema, "comments");
