var _ = require('underscore');
var mysql = require('mysql');
var controleur = /[0-9a-zA-Z\.\_\-]{1,25}/i;
var config= require('./config');
var typesComptes={secretaire:2,formateur:1,condidat:3};
var crypto = require('./Model.crypto');
exports.login = function(request, callback) {
    var result;
    if (controleur.test(request.body.pseudo) && controleur.test(request.body.mdp)) {
        var connection = mysql.createConnection(config.config);
        connection.connect();
        console.log(crypto.encrypt('root'));
        // appeler une procedure.
        //call questionnaire.getCompte('amina', 'amina',@first,@second);
        connection.query("call questionnaire.getCompte('" + request.body.pseudo + "', '" + crypto.encrypt(request.body.mdp) + "');",
            function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    // throw err;
                } else {
                    // console.log(rows[0][0]);
                    result = rows[0][0];
                }
                if (!_.isEmpty(result)) {
                    var condidat = /[0-9]+/i;
                    if (condidat.test(result.type_cpt)) {
                        request.session.pseudo = request.body.pseudo;
                        request.session.id_cpt = result.id_cpt;
                        request.session.type_cpt = result.type_cpt;
                    } else {
                        request.session.pseudo = result.type_cpt;
                        request.session.id_cpt = result.id_cpt;
                        request.session.type_cpt = typesComptes.condidat;
                    }
                    callback.json({
                        data: result,
                        type: request.session.type_cpt,
                        stat: "success"
                    });
                } else {
                    callback.json({
                        data: [],
                        stat: "failed"
                    });
                }
            });
        connection.end();

    } else {
        callback.json({
            data: [],
            stat: "failed"
        });
    }
};

