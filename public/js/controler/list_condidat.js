$(document).ready(function() {

    'use strict';
    var headers = [];
    headers = _.keys(data[0]).map(function(val) {
        return val.split('_')[0].toUpperCase();
    });
    var dataArray = [],
        i = 0,
        columns = [{
            data: 0,
            type: 'numeric',
            validator: /^[0-9\-]+$/i,
            allowInvalid: false
        }, {
            data: 1,
            validator: /^[A-Za-z0-9]+$/i,
            allowInvalid: false
        }, {
            data: 2,
            validator: /^[A-Za-z\.\-\_]+$/i,
            allowInvalid: false
        }, {
            data: 3,
            validator: /^[A-Za-z\.\-\_]+$/i,
            allowInvalid: false
        }, {
            data: 4,
            validator: /^(([A-Za-z0-9\.\_\-]+)(@)([A-Za-z0-9\.\_\-]+)(\.)([A-Za-z]+))+$/i,
            allowInvalid: false
        }, {
            data: 5,
            validator: /^[0-9\ \-\.]+$/i,
            allowInvalid: false
        }];
    dataArray = ObjectToArray(data);
    var showRows = false;
    var items = {
        "affect": {
            name: 'affecter à un Questionnaire'
        },
        "row_above": {},
        "row_below": {},
        "remove_row": {},
        "remove_col": {},
        "make_read_only": {},
        "alignment": {},
    };
    if (!_.isUndefined(dataQuest)) {
        showRows = true;
        items = {};
        items = {
            "affect": {
                name: 'affecter à un Questionnaire'
            }
        };
    }
    // dataArray.unshift(headers);
    var checkLoad = 0;
    var container = document.getElementById('hot'),

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
                            if (!showRows) {
                                window.location = "/secretaire/affect_condidat/" + dataArray[selected[0]][0];
                            } else {
                                add_to_affect(dataArray[selected[0]]);
                            }

                        }, 100);
                    }
                },
                items: items
            },
            // maxRows: 20,
            minSpareRows: 1,
            // fixedRowsTop: 1,
            colHeaders: headers,
            rowHeaders: showRows,
            search: true,
            // manualColumnResize: true,
            // manualRowResize: true,
            manualColumnMove: true,
            persistentState: true,
            fillHandle: true,
            beforeKeyDown: listeningKeys,
            afterChange: changingData,
            beforeRemoveRow: removingData
        },
        hot = new Handsontable(container, settings);
    // var onlyExactMatch = function(queryStr, value) {
    //         return queryStr.toString() === value.toString();
    //     };

    var searchFiled = document.getElementById('search');
    var searchButton = document.getElementById('searchRow');
    var colSearch = document.getElementById('colSearch');
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

    function changingData(changes, source) {
        if ((checkLoad === 1 || checkLoad === 2) && (!_.isEmpty(changes))) {
            diference.push(changes[0]);
            if (checkLoad !== 2 && diference.length > 0) {
                checkLoad = 2;
                ValiderModif = document.querySelector('#ValiderModif');
                ValiderModif.style.display = "inline-block";
            }
        } else if (checkLoad === 0) {
            checkLoad = 1;
        }

    }



    function listeningKeys(event) {
        if (event.keyCode === 46) {
            console.log('deleting...');
            var selectedRow = hot.getSelected();
            if (selectedRow[0] === selectedRow[2] && selectedRow[1] === 0 && selectedRow[3] === 5) {
                removingData(selectedRow[0]);
                delete dataArray[selectedRow[0]];
                hot.spliceCol(selectedRow[1], selectedRow[0], 1);
            }
        }
    }

    function separateData(donnees) {
        var objData = {
            arr: _(donnees).filter(function(element) {
                return element[2] !== null;
            })
        };
        var heads = _.keys(data[0]),
            ajoutData = {},
            newRows = _(donnees).filter(function(element) {
                return element[2] === null;
            }),
            groupRows = _(newRows).groupBy(function(element) {
                return element[0];
            }),
            increment = 0;
        _(groupRows).each(function(row) {
            ajoutData[increment] = {};
            if (!_.isEmpty(row)) {
                _(row).map(function(element, index) {
                    ajoutData[increment][heads[element[1]]] = element[3];
                });
                increment++;
            }
        });
        objData.data = ajoutData;
        return objData;
    }

    function removingData(argument) {
        if ((checkLoad === 1 || checkLoad === 2)) {
            delData.push(dataArray[argument]);
            if (checkLoad !== 2) {
                checkLoad = 2;
                ValiderModif = document.querySelector('#ValiderModif');
                ValiderModif.style.display = "inline-block";
            }
        } else if (checkLoad === 0) {
            checkLoad = 1;
        }
    }

    //send data
    $('#ValiderModif').click(function(event) {
        var objData = separateData(diference);
        objData.del = delData;
        // console.log(objData.data);
        if (confirm("Voulez Vous Modifier Vos Données?")) {
            //send Data
            //initialize changes.
            diference = [];
            delData = [];
            $.ajax({
                url: '/secretaire/update_list_cdd',
                type: 'POST',
                //dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
                data: {
                    arr: JSON.stringify(objData.arr),
                    data: JSON.stringify(objData.data),
                    del: JSON.stringify(objData.del)
                }
            })
                .done(function(resultat) {
                    checkLoad = 1;
                    ValiderModif.style.display = "none";
                    if (resultat.stat === 'success') {
                        $.snackbar({
                            content: "Modification effectuée avec succé.",
                            style: "light-green",
                            timeout: 5000
                        });
                        diference = [];
                        // setTimeout(function(){
                        //     window.location="/secretaire/list_condidat"
                        // }, 1000);
                    } else if (resultat.stat === 'fail') {
                        console.warn("Error DataBase:" + resultat.error.code);

                        $.snackbar({
                            content: "Modification non valide.",
                            style: "deep-orange",
                            timeout: 5000
                        });
                    }
                })
                .fail(function() {
                    $.snackbar({
                        content: "Erreur de Modification.",
                        style: "deep-orange",
                        timeout: 5000
                    });
                });
        }
    });

    function add_to_affect(condidat) {
        var button = document.querySelector('#expendQuest');
        if (!_(selectedCdd).contains(condidat)) {
            selectedCdd.push(condidat);
            $.snackbar({
                content: "ce Condidat est ajouté la liste des affectations.",
                style: "light-green",
                timeout: 5000
            });
        } else {
            $.snackbar({
                content: "ce Condidat existe déja sur la liste des affectations.",
                style: "deep-orange",
                timeout: 5000
            });
        }
        if (_.isEmpty(selectedQuest)) {
            $.snackbar({
                content: "Veuillez Selectionner un Questionnaire.",
                style: "deep-orange",
                timeout: 5000
            });
        }
        if ($(button).hasClass('no-shadow')) {
            $(button).removeClass('no-shadow');
            $(button).addClass('btn-raised btn-info animated zoomIn');
        }

    }
});
