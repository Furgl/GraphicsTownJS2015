var grobjects = grobjects || [];

var Pokeball = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	Pokeball = function Pokeball(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Pokeball.prototype.init = function(drawingState) {
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupSphere(1, "all", 0.0, 0.0, 0.0, colors, 0, 0, 0)); //inside
			pos.push.apply(pos, shapes.setupSphere(1.01, "top", 1.0, 0.0, 0.0, colors, 0, 0, 0)); //top
			pos.push.apply(pos, shapes.setupSphere(1.01, "bottom", 1.0, 1.0, 1.0, colors, 0, 0, 0)); //bottom
			pos.push.apply(pos, shapes.setupCylinder(0.28, 0.1, 0.98, 1.0, 1.0, colors, 0, 0, -1)); //outer button
			pos.push.apply(pos, shapes.setupCylinder(0.19, 0.1, 0.98, 1.0, 1.0, colors, 0, 0, -1.05)); //inner button
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Pokeball.prototype.draw = function(drawingState) {
		drawingState.gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);
		twgl.m4.rotateY(model1, Math.PI, model1);

		/*twgl.m4.translate(model1, [0.0, Math.abs(Math.cos(drawingState.realtime/160)+0.7)*0.3-0.1, 0], model1);
		twgl.m4.rotateY(model1, Math.cos(drawingState.realtime/250)*0.3, model1);
		twgl.m4.rotateX(model1, 0.6 + Math.cos(drawingState.realtime/300)*0.3, model1);
		if(drawingState.realtime*180/160/Math.PI % 720 >= 620 || drawingState.realtime*180/160/Math.PI % 720 < 100)
			twgl.m4.rotateX(model1, 3+3.14*Math.cos(drawingState.realtime/160-5*Math.PI/9), model1);
		else if(drawingState.realtime*180/160/Math.PI % 720 >= 260 && drawingState.realtime*180/160/Math.PI % 720 < 460)
			twgl.m4.rotateX(model1, 3-3.14*Math.cos(drawingState.realtime/160-5*Math.PI/9), model1);*/

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isPokeball: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(drawingState.gl, drawingState.gl.TRIANGLES, buffers);
	};
	Pokeball.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Pokeball("Pokeball",[0,0,0],34));