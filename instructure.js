const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/educacionit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const appSchemas = require("./schemas");
var Instructure = new mongoose.model("Instructure", appSchemas.Instructure);

let createInstructure = (instructure, callback) => {
  console.log(instructure);
  let newInstructure = new Instructure({
    Nombre: instructure.nombre,
    CantidadCursos: instructure.cantidadCursos,
  });

  newInstructure.save(callback);
};

let all = (callback) => {
  Instructure.find(callback).lean().exec(callback);
};

let findById = (id, callback) => {
  Instructure.findOne({ _id: new mongoose.Types.ObjectId(id) })
    .lean()
    .exec(callback);
};

let update = (instructure_data, callback) => {
  Instructure.findOne(
    {
      _id: mongoose.Types.ObjectId(instructure_data.id),
    },
    (err, res_instructure) => {
      console.log(res_instructure);
      (res_instructure.Nombre = instructure_data.nombre),
        (res_instructure.CantidadCursos = instructure_data.cant_cursos);
      res_instructure.save();
    }
  );
};

module.exports = {
  createInstructure: createInstructure,
  all: all,
  findById: findById,
  update: update,
};
