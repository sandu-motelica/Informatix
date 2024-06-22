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
  id_homework: {
    type: Schema.Types.ObjectId,
    ref: "Homework",
    required: false,
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
solutionSchema.index(
  { id_problem: 1, id_student: 1, id_homework: 1 },
  { unique: true, sparse: true }
);

export const Solution = mongoose.model("Solution", solutionSchema, "solutions");
