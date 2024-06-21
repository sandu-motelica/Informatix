import mongoose, { Schema } from "mongoose";

const ratingSchema = new mongoose.Schema({
  id_problema: {
    type: Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    required: true,
  },
});

ratingSchema.index({ id_problema: 1, id_user: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema, "ratings");
