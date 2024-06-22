export default class SolutionDto {
  id;
  id_problem;
  id_student;
  id_homework;
  content;
  grade;
  created_time;

  constructor(model) {
    this.id = model._id;
    this.id_problem = model.id_problem;
    this.id_student = model.id_student;
    this.content = model.content;
    this.grade = model.grade;
    this.id_homework = model.id_homework;
    this.created_time = model.created_time;
  }
}
