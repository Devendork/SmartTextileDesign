
var epi = 12; 		 				// the epi of the heddle  //space between warps
var weaves = [];

var yarn_types = []; 				//the kinds of yarns {id: , color: , width: (in), conductive}

yarn_types[0] = {
	id: 0, 
	name: "wool aran",
	color:" #000",
	width: 0.14,
	conductive: false
};


yarn_types[1] = {
	id: 1, 
	name: "ESSC Copper",
	color:" #c00",
	width: 0.05,
	conductive: true
};


yarn_types[2] = {
	id: 2, 
	name: "Multiple",
	color:" #0c0",
};

var ends = 118;   				// 1/2 total warps, only valid on rigid heddle
var warp_type = yarn_types[0]; 	    //assumes warp all same 
var primary_yarn = yarn_types[0];

var frames  = [];    				//the number of overlayed patterns


//each cell can take one of three forms
var primitives = {					// the number of possible ways of floating the yarn
		shed: 					//  through the shed, plain weave
			{id:0, c: "#fff", code: "s"},			
		over: 					//  float shed to top (plain_weave + float)
			{id:1, c: "#000", code: "o"},	
		under: 					//  under all warps then to top.
			{id:2, c: "#ccc", code: "u"}
};


var scene = null; 




$( document ).ready(function() {
    console.log( "ready!" );

    //this is the base weave, upon which other yarns will be based

    
    weaves[0] = scanPattern(0, "texture-01.png", yarn_types[0], 0.25, primitives.shed, primitives.over, 2, "#a00");
    weaves[1] = scanPattern(1, "thermo-01.png", yarn_types[1], 0.25, primitives.under, primitives.over, 1, "#0a0");
    weaves[2] = scanPattern(2, "thermo-02.png", yarn_types[1], 0.15, primitives.under, primitives.over, 1, "#00a");
    weaves[3] = mergeWeaves(weaves[0], weaves[1], weaves[2]);


	scene = new Scene2D($('#renderArea'));
	
	for(var i = 0; i < weaves.length; i++){
		scene.renderWeave(i, weaves[i]);
	}

	scene.drawWeave(3);
    initUI();

});


function scanPattern(id, image_name, yarn_type, threshold, default_primitive, select_primitive, resolution, color){
	var weave = {				 
    	wefts: [],
    	image_name: image_name,
    	threshold: threshold,
    	yarn_type: yarn_type
    }

    var canvas = document.getElementById("canvas");
    var ctx =canvas.getContext("2d");
    var image =  document.getElementById("img"+id);
    image.crossOrigin = "Anonymous";


    canvas.width = image.naturalWidth;
    canvas.height =  image.naturalHeight;
	ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);


	var warp_sample = image.naturalWidth / (ends / resolution);
	var weft_sample = warp_sample * (primary_yarn.width / (resolution/epi)); 

 	var num_wefts = Math.floor(image.naturalHeight / weft_sample);

	var data = ctx.getImageData(0,0,image.naturalWidth, image.naturalHeight).data;


	for(var r = 0; r < num_wefts; r++){
		weave.wefts.push({
			resolution: resolution,
			warps: [],
			yarn_type: yarn_type,
			color: color
		});

			for(var c = 0; c < (ends/resolution); c++){

				var fq = {0: 0, 1: 0};
				var y = Math.floor(weft_sample*r);
				var x = Math.floor(warp_sample*c);

				//sample the pixel square relative to this row and column
				for(var i = 0; i < weft_sample; i++){
					for(var j = 0; j < warp_sample; j++){

						var ndx = (y+j)*image.naturalWidth;				//get row index
						ndx +=    x+i;									//get column index
						ndx *= 	  4; 									//because every pixel has 4 values

						if(data[ndx] <= 128) fq[0]++;
						else fq[1]++;

					}
				}
				if(fq[0] >= ((fq[0] + fq[1])*threshold)){
					weave.wefts[r].warps[c] = select_primitive;
				}else{
					weave.wefts[r].warps[c] = default_primitive;
				} 
		
		}
	}


	console.log(image_name, "complete");
	return weave;
}


function computeYardage(){
	for (w in weaves){
		var weave = weaves[w];
		weave.yards = 0;
		for(r in weave.wefts){
			var row = weave.wefts[r];
			var left_start = -1;
			var right_start = -1;
			for(var i = 0; i < (row.warps.length/2); i++){
				var left = i;
				var right = row.warps.length - 1 - i;

				if(row.warps[left].id != 2) left_start = left;
				if(row.warps[right].id != 2) right_start = right;
			}
			//console.log(left_start, right_start);
			if(left != -1 && right != -1){
				weave.yards += (right - left) * ends/epi;
			}
		}

		weave.yards /= 36.;
		console.log(weave.yards);
	}
}

function mergeWeaves(a, b, c){

	var weave = {
    	wefts: [],
    	yarn_type: yarn_types[2]
    }

	for(var r = 0; r < a.wefts.length; r++){
		weave.wefts.push(a.wefts[r]);
		weave.wefts.push(b.wefts[r]);
		weave.wefts.push(c.wefts[r]);
	}

	console.log(weave);

	return weave;
}

function getInstruction(number){

	var weave  = weaves[scene.showing];

	var row = weave.wefts.length - 1 - number;

	if(row < 0) return null;

	var cur_p = -1;
	var cur_count = 0;
	var is = " ";

	var warps = weave.wefts[row].warps;

	for(var w = 0; w < warps.length; w++){

		if(cur_p == -1){
			is = is.concat(warps[w].code);
			cur_count++;
			cur_p = warps[w];
		}else if(cur_p.code == warps[w].code){
			cur_count++;
			cur_p = warps[w];
		}else{
			is = is.concat(cur_count + " "+warps[w].code);
			cur_count = 1;
			cur_p = warps[w];
		}
	}

	is = is.concat(cur_count);

	return is;
}





