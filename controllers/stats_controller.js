var models = require('../models/models.js');
var Sequelize = require('sequelize');

// GET /stats
exports.show = function(req, res, next) {
    var stats = {
            'totalquizes': 0,
            'totalcomments': 0,
            'mediacomments': 0,
            'quizes_concomments': 0,
            'quizes_sincomments': 0
        };
    
   // preguntas totales
    models.Quiz.count().then(function(c){
            stats.totalquizes = parseInt(c);
            // comentarios totales
            models.Comment.count().then(function(c){
                stats.totalcomments = parseInt(c);
                // media de comentarios por pregunta
                if (stats.totalquizes > 0) {
                    stats.mediacomments = Math.floor(stats.totalcomments / stats.totalquizes);
                }
                
                // preguntas con y sin comentarios
                models.Comment.findAll(
                    {
                        attributes: [[Sequelize.literal('DISTINCT `QuizId`'), 'QuizId']]
                        
                    }).then(function(m) {
                        stats.quizes_concomments = parseInt(m.length);
                        stats.quizes_sincomments = stats.totalquizes - stats.quizes_concomments;
                        res.render('stats', {stats: stats, errors: []});
                    }).catch(function(err) { next(err); });        
                }).catch(function(err) { next(err); });
    }).catch(function(err) { next(err); });
    
    
};
