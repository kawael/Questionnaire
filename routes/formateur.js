var express = require('express');
var router = express.Router();
var quest=  require('./Model.questionnaire');
/* GET home page. */
router.get('/formateur', function(req, res) {
    if(req.session.pseudo !== undefined){
    	res.render('body/formateur/home', {
        	title: "Formateur",
        	pseudo: req.session.pseudo,
        	type_cpt: req.session.first_cpt,
        	id_cpt: req.session.second_cpt
    	});
    }else{
    	res.redirect('/login');
    }
});
router.get('/formateur/ajout_quest', function(req, res) {
    if(req.session.pseudo !== undefined){
        res.render('body/formateur/ajout_quest', {
            title: "Formateur",
            pseudo: req.session.pseudo,
            type_cpt: req.session.first_cpt,
            id_cpt: req.session.second_cpt
        });
    }else{
        res.redirect('/login');
    }
});
router.get('/formateur/list_quest', function(req, res) {
    if(req.session.pseudo !== undefined){
        quest.list(req,res);
    }else{
        res.redirect('/login');
    }
});
router.post('/formateur/update_list_quest', function(req, res) {
    quest.update_list_quest(req, res);
});
router.post('/formateur/ajout_questionnaire', function(req, res) {
    quest.ajouter(req, res);
});

module.exports = router;