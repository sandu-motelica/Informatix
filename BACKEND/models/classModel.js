import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  id_profesor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Clasa = mongoose.model("Clasa", classSchema, "classes");
