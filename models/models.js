// Construcción de la BDD y su tabla Quiz con sequelize

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name     = (url[6] || null);
var user        = (url[2] || null);
var pwd         = (url[3] || null);
var protocol    = (url[1] || null);
var dialect     = (url[1] || null);
var port        = (url[5] || null);
var host        = (url[4] || null);
var storage     = process.env.DATABASE_STORAGE;

//Cargar ORM
var Sequelize = require('sequelize');

// Definir tipo y nombre de BDD
var sequelize = new Sequelize(DB_name, user, pwd, {
                    dialect:    dialect,
                    protocol:   protocol,
                    port:       port,
                    host:       host,
                    storage:    storage,    // solo SQLite (.env)
                    omitNull:   true        // solo Postgres
});

//Importamos definición de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Exportamos definición de tabla Quiz
exports.Quiz = Quiz;

// Creación BDD y opcionalmente inicialización de la tabla Quiz
// sync sincroniza las definiciones del modelo con la BDD
sequelize.sync().then(function(){
   //comprobamos si la tabla está vacía y si lo está añadimos las dos
   //primeras preguntas
   Quiz.count().then(function(count){
      if (count === 0) {
          Quiz.create({
              pregunta: 'Capital de Italia',
              respuesta: 'Roma'
          }).then(function(){
              console.log('BDD inicializada');
          });
      }
   });
    
});
