const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const alumno = require("./alumno");
const instructure = require("./instructure");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app
  .route("/crear-alumno")
  .get((req, res) => {
    res.render("form-alumno", {
      title: "Crear alumno",
    });
  })
  .post((req, res) => {
    alumno.save(req.body.nombre, (err) => {
      if (err) {
        res.send("The method save fail with the error: " + err);
      } else {
        res.send("The data was saved successfuly");
      }
    });
  });

app.get("/list-alumnos", (req, res) => {
  alumno.all((err, data) => {
    if (err) {
      res.send("The all method fail with the error: " + err);
    } else {
      res.render("list-alumnos", {
        list_alumnos: data,
      });
    }
  });
});

app
  .route("/editar-alumno")
  .get((req, res) => {
    alumno.findById(req.query.id, (err, data) => {
      if (err) {
        res.send("The method findById fail with the error: " + err);
      } else {
        res.render("form-alumno", {
          data: data,
          title: "Editar alumno",
        });
      }
    });
  })
  .post((req, res) => {
    var alumno_data = {
      id: req.query.id,
      nombre: req.body.nombre,
    };

    alumno.update(alumno_data, (err, data) => {
      if (err) {
        res.send("The method update fail with the error: " + err);
      } else {
        res.redirect("/list-alumnos");
      }
    });
  });

app
  .route("/crear-instructor")
  .get((req, res) => {
    res.render("form-instructure", {
      title: "Crear instructor",
    });
  })
  .post((req, res) => {
    console.log(req.body);
    var instructure_data = {
      nombre: req.body.nombre,
      cantidadCursos: req.body.cursos,
    };
    instructure.createInstructure(instructure_data, (err, data) => {
      if (err) {
        res.send("The metod createInstructure fail with the error: " + err);
      } else {
        res.render("list-instructures", {
          list_instructures: data,
        });
      }
    });
  });

app.get("/list-instructures", (req, res) => {
  instructure.all((err, data) => {
    if (err) {
      res.send("The all method fail with the error: " + err);
    } else {
      res.render("list-instructures", {
        list_instructures: data,
      });
    }
  });
});

app
  .route("/editar-instructure")
  .get((req, res) => {
    instructure.findById(req.query.id, (err, data) => {
      if (err) {
        res.send("The method findById fail with the error: " + err);
      } else {
        res.render("form-instructure", {
          data: data,
          title: "Editar instructor",
        });
      }
    });
  })
  .post((req, res) => {
    var instructure_data = {
      id: req.query.id,
      nombre: req.body.nombre,
      cant_cursos: req.body.cursos,
    };
    instructure.update(instructure_data, (err, data) => {
      if (err) {
        res.send("The method update fail with the error: " + err);
      } else {
        res.redirect("/list-instructures");
      }
    });
  });

app.get("/chat", (req, res) => {
  res.render("chat");
});

let server = app.listen(8080, () => {
  console.log("Server started successfuly on por 8080");
});

let io = require("socket.io");
let server_io = io(server);

let clients_connected = [];

server_io.on("connection", (socket) => {
  console.log("A user connected");
  clients_connected.push(socket);
  socket.emit("welcome", "Welcome to the chat!");
  socket.on("disconnect", () => {
    //Lógica de remover cliente del array
    console.log("User disconnected");
  });

  socket.on("chat message", (message) => {
    console.log("Message recived: " + message);
    server_io.emit("chat message", message);
  });
});
