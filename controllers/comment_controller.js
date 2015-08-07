var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
    // quizId se encuentra en la ruta. Se utiliza params
    var quizId = req.params.quizId;
    models.Quiz.findById(quizId).then(
        function(quiz) {
            if (quiz) {
                res.render('comments/new.ejs', {quizid: quizId, errors:[]});
            } else {
                next(new Error('La pregunta ' + quizId + ' no existe'));
            }
        }).catch(function(error) { next(error);});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
    var comment = models.Comment.build(
            { 
                texto: req.body.comment.texto,
                QuizId: req.params.quizId
            });
    comment.validate().then(
        function(err) {
            if (err) {
                res.render('comments/new.ejs', {comment: comment, errors: err.errors});
            } else {
                // guardamos en la bdd
                comment.save().then(function() {
                        res.redirect('/quizes/' + req.params.quizId);
                        });
            }
        }).catch(function(error){ next(error); });
};