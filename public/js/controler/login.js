$("#loginForm").submit(function(ev) {
    ev.preventDefault();
    NProgress.configure({
        parent: '#loader'
    });
    NProgress.start();
    var _thisAction = $(this).attr('action');
    /* reponse */
    var message = document.querySelector('#message');
    var button = "<button class='close' type='button' data-dismiss='alert'>×</button>";
    var alert;
    var pseudo = document.querySelector('input[name="pseudo"]').value;
    var mdp = document.querySelector('input[name="mdp"]').value;
    //send Data
    $.ajax({
        url: _thisAction,
        type: 'POST',
        //dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
        data: {
            pseudo: pseudo,
            mdp: mdp
        },
    })
        .done(function(resultat) {
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

                setTimeout(function() {
                    if (resultat.type == 1) {
                        document.location = "/formateur";
                    } else if (resultat.type == 2) {
                        document.location = "/secretaire";
                    } else if (resultat.type == 3) {
                        document.location = "/condidat/";
                    }
                }, 1500);
            } else if (resultat.stat === 'failed') {
                if (!message.hasChildNodes()) {
                    alert = document.createElement('div');
                } else {
                    alert = document.querySelector("#message div");
                }
                $(alert).attr("class", "alert alert-dismissable alert-warning");
                $(alert).html(button + "Erreur d'authentification.");
                message.appendChild(alert);
                $(alert).slideDown(500);
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

//https://github.com/rstacruz/nprogress