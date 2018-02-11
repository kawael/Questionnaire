'use strict';
var headers = [];
headers = _.keys(dataQuest[0]).map(function(val) {
    return val.split('_')[0].toUpperCase();
});
var dataArray = [],
    i = 0,
    columns = [{
        data: 0,
        readOnly: true
    }, {
        data: 1,
        readOnly: true
    }, {
        data: 2,
        readOnly: true
    }, {
        data: 3,
        readOnly: true
    }, {
        data: 4,
        readOnly: true
    }];
dataArray = ObjectToArray(dataQuest);
// dataArray.unshift(headers);
var checkLoad = 0;
var container = document.getElementById('hotQuest'),

    settings = {
        data: dataArray,
        // colHeaders: headers,
        columnSorting: true,
        columns: columns,
        stretchH: 'all',
        contextMenu: {
            callback: function(key, options) {
                if (key === 'affect') {
                    setTimeout(function() {
                        var selected = hot.getSelected();
                        affecter_Quest(dataArray[selected[0]]);

                    }, 100);
                }
            },
            items: {
                "affect": {
                    name: 'selectionner le Questionnaire'
                }
            }
        },
        // maxRows: 20,
        minSpareRows: 1,
        // fixedRowsTop: 1,
        colHeaders: headers,
        rowHeaders: true,
        search: true,
        // manualColumnResize: true,
        // manualRowResize: true,
        manualColumnMove: true,
        persistentState: true,
        fillHandle: true
    },
    hot = new Handsontable(container, settings);
// var onlyExactMatch = function(queryStr, value) {
//         return queryStr.toString() === value.toString();
//     };

var searchFiled = document.getElementById('searchQuest');
var searchButton = document.getElementById('searchRowQuest');
var colSearch = document.getElementById('colSearchQuest');
Handsontable.Dom.addEvent(searchButton, 'click', function(event) {
    hot.updateSettings({
        data: dataArray
    });
    hot.render();
    if (!_.isEmpty(searchFiled.value)) {
        var queryResult = hot.search.query(searchFiled.value);
        var rows = _.chain(queryResult).filter(function(element) {
            if (!_.isEmpty(colSearch.value)) {
                return element.col == colSearch.value;
            } else {
                return true;
            }
        }).pluck('row').value();
        var result = _(dataArray).filter(function(element, key) {
            return (_(rows).contains(key)) ? true : false;
        });
        // result.unshift(headers);
        hot.updateSettings({
            data: result
        });
    }

});

function affecter_Quest(questionnaire) {
    if (!_(selectedQuest).contains(questionnaire)) {
        selectedQuest.push(questionnaire);
        $.snackbar({
            content: "ce Questionnaire est ajouté la liste des affectations.",
            style: "light-green",
            timeout: 5000
        });

    } else {
        $.snackbar({
            content: "ce Questionnaire existe déja sur la liste des affectations.",
            style: "deep-orange",
            timeout: 5000
        });
    }

    if (_.isEmpty(selectedCdd)) {
        $.snackbar({
            content: "Veuillez Selectionner un Condidat.",
            style: "deep-orange",
            timeout: 5000
        });
    }
    var button = document.querySelector('#expendQuest');
    if ($(button).hasClass('no-shadow')) {
        $(button).removeClass('no-shadow');
        $(button).addClass('btn-raised btn-info animated zoomIn');
    }
}
var templateLigne;
//creer un template pour le tableau de model select les CDD et Quest
$('#expendQuest').click(function(event) {
    event.preventDefault();
    var modal = document.querySelector('#modal_add_affect');
    var content = modal.querySelector('.modal-body');
    if (!_.isEmpty(selectedQuest)) {
        // content.innerHTML = selectedQuest + selectedCdd;
        var affects = document.querySelector('#list_affect');
        affects.parentNode.querySelector('thead button').onclick = ajoutLigne;
        affects.innerHTML = "";
        var selectQuest = document.createElement('select');
        selectQuest.name = "id_quest_pass";
        selectQuest.className = "form-control";
        selectQuest.innerHTML = "{{optionsQuest}}";
        var QuestOptions = "";
        _(selectedQuest).each(function(questio) {
            QuestOptions += "<option value='" + questio[0] + "'>" + questio[0] + "</option>";
        });
        var selectCdd = document.createElement('select');
        selectCdd.name = "id_cdd_pass";
        selectCdd.className = "form-control";
        selectCdd.innerHTML = "{{optionsCdd}}";
        var CddOptions = "";
        _(selectedCdd).each(function(condid) {
            CddOptions += "<option value='" + condid[0] + "'>" + condid[0] + "</option>";
        });
        //ajouter la ligne au tableau...
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.className = "form-group";
        td.appendChild(selectCdd);
        var td2 = document.createElement('td');
        td2.className = "form-group";
        td2.appendChild(selectQuest);
        var td3 = document.createElement('td');
        td3.className = "form-group";
        var now = new Date();
        var mois = ((now.getMonth() + 1) < 10) ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
        var date = now.getFullYear() + "-" + mois + "-" + now.getDate();
        td3.innerHTML = "<input type='date' class='form-control' value='" + date + "' placeholder='Quand passer le Quiz' name='date_pass' required>";
        var td4 = document.createElement('td');
        td4.className = "text-right";
        td4.innerHTML = "<button class='btn btn-warning no-marg supp-ligne'><i class='mdi-content-remove'></i></button>";
        tr.appendChild(td);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        templateLigne = tr.innerHTML;
        templateLigne = templateLigne.replace('{{optionsQuest}}', QuestOptions);
        templateLigne = templateLigne.replace('{{optionsCdd}}', CddOptions);
        tr.innerHTML = templateLigne;
        tr.querySelector('.supp-ligne').onclick = suppLigne;
        affects.appendChild(tr);
        $(modal).modal('show');

        $.material.init();
    } else {
        $.snackbar({
            content: "Veuillez Selectionner un Questionnaire.",
            style: "deep-orange",
            timeout: 5000
        });
    }
});

function suppLigne(e) {
    e.preventDefault();
    var trParent = this.parentNode.parentNode;
    trParent.className += " animated zoomOut";
    setTimeout(function() {
        trParent.remove();
    }, 500);
}

function ajoutLigne(argument) {
    var tr = document.createElement('tr');
    tr.innerHTML = templateLigne;
    tr.className += " animated zoomIn";
    tr.querySelector('.supp-ligne').onclick = suppLigne;
    var affects = document.querySelector('#list_affect');
    affects.appendChild(tr);
    setTimeout(function() {
        tr.className = "";
    }, 600);
    $.material.init();
}

$('#btn_affect').click(function(event){
    if (confirm("êtes vous sûre de vouloir affecter ces condidats?")) {
        var affects = document.querySelectorAll('#list_affect tr'),
            values = [],
            message = document.querySelector('#message');
        _(affects).each(function(row, indice) {
            values[indice] = {};
            _(row.querySelectorAll('td select,td input')).each(function(cell) {
                if (cell !== null) {
                    values[indice][cell.name] = cell.value;
                }
            });
        });
        $.ajax({
            url: '/secretaire/ajout_affectation',
            type: 'POST',
            // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
            data: {
                data: JSON.stringify(values)
            }
        }).done(function(resultat) {
            afficher_message(resultat.stat,resultat.message,message);
        }).fail(function(){
           afficher_message('error','',message);
        });
    }
});

function afficher_message(type, message, messageElement) {
    var types = {
            success: "alert alert-dismissable alert-success text-left",
            fail: "alert alert-dismissable alert-warning text-left",
            error: "alert alert-dismissable alert-danger text-left"
        },
        messages = {
            success: message,
            fail: message,
            error: "problème de connection."
        },
        alert,
        button = "<button class='close' type='button' data-dismiss='alert'>×</button>";
    if (!messageElement.hasChildNodes()) {
        alert = document.createElement('div');
    } else {
        alert = document.querySelector("#message div");
    }
    $(alert).attr("class", types[type]);
    $(alert).html(button + messages[type]);
    messageElement.appendChild(alert);
    $(alert).slideDown(500);
    setTimeout(function() {
        $(alert).slideUp(500);
    }, 5000);
}