// Importamos el modelo
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
/*exports.load = function(req, res, next, quizId) {
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
};
*/
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
        res.render('quizes/index.ejs', {quizes: quizes, errors: []});
    }).catch(function(error) { next(error);});
};

//GET /quizes/:id
exports.show = function(req,res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
    var r = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        r = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz, respuesta: r, errors: []});    
};

//GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build(
            {pregunta: "Pregunta", respuesta: "Respuesta"}
            );
    res.render('quizes/new', {quiz:quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  
  quiz.validate().then(
    function(err) {
        if(err) {
            //err.errors matriz de errores
            res.render('quizes/new', {quiz: quiz, errors: err.errors});
        } else {
           //guardar en la BDD los campos pregunta, respuesta y tema de Quiz
            //(limitamos el guardado únicamente a esos tres campos)
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
                res.redirect('/quizes');  //redirección a lista de preguntas
            }); 
        }
    }
  );
 };
 
 //GET /quizes/:id/edit
 exports.edit = function(req, res) {
     var quiz = req.quiz;       //ver autoload
     res.render('quizes/edit', {quiz: quiz, errors: []});
 };
 
 //PUT /quizes/:id/update
 exports.update = function(req, res) {
     var quiz = req.quiz;       //ver autoload
     
     quiz.pregunta = req.body.quiz.pregunta;
     quiz.respuesta = req.body.quiz.respuesta;
     quiz.tema = req.body.quiz.tema;
     
     quiz.validate().then(
        function(err) {
        if(err) {
            //err.errors matriz de errores
            res.render('quizes/edit', {quiz: quiz, errors: err.errors});
        } else {
            quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function() {
                res.redirect('/quizes');  //redirección a lista de preguntas
            }); 
        }
    }
  );
 };
 
 //DELETE /quizes/:id
 exports.destroy = function(req, res, next) {
     var quiz = req.quiz;       //ver autoload
     
     quiz.destroy().then(function() {
         res.redirect('/quizes');
     }).catch(function(error){ next(error); });
 };

