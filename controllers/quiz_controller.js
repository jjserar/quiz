// Importamos el modelo
var models = require('../models/models.js');

//GET /quizes/question
exports.question = function(req,res) {
    //recuperamos preguntas y mostramos la primera
    models.Quiz.findAll().then(function(quiz){
       res.render('quizes/question', {pregunta: quiz[0].pregunta});
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    
    //recuperamos respuestas y comparamos con la primera
    models.Quiz.findAll().then(function(quiz){
       var r = '';
       if (req.query.respuesta === quiz[0].respuesta) {
           r = 'Correcto';
       } else {
           r = 'Incorrecto';
       }
       res.render('quizes/answer', {respuesta: r});
    });
};


