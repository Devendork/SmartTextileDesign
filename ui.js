

function initUI(){


	var instruction_row = document.getElementById("instruction_row");
	instruction_row.min = 0;
	instruction_row.max = weaves[scene.showing].wefts;
	instruction_row.value = 0;
	instruction_row.step = 1;
	instruction_row.width = 40;

	var epi_input = $("#epi");
	epi_input.val(epi);

	var ends_input = $("#ends");
	ends_input.val(ends);

	var thresholds = [];
	thresholds[0] = document.getElementById("layer1_threshold");
	thresholds[1] = document.getElementById("layer2_threshold");
	thresholds[2] = document.getElementById("layer3_threshold");

	var layer_yarns = [];
	layer_yarns[0] = $("#layer1_yarn");
	layer_yarns[1] = $("#layer2_yarn");
	layer_yarns[2] = $("#layer3_yarn");



	//for each yarn  - append a div
	for(var yt = 0; yt < yarn_types.length -1; yt++){
		var y = yarn_types[yt];
		var heading = $("<h3>"+y.name+"</h3>");
		var radio_primary = $("<input  name=\"primary\" type=\"radio\" value=\""+y.id+"\" />");
		var radio_warp = $("<input name=\"warp\" type=\"radio\" value=\""+y.id+"\" />");

		var yarn_width = $("<div class=\"third_width\" ><span class=\"my_label\">Width</span><input id= \"yarn_"+y.id+"\" type=\"number\" value=\""+y.width+"\"/></div>");
		var is_primary = $("<div class=\"third_width\" ><span class=\"my_label\">Primary?</span></div>");
		is_primary.append(radio_primary);
		var is_warp = $("<div class=\"third_width\" ><span class=\"my_label\">Warp?</span></div>");
		is_warp.append(radio_warp);


		if(primary_yarn.id == y.id) radio_primary.val(y.id);
		if(warp_type.id == y.id) radio_warp.val(y.id);

		$("#yarn_settings").append(heading);
		$("#yarn_settings").append(yarn_width);
		$("#yarn_settings").append(is_primary);
		$("#yarn_settings").append(is_warp);
	}


  for(var w = 0; w < weaves.length -1; w++){
  	var weave = weaves[w];
  	var parent = $("#layer_settings");
  	var layer_div = $("<div id=\"layer"+w+"\" class=\"layer\">");
  	var options_div = $("<div class=\"layer_options\">");
  	var select_yarns = $("<select id=\"layer1_yarn\" name=\"layer1_yarn\"> </select>");
  	
  	//add to select list
	for(yt in yarn_types){
		select_yarns.append($('<option>', {
		    value: yarn_types[yt].id,
		    text: yarn_types[yt].name
			}));
	}

	select_yarns.val(weave.yarn_type.name);

  	layer_div.append($("<h2>Layer "+w+"</h2>"));
  	layer_div.append($("<img src=\"img/"+weave.image_name+"\">"));
  	options_div.append($("<span class=\"my_label\">Yarn <span id=\"yards_"+w+"\"></span></span>"));
  	options_div.append(select_yarns);
  	options_div.append($("<span class=\"my_label\">Threshold <span id=\"tval_"+w+"\">"+weave.threshold+"</span></span>"));
  	options_div.append($("<input id=\"layer"+w+"_threshold\" type=\"range\" min = \"0\" max=\"1\" value=\""+weave.threshold+"\" step=\"0.01\"/>"));




  	layer_div.append(options_div);
	parent.append(layer_div);
  }


	$(".layer")
	.mouseover(function(){
		$(this).css('background-color', '#cff');
	})
	.mouseout(function(){
		$(this).css('background-color', '#fff');
	});

	$(".layer").click(function(){
		console.log(this.id);
		if(this.id == "layer0"){
			scene.drawWeave(0);
		} 
		if(this.id == "layer1"){
			scene.drawWeave(1);
		} 

		if(this.id == "layer2"){
			scene.drawWeave(2);
		} 

		instruction_row.max = weaves[scene.showing].wefts.length;
		updateInstruction(instruction_row.value);

	});

	$("#merge").click(function(){
		scene.drawWeave(3);
		instruction_row.max = weaves[scene.showing].wefts.length;
		updateInstruction(instruction_row.value);
	});

	$("#instruction_row").change(function(){
		updateInstruction(this.value);
	});

	function updateInstruction(value){
		var t = getInstruction(value);
		$("#instruction").val(t);
		//$("#instruction").css("color:"+weaves[scene.showing]);
		scene.highlightRow(value);
	}


}