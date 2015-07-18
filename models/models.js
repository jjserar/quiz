// Construcción de la BDD y su tabla Quiz con sequelize

var path = require('path');

//Cargar ORM
var Sequelize = require('sequelize');

// Definir tipo y nombre de BDD
var sequelize = new Sequelize(null, null, null,
            {dialect: "sqlite", storage: "quiz.sqlite"}
        );

//Importamos definición de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Exportamos definición de tabla Quiz
exports.Quiz = Quiz;

// Creación BDD y opcionalmente inicialización de la tabla Quiz
// sync sincroniza las definiciones del modelo con la BDD
// (utilizamos la forma obsoleta de manejo de callbacks en sequelize con
// success. En la actualidad se utilizan promises)
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
