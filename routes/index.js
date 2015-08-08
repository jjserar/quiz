var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' , errors: []});
});

//Si el parámetro quizId existe en la ruta, invoca autoload
// Autoload - factoriza el código si ruta incluye :quizId
var models = require('../models/models.js');
router.param('quizId', function(req, res, next, quizId) {
    models.Quiz.find({
        where: { id: Number(quizId) },
        include: [{ model: models.Comment }]
        }).then(
            function(quiz) {
                if (quiz) {
                    req.quiz = quiz;
                    next();
                } else {
                    next(new Error('La pregunta ' + quizId + ' no existe'));
                }
        }).catch(function(error) { next(error);});
});

// Rutas de sesión
router.get('/login',                        sessionController.new);     // login
router.post('/login',                       sessionController.create);  // crear sesión
router.delete('/logout',                    sessionController.destroy); // destruir sesión

router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    quizController.edit);
router.put('/quizes/:quizId(\\d+)',         quizController.update);
router.delete('/quizes/:quizId(\\d+)',      quizController.destroy);
router.get('/author', function(req,res) {res.render('author',{errors: []});});

//Formulario de creación o modificación de comentario
router.get('/quizes/:quizId(\\d+)/comments/new',    commentController.new);
//Adición del comentario en la bdd
router.post('/quizes/:quizId(\\d+)/comments/create',       commentController.create);

module.exports = router;
