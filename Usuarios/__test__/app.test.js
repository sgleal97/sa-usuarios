const request = require("../src/app");
let server, agent;

// Se inicia el servidor para comenzar a escuchar peticiones
beforeEach((done) => {
  server = app.listen(3000, (err) => {
    if (err) return done(err);
    agent = request.agent(server); // se obtiene el puerto en el que corre el server
    done();
  });
});
// despues de cada prueba se cierra el servidor iniciado en beforeEach
afterEach((done) => {
  return server && server.close(done);
});
// Server
describe("Pruebas solicitar", function () {
  test("post /jugadores", function (done) {
    request(app)
      .post("/jugadores")
      .set({ "Content-Type": "application/json" })
      .send({
        id: 0,
        nombres: "prueba3",
        apellidos: "prueba3",
        email: "prueba3@gmail.com",
        password: "prueba3",
        administrador: false
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});