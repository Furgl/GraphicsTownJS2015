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
Shapes.prototype.setupSphere2 = function(radius, part, r, g, b, colorArray, xOffset, yOffset, zOffset, texCoords) {
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
			var y = cosTheta;
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
	var sortedVertices = [];
	for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
		for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
			var first = (latNumber * (longitudeBands + 1)) + longNumber;
			var second = first + longitudeBands + 1;
			indexData.push(first);
			sortedVertices.push(vertexPositionData[first], vertexPositionData[first+1], vertexPositionData[first+2]);
			indexData.push(second);
			sortedVertices.push(vertexPositionData[second], vertexPositionData[second+1], vertexPositionData[second+2]);
			indexData.push(first + 1);
			sortedVertices.push(vertexPositionData[first+1], vertexPositionData[first+2], vertexPositionData[first+3]);

			indexData.push(second);
			sortedVertices.push(vertexPositionData[second], vertexPositionData[second+1], vertexPositionData[second+2]);
			indexData.push(second + 1);
			sortedVertices.push(vertexPositionData[second+1], vertexPositionData[second+2], vertexPositionData[second+3]);
			indexData.push(first + 1);
			sortedVertices.push(vertexPositionData[first+1], vertexPositionData[first+2], vertexPositionData[first+3]);
		}
	}
/*	for (var i=0; i<indexData.length; i++)
		sortedVertices.push(vertexPositionData[indexData[i]], vertexPositionData[indexData[i+1]], 
				vertexPositionData[indexData[i+2]]);*/

	//sortedVertices = [0,0,0, 0,1,0, 1,0,0, 1,0,0, 1,1,0, 0,1,0];
	//texCoords = [0,0, 0,1, 1,0, 1,0, 1,1, 0,1];

	return [vertexPositionData, texCoords, normalData, indexData];
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