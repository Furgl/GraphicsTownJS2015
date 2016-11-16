var grobjects = grobjects || [];

var Mountains = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	Mountains = function Mountains(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Mountains.prototype.init = function(drawingState) {
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			var radius = 9;
			var numMountains = 20;
			var theta = (Math.PI/180) * (360/numMountains); //Degrees = radians * (180 / π)
			for (var i=0; i<numMountains; i++)
				pos.push.apply(pos, shapes.setupCone(2.5+Math.random()*2-1, 3.5+Math.random()*3.5-1.75, 0.8+Math.random()*0.2-0.1, 0.7+Math.random()*0.2-0.1, 0.6+Math.random()*0.2-0.1, colors, Math.cos(theta*i) * radius, 0, Math.sin(theta*i) * radius, Math.random()-0.5));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Mountains.prototype.draw = function(drawingState) {
		drawingState.gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isMountains: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(drawingState.gl, drawingState.gl.TRIANGLES, buffers);
	};
	Mountains.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Mountains("Mountains",[0,0.001,0],3));