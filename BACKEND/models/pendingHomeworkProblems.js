import mongoose, { Schema } from "mongoose";

const pendingHomeworkProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  id_problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const PendingHomeworkProblem = mongoose.model(
  "PendingHomeworkProblem",
  pendingHomeworkProblemSchema,
  "pendingHomeworkProblems"
);
