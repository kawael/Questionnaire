var express = require('express');
var router = express.Router();
var condidat=  require('./Model.condidat');
var passer=  require('./Model.passer');
/* GET home page. */
router.get('/secretaire', function(req, res) {
    if(req.session.pseudo !== undefined){
    	res.render('body/secretaire/home', {
        	title: "Secretaire",
        	pseudo: req.session.pseudo,
        	type_cpt: req.session.first_cpt,
        	id_cpt: req.session.second_cpt
    	});
    }else{
    	res.redirect('/login');
    }
    
});
router.get('/secretaire/ajout_condidat', function(req, res) {
    if(req.session.pseudo !== undefined){
        res.render('body/secretaire/ajout_condidat', {
            title: "Secretaire",
            pseudo: req.session.pseudo,
            type_cpt: req.session.first_cpt,
            id_cpt: req.session.second_cpt
        });
    }else{
        res.redirect('/login');
    }
});
router.post('/secretaire/ajout_condidat', function(req, res) {
    condidat.ajouter(req,res);
});
router.post('/secretaire/update_list_cdd', function(req, res) {
    condidat.majListe(req,res);
});
router.get('/secretaire/list_condidat', function(req, res) {
    if(req.session.pseudo !== undefined){
        condidat.list(res,'body/secretaire/list_condidat');
    }else{
        res.redirect('/login');
    }
});
// /\/secretaire\/affect_condidat\/(:id_cdd)?/ '/secretaire/affect_condidat/:id_cdd'
router.get(/\/secretaire\/affect_condidat\/([0-9]*)/, function(req, res) {
    if(req.session.pseudo !== undefined){
        condidat.affect(req,res);
    }else{
        res.redirect('/login');
    }
});
router.post("/secretaire/ajout_affectation/", function(req, res) {
    if(req.session.pseudo !== undefined){
        condidat.add_affect(req,res);
    }else{
        res.redirect('/login');
    }
});
router.get('/secretaire/list_affectation', function(req, res) {
    if(req.session.pseudo !== undefined){
        passer.list_pass(req, res);
    }else{
        res.redirect('/login');
    }
});
router.post('/secretaire/update_list_affect', function(req, res) {
    passer.majListePass(req,res);
});
module.exports = router;

// coolors
//http://coolors.co/23c9ff-4c6085-f46036-f7f7ff-32322c