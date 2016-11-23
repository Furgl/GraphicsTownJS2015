var grobjects = grobjects || [];

var Weedle = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = [];
	var shapes = new Shapes();

	Weedle = function Weedle(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.state = "idle";
		this.idleTime = 0;
		this.origPos = [];
		this.destination = [];
		this.rotationY = Math.PI/2;
		this.origRotationY;
		this.prevTime = 0;
	}
	Weedle.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["vs", "fs"]);
		}
		if (buffers.length == 0) {
			var colors = [];
			var pos = [];
			pos.push.apply(pos, shapes.setupSphere(0.6, "all", 0.9, 0.65, 0.5, colors, 0, 0, 0)); //head
			pos.push.apply(pos, shapes.setupSphere(0.25, "all", 0.9, 0.6, 1.0, colors, 0, 0, -0.65)); //nose
			pos.push.apply(pos, shapes.setupSphere(0.07, "all", 0.0, 0.0, 0.0, colors, 0.25, 0.3, -0.45)); //left eye
			pos.push.apply(pos, shapes.setupSphere(0.07, "all", 0.0, 0.0, 0.0, colors, -0.25, 0.3, -0.45)); //right eye
			pos.push.apply(pos, shapes.setupCone(0.2, 0.6, 1.0, 1.0, 1.0, colors, 0, 0.4, -0.2, -0.3)); //head needle
			buffers[0] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
			//weedle 2
			var colors = [];
			var pos = [];
			pos.push.apply(pos, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors, 0, -0.6, 0.5)); //body 1
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, 0.25, -0.9, 0.2)); //foot 1 - left
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.25, -0.9, 0.2)); //foot 1 - right
			buffers[1] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
			//weedle 3
			var colors = [];
			var pos = [];
			pos.push.apply(pos, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors, 0, -1.0, 1.0)); //body 2
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, 0.25, -1.3, 0.7)); //foot 2 - left
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.25, -1.3, 0.7)); //foot 2 - right
			buffers[2] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
			//weedle 4
			var colors = [];
			var pos = [];
			pos.push.apply(pos, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors, -0.1, -1.3, 1.5)); //body 3
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, 0.15, -1.6, 1.2)); //foot 3 - left
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.35, -1.6, 1.2)); //foot 3 - right
			buffers[3] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
			//weedle 5
			var colors = [];
			var pos = [];
			pos.push.apply(pos, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors, -0.3, -1.4, 2.1)); //body 4
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.05, -1.7, 1.9)); //foot 4 - left
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.55, -1.7, 1.9)); //foot 4 - right
			buffers[4] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
			//weedle 6
			var colors = [];
			var pos = [];			
			pos.push.apply(pos, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors, -0.6, -1.4, 2.7)); //body 5
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.45, -1.7, 2.4)); //foot 5 - left
			pos.push.apply(pos, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors, -0.85, -1.7, 2.4)); //foot 5 - right
			pos.push.apply(pos, shapes.setupCone(0.2, 0.8, 1.0, 1.0, 1.0, colors, -0.65, -1.2, 2.8, 0.4)); //tail needle
			buffers[5] = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: shapes.calculateNormals(pos)});
		}

	};
	Weedle.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);

		for (var i=0; i<buffers.length; i++) {
			var model = twgl.m4.scaling([this.size,this.size,this.size]);
			twgl.m4.setTranslation(model,this.position,model);
			twgl.m4.rotateY(model, this.rotationY, model);

			//animations
			if (this.state == "idle" && Math.random()*1000000 < this.idleTime) {
				this.origRotationY = this.rotationY;
				this.origPos = this.position.slice();
				do {
					this.destination = [Math.random()*20-10, this.position[1], Math.random()*20-10];
					var distance = Math.sqrt(Math.pow(Math.abs(this.destination[0]-this.position[0]), 2)+Math.pow(Math.abs(this.destination[2]-this.position[2]), 2));
				} while(distance < 10);
				this.state = "turning";
			}			
			if (this.state == "idle" || this.state == "turning") {
				switch (i) {//switch on body piece
				case 0:
					twgl.m4.translate(model, [Math.cos(drawingState.realtime/400)*0.3,0+Math.cos(drawingState.realtime/200)*0.1,0], model);
					twgl.m4.rotateY(model, -Math.cos(drawingState.realtime/400)*0.2, model);
					twgl.m4.rotateX(model, Math.cos(drawingState.realtime/200)*0.2-0.3, model);
					break;
				case 1:
					twgl.m4.translate(model, [Math.cos(drawingState.realtime/400)*0.15,0+Math.cos(drawingState.realtime/200)*0.05,0], model);
					break;
				case 2:
					twgl.m4.translate(model, [Math.cos(drawingState.realtime/400)*0.1,0+Math.cos(drawingState.realtime/200)*0.025,0], model);
					break;
				case 3:
					twgl.m4.translate(model, [Math.cos(drawingState.realtime/400)*0.05,0,0], model);
					break;
				case 4:
					twgl.m4.translate(model, [Math.cos(drawingState.realtime/400)*0.03,0,0], model);
					break;
				case 5:
					break;
				}
				if (this.state == "idle")
					this.idleTime++;
			}
			if (this.state == "turning" && this.prevTime != drawingState.realtime) {
				var rotY; //final angle
				if (this.destination[2]-this.position[2] < 0)
					rotY = Math.atan((this.destination[0]-this.position[0])/(this.destination[2]-this.position[2])); 
				else
					rotY = Math.atan((this.destination[0]-this.position[0])/(this.destination[2]-this.position[2])) + Math.PI;
				if (rotY > this.rotationY) 
					this.rotationY += Math.min(rotY-this.rotationY, 0.002); 
				else if (rotY < this.rotationY) 
					this.rotationY -= Math.min(this.rotationY-rotY, 0.002);
				else
					this.state = "moving";
			}
			if (this.state == "moving") {
				switch (i) {//switch on body piece
				case 0:
					twgl.m4.translate(model, [0,(-Math.cos(drawingState.realtime/200)+1)*0.15-1.1,(Math.cos(drawingState.realtime/200)+1)*0.15-0.6], model);
					twgl.m4.rotateX(model, -Math.cos(drawingState.realtime/200)*0.2-0.1, model);
					break;
				case 1:
					twgl.m4.translate(model, [0,(Math.cos(drawingState.realtime/200)+1)*0.01-0.8,(Math.cos(drawingState.realtime/200)+1)*0.15-0.4], model);
					break;
				case 2:
					twgl.m4.translate(model, [0,(Math.cos(drawingState.realtime/200)+1)*0.2-0.37,(Math.cos(drawingState.realtime/200)+1)*0.15-0.25], model);
					break;
				case 3:
					twgl.m4.translate(model, [0.1,(Math.cos(drawingState.realtime/200)+1)*0.47-0.1,0], model);
					break;
				case 4:
					twgl.m4.translate(model, [0.3,(Math.cos(drawingState.realtime/200)+1)*0.2-0.01,(-Math.cos(drawingState.realtime/200)+1)*0.15-0.16], model);
					break;
				case 5:
					twgl.m4.translate(model, [0.6,(Math.cos(drawingState.realtime/200)+1)*0.01,(-Math.cos(drawingState.realtime/200)+1)*0.2-0.18], model);
					break;
				}
				if (this.position[0] == this.destination[0] && this.position[2] == this.destination[2]) {
					this.state = "idle";
					this.idleTime = 0;
				}
				else if (this.prevTime != drawingState.realtime) {
					if (this.position[0] > this.destination[0])
						this.position[0] -= Math.min(Math.abs(this.destination[0]-this.position[0]), (-Math.cos(drawingState.realtime/200)+1)*Math.abs(this.destination[0]-this.origPos[0])/3500);
					else if (this.position[0] < this.destination[0])
						this.position[0] += Math.min(Math.abs(this.destination[0]-this.position[0]), (-Math.cos(drawingState.realtime/200)+1)*Math.abs(this.destination[0]-this.origPos[0])/3500); //Math.abs(this.destination[0]-this.origPos[0])/1000
					if (this.position[2] > this.destination[2])
						this.position[2] -= Math.min(Math.abs(this.destination[2]-this.position[2]), (-Math.cos(drawingState.realtime/200)+1)*Math.abs(this.destination[2]-this.origPos[2])/3500);
					else if (this.position[2] < this.destination[2])
						this.position[2] += Math.min(Math.abs(this.destination[2]-this.position[2]), (-Math.cos(drawingState.realtime/200)+1)*Math.abs(this.destination[2]-this.origPos[2])/3500);
				}
			}

			var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model));
			twgl.setBuffersAndAttributes(gl,shaderProgram,buffers[i]);
			twgl.setUniforms(shaderProgram,{isWeedle:1,
				normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
				lightDir:drawingState.sunDirection, model: model});
			twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers[i]);
		}
		this.prevTime = drawingState.realtime;
	};
	Weedle.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Weedle("Weedle",[0,1.85,0],1));