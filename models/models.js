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
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//Importamos definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Relación entre tablas 1-N (belongsTo, hasMany)
Comment.belongsTo(Quiz);    // parte 1 de la relación
Quiz.hasMany(Comment);      // parte n de la relación

//Exportamos definición de tabla Quiz y de Comment
exports.Quiz = Quiz;
exports.Comment = Comment;

// Creación BDD y opcionalmente inicialización de la tabla Quiz
// sync sincroniza las definiciones del modelo con la BDD
sequelize.sync().then(function(){
   //comprobamos si la tabla está vacía y si lo está añadimos las dos
   //primeras preguntas
   Quiz.count().then(function(count){
      if (count === 0) {
          Quiz.create({
              pregunta: 'Capital de Italia',
              respuesta: 'Roma',
              tema: 'Geografía'
          });
          Quiz.create({
              pregunta: 'Capital de Portugal',
              respuesta: 'Lisboa',
              tema: 'Geografía'
          }).then(function(){
              console.log('BDD inicializada');
          });
      }
   });
    
});
