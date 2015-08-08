var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
    // El autoload de rutas nos garantiza que el id existe
    res.render('comments/new.ejs', {quiz: req.quiz, errors:[]});
};

// POST /quizes/:quizId/comments/create
exports.create = function(req, res) {
    var comment = models.Comment.build(
            { 
                texto: req.body.comment.texto,
                //QuizId: req.params.quizId
                QuizId: req.quiz.id     // Ver Autoload
            });
    comment.validate().then(
        function(err) {
            if (err) {
                res.render('comments/new.ejs', {comment: comment, errors: err.errors});
            } else {
                // guardamos en la bdd
                comment.save().then(function() {
                        //res.redirect('/quizes/' + req.params.quizId);
                        res.redirect('/quizes/' + req.quiz.id);     // Ver Autoload
                        });
            }
        }).catch(function(error){ next(error); });
};