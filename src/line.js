var FSHADER_SOURCE_LINE =
  "void main() {\n" + "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + "}\n";

function drawLines(gl) {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE_LINE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  for (var i = 0; i < polygon.length; i++) {
    var polygonVertexAndColor = getVertexAndColor(i);

    var n = initVertexBuffers(gl, polygonVertexAndColor);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    // Draw the rectangle
    gl.drawArrays(gl.LINE_LOOP, 0, n);
    
  }
}