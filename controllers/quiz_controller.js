// Importamos el modelo
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    models.Quiz.findById(quizId).then(
            function(quiz) {
                if (quiz) {
                    req.quiz = quiz;
                    next();
                } else {
                    next(new Error('La pregunta ' + quizId + ' no existe'));
                }
    }).catch(function(error) { next(error);});
};

//GET /quizes
exports.index = function(req, res, next) {
    var objWhere = {};
    objWhere.order = [['pregunta', 'ASC']];
    if ( req.query.search ) {
        var search = req.query.search.replace(/\s/g,"%");
        /*objWhere.where = { 
            pregunta: {like: '%'+search+'%'}
        };*/
        objWhere.where = ["pregunta like ?", '%'+search+'%'];
    }
    models.Quiz.findAll(objWhere).then(function(quizes){
        res.render('quizes/index.ejs', {quizes: quizes});
    }).catch(function(error) { next(error);});
};

//GET /quizes/:id
exports.show = function(req,res) {
    res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
    var r = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        r = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: r});    
};


