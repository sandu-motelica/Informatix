export default class ProblemDto {
  id;
  title;
  description;
  id_author;
  dificulty;

  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.description = model.description;
    this.id_author = model.id_author;
    this.dificulty = model.dificulty;
  }
}
