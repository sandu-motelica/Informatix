import mongoose, { Schema } from "mongoose";

const classStudentsSchema = new mongoose.Schema({
  id_class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  id_student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ClassStudents = mongoose.model(
  "ClassStudents",
  classStudentsSchema,
  "class_students"
);
