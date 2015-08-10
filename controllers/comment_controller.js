var models = require('../models/models.js');

//Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
    models.Comment.find( {
        where: { id: Number(commentId) }
    }).then(function(comment) {
        if(comment) {
            req.comment = comment;
            next();
        } else {
            next(new Error('No existe comentario con identificador ' + commentId));
        }
    }).catch(function(error) { next(error); });
};

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
                res.render('comments/new.ejs', {quiz: req.quiz, comment: comment, errors: err.errors});
            } else {
                // guardamos en la bdd
                comment.save().then(function() {
                        //res.redirect('/quizes/' + req.params.quizId);
                        res.redirect('/quizes/' + req.quiz.id);     // Ver Autoload
                        });
            }
        }).catch(function(error){ next(error); });
};

// PUT /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
    req.comment.publicado = true;       // ver autoload para comment
    req.comment.save(
            { fields: ["publicado"] }
            ).then( function() {
                res.redirect('/quizes/' + req.comment.QuizId);
            }).catch(function(error) { next(error); });
};