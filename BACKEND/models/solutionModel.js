import mongoose, { Schema } from "mongoose";

export const solutionSchema = new mongoose.Schema({
  id_problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  evaluated: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: Number,
    default: 0,
  },
  created_time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const Solution = mongoose.model("Solution", solutionSchema, "solutions");
