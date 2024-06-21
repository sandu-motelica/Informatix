export default class HomeworkDto {
  id;
  name;
  id_class;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.id_class = model.id_class;
  }
}
