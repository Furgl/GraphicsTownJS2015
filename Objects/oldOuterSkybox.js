var grobjects = grobjects || [];

var OuterSkybox = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	OuterSkybox = function OuterSkybox(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	OuterSkybox.prototype.init = function(drawingState) {
		var gl = drawingState.gl;

		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupRectangularPrism(1, 1, 1, 0.0, 1.0, 1.0, colors, []));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: normals});
		}
	};
	OuterSkybox.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isOuterSkybox: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
	};
	OuterSkybox.prototype.center = function(drawingState) {
		return this.position;
	}
})();
//grobjects.push(new OuterSkybox("OuterSkybox",[0,1,0],1));