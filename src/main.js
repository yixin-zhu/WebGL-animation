var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "attribute vec4 a_Color;\n" +
  "varying vec4 v_Color;\n" +
  "uniform mat4 u_ModelMatrix;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position * u_ModelMatrix;\n" +
  "  v_Color = a_Color;\n" +
  "}\n";

var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "varying vec4 v_Color;\n" +
  "uniform bool use_red;\n" +
  "void main() {\n" +
  "  gl_FragColor = use_red ? vec4(1.0, 0.0, 0.0, 1.0) : v_Color;\n" +
  "}\n";

function set_use_red(gl, use_red) {
  var use_red_loc = gl.getUniformLocation(gl.program, "use_red");
  gl.uniform1i(use_red_loc, use_red);
}

function clearCanvas(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function main() {
  var canvas = document.getElementById("webgl");

  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  clearCanvas(gl);

  var modelMatrix = new Matrix4();
  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }
  updateModelMatrix(gl, modelMatrix, u_ModelMatrix);

  useControl(canvas, gl);
  drawAll(gl, isWithBorder);
  rotate(gl, modelMatrix, u_ModelMatrix);
}

function getVertexAndColor(gl, i, setColorToRed = false) {
  var polygonToDraw = polygon[i];
  var polygonVertexAndColor = [];
  it = [1, 2, 3, 1, 3, 4];
  for (var j = 0; j < it.length; j++) {
    t = it[j] - 1;
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
  if (setColorToRed == true) {
    set_use_red(gl, true);
  } else {
    set_use_red(gl, false);
  }
  return polygonVertexAndColor;
}

function updateModelMatrix(
  gl,
  modelMatrix,
  u_ModelMatrix,
  angle = 0.0,
  scale = 1.0
) {
  modelMatrix.setRotate(angle, 0, 0, 1);
  modelMatrix.scale(scale, scale, scale);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
}

function drawRectangle(gl) {
  for (var i = 0; i < polygon.length; i++) {
    var polygonVertexAndColor = getVertexAndColor(gl, i, false);
    var n = initVertexBuffers(gl, polygonVertexAndColor);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }
}

function drawBorder(gl) {
  for (var i = 0; i < polygon.length; i++) {
    var polygonVertexAndColor = getVertexAndColor(gl, i, true);
    var n = initVertexBuffers(gl, polygonVertexAndColor);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    gl.drawArrays(gl.LINE_LOOP, 0, n);
  }
}

var isWithBorder = true;
function drawAll(gl, isWithBorder) {
  clearCanvas(gl);
  drawRectangle(gl);
  if(isWithBorder){
    drawBorder(gl);
  }
}

function initVertexBuffers(gl, polygonVertexAndColor) {
  var verticesColors = new Float32Array(polygonVertexAndColor);
  var n = 6;

  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log("Failed to create the buffer object");
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

var convertCanvasToGL = function (x, y) {
  canvas = document.getElementById("webgl");
  var width = canvas.width;
  var height = canvas.height;
  var midWidth = width / 2;
  var midHeight = height / 2;
  var glX = (x - midWidth) / midWidth;
  var glY = -(y - midHeight) / midHeight;
  return [glX, glY];
};
