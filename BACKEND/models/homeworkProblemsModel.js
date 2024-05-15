import mongoose, { Schema } from "mongoose";

const homeworkProblemsSchema = new mongoose.Schema({
  id_homework: {
    type: Schema.Types.ObjectId,
    ref: "Homework",
    required: true,
  },
  id_problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
});

export const HomeworkProblems = mongoose.model(
  "HomeworkProblems",
  homeworkProblemsSchema,
  "homework_problems"
);
