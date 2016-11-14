var grobjects = grobjects || [];

var Moon = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	Moon = function Moon(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Moon.prototype.init = function(drawingState) {
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupCircle(1.0, 0.8, 0.8, 0.8, colors));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Moon.prototype.draw = function(drawingState) {
		//position
		/*var distance = 50;
		this.position = [drawingState.sunDirection[0]*distance, drawingState.sunDirection[1]*distance, drawingState.sunDirection[2]*distance];*/
		
		drawingState.gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);
		
		//face camera
		//twgl.m4.rotateX(model1, drawingState.realtime, model1); //front/back
		//twgl.m4.rotateY(model1, drawingState.realtime, model1); //along
		//twgl.m4.rotateZ(model1, drawingState.realtime, model1); //left/right

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isMoon: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(drawingState.gl, drawingState.gl.TRIANGLES, buffers);
	};
	Moon.prototype.center = function(drawingState) {
		return this.position;
	}
})();
//grobjects.push(new Moon("Moon",[0,3,0],3));