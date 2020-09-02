const mongo = require("mongodb");
const nodemon = require("nodemon");
const mongo_client = mongo.MongoClient;
const object_id = mongo.ObjectId;

let alumnos_colection;
let db;

mongo_client.connect(
  "mongodb://localhost:27017",
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.log("The connection with MongoDB fail whit the error: " + err);
    } else {
      db = client.db("educacionit");
      alumnos_colection = db.collection("Alumnos");
    }
  }
);

let save = (nombre, callback) => {
  let alumno_data = {
    Nombre: nombre,
  };

  alumnos_colection.insertOne(alumno_data, (err, data) => {
    callback(err);
  });
};

let update = (alumno_data, callback) => {
  console.log(alumno_data);
  alumnos_colection.updateOne(
    { _id: new object_id(alumno_data.id) },
    { $set: { Nombre: alumno_data.nombre } },
    callback
  );
};

let findById = (id, callback) => {
  alumnos_colection.findOne({ _id: new object_id(id) }, callback);
};

let all = (callback) => {
  alumnos_colection.find().toArray(callback);
};

module.exports = {
  save: save,
  update: update,
  all: all,
  findById,
};
