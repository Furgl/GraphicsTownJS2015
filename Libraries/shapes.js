/**
 * 
 */

function Shapes() {}


Shapes.prototype.calculateNormals = function(posArray) {
	if (!posArray)
		return null;
	var normals = [];
	for (var i=0; i<posArray.length; i+=9) {
		var point1 = [posArray[i], posArray[i+1], posArray[i+2]];
		var point2 = [posArray[i+3], posArray[i+4], posArray[i+5]];
		var point3 = [posArray[i+6], posArray[i+7], posArray[i+8]];
		var u = twgl.v3.subtract(point2, point1);
		var v = twgl.v3.subtract(point3, point1);
		var normal = twgl.v3.cross(u, v);
		for (var j=0; j<3; j++) {
			normals.push(normal[0]);
			normals.push(normal[1]);
			normals.push(normal[2]);
		}
	}
	return normals;
};
Shapes.prototype.setupSphere2 = function(radius, shape) {
	var latitudeBands = 30;
	var longitudeBands = 30;
	var vertexPositionData = [];
	var normalData = [];
	var texCoords = [];
	for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta / (shape == "circle" ? 1000 : 1);
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / longitudeBands);
			var v = 1 - (latNumber / latitudeBands);

			normalData.push(x);
			normalData.push(y);
			normalData.push(z);
			texCoords.push(u);
			texCoords.push(v);
			vertexPositionData.push(radius * x);
			vertexPositionData.push(radius * y);
			vertexPositionData.push(radius * z);
		}
	}
	var indexData = [];
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}
 
	return {texCoords: texCoords, vertices: vertexPositionData, indexData: indexData, normals: normalData};
};
//puts points for triangles into array
Shapes.prototype.setupSphere = function(radius, part, r, g, b, colorArray, xOffset, yOffset, zOffset, texCoords) {
	if (!texCoords)
		texCoords = [];
	var points = [];
	//position
	var theta = 0, phi = 0, index = 0;
	//vertical stripes
	for (phi = 0; phi < 2.001 * Math.PI; phi = phi + (1 / 50) * Math.PI) {
		points[index] = [];
		//starts from top
		for (theta = 0; theta < 1.001 * Math.PI; theta = theta + (1 / 50) * Math.PI) {
			var x = xOffset + radius * Math.sin(theta) * Math.cos(phi);
			var y = yOffset + radius * Math.cos(theta);
			var z = zOffset + radius * Math.sin(theta) * Math.sin(phi);
			if ((part == "top" && y > 0.01) ||
					(part == "bottom" && y < 0.00) ||
					(part == "button" && x) ||
					(part == "all")) {
				points[index].push({x: x, y: y, z: z});				
			}
		}
		index++;
	}

	//array of points in triangle order
	var triangles = [];
	//each stripe
	for (var i = 0; i < points.length - 1; i += 1) {
		//each point in stripe
		for (var j = 0; j < points[i].length - 1; j += 1) {
			var point1 = points[i][j];
			var point2 = points[i][j + 1];
			var point3 = points[i + 1][j + 1];
			if (point1 && point2 && point3) {
				triangles.push(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z,
						point3.x, point3.y, point3.z);
				colorArray.push(r, g, b, r, g, b, r, g, b);
				texCoords.push(0,0, 1,0, 1,1);
			}
			point1 = points[i][j];
			point2 = points[i + 1][j + 1];
			point3 = points[i + 1][j];
			if (point1 && point2 && point3) {
				triangles.push(point1.x, point1.y, point1.z, point2.x, point2.y, point2.z,
						point3.x, point3.y, point3.z);
				colorArray.push(r, g, b, r, g, b, r, g, b);
			}
		}
	}
	return triangles;
};
Shapes.prototype.setupCylinder = function(radius, length, r, g, b, colorArray, xOffset, yOffset, zOffset) {
	var segments = 50;
	var triangles = [];
	var theta = (Math.PI/180) * (360/segments); //Degrees = radians * (180 / π) -> (Math.PI/180) * (360/segments);
	//bottom
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = Math.sin(theta*i) * radius + yOffset;
		var z = zOffset;
		triangles.push(x, y, z); 
		colorArray.push(r, g, b);
		triangles.push(xOffset, yOffset, zOffset); 
		colorArray.push(r, g, b); 
	}
	//middle
	for (var i=0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = Math.sin(theta*i) * radius + yOffset;
		var z = zOffset;
		triangles.push(x, y, z);
		colorArray.push(r, g, b);
		triangles.push(x, y, z + length);
		colorArray.push(r, g, b);
	}
	//top
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = Math.sin(theta*i) * radius + yOffset;
		var z = zOffset;
		triangles.push(x, y, z + length);
		colorArray.push(r, g, b);
		triangles.push(xOffset, yOffset, zOffset + length); 
		colorArray.push(r, g, b);
	}
	return triangles;
};
Shapes.prototype.setupCone = function(radius, length, r, g, b, colorArray, xOffset, yOffset, zOffset, zTilt) {
	var segments = 50;
	var triangles = [];
	var theta = (Math.PI/180) * (360/segments); //Degrees = radians * (180 / π)
	//bottom
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = 0.0 + yOffset;
		var z = Math.sin(theta*i) * radius + zOffset;
		triangles.push(x, y, z); 
		colorArray.push(r, g, b);
		triangles.push(xOffset, yOffset, zOffset); 
		colorArray.push(r, g, b); 
	}
	//cone
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = 0.0 + yOffset;
		var z = Math.sin(theta*i) * radius + zOffset;
		triangles.push(x, y, z);
		colorArray.push(r, g, b);
		triangles.push(xOffset, y + length, zTilt + zOffset);
		colorArray.push(r, g, b);
		if (i+1>segments*Math.PI) {
			triangles.push(xOffset, y + length, zTilt + zOffset);
			colorArray.push(r, g, b);
		}			
	}
	return triangles;
};
Shapes.prototype.setupCone2 = function(radius, length, xOffset, yOffset, zOffset, zTilt) {
	var segments = 50;
	var vertexPositionData = [];
	var texCoords = [];
	var theta = (Math.PI/180) * (360/segments); //Degrees = radians * (180 / π)
	//bottom
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = yOffset;
		var z = Math.sin(theta*i) * radius + zOffset;
		vertexPositionData.push(x, y, z); 
		texCoords.push(0, 0.5);
		vertexPositionData.push(xOffset, yOffset, zOffset); 
		texCoords.push(0.2, 0.5); 
	}
	//cone
	for (var i =0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius + xOffset;
		var y = yOffset;
		var z = Math.sin(theta*i) * radius + zOffset;
		vertexPositionData.push(x, y, z);
		texCoords.push(x, y);
		vertexPositionData.push(xOffset, y + length, zTilt + zOffset);
		texCoords.push(xOffset, y+length);
		if (i+1>segments*Math.PI) {
			vertexPositionData.push(xOffset, y + length, zTilt + zOffset);
			texCoords.push(xOffset, length);
		}			
	}
	var normalData = this.calculateNormals(vertexPositionData);
	return {vertices: vertexPositionData, texCoords: texCoords, normals: normalData};
};
Shapes.prototype.setupCircle = function(radius, r, g, b, colorArray) {
	var segments = 50;
	var triangles = [];
	var theta = (Math.PI/180) * (360/segments); //Degrees = radians * (180 / π)
	for (var i=0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius;
		var y = 0.0;
		var z = Math.sin(theta*i) * radius;
		triangles.push(x, y, z); 
		colorArray.push(r, g, b);
		triangles.push(0, 0, 0); 
		colorArray.push(r, g, b); 
	}
	return triangles;
};
Shapes.prototype.setupCircle2 = function(radius) {
	var segments = 50;
	var triangles = [];
	var texCoords = [];
	var theta = (Math.PI/180) * (360/segments); //Degrees = radians * (180 / π)
	for (var i=0; i<=segments*Math.PI; i++){
		var x = Math.cos(theta*i) * radius;
		var y = 0.0;
		var z = Math.sin(theta*i) * radius;
		triangles.push(x, y, z); 
		texCoords.push(x, z);
		triangles.push(0, 0, 0); 
		texCoords.push(0, 0); 
	}
	var normalData = this.calculateNormals(triangles);
	return {vertices: triangles, texCoords: texCoords, normals: normalData};
};
Shapes.prototype.setupRectangularPrism = function(height, width, length, r, g, b, colorArray, texCoords) {
	var triangles = [];
	//close plane
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(-width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(-width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(-width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	//far plane
	triangles.push(width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(-width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	//right plane
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	//left plane
	triangles.push(-width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(-width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(-width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(-width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	//top plane
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(-width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(-width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(width/2, height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(-width/2, height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	//bottom plane
	triangles.push(width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(-width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 0);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	triangles.push(width/2, -height/2, length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 0);
	triangles.push(width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(1, 1);
	triangles.push(-width/2, -height/2, -length/2);
	colorArray.push(r, g, b);
	texCoords.push(0, 1);
	return triangles;
};