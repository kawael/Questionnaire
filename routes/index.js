var express = require('express'),
    router = express.Router(),
    compte = require('./Model.compte'),
    secretaire = require('./secretaire'),
    formateur = require('./formateur'),
    condidat = require('./condidat');
// var Q = require('q');
/* GET home page. */
router.get('/', function(req, res) {
    if (req.session.pseudo !== undefined) {
        res.render('body/home', {
            title: "Home",
            pseudo: req.session.pseudo,
            type_cpt: req.session.first_cpt,
            id_cpt: req.session.second_cpt
        });
    } else {
        res.redirect('/login');
    }

});
router.get('/login', function(req, res) {

    req.session.destroy();
    res.render('body/login', {
        title: "Login"
    });

});
router.post('/login', function(req, res) {
    compte.login(req, res);
});
router.route(/secretaire[\/.]*/)
    .all(function(req, res, next) {
        if (req.session.type_cpt === '2') {
            next();
        } else {
            res.redirect('/login');
        }
    }).get(secretaire)
    .post(secretaire);

router.route(/formateur[\/.]*/)
    .all(function(req, res, next) {
        if (req.session.type_cpt === '1') {
            next();
        } else {
            res.redirect('/login');
        }
    }).get(formateur)
    .post(formateur);
router.route(/condidat[\/.]*/)
    .all(function(req, res, next) {
        if (req.session.type_cpt === 3) {
            next();
        } else {
            res.redirect('/login');
        }
    }).get(condidat)
    .post(condidat);
module.exports = router;

// coolors
//http://coolors.co/23c9ff-4c6085-f46036-f7f7ff-32322c