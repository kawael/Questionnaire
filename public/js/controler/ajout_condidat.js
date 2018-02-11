$("#AjoutCDD").submit(function(ev) {
	ev.preventDefault();
	NProgress.configure({ parent: '#loader' });
	NProgress.start();
	// NProgress.done();
	/* reponse */
	var message= document.querySelector('#message');
	var button= "<button class='close' type='button' data-dismiss='alert'>×</button>";
	var alert;
	var inputs = document.querySelectorAll("#AjoutCDD input[type='text']");
	var data ={};
	_(inputs).each(function (input) {
		data[input.attributes[3].value]= input.value;
	});
	//send Data
	$.ajax({
		url: this.attributes[2].value,
		type: 'POST',
		//dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
		data: data,
	})
	.done(function(resultat) {
		NProgress.done();
		if(resultat.stat === 'success'){
			if(!message.hasChildNodes()){
				alert= document.createElement('div');
			}else{
				alert= document.querySelector("#message div");
			}
			$(alert).attr("class","alert alert-dismissable alert-success");
			$(alert).html(button+resultat.description);
			message.appendChild(alert);
			$(alert).slideDown(500);
		}else if(resultat.stat === 'fail'){
			console.warn("Error DataBase:" +resultat.error.code);
			if(!message.hasChildNodes()){
				alert= document.createElement('div');
			}else{
				alert= document.querySelector("#message div");
			}
			$(alert).attr("class","alert alert-dismissable alert-warning");
			$(alert).html(button+resultat.description);
			message.appendChild(alert);
			$(alert).slideDown(500);
		}
	})
	.fail(function(){
		NProgress.done();
		if(!message.hasChildNodes()){
				alert= document.createElement('div');
			}else{
				alert= document.querySelector("#message div");
			}
			$(alert).attr("class","alert alert-dismissable alert-danger");
			$(alert).html(button+"problème de connection.");
			message.appendChild(alert);
			$(alert).slideDown(500);
	});
});

//https://github.com/rstacruz/nprogress