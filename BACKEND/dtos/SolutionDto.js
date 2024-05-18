export default class SolutionDto {
  id;
  id_problem;
  id_student;
  content;
  created_time;

  constructor(model) {
    this.id = model._id;
    this.id_problem = model.id_problem;
    this.id_student = model.id_student;
    this.content = model.content;
    this.created_time = model.created_time;
  }
}
