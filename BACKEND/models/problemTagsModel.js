import mongoose from "mongoose";

const problemTagsSchema = new mongoose.Schema({
  id_problem: {
    type: Number,
    required: true,
  },
  id_tag: {
    type: Number,
    required: true,
  },
});

// problemTagsSchema.index({ id_problem: 1, id_tag: 1 }, { unique: true });

export const ProblemTags = mongoose.model(
  "ProblemTags",
  problemTagsSchema,
  "problemTags"
);
