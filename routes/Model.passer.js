var _ = require('underscore');
var dateFormat = require('dateformat');
var mysql = require('mysql');
var config = require('./config');
var typesComptes = {
    secretaire: 2,
    formateur: 1,
    condidat: 3
};
var crypto = require('./Model.crypto');
var dataOld = [];
var _this = this;



exports.list_pass = function(request, response) {
    var connection = mysql.createConnection(config.config);
    connection.connect();
    // appeler une procedure getListCDD
    connection.query("SELECT * FROM  `questionnaire`.`passer`;",
        function(err, rows, fields) {
            if (err) {
                console.dir(err.code);
                // throw err;
            } else {
                var data = [];
                _(rows).each(function(element, index) {
                    data[index] = {};
                    _(element).map(function(value, key) {
                        if (key === 'date_pass') {
                            data[index][key] = dateFormat(value, "mm-dd-yyyy");
                        } else {
                            data[index][key] = value;
                        }
                    });
                });
                dataOld = data;
                connection.end();
                response.render("body/secretaire/list_affectation", {
                    data: JSON.stringify(data),
                    title: "Secretaire"
                });
            }
        });
};
exports.majListePass = function(req, res) {
    var colonnes = ['id_cdd_pass', 'id_quest_pass', 'resultat', 'date_pass', 'activer_pass'];

    // console.log(JSON.parse(req.body.data));
    var changes = JSON.parse(req.body.arr);
    var dataNew = [];
    _(changes).each(function(element, inc) {
        if (colonnes[element[1]] === 'date_pass') {
            dataNew[inc] = {
                id_cdd_old: dataOld[element[0]].id_cdd_pass,
                id_quest_old: dataOld[element[0]].id_quest_pass,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: dateFormat(element[3], "yyyy-mm-dd")
            };
        }else{
        	dataNew[inc] = {
                id_cdd_old: dataOld[element[0]].id_cdd_pass,
                id_quest_old: dataOld[element[0]].id_quest_pass,
                col: colonnes[element[1]],
                // oldVal: element[2],
                newVal: element[3]
            };
        }


    });
    var connection = mysql.createConnection(config.config);
    if (!_.isEmpty(JSON.parse(req.body.arr))) {
        var message = "",
            error = "";

        connection.connect();
        var inci = 0;
        for (var i = 0; i < dataNew.length; i++) {
            // console.log(query);
            connection.query("call questionnaire.updatePasser('" + dataNew[i].id_cdd_old + "','" + dataNew[i].id_quest_old + "','" + dataNew[i].col + "','" + dataNew[i].newVal + "');",
                function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                        error = err;
                        message = "fail";
                        // throw err;
                    } else {
                        inci++;
                        // console.log(rows);
                        message = "success";

                    }
                });
        }
        connection.end();

        // set Interval here.
        var waiting = setInterval(function() {
            if (inci === dataNew.length || message === "fail") {
                clearInterval(waiting);
                res.json({
                    error: error,
                    stat: message
                });
            }
        }, 200);
    }
};