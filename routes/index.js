var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statsController = require('../controllers/stats_controller');

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

// Autoload para parámetro commentId
router.param('commentId',                   commentController.load);

// Rutas de sesión
router.get('/login',                        sessionController.new);     // login
router.post('/login',                       sessionController.create);  // crear sesión
router.delete('/logout',                    sessionController.destroy); // destruir sesión

router.get('/quizes',                       quizController.index);
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
// Composición de Middlewares. En este caso para garantizar que el usuario
// esté autenticado antes de permitirle realizar las acciones siguientes
router.get('/quizes/new',                   sessionController.loginRequired, quizController.new);
router.post('/quizes/create',               sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',    sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',         sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',      sessionController.loginRequired, quizController.destroy);
router.get('/author', function(req,res) {res.render('author',{errors: []});});

//Formulario de creación o modificación de comentario
router.get('/quizes/:quizId(\\d+)/comments/new',        commentController.new);
//Adición del comentario en la bdd
router.post('/quizes/:quizId(\\d+)/comments/create',    commentController.create);
//Publicar comentario (modificar campo publicado)
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
                                            sessionController.loginRequired, 
                                            commentController.publish);


//Estadisticas
router.get('/stats',                        sessionController.loginRequired, statsController.show);

module.exports = router;
