var clock;
var templateQuestion = '<div class="form-group marged-left"><label class="col-lg-12 row">Question n°= {{num_q}} :<h4> {{descr_q}}?</h4></label><label class="col-lg-2 control-label"> Réponses :</label><div class="col-lg-10">{{list_reponse}}</div></div>';
var templateReponse = '<div class="radio radio-primary"><label class="reponse" ><input type="radio" name="q{{num_q}}" value="{{num_rep}}">{{descr_rep}}</label></div>';
var nbre_q= quests.questions.length;
var current_q = 0;
$(document).ready(function() {

    var container = document.getElementById('container');
    var champQues = document.getElementById('champQues');
    var champCdd = document.getElementById('champCdd');
    var champTemps = document.getElementById('champTemps');
    var parentTemps = champTemps.parentNode;

    champQues.innerHTML = "Questionnaire n°= " + quests.id_quest;
    champCdd.innerHTML = "Condidat : " + quests.nom_cdd;
    var CountForm = /([0-9]{0,3})(\:)?([0-9]{0,2})/i;
    var minute = (!_.isNaN(parseInt(quests.temps_quest.replace(CountForm, '$1')))) ? parseInt(quests.temps_quest.replace(CountForm, '$1')) * 60 : 0;
    var seconde = (!_.isNaN(parseInt(quests.temps_quest.replace(CountForm, '$3')))) ? parseInt(quests.temps_quest.replace(CountForm, '$3')) : 0;
    var aside = document.querySelector('.fullHeight');

    //set Height
    $(document.querySelector('html')).css('height', '100%');
    var headHeight = document.querySelector('.heading').parentNode.clientHeight;
    var FullHeight = document.querySelector('html').clientHeight;
    $(aside).css('height', FullHeight);
    $(container).css('height', parseInt(FullHeight) - parseInt(headHeight) - 60);

    parentTemps.className = "";
    var typeCounter = "";
    if (((minute + seconde) / 60) <= 1) {
        parentTemps.className = "col-xs-12 col-sm-4 col-sm-offset-2 col-md-3 col-md-offset-3 col-lg-2 col-lg-offset-4";
        typeCounter = "Counter";
    } else if (((minute + seconde) / 60) <= 60) {
        parentTemps.className = "col-xs-12 col-sm-5 col-sm-offset-1 col-md-4 col-lg-offset-2 col-md-4 col-lg-offset-2";
        typeCounter = "MinuteCounter";
    } else {
        parentTemps.className = "col-xs-12 col-sm-6 col-md-6 col-lg-5 col-lg-offset-1";
        typeCounter = "HourlyCounter";
    }
    // Instantiate a counter
    clock = new FlipClock($('#champTemps'), (minute + seconde), {
        clockFace: typeCounter,
        autoStart: false,
        countdown: true
    });

});
var __this;
$('#luncher').click(function(ev) {
    ev.preventDefault();
    var parent = this.parentNode;
    var _this = this;
    $(_this).addClass('animated zoomOut');
    $(parent).addClass('animator');
    $(_this).queue(function(next) {
        $(parent).remove();
        $(container).addClass('jumbotron');
        clock.start();
        next();
    });
    next_question();
});

$('#conti_end').click(function(ev) {
    console.log("hello");
    current_q++;
    if(current_q<nbre_q){
        next_question();
    }else{
        end_questions();
    }
});
function next_question () { 
    var Main = document.querySelector('#Main');
    Main.innerHTML = "";
    var question,questions="";
    var reponse;
    var reponses = [];
    question = "";
    question = templateQuestion.replace("{{num_q}}", quests.questions[current_q].id_q);
    question = question.replace("{{descr_q}}", quests.questions[current_q].descr_q);
    
    reponses = [];
    _(quests.questions[current_q].reponses).each(function(rep_ele) {
        reponse = "";
        reponse = templateReponse.replace("{{num_q}}", quests.questions[current_q].id_q);
        reponse = reponse.replace("{{num_rep}}", rep_ele.id_rep);
        reponse = reponse.replace("{{descr_rep}}", rep_ele.desc_rep);
        reponses.push(reponse);
    });
    questions += question.replace("{{list_reponse}}", reponses.join(''));
    
    Main.innerHTML = questions;
    $.material.init();
    $('.reponse').click(function(event) {
        $('#conti_end').removeClass("hidden");
        // var radio = this.querySelector('input');
        // radio.checked = (radio.checked) ? false : true;
    });
}
function end_questions (argument) {
    var Main = document.querySelector('#Main');
    Main.innerHTML = "";
    clock.stop()
    console.log(clock.original -clock.getTime().time);
}