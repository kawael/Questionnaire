var express = require('express');
var router = express.Router();
var condidat = require('./Model.condidat');

router.get('/condidat/', function(req, res) {
    if (req.session.pseudo !== undefined) {
        condidat.to_quest(req, res);
    } else {
        res.redirect('/login');
    }
});
router.get('/condidat/:quest', function(req, res) {
    if (req.session.pseudo !== undefined) {
        condidat.to_quiz(req, res);
    } else {
        res.redirect('/login');
    }
});
module.exports = router;