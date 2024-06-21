import mongoose, { Schema } from "mongoose";

const homeworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id_class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const Homework = mongoose.model("Homework", homeworkSchema, "homeworks");
