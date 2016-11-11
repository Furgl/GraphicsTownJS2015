var grobjects = grobjects || [];
var groundPlaneSize = groundPlaneSize || 20;

(function() {
	"use strict";

	var vertexPos = [
		-groundPlaneSize, 0, -groundPlaneSize,
		groundPlaneSize, 0, -groundPlaneSize,
		groundPlaneSize, 0,  groundPlaneSize,
		-groundPlaneSize, 0, -groundPlaneSize,
		groundPlaneSize, 0,  groundPlaneSize,
		-groundPlaneSize, 0,  groundPlaneSize
		];

	var shaderProgram = undefined;
	var buffers = undefined;
	var shapes = new Shapes();

	var ground = {
			name : "Ground Plane",
			init : function(drawingState) {
				// an abbreviation...
				var gl = drawingState.gl;
				if (!shaderProgram) 
					shaderProgram = twgl.createProgramInfo(gl,["vs","fs"]);
				var pos = vertexPos;
				var normals = shapes.calculateNormals(pos);
				var colors = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
				buffers = twgl.createBufferInfoFromArrays(gl,{vPos: pos, inColor: colors, vNormal: normals});
			},
			draw : function(drawingState) {
				var gl = drawingState.gl;
				gl.useProgram(shaderProgram.program);
				var modelM = twgl.m4.scaling([1,1,1]);
				//var modelViewMatrix = twgl.m4.multiply(modelM, drawingState.view);
				var normMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));
				twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
				twgl.setUniforms(shaderProgram,{isPokeball: 0,
					normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
					lightDir:drawingState.sunDirection, model: modelM});
				twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
			},
			center : function(drawingState) {
				return [0,0,0];
			}

	};

	grobjects.push(ground);
})();