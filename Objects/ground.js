var grobjects = grobjects || [];

var Ground = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	Ground = function Ground(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Ground.prototype.init = function(drawingState) {
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupCircle(1, 0.2, 0.5, 0.2, colors));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Ground.prototype.draw = function(drawingState) {
		drawingState.gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isGround: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(drawingState.gl, drawingState.gl.TRIANGLES, buffers);
	};
	Ground.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Ground("Ground",[0,0,0],30));