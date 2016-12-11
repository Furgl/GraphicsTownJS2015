var grobjects = grobjects || [];

var Bird = undefined;

(function() {
	"use strict";

	var shaderProgram = undefined;
	var bufferBody;
	var texCoordsBody;
	var bufferWing1;
	var bufferWing2;
	var texCoordsWing;

	var image = new Image();
	image.src = "data:image/jpeg;base64,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";

	var Hermite = function(t) {
		return [
			2*t*t*t-3*t*t+1,
			t*t*t-2*t*t+t,
			-2*t*t*t+3*t*t,
			t*t*t-t*t
			];
	}

	var HermiteDerivative = function(t) {
		return [
			6*t*t-6*t,
			3*t*t-4*t+1,
			-6*t*t+6*t,
			3*t*t-2*t
			];
	}

	// This can generate both the function C(t) and the derivative C'(t),
	// depending on the basis passed in
	var Cubic = function (basis,P,t){
		var b = basis(t);
		var result=twgl.v3.mulScalar(P[0],b[0]);
		twgl.v3.add(twgl.v3.mulScalar(P[1],b[1]),result,result);
		twgl.v3.add(twgl.v3.mulScalar(P[2],b[2]),result,result);
		twgl.v3.add(twgl.v3.mulScalar(P[3],b[3]),result,result);
		return result;
	}

	var findAttribLocations = function (gl, program, attributes) {
		var out = {};
		for(var i = 0; i < attributes.length;i++){
			var attrib = attributes[i];
			out[attrib] = gl.getAttribLocation(program, attrib);
		}
		return out;
	}

	var enableLocations = function (gl, attributes) {
		for(var key in attributes){
			var location = attributes[key];
			gl.enableVertexAttribArray(location);
		}
	}

	//always a good idea to clean up your attrib location bindings when done. You wont regret it later. 
	var disableLocations = function (gl, attributes) {
		for(var key in attributes){
			var location = attributes[key];
			gl.disableVertexAttribArray(location);
		}
	}

	//creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
	//it's mostly going to be a try it once, flip if you need to. 
	var createGLTexture = function (gl, image, flipY) {
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		if(flipY)
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); //CLAMP_TO_EDGE
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		return texture;
	}

	Bird = function Bird(name, position, size) {
		this.name = name;
		this.position = position || [0,0,0];
		this.size = size || 1.0;
		this.program = null;
		this.attributes = null;
		this.texture = null;
		this.shapes = new Shapes();
		this.vertices = null;
		this.uvs = [];

		this.start = [this.position[0], this.position[1], this.position[2]];
		this.end = [Math.random()*5, this.position[1], Math.random()*5];
		this.increasing = this.position[0] < this.end[0];
		this.prevPosition = [this.position[0], this.position[1], this.position[2]];
		this.ticks = Math.random()*10;
		this.d0 = [0,0,0];
		this.d1 = [(Math.random()-0.5)*5,(Math.random()-0.5)*5,(Math.random()-0.5)*5];
		this.prevTime = 0;
	}

	Bird.prototype.init = function (drawingState) {
		if (!shaderProgram) 
			shaderProgram = twgl.createProgramInfo(drawingState.gl, ["vs", "fs"]);

		var gl = drawingState.gl;

		this.program = shaderProgram.program;
		this.attributes = findAttribLocations(gl, this.program, ["vPos", "vTexCoord"]);

		this.texture = createGLTexture(gl, image, true);

		//BODY
		var vertices = [
			0.0,0.5,0.0, -0.4,0.0,0.0, 0.0,-0.4,0.0, //neck/head
			0.0,0.5,0.0, 0.0,0.0,0.0, 1.8,0.0,0.0, //body
			1.3,0.0,0.0, 1.8,0.0,0.0, 1.9,0.25,0.0 //tail
			];
		var texCoordsBody2 = [
			0,0, 1,1, 1,0, //eyes
			0.5,0.5, 1,0, 0,1,
			0.5,0.5, 1,0, 0,1,
			];
		var normals = this.shapes.calculateNormals(vertices);

		bufferBody = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: vertices, 
			inColor: vertices, vNormal: normals});

		texCoordsBody = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBody);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsBody2), gl.STATIC_DRAW);
		texCoordsBody.itemSize = 2;
		texCoordsBody.numItems = texCoordsBody2.length / 2;

		//WINGS
		var vertices = [
			0.0,0.0,0.0, 1.0,1.5,0.0, 0.7,0.0,0.0
			];
		var texCoordsWing2 = [
			0.5,0.5, 1,0, 0,1,
			];
		var normals1 = [
			0,0,-1, 0,0,-1, 0,0,-1
			];
		var normals2 = [
			0,0,1, 0,0,1, 0,0,1
			];

		bufferWing1 = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: vertices, 
			inColor: vertices, vNormal: normals1});

		bufferWing2 = twgl.createBufferInfoFromArrays(drawingState.gl, {vPos: vertices, 
			inColor: vertices, vNormal: normals2});

		texCoordsWing = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsWing);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoordsWing2), gl.STATIC_DRAW);
		texCoordsWing.itemSize = 2;
		texCoordsWing.numItems = texCoordsWing2.length / 2;
	} 

	Bird.prototype.center = function () {
		return this.position;
	}

	Bird.prototype.draw = function (drawingState) {
		var gl = drawingState.gl;

		gl.useProgram(this.program);
		gl.disable(gl.CULL_FACE);

		var P = [this.start,this.d0,this.end,this.d1];
		var t = this.ticks/200;

		this.position = Cubic(Hermite,P,t);
		var rotation = twgl.m4.lookAt([0,0,0],Cubic(HermiteDerivative,P,t),[0,1,0]);
		rotation = twgl.m4.axisRotate(rotation, [0,1,0], -Math.PI/2);

		if (this.position[0] < this.end[0] != this.increasing || this.ticks > 300) { //when it reaches distination
			if (this.ticks > 300)
				console.log("failsafe activated!");
			this.start = [this.position[0], this.position[1], this.position[2]];
			do 
				var newEnd = [(Math.random()-0.5)*30, (Math.random()-0.5)*2+15, (Math.random()-0.5)*30];
			while (Math.sqrt(Math.pow(newEnd[0]-this.start[0], 2)+Math.pow(newEnd[1]-this.start[1], 2)+
					Math.pow(newEnd[2]-this.start[2], 2)) < 18);
			this.end = newEnd;
			this.increasing = this.position[0] < this.end[0];
			this.ticks = 0;
			this.d0 = this.d1;
			this.d1 = [(Math.random()-0.5)*100,(Math.random()-0.5)*50,(Math.random()-0.5)*100];
		}

		this.prevPosition = [this.position[0], this.position[1], this.position[2]];
		if (this.prevTime != drawingState.realtime)
			this.ticks++;
		this.prevTime = drawingState.realtime;

		//BODY
		var modelM = twgl.m4.scaling([this.size,this.size, this.size]);
		twgl.m4.multiply(rotation, modelM, modelM);
		twgl.m4.setTranslation(modelM, this.position, modelM);

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,bufferBody);
		twgl.setUniforms(shaderProgram,{isGround: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: modelM});

		gl.activeTexture(gl.TEXTURE0);
		enableLocations(gl, this.attributes)

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBody);
		gl.vertexAttribPointer(this.attributes.vTexCoord, texCoordsBody.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, texCoordsBody.numItems);

		//WING1
		var modelM = twgl.m4.scaling([this.size,this.size, this.size]);
		twgl.m4.multiply(rotation, modelM, modelM);
		var flap = Math.cos(this.ticks/8-5*Math.PI/9) + Math.PI/2;
		twgl.m4.setTranslation(modelM,[this.position[0], this.position[1]+0.3-flap/20, this.position[2]], modelM);
		twgl.m4.rotateX(modelM, flap, modelM); //flap

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,bufferWing1);
		twgl.setUniforms(shaderProgram,{isGround: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: modelM});

		gl.activeTexture(gl.TEXTURE0);
		enableLocations(gl, this.attributes)

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsWing);
		gl.vertexAttribPointer(this.attributes.vTexCoord, texCoordsWing.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, texCoordsWing.numItems);

		//WING2
		var modelM = twgl.m4.scaling([this.size,this.size, this.size]);
		twgl.m4.multiply(rotation, modelM, modelM);
		flap = -flap;
		twgl.m4.setTranslation(modelM,[this.position[0], this.position[1]+0.3+flap/20, this.position[2]], modelM);
		twgl.m4.rotateX(modelM, flap, modelM); //flap

		var normMatrix = twgl.m4.inverse(twgl.m4.transpose(modelM));
		twgl.setBuffersAndAttributes(drawingState.gl,shaderProgram,bufferWing2);
		twgl.setUniforms(shaderProgram,{isGround: 1,
			normalMatrix: normMatrix, view:drawingState.view, proj:drawingState.proj, 
			lightDir:drawingState.sunDirection, model: modelM});

		gl.activeTexture(gl.TEXTURE0);
		enableLocations(gl, this.attributes)

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsWing);
		gl.vertexAttribPointer(this.attributes.vTexCoord, texCoordsWing.itemSize, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, texCoordsWing.numItems);

		disableLocations(gl, this.attributes);
	}
})();
grobjects.push(new Bird("Bird",[(Math.random()-0.5)*20,(Math.random()-0.5)*5+10,(Math.random()-0.5)*20],1));