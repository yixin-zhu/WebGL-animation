// this file is for the algorithm of drawing handles and dragging them
// draw the handles

function drawHandle(cxt, x, y, color) {
  radius = 10;
  cxt.beginPath();
  cxt.arc(x, y, radius, 0, 2 * Math.PI);
  cxt.fillStyle = color;
  cxt.fill();
}

// update the position of the vertex position
function updatePos(index, x, y) {
  vertex_pos[index][0] = x;
  vertex_pos[index][1] = y;
}

function useHandle(canvas, gl) {
  // to initialize the handles
  /*
  for (let i = 0; i < vertex_pos.length; i++) {
    const [x, y, z] = vertex_pos[i];
    drawHandle(gl, x, y, "red");
  }
  */

  // add event listeners, including mouse down, mouse move, mouse up
  let isDragging = false;
  let dragIndex = -1;
  let radius = 10;

  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < vertex_pos.length; i++) {
      const [x, y, z] = vertex_pos[i];
      if (Math.abs(mouseX - x) <= radius && Math.abs(mouseY - y) <= radius) {
        isDragging = true;
        dragIndex = i;
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    handleColor = "red";
    if (isDragging && dragIndex !== -1) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      for (let i = 0; i < vertex_pos.length; i++) {
        const [x, y, z] = vertex_pos[i];
        if (i === dragIndex) {
          updatePos(i, mouseX, mouseY);
        }
      }
      drawAll(gl);
    }
  });

  canvas.addEventListener("mouseup", function (event) {
    isDragging = false;
    dragIndex = -1;
  });
}

function drawAllHandles(cxt) {
  for (let i = 0; i < vertex_pos.length; i++) {
    const [x, y, z] = vertex_pos[i];
    drawHandle(cxt, x, y, "red");
  }
}
