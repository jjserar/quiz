// Para simplificar, definimos varios usuarios aquí almacenados en un objeto
// En entornos reales, se almacenarán en BDD

var users = {
    admin: {
        id:1,
        username:'administrador',
        pwd:'1234'
    },
    pepe: {
        id:2,
        username:'pepepótamo',
        pwd:'5678'
    }
};

// Comprueba la existencia de un usuario
exports.autenticar = function(login, pwd, callback) {
    if (users[login]) {
        if ( pwd === users[login].pwd ) {
            callback(null, users[login]);
        } else {
            callback(new Error('Usuario o contraseña erróneos'));
        }
    } else {
        callback(new Error('Usuario o contraseña erróneos'));
    }
};