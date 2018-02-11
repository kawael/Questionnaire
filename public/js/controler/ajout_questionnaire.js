$('#AjoutQuest').submit(function(e) {
    e.preventDefault();
    NProgress.configure({
        parent: '#loader'
    });
    NProgress.start();
    var _this = this;
    var message = document.querySelector('#message');
    var button = "<button class='close' type='button' data-dismiss='alert'>×</button>";
    var alert;
    var inputs = document.querySelectorAll('#AjoutQuest input,#AjoutQuest textarea,#AjoutQuest select');
    var data = {};
    _(inputs).each(function(input) {
        if (input.type === 'checkbox') {
            data[input.name] = (input.checked) ? 'on' : 'off';
        } else {
            data[input.name] = input.value.replace(/[\'\"]/gi, "\\'");
        }

    });
    console.log(data);
    var action = this.action.split('/');
    var myPost = '/' + action[3] + '/' + action[4];
    $.ajax({
        url: myPost,
        type: 'POST',
        //dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        data: data
    }).done(function(resultat) {
            NProgress.done();
            if (resultat.stat === 'success') {
                if (!message.hasChildNodes()) {
                    alert = document.createElement('div');
                } else {
                    alert = document.querySelector("#message div");
                }
                $(alert).attr("class", "alert alert-dismissable alert-success");
                $(alert).html(button + "Authentification effectué avec succée.");
                message.appendChild(alert);
                $(alert).slideDown(500);
                _this.querySelector('input[type="reset"]').click();
            } else if (resultat.stat === 'fail') {
                if (!message.hasChildNodes()) {
                    alert = document.createElement('div');
                } else {
                    alert = document.querySelector("#message div");
                }
                $(alert).attr("class", "alert alert-dismissable alert-warning");
                $(alert).html(button + "Erreur d'authentification.");
                message.appendChild(alert);
                $(alert).slideDown(500);
                _this.querySelector('input[type="reset"]').click();
            }
        })
        .fail(function() {
            if (!message.hasChildNodes()) {
                alert = document.createElement('div');
            } else {
                alert = document.querySelector("#message div");
            }
            $(alert).attr("class", "alert alert-dismissable alert-warning");
            $(alert).html(button + "Erreur d'authentification.");
            message.appendChild(alert);
            $(alert).slideDown(500);
        });
});