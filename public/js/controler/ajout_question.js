var questionTemp = '<div class="form-group"><label class="col-xs-4 col-sm-3 col-md-3 col-lg-2 control-label">Description :</label><div class="col-xs-8 col-sm-7 col-md-7 col-lg-5"><textarea placeholder="Description de Question" name="question<%= numero %>" required="required" class="form-control"></textarea></div><label class="col-xs-4 col-sm-3 col-md-3 col-lg-2 control-label">Type :</label><div class="col-xs-8 col-sm-7 col-md-7 col-lg-3"><select required="required" name="type_quest<%= numero %>" class="form-control"><option value="radio">Radio</option><option value="checkbox">Checkbox</option></select></div></div><div class="form-group"><label class="col-xs-12 col-sm-3 col-md-3 col-lg-2 control-label">Réponses :</label>'+
'<div class="col-xs-12 col-sm-12 col-md-9 col-lg-10 row"><div class="col-md-12 col-lg-12 text-right"><a class="btn btn-info btn-fab btn-flat mdi-content-add add-reponse q<%= numero %>"></a></div></div></div>';
var lienTemp = '<a href="#q<%= numero %>" data-toggle="tab">Question n°<%= numero %><i class="btn btn-flat btn-danger mdi-content-clear no-pad-marg clearLink"></i></a>';
var reponseTemp= '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><input type="text" name="quest<%= num_ques %>_rep<%= num_rep %>" pattern="[a-zA-Z0-9\\.\\ \\-]{1,45}" placeholder="Reponse." required="required" class="form-control"/></div><div class="col-sm-2 col-sm-2 col-md-4 col-lg-4"><div class="checkbox no-padding"><label><input type="checkbox" name="quest<%= num_ques %>_rep<%= num_rep %>_bon" value="off"> Réponse.</label></div></div><div class="col-sm-2 col-sm-2 col-md-2 col-lg-2"><i class="btn btn-danger btn-flat mdi-content-clear"></i></div>';
var question = _.template(questionTemp);
var lien = _.template(lienTemp);
var reponse = _.template(reponseTemp);
var contenu = document.querySelector("#contenuQuest");
var liste = document.querySelector("#listeQuest");
var nbreLinks = liste.childNodes.length;

var createLink = document.querySelector("#new");
createLink.addEventListener('click', function(e) {
    //some animation
    createLink.className = "animated fadeInLeft";
    setTimeout(function() {
        createLink.className = "";
    }, 1000);
    //create a link to tab
    var newLink = document.createElement('li');
    newLink.className = "animated fadeInLeft";
    newLink.innerHTML = lien({
        numero: nbreLinks
    });
   	newLink.childNodes[0].childNodes[1].addEventListener('click',clickClear);
    liste.insertBefore(newLink, createLink);
    //create a tab
    var newTab = document.createElement('div');
    newTab.className = "tab-pane fade";
    newTab.id = "q" + nbreLinks;
    newTab.innerHTML = question({
        numero: nbreLinks
    });
    newTab.querySelector('.add-reponse').onclick= add_reponse;
    contenu.appendChild(newTab);
    //incrementing number of elements
    nbreLinks++;
    $.material.init();
}, false);

function clickClear(ev) {
    ev.preventDefault();
    // var parent= this.parentNode().parentNode();
    var li = this.parentNode.parentNode;
    var child= document.querySelector(this.parentNode.href.split('\/')[5]);
    li.className = "animated fadeOutLeft";
    setTimeout(function() {
        liste.removeChild(li);
        contenu.removeChild(child);
        nbreLinks--;
    }, 700);
}
var nbreRep={};
var repContent;
function add_reponse (ev){
    ev.preventDefault();
    repContent= ev.target.parentNode.parentNode;
    var numQuest =ev.target.className.split(' ')[6].charAt(1);
    nbreRep[numQuest]=(!nbreRep[numQuest])? 0 : nbreRep[numQuest];
    var new_rep = document.createElement('div');
    new_rep.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 row animated fadeInDown q"+numQuest+"-r"+nbreRep[numQuest];
    new_rep.innerHTML = reponse({num_ques: numQuest,num_rep: nbreRep[numQuest]});
    var clearRep = new_rep.querySelector('.mdi-content-clear');
    clearRep.onclick = clear_reponse;
    nbreRep[numQuest]++;
    repContent.appendChild(new_rep);
    $.material.init();
}
function clear_reponse(e){
    e.preventDefault();
    var parent = e.target.parentNode.parentNode;
    var numQuest =parent.className.split(' ')[5].split('-')[0].charAt(1);
    parent.className += " fadeOutUp";
    setTimeout(function() {
        repContent.removeChild(parent);
        nbreRep[numQuest]--;
    }, 700);
}