var grobjects = grobjects || [];

var Sun = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var shapes = new Shapes();

	Sun = function Sun(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Sun.prototype.init = function(drawingState) {
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);
		}
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupCircle(1.0, 1.0, 0.9, 0.0, colors));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: pos, inColor: colors, vNormal: normals});
		}

	};
	Sun.prototype.draw = function(drawingState) {
		//position
		/*var distance = 50;
		this.position = [drawingState.sunDirection[0]*distance, drawingState.sunDirection[1]*distance, drawingState.sunDirection[2]*distance];*/
		
		drawingState.gl.useProgram(shaderProgram.program);
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);
		
		//face camera
		var distance = Math.sqrt(Math.pow(drawingState.drivePos[0]-this.position[0], 2)+Math.pow(drawingState.drivePos[1]-this.position[1], 2)+Math.pow(drawingState.drivePos[2]-this.position[2], 2));
		var rotX = Math.asin((drawingState.drivePos[2]-this.position[2])/distance);
	    var rotY = Math.asin((drawingState.drivePos[0]-this.position[0])/distance);
		var rotZ = Math.asin((drawingState.drivePos[1]-this.position[1])/distance);
		twgl.m4.rotateX(model1, rotX, model1); //front/back
		twgl.m4.rotateY(model1, rotY, model1); //along
		twgl.m4.rotateX(model1, rotZ, model1); //left/right
		

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{isSun: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(drawingState.gl, drawingState.gl.TRIANGLES, buffers);
	};
	Sun.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Sun("Sun",[0,3,0],3));