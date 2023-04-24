var ANGLE_STEP = 45.0;

var isRotating = true;
var currentAngle = 0.0;
var currentScale = 1.0;
function rotate(gl, modelMatrix, u_ModelMatrix) {
  var tick = function () {
    if (isRotating) {
      currentAngle = animateAngle(currentAngle);
      currentScale = animateScale(currentScale);
    }
    updateModelMatrix(
      gl,
      modelMatrix,
      u_ModelMatrix,
      currentAngle,
      currentScale
    );
    drawAll(gl, isWithBorder);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

var g_last = Date.now();
function animateAngle(angle) {
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  var newAngle = angle - (ANGLE_STEP * elapsed) / 1000.0;
  return (newAngle %= 360);
}

var t_last = Date.now();
var p = -1;
function animateScale(scale) {
  var now = Date.now();
  var elapsed = now - t_last;
  t_last = now;
  var newScale = scale + (p * (0.2 * elapsed)) / 1000.0;
  if (newScale > 1.0) {
    p = -1;
    newScale = 1.0;
  } else if (newScale < 0.2) {
    p = 1;
    newScale = 0.2;
  }
  return newScale;
}
