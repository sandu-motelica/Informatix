import mongoose, { Schema } from "mongoose";

const ratingSchema = new mongoose.Schema({
  id_problema: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

export const Rating = mongoose.model("Rating", ratingSchema, "ratings");
