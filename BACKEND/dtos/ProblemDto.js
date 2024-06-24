export default class ProblemDto {
  id;
  title;
  description;
  id_author;
  difficulty;
  status;
  created_time;

  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.description = model.description;
    this.id_author = model.id_author;
    this.difficulty = model.difficulty;
    this.status = model.status;
    this.created_time = model.created_time;
  }
}
