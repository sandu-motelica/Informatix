import mongoose, { Schema } from "mongoose";

const problemTagsSchema = new mongoose.Schema({
  id_problem: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_tag: {
    type: Schema.Types.ObjectId,
    ref: "Tag",
    required: true,
  },
});

// problemTagsSchema.index({ id_problem: 1, id_tag: 1 }, { unique: true });

export const ProblemTags = mongoose.model(
  "ProblemTags",
  problemTagsSchema,
  "problemTags"
);
