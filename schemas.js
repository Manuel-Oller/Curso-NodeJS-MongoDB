const mongoose = require("mongoose");
const schema = mongoose.Schema;

var schemaInstructure = new mongoose.Schema({
  Nombre: String,
  CantidadCursos: String,
});

module.exports = {
  Instructure: schemaInstructure,
};
