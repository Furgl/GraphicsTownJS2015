var grobjects = grobjects || [];

var Weedle = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers1 = undefined; 
	var buffers2 = undefined; 
	var buffers3 = undefined; 
	var shapes = new Shapes();

	Weedle = function Weedle(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
	}
	Weedle.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["vs", "fs"]);
		}
		if (!buffers1) {
			var colors1 = [];
			var pos1 = [];
			pos1.push.apply(pos1, shapes.setupSphere(0.6, "all", 0.9, 0.65, 0.5, colors1, 0, 0, 0)); //head
			pos1.push.apply(pos1, shapes.setupSphere(0.25, "all", 0.9, 0.6, 1.0, colors1, 0, 0, -0.65)); //nose
			pos1.push.apply(pos1, shapes.setupSphere(0.07, "all", 0.0, 0.0, 0.0, colors1, 0.25, 0.3, -0.45)); //left eye
			pos1.push.apply(pos1, shapes.setupSphere(0.07, "all", 0.0, 0.0, 0.0, colors1, -0.25, 0.3, -0.45)); //right eye
			pos1.push.apply(pos1, shapes.setupCone(0.2, 0.6, 1.0, 1.0, 1.0, colors1, 0, 0.4, -0.2, -0.3)); //head needle
			buffers1 = twgl.createBufferInfoFromArrays(gl, {vPos: pos1, inColor: colors1, vNormal: shapes.calculateNormals(pos1)});
			//weedle 2
			var colors2 = [];
			var pos2 = [];
			pos2.push.apply(pos2, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors2, 0, -0.6, 0.5)); //body 1
			pos2.push.apply(pos2, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors2, 0.25, -0.7, 0.1)); //foot 1 - left
			pos2.push.apply(pos2, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors2, -0.25, -0.7, 0.1)); //foot 1 - right
			buffers2 = twgl.createBufferInfoFromArrays(gl, {vPos: pos2, inColor: colors2, vNormal: shapes.calculateNormals(pos2)});
			//weedle 3
			var colors3 = [];
			var pos3 = [];
			pos3.push.apply(pos3, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors3, 0, -1.0, 1.0)); //body 2
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, 0.25, -1.1, 0.6)); //foot 2 - left
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.25, -1.1, 0.6)); //foot 2 - right
			pos3.push.apply(pos3, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors3, -0.1, -1.3, 1.5)); //body 3
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, 0.15, -1.4, 1.1)); //foot 3 - left
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.35, -1.4, 1.1)); //foot 3 - right
			pos3.push.apply(pos3, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors3, -0.3, -1.4, 2.1)); //body 4
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.05, -1.5, 1.8)); //foot 4 - left
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.55, -1.5, 1.8)); //foot 4 - right
			pos3.push.apply(pos3, shapes.setupSphere(0.4, "all", 0.9, 0.65, 0.5, colors3, -0.6, -1.3, 2.7)); //body 5
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.45, -1.4, 2.3)); //foot 5 - left
			pos3.push.apply(pos3, shapes.setupSphere(0.12, "all", 0.9, 0.6, 0.8, colors3, -0.85, -1.4, 2.3)); //foot 5 - right
			pos3.push.apply(pos3, shapes.setupCone(0.2, 0.8, 1.0, 1.0, 1.0, colors3, -0.65, -1.1, 2.8, 0.4)); //tail needle
			buffers3 = twgl.createBufferInfoFromArrays(gl, {vPos: pos3, inColor: colors3, vNormal: shapes.calculateNormals(pos3)});
		}

	};
	Weedle.prototype.draw = function(drawingState) {
		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		//weedle 1
		var model1 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model1,this.position,model1);
		twgl.m4.rotateY(model1, Math.PI, model1);

		twgl.m4.translate(model1, [Math.cos(drawingState.realtime/400)*0.3,0+Math.cos(drawingState.realtime/200)*0.1,0], model1);
		twgl.m4.rotateY(model1, -Math.cos(drawingState.realtime/400)*0.2, model1);
		twgl.m4.rotateX(model1, Math.cos(drawingState.realtime/200)*0.2-0.3, model1);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model1));
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers1);
		twgl.setUniforms(shaderProgram,{
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model1});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers1);
		//weedle 2
		var model2 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model2,this.position,model2);
		twgl.m4.rotateY(model2, Math.PI, model2);

		twgl.m4.translate(model2, [Math.cos(drawingState.realtime/400)*0.225,0+Math.cos(drawingState.realtime/200)*0.075,0], model2);
		twgl.m4.rotateX(model2, 0, model2);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model2));
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers2);
		twgl.setUniforms(shaderProgram,{
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model2});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers2);
		//weedle 3
		var model3 = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(model3,this.position,model3);
		twgl.m4.rotateY(model3, Math.PI, model3);

		twgl.m4.translate(model3, [Math.cos(drawingState.realtime/400)*0.15,0+Math.cos(drawingState.realtime/200)*0.05,0], model3);
		twgl.m4.rotateX(model3, 0, model3);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(model3));
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers3);
		twgl.setUniforms(shaderProgram,{
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: model3});
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers3);
	};
	Weedle.prototype.center = function(drawingState) {
		return this.position;
	}
})();
grobjects.push(new Weedle("Weedle",[3,1.9,0],1));