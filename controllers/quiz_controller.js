// Importamos el modelo
var models = require('../models/models.js');

//GET /quizes/:id/answer
exports.answer = function(req, res) {
    models.Quiz.findById(req.params.quizId).then(function(quiz) {
        var r = '';
        if (req.query.respuesta === quiz.respuesta) {
           r = 'Correcto';
        } else {
           r = 'Incorrecto';
        }
        res.render('quizes/answer', {quiz: quiz, respuesta: r});    
    });
};

//GET /quizes/:id
exports.show = function(req,res) {
    models.Quiz.findById(req.params.quizId).then(function(quiz) {
                res.render('quizes/show', {quiz: quiz});
            });
};

//GET /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes});
    });
};