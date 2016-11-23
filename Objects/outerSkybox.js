var grobjects = grobjects || [];

var OuterSkybox = undefined;

(function() {
	"use strict";
	var shaderProgram = undefined;
	var buffers = undefined; 
	var textureBuffer = undefined;
	var texture = undefined;
	var shapes = new Shapes();
/*	var vertexTextureCoords = new Float32Array(
			[  -0.5, -0.5,    0.5, -0.5,    0.5,  0.5,   -0.5,  0.5,
				0.5, -0.5,    0.5,  0.5,   -0.5,  0.5,   -0.5, -0.5,
				-0.5,  0.5,   -0.5, -0.5,    0.5, -0.5,    0.5,  0.5,
				-0.5, -0.5,    0.5, -0.5,    0.5,  0.5,   -0.5,  0.5,
				0.5,  0.5,   -0.5,  0.5,   -0.5, -0.5,    0.5, -0.5,
				0.5,  0.5,   -0.5,  0.5,   -0.5, -0.5,    0.5, -0.5 ]);*/
    var vertexTextureCoords = new Float32Array(
            [  0, 0,   1, 0,   1, 1,   0, 1,
               1, 0,   1, 1,   0, 1,   0, 0,
               0, 1,   0, 0,   1, 0,   1, 1,
               0, 0,   1, 0,   1, 1,   0, 1,
               1, 1,   0, 1,   0, 0,   1, 0,
               1, 1,   0, 1,   0, 0,   1, 0 ]);
    
    // element index array
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back
	
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
		
/*	    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
	    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);*/
		
		if (!buffers) {
			var pos = [];
			var colors = [];
			pos.push.apply(pos, shapes.setupRectangularPrism(1, 1, 1, 0.0, 1.0, 1.0, colors, []));
			var normals = shapes.calculateNormals(pos);
			buffers = twgl.createBufferInfoFromArrays(gl, {vPos: pos, inColor: colors, vNormal: normals});

			// a buffer for textures
			textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
			textureBuffer.itemSize = 2;
			textureBuffer.numItems = 1;
		}

		// Set up texture
		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		var image = new Image();

		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			// Option 1 : Use mipmap, select interpolation mode
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		};
		image.crossOrigin = "anonymous";
		image.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";
		//window.setTimeout(draw,200);
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

	   /* shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
	    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);*/
		
/*		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		// Bind texture
		gl.bindTexture(gl.TEXTURE_2D, texture);
*/
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
	    // Bind texture
/*	    gl.bindTexture(gl.TEXTURE_2D, texture);

	    // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);*/
	};
	OuterSkybox.prototype.center = function(drawingState) {
		return this.position;
	}
})();
//grobjects.push(new OuterSkybox("OuterSkybox",[0,1,0],1));