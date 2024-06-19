export default class ClassDto {
  id;
  name;
  id_profesor;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.id_profesor = model.id_profesor;
  }
}
