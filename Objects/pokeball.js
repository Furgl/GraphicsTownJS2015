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
		var gl=drawingState.gl;
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupSphere(0.54, "all", 0.0, 0.0, 0.0, colors, 0, 0, 0)); //inside
			pos.push.apply(pos, shapes.setupSphere(0.55, "top", 1.0, 0.0, 0.0, colors, 0, 0, 0)); //top
			pos.push.apply(pos, shapes.setupSphere(0.55, "bottom", 1.0, 1.0, 1.0, colors, 0, 0, 0)); //bottom
			pos.push.apply(pos, shapes.setupCylinder(0.15, 0.1, 0.98, 1.0, 1.0, colors, 0, 0, -0.53)); //outer button
			pos.push.apply(pos, shapes.setupCylinder(0.1, 0.1, 0.98, 1.0, 1.0, colors, 0, 0, -0.57)); //inner button
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Pokeball.prototype.draw = function(drawingState) {
/*		var distance = 50;
		this.position = [drawingState.sunDirection[0]*distance, drawingState.sunDirection[1]*distance, drawingState.sunDirection[2]*distance];*/
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		//var modelViewMatrix = twgl.m4.multiply(modelM, drawingState.view);
		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));
		twgl.m4.setTranslation(modelM,this.position,modelM);
		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isPokeball: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: modelM});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
	};
	Pokeball.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Pokeball("Pokeball",[0,1.7,0],3));