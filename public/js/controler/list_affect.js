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
            allowInvalid: false,
            readOnly: true
        }, {
            data: 1,
            type: 'numeric',
            validator: /^[0-9\-]+$/i,
            allowInvalid: false,
            readOnly: true
        }, {
            data: 2,
            type: 'numeric',
            validator: /^[0-9\.]+$/i,
            allowInvalid: false,
            readOnly: true
        }, {
            data: 3,
            validator: /^[0-9\-\ ]+$/i,
            allowInvalid: false
        }, {
            data: 4,
            validator: /^[01]{1}$/i,
            allowInvalid: false,
            type: 'checkbox',
            checkedTemplate: 1,
            uncheckedTemplate: 0
        }];
    dataArray = ObjectToArray(data);
    var showRows = false;

    // dataArray.unshift(headers);
    var checkLoad = 0;
    var container = document.getElementById('hot'),

        settings = {
            data: dataArray,
            // colHeaders: headers,
            columnSorting: true,
            columns: columns,
            stretchH: 'all',
            contextMenu: false,
            // maxRows: 20,
            minSpareRows: 0,
            minSpareCols: 0,
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
    setTimeout(function() {
        $.material.init();
    }, 0);


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
        var isDate = /(([0-9]{2,4})([\ \-\\]{0,1})){3}/i;
        var temp;
        var objData = {
            arr: _(donnees).map(function(row) {
                if (isDate.test(row[2])) {
                    temp = new Date(row[3].split('-').join(' '));
                    return [row[0], row[1], row[2], temp.getTime()];
                } else {
                    return row;
                }


            })
        };
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
                url: '/secretaire/update_list_affect',
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
});

function ObjectToArray(dataOld) {
    var dataNew = [];
    _(dataOld).each(function(element, index) {
        i = 0;
        dataNew[index] = [];
        _(element).each(function(valeur, key) {
            dataNew[index][i] = valeur;
            i++;
        });
    });
    return dataNew;
}