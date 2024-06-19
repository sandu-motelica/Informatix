import mongoose, { Schema } from "mongoose";

export const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },

  id_author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "easy",
    required: true,
  },
  submissions: {
    type: Number,
    default: 0,
    required: true,
  },
  accepted: {
    type: Number,
    default: 0,
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "pending", "declined"],
    default: "pending",
    required: true,
  },
});

export const Problem = mongoose.model("Problem", problemSchema, "problems");
