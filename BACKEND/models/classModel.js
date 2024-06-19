import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  id_profesor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Class = mongoose.model("Class", classSchema, "classes");
