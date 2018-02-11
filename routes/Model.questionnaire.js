/**
 * [ gestion des questionnaire]
 */
var dateFormat = require('dateformat');
var _ = require('underscore');
var mysql = require('mysql');
var controleur = /[0-9a-zA-Z\.\_\-]{1,25}/i;
var config = require('./config');
var typesComptes = {
    secretaire: 2,
    formateur: 1,
    condidat: 3
};
var result_add = "";
var dataOld;
exports.ajouter = function(requete, reponse) {
    var connection = mysql.createConnection(config.config);
    // connection.connect();
    var brutData = requete.body;
    var insQues = {
        id_quest: -1,
        nom_quest: brutData.nom_quest,
        temps_quest: brutData.duree_quest,
        niveau_quest: brutData.niveau_quest,
        toPrint: function() {
            return "'" + this.id_quest + "','" + this.nom_quest + "','" + this.temps_quest + "','" + this.niveau_quest + "'";
        }
    };
    var questions = [];
    var tmpRep;
    // filtrer les questions.
    _(brutData).each(function(valeur, index) {
        if (index.search('question') !== -1) {
            questions[parseInt(index.split('question')[1]) - 1] = {};
            questions[parseInt(index.split('question')[1]) - 1].reponse = [];
            questions[parseInt(index.split('question')[1]) - 1].description_q = valeur;
        } else if (index.search('type_quest') !== -1) {
            questions[parseInt(index.split('type_quest')[1]) - 1].type_q = valeur;
        } else if (index.search('rep') !== -1) {
            tmpRep = parseInt(index.split('_rep')[0].split('quest')[1]) - 1;
            if (index.search('bon') === -1) {
                questions[tmpRep].reponse[parseInt(index.split('_rep')[1])] = {};
                questions[tmpRep].reponse[parseInt(index.split('_rep')[1])].descr_rep = valeur;
            } else {
                questions[tmpRep].reponse[parseInt(index.split('_bon')[0].split('_rep')[1])].bon_rep = valeur;
            }

        }
    });
    // questions.shift();
    //filtrer les reponses.
    add_questionnaire(connection, insQues.toPrint(), questions, reponse);

};


var add_questionnaire = function(connecte, data, questions, reponse) {
    connecte.connect();
    var nbreElement = questions.length + 1;
    _(questions).each(function(element) {
        nbreElement += element.reponse.length;
    });
    var compteurElement = 0;
    connecte.query("call questionnaire.ajout_questio(" + data + ");",
        function(err, rows, fields) {
            if (err) {
                console.log(err);
                error = err;
                result_add = "fail";
                // throw err;
            } else {
                compteurElement++;
                _(questions).each(function(element) {
                    connecte.query("call questionnaire.ajout_question('" + -1 + "','" + element.description_q + "','" + element.type_q + "');",
                        function(err, rows, fields) {
                            if (err) {
                                result_add = "fail";
                                console.log(err);
                            } else {
                                compteurElement++;
                                _(element.reponse).each(function(repons) {
                                    connecte.query("call questionnaire.ajout_reponse('" + element.description_q + "','" + repons.descr_rep + "','" + repons.bon_rep + "');",
                                        function(err2, rows2) {
                                            if (err2) {
                                                result_add = "fail";
                                                console.log(err2);
                                            } else {
                                                compteurElement++;
                                                result_add = "success";
                                            }
                                        });
                                });
                            }
                        });
                });
            }
        });
    var wait = setInterval(function() {
        if (compteurElement === nbreElement) {
            clearInterval(wait);
            console.log("ajout de questionnaire:" + result_add + " , " + compteurElement + " elements.");
            reponse.json({
                stat: result_add
            });
        }
    }, 200);
};

exports.list = function(req, res) {
    var connection = mysql.createConnection(config.config);
    connection.connect();
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
                dataOld = questData;
                res.render('body/formateur/list_quest', {
                    title: "Formateur",
                    dataQuest: JSON.stringify(questData),
                    pseudo: req.session.pseudo,
                    type_cpt: req.session.first_cpt,
                    id_cpt: req.session.second_cpt
                });
            }
        });
};
exports.update_list_quest = function(req, res) {
    var colonnes = ['id_quest', 'nom_quest', 'date_quest', 'temps_quest', 'niveau_quest'];

    // console.log(JSON.parse(req.body.data));
    var changes = JSON.parse(req.body.arr);
    // console.log(changes);
    var dataNew = [];
    _(changes).each(function(element, inc) {
        if (colonnes[element[1]] === 'date_quest') {
            dataNew[inc] = {
                id: dataOld[element[0]].id_quest,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: dateFormat(element[3], "yyyy-mm-dd")
            };
        } else {
            dataNew[inc] = {
                id: dataOld[element[0]].id_quest,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: element[3]
            };
        }
    });
    var connection = mysql.createConnection(config.config);
    if (!_.isEmpty(JSON.parse(req.body.arr))) {
        var message = "",
            error = "",
            query;

        connection.connect();
        for (var i = 0; i < dataNew.length; i++) {
            query = "";
            if (dataNew[i].col !== 'id_quest') {
                query = "'-1'," + "NULL,".repeat(colonnes.indexOf(dataNew[i].col)) + "'" + dataNew[i].newVal + "'" + ", NULL ".repeat(colonnes.length - colonnes.indexOf(dataNew[i].col));
            } else {
                query = "NULL,".repeat(colonnes.indexOf(dataNew[i].col)) + "'" + dataNew[i].newVal + "'" + ", NULL ".repeat(colonnes.length - colonnes.indexOf(dataNew[i].col));
            }
            // console.log(query);
            connection.query("call questionnaire.updateQuestionnaire('" + dataNew[i].id + "'," + query + ");",
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

var delete_cdd = function(con, delData, response) {
    console.log('deleting quest...');
    con.connect();
    var message = "",
        error = "";
    for (var i = 0; i < delData.length; i++) {
        con.query("call `questionnaire`.`deleteQuest`('" + delData[i][0] + "');",
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