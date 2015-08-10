// Middleware de verificación de login
exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// GET /login (formulario de inicio de sesión)
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};
    
    res.render('sessions/new', {errors: errors});
};
// POST /login
exports.create = function(req, res) {
    var login = req.body.login;
    var pwd = req.body.pwd;
    
    // invocamos al controlador de usuarios
    // Verificamos que el usuario existe
    var userController = require('./user_controller');
    userController.autenticar(login, pwd, function(error, user){
        if (error) {
            req.session.errors = [
                {'message': 'Se ha producido un error: ' + error}
            ];
            res.redirect('/login');
            return;
        }
        // generamos información de sesión
        // la sesión se definirá por la existencia de req.session.user
        req.session.user = {
            id: user,
            username: user.username
        };
        // redireccionamos a la página en la que se encontraba el usuario
        res.redirect(req.session.redir.toString());
    });
};
// DELETE /logout
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};