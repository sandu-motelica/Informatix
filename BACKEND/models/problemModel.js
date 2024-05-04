import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
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
    type: Number,
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
});

export const Problem = mongoose.model("Problem", problemSchema, "problems");
