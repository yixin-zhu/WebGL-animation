function updatePos(index, x, y) {
  vertex_pos[index][0] = x;
  vertex_pos[index][1] = y;
}

function useControl(canvas, gl) {
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
      drawAll(gl, isWithBorder);
    }
  });

  canvas.addEventListener("mouseup", function (event) {
    isDragging = false;
    dragIndex = -1;
  });

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "b":
        isWithBorder = !isWithBorder;
        break;
      case "t":
        isRotating = !isRotating;
        g_last = Date.now();
        t_last = Date.now();
        break;
      case "e":
        currentAngle = 0.0;
        currentScale = 1.0;
        isRotating = false;
        break;
      default:
    }
  });
}
