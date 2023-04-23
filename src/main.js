// main.js
// base on HelloQuad.js (c) 2012 matsuda

// ColoredTriangle.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "varying vec4 v_Color;\n" +
  "void main() {\n" +
  "  gl_FragColor = v_Color;\n" +
  "}\n";

var VSHADER_SOURCE_LINE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" +
  "}\n";

var FSHADER_SOURCE_LINE =
  "void main() {\n" + "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + "}\n";

function drawLines(gl) {
    // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE_LINE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  for (var i = 0; i < polygon.length; i++) {
    var polygonToDraw = polygon[i];
    var polygonVertexAndColor = [];
    it = [1, 2, 3, 1, 3, 4]
    for (var j = 0; j < it.length; j++) {
      t = it[j] -1 ;
      var vertexIndex = polygonToDraw[t];
      var vertex = convertCanvasToGL(
        vertex_pos[vertexIndex][0],
        vertex_pos[vertexIndex][1]
      );
      var vertexColor = vertex_color[vertexIndex];
      polygonVertexAndColor.push(vertex[0]);
      polygonVertexAndColor.push(vertex[1]);
      polygonVertexAndColor.push(vertexColor[0] / 255.0);
      polygonVertexAndColor.push(vertexColor[1] / 255.0);
      polygonVertexAndColor.push(vertexColor[2] / 255.0);
    }
    
    var n = initVertexBuffers(gl, polygonVertexAndColor);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    // Draw the rectangle
    gl.drawArrays(gl.LINE_LOOP, 0, n);
    console.log("after draw lines");
  }
}

function drawAll(gl) {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (var i = 0; i < polygon.length; i++) {
    var polygonToDraw = polygon[i];
    var polygonVertexAndColor = [];
    it = [1, 2, 3, 1, 3, 4]
    for (var j = 0; j < it.length; j++) {
      t = it[j] -1 ;
      var vertexIndex = polygonToDraw[t];
      var vertex = convertCanvasToGL(
        vertex_pos[vertexIndex][0],
        vertex_pos[vertexIndex][1]
      );
      var vertexColor = vertex_color[vertexIndex];
      polygonVertexAndColor.push(vertex[0]);
      polygonVertexAndColor.push(vertex[1]);
      polygonVertexAndColor.push(vertexColor[0] / 255.0);
      polygonVertexAndColor.push(vertexColor[1] / 255.0);
      polygonVertexAndColor.push(vertexColor[2] / 255.0);
    }

    // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl, polygonVertexAndColor);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  drawLines(gl);
}

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");
  // var cxt = canvas.getContext("2d");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  drawAll(gl);
  useHandle(canvas, gl);
}

function initVertexBuffers(gl, polygonVertexAndColor) {
  // 在这里定义了顶点的位置
  var verticesColors = new Float32Array(polygonVertexAndColor);
  var n = 6;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return false;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

  // Get the storage location of a_Position, assign buffer and enable
  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color); // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

var convertCanvasToGL = function (x, y) {
  canvas = document.getElementById("webgl");
  // get the canvas width and height
  var width = canvas.width;
  var height = canvas.height;
  // get the midpoint of the canvas
  var midWidth = width / 2;
  var midHeight = height / 2;
  // calculate the GL x coordinate by subtracting the midpoint and dividing by the half width
  var glX = (x - midWidth) / midWidth;
  // calculate the GL y coordinate by subtracting the midpoint and dividing by the half height
  // also invert the sign because GL y axis is opposite of canvas y axis
  var glY = -(y - midHeight) / midHeight;
  // return the GL coordinates as an array
  return [glX, glY];
};
