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
  time_limit: {
    type: Date,
  },
});

export const Homework = mongoose.model("Homework", homeworkSchema, "homeworks");
