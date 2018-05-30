function Scene2D(element){
	this.element = element;
 	this.w = element.width();
	this.h = element.height();
	this.draw = SVG('renderArea');
	var that = this;
	this.weaves = [];
	this.showing = 0;
	this.highlight = this.draw.nested();


	$(window).on('resize', function(){
		that.resize();
	});

}


Scene2D.prototype.element = null;
Scene2D.prototype.w= 1;
Scene2D.prototype.h= 1;
Scene2D.prototype.draw = null;
Scene2D.prototype.weaves = null;
Scene2D.prototype.showing = 0;
Scene2D.prototype.highlight = null;

Scene2D.prototype.drawWeave = function (id){
	console.log("hiding "+this.showing+" showing"+id);
	for(w in this.weaves){
		this.weaves[w].hide();
	}
	this.weaves[id].show();
	this.showing = id;
}


Scene2D.prototype.renderWeave = function(id, weave){
	
	//clear the last drawing

	var grid_w = (this.w / 2.) / ends;									//half screen width divided by number of ends - each cell should have this width
	var warp_w = (1./epi); 					            				//actual spacing between warps every other warp

	var yarn = primary_yarn;
	var grid_h = (grid_w) * (yarn.width/warp_w);
	
	var line_width = grid_w/64;
	var height = 0;

	var nested = this.draw.nested();
	nested.attr({x: this.w/4, y:60});


	for(r in weave.wefts){
		nested.line(0, r*grid_h, ends*grid_w, r*grid_h).stroke({width:line_width});
		height += grid_h;
	}
	nested.line(0, height, ends*grid_w, height).stroke({width:line_width});

	nested.rect(ends*grid_w, height).fill("#fff").back();

	//draw all weave columns
	for(var c = 0; c < ends; c++){
		nested.line(c*grid_w, 0, c*grid_w, height).stroke({width:line_width});
	}
	nested.line(ends*grid_w, 0, ends*grid_w, height).stroke({width:line_width});


	for(var r = 0; r < weave.wefts.length; r++){
		var weft = weave.wefts[r];
		for(var c = 0; c < weft.warps.length; c++){
				var p = weft.warps[c];

				if(p.id == 1){
					nested.rect(grid_w*weft.resolution, grid_h).move(grid_w*c*weft.resolution, grid_h*r).fill(weft.color);
				}
		}
	}


	//add dimensions - x
	nested.line(0, -10, ends*grid_w, -10).attr({
		stroke: '#f00'
		, 'stroke-width': 0.5
		});

	var dim_w = ends / epi;
	dim_w = Math.floor(dim_w*100) / 100.;


	nested.text(dim_w+" in")
	.move(ends*grid_w/2, -25)
	.fill("#f00")
	.stroke("none");


	//add dimensions - y
	nested.line(-10, 0, -10, height).attr({
		stroke: '#f00'
		, 'stroke-width': 0.5
		});

	
	var dim_h = weave.wefts.length*yarn.width;

	dim_h = Math.floor(dim_h*100) / 100.;

	nested.text(dim_h+" in")
	.move(-75, height/2)
	.fill("#f00")
	.stroke("none");

	this.weaves[id] = nested;	
}


Scene2D.prototype.highlightRow = function(value){

	var weave = weaves[this.showing];
	var row = weave.wefts.length - 1 - value;

	if(row <= 0) return;

	var grid_w = (this.w / 2. / ends)			       				 //half screen width divided by number of ends - each cell should have this width
	var warp_w = (1/epi); 										    //actual spacing between warps every other warp

	var yarn = primary_yarn;
	var grid_h = (grid_w) * (yarn.width/warp_w);
	

	this.highlight.remove();
	this.highlight = this.draw.nested();							//needs garbage collection - gets called everytime and abandoned

	var r = weave.wefts[row].warps;
	
	this.highlight.attr({x: this.w/4, y:60});
	this.highlight
	.rect(ends*grid_w, grid_h)
	.move(0, grid_h*row)
	.attr({
		  fill: '#f06'
		, 'fill-opacity': 0.0
		, stroke: weave.wefts[row].color
		, 'stroke-width': 0.5
		})
	.front();

	this.highlight
	.rect(ends*grid_w, grid_h*3)
	.move(0, grid_h*(row+1))
	.attr({
		  fill: '#fff'
		, 'fill-opacity': 0.9
		})
	.front();


	var t = getInstruction(value);
	this.highlight.text("row:"+value+" - "+t)
	.move(0, grid_h*(row+1))
	.stroke("none")
	.fill(weave.wefts[row].color)
	.front();



}








