/*
 * User: C.wail
 * Date: 2015-01-21
 * Time: 20:58:24
 * Contact: kawael09@gmail.com
 */
var _ = require('underscore');
var dateFormat = require('dateformat');
var mysql = require('mysql');
var controleur = /[0-9a-zA-Z\.\_\-]{1,25}/i;
var config = require('./config');
var passer = require('./Model.passer');
var typesComptes = {
    secretaire: 2,
    formateur: 1,
    condidat: 3
};
var crypto = require('./Model.crypto');
var dataOld = [];
var _this = this;
/**
 * [ajouter un condidat (reponse en fin d'ajout)]
 */
exports.ajouter = function(request, callback) {
    var connection = mysql.createConnection(config.config);
    connection.connect();
    var data = {},
        dataRows = {};

    if (!_.isUndefined(request.body.data)) {
        dataRows = JSON.parse(request.body.data);
    } else {
        data = request.body;
    }
    if (!_.isEmpty(dataRows)) {
        _(dataRows).each(function(row) {
            // console.log(row);
            add_cdd(request.session.id_cpt, row, callback, connection);
        });
    } else {
        data.id_cdd = -1;
        add_cdd(request.session.id_cpt, data, callback, connection);
    }
    // appeler une procedure.
    //call questionnaire.getCompte('amina', 'amina',@first,@second);

    connection.end();
};
/**
 * [add_cdd ajouter un nouveau condidat à la BD]
 */
function add_cdd(compte, data, callback, connection) {
    connection.query("call questionnaire.ajout_condidat('" + compte + "','" + data.id_cdd + "','" + crypto.encrypt(data.mdp_cdd) + "', '" + data.nom_cdd + "','" + data.prenom_cdd + "','" + data.email_cdd + "','" + data.tel_cdd + "');",
        function(err, rows, fields) {
            if (err) {
                console.dir(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    callback.json({
                        description: "Email ou Telephone déja existant.",
                        stat: "fail",
                        error: err
                    });
                } else if (err.code === 'ER_DATA_TOO_LONG') {
                    callback.json({
                        description: "Mot de passe Trop Long.",
                        stat: "fail",
                        error: err
                    });
                } else {
                    callback.json({
                        description: "problème de DB.",
                        stat: "fail",
                        error: err
                    });
                }
                // throw err;
            } else {
                callback.json({
                    description: "condidat ajouté avec succé.",
                    stat: "success"
                });
            }

        });
}
/**
 * [list description]
 * @param  {[object]} response [envoyer la page avec la liste des condidats]
 */
exports.list = function(response, page) {
    var connection = mysql.createConnection(config.config);
    connection.connect();
    // appeler une procedure getListCDD
    connection.query("call questionnaire.getListCDD();",
        function(err, rows, fields) {
            if (err) {
                console.dir(err.code);
                response.json({
                    description: "problème de DB.",
                    stat: "fail",
                    error: err
                });
                // throw err;
            } else {
                var data = [];
                _(rows[0]).each(function(element, index) {
                    data[index] = {};
                    _(element).map(function(value, key) {
                        if (key === 'mdp_cdd') {
                            data[index][key] = crypto.decrypt(value);
                        } else {
                            data[index][key] = value;
                        }
                    });
                });
                dataOld = data;
                if (page === 'body/secretaire/affect_condidat') {
                    connection.query("SELECT * FROM questionnaire;",
                        function(err, rows, fields) {
                            if (err) {
                                console.dir(err.code);
                                // throw err;
                            } else {
                                var questData = [];
                                _(rows).each(function(row, i) {
                                    questData[i] = {};
                                    _(row).each(function(valeur, key) {
                                        if (key === 'date_quest') {
                                            questData[i][key] = dateFormat(valeur, "dd-mm-yyyy");
                                        } else {
                                            questData[i][key] = valeur;
                                        }
                                    });
                                });
                                response.render(page, {
                                    one_cdd: false,
                                    dataQuest: JSON.stringify(questData),
                                    data: JSON.stringify(data),
                                    title: "Secretaire"
                                });
                            }
                        });
                } else {
                    response.render(page, {
                        data: JSON.stringify(data),
                        title: "Secretaire"
                    });
                }

            }

        });
    setTimeout(function() {
        connection.end();
    }, 5000);
};

/**
 * [majListe description]
 * @param  {[object]} req [requete contenant les lignes a mettre a jour]
 * @param  {[object]} res [reponse en fin de maj]
 */
exports.majListe = function(req, res) {
    var colonnes = ['id_cdd', 'mdp_cdd', 'nom_cdd', 'prenom_cdd', 'email_cdd', 'tel_cdd'];

    // console.log(JSON.parse(req.body.data));
    var changes = JSON.parse(req.body.arr);
    var dataNew = [];
    _(changes).each(function(element, inc) {
        if (colonnes[element[1]] === 'mdp_cdd') {
            dataNew[inc] = {
                id: dataOld[element[0]].id_cdd,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: crypto.encrypt(element[3])
            };
        } else {
            dataNew[inc] = {
                id: dataOld[element[0]].id_cdd,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: element[3]
            };
        }
    });
    if (!_.isEmpty(JSON.parse(req.body.data))) {
        console.log('adding new condidat...');
        _this.ajouter(req, res);
    }
    var connection = mysql.createConnection(config.config);
    if (!_.isEmpty(JSON.parse(req.body.arr))) {
        var message = "",
            error = "",
            query;

        connection.connect();
        for (var i = 0; i < dataNew.length; i++) {
            query = "";
            if (dataNew[i].col !== 'id_cdd') {
                query = "'-1'," + "NULL,".repeat(colonnes.indexOf(dataNew[i].col)) + "'" + dataNew[i].newVal + "'" + ", NULL ".repeat(colonnes.length - colonnes.indexOf(dataNew[i].col));
            } else {
                query = "NULL,".repeat(colonnes.indexOf(dataNew[i].col)) + "'" + dataNew[i].newVal + "'" + ", NULL ".repeat(colonnes.length - colonnes.indexOf(dataNew[i].col));
            }
            // console.log(query);
            connection.query("call questionnaire.updateCondidat('" + dataNew[i].id + "'," + query + ");",
                function(err, rows, fields) {
                    if (err) {
                        console.dir(err);
                        error = err;
                        message = "fail";
                        // throw err;
                    } else {
                        // console.log(rows);
                        message = "success";

                    }
                });
        }
        connection.end();

        // set Interval here.
        var waiting = setInterval(function() {
            if (message !== "") {
                clearInterval(waiting);
                res.json({
                    error: error,
                    stat: message
                });
            }
        }, 200);
    }
    if (!_.isEmpty(JSON.parse(req.body.del))) {
        delete_cdd(connection, JSON.parse(req.body.del), res);
    }
};
/**
 * [delete_cdd description]
 * @param  {[object]} con      [la connection a la base de données MYSQL]
 * @param  {[array]} delData  [les lignes à supprimer de la BD]
 * @param  {[objevt]} response [reponse en fin de supression]
 */
var delete_cdd = function(con, delData, response) {
    console.log('deleting condidat...');
    con.connect();
    var message = "",
        error = "";
    for (var i = 0; i < delData.length; i++) {
        con.query("DELETE FROM condidat WHERE id_cdd = " + delData[i][0] + ";",
            function(err, rows, fields) {
                if (err) {
                    console.dir(err);
                    error = err;
                    message = "fail";
                    // throw err;
                } else {
                    // console.log(rows);
                    message = "success";
                }
            });
    }
    con.end();

    // set Interval here.
    var waiting = setInterval(function() {
        if (message !== "") {
            clearInterval(waiting);
            response.json({
                error: error,
                stat: message
            });
        }
    }, 200);
};
/**
 * [repeat description]
 * @param  {[number]} n [nombre de repetition]
 * @return {[string]}   [la chaine repetée n fois]
 */
String.prototype.repeat = function(n) {
    n = n || 1;
    return Array(n).join(this);
};
/**
 * [affect description]
 * @param  {[object]} req [la requete]
 * @param  {[object]} res [la reponse]
 * @return {[page]}     [retourne la page des affectations.]
 */
exports.affect = function(req, res) {
    if (!_.isEmpty(req.params[0])) {
        // console.log(req.params[0]);
        var connection = mysql.createConnection(config.config);
        connection.connect();
        connection.query("SELECT * FROM condidat WHERE id_cdd = " + req.params[0] + ";",
            function(err, rows, fields) {
                if (err) {
                    console.dir(err);
                    // throw err;
                } else {
                    // console.log(rows);
                    // message = "success";
                    connection.query("SELECT * FROM questionnaire;",
                        function(err2, rowsQuest, fields2) {
                            if (err2) {
                                console.dir(err2);
                                // throw err;
                            } else {
                                connection.end();
                                var questData = [];
                                _(rowsQuest).each(function(row, i) {
                                    questData[i] = {};
                                    _(row).each(function(valeur, key) {
                                        if (key === 'date_quest') {
                                            questData[i][key] = dateFormat(valeur, "dd-mm-yyyy");
                                        } else {
                                            questData[i][key] = valeur;
                                        }
                                    });
                                });
                                res.render('body/secretaire/affect_condidat', {
                                    nom_condidat: rows[0].nom_cdd,
                                    prenom_condidat: rows[0].prenom_cdd,
                                    id_condidat: rows[0].id_cdd,
                                    one_cdd: true,
                                    dataQuest: JSON.stringify(questData),
                                    title: "Secretaire",
                                    pseudo: req.session.pseudo,
                                    type_cpt: req.session.first_cpt,
                                    id_cpt: req.session.second_cpt
                                });
                            }
                        });
                }
            });
    } else {
        _this.list(res, 'body/secretaire/affect_condidat');
    }
};

exports.add_affect = function(requete, reponse) {
    var data = JSON.parse(requete.body.data);
    var connection = mysql.createConnection(config.config);
    connection.connect();
    var nbreRows = data.length,
        compteurRows = 0,
        message = "",
        etat = "";
    _(data).each(function(row) {
        connection.query("INSERT INTO `questionnaire`.`passer` (`id_cdd_pass`, `id_quest_pass`,`resultat`,`date_pass`) VALUES ('" + row.id_cdd_pass + "', '" + row.id_quest_pass + "', NULL,'" + row.date_pass + "');",
            function(err, rows, fields) {
                if (err) {
                    console.dir(err);
                    error = err;
                    message = "erreur: " + config.errors[err.code];
                    etat = "fail";
                    // throw err;
                } else {
                    compteurRows++;
                    // console.log(rows);
                    message = "affectation effectué avec succé";
                    etat = "success";

                }
            });
    });
    var waitMessage = setInterval(function() {
        if (compteurRows === nbreRows || etat === "fail") {
            clearInterval(waitMessage);
            connection.end();
            reponse.json({
                message: message,
                stat: etat
            });
        }
    }, 200);
};

exports.to_quest = function(requete, reponse) {
    var connection = mysql.createConnection(config.config);
    connection.connect();
    var err = "",
        message = "";
    connection.query("SELECT * FROM passer p WHERE" +
        " p.id_cdd_pass='" + requete.session.id_cpt + "' AND activer_pass=1;",
        function(err, rows, fields) {
            if (err) {
                console.dir(err);
                error = err;
                message = "erreur: " + config.errors[err.code];
                etat = "fail";
                // throw err;
            } else {
                var Data = [];
                _(rows).each(function(row, i) {
                    Data[i] = {};
                    _(row).each(function(valeur, key) {
                        if (key === 'date_pass') {
                            Data[i][key] = dateFormat(valeur, "dd/mmmm/yyyy");
                        } else {
                            Data[i][key] = valeur;
                        }
                    });
                });
                // console.log(rows);
                message = "affectation effectué avec succé";
                etat = "success";
                reponse.render('body/condidat/to_quest', {
                    title: "Condidat",
                    quests: Data,
                    pseudo: requete.session.pseudo,
                    id_cpt: requete.session.id_cpt,
                    type_cpt: requete.session.type_cpt
                });

            }
        });
    connection.end();
};
exports.to_quiz = function(requete, reponse) {
    var isNumber = /[0-9]{1,10}/i;
    if (isNumber.test(requete.params.quest)) {
        var connection = mysql.createConnection(config.config);
        connection.connect();
        connection.query("SELECT quest.id_quest,quest.temps_quest,quest.niveau_quest,c.nom_cdd,c.prenom_cdd,q.id_q,q.description_q,q.type_q,rp.id_rep,rp.description_rep,a.bon_rep" +
            " FROM condidat c,passer p,questionnaire quest,contient co,question q, avoir a,reponse rp " +
            " WHERE c.id_cdd = p.id_cdd_pass AND quest.id_quest = p.id_quest_pass AND quest.id_quest=co.id_quest AND " +
            " co.id_q = q.id_q AND q.id_q=a.id_q AND rp.id_rep= a.id_rep AND " +
            "p.id_quest_pass = '" + requete.params.quest + "' AND p.id_cdd_pass='" +
            requete.session.id_cpt + "' AND p.activer_pass=1;",
            function(err, rows, fields) {
                if (err) {
                    console.dir(err);
                    reponse.redirect('/condidat/');
                    // throw err;
                } else {
                    var data = {};
                    data['id_quest'] = rows[0].id_quest;
                    data['temps_quest'] = rows[0].temps_quest;
                    data['niveau_quest'] = rows[0].niveau_quest;
                    data['nom_quest'] = rows[0].nom_quest;
                    data['nom_cdd'] = rows[0].nom_cdd;
                    data['prenom_cdd'] = rows[0].prenom_cdd;
                    var questions = _(rows).groupBy(function(el) {
                        return el.id_q;
                    });
                    var i = 0;
                    var j = 0;
                    data['questions'] = [];
                    _(questions).each(function(question, indice) {
                        data['questions'][i] = {};
                        data['questions'][i]['id_q'] = indice;
                        data['questions'][i]['descr_q'] = _(question).pluck('description_q')[0];
                        data['questions'][i]['type_q'] = _(question).pluck('type_q')[0];
                        data['questions'][i]['reponses'] = [];
                        j = 0;
                        _(question).each(function(element, key) {
                            data['questions'][i]['reponses'][j] = {};
                            data['questions'][i]['reponses'][j]['id_rep'] = element.id_rep;
                            data['questions'][i]['reponses'][j]['desc_rep'] = element.description_rep;
                            data['questions'][i]['reponses'][j]['bon_rep'] = element.bon_rep;
                            j++;
                        });
                        i++;
                    });
                    delete questions;
                    delete j;
                    delete i;

                    reponse.render('body/condidat/panel_quiz', {
                        title: "Condidat",
                        quests: JSON.stringify(data),
                        pseudo: requete.session.pseudo,
                        type_cpt: requete.session.type_cpt
                    });

                }
            });
        connection.end();
    }
};