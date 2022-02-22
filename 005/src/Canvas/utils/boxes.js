// TODO Rename most instances of "box" to "shape":
import { DEFAULT_BOX, SHAPE_TYPE, DEFAULT_BOX_FILL, DEFAULT_BOX_LINECOLOR, DEFAULT_BOX_LINEWIDTH } from '../constants';

export const drawBoxes = ({ ctx, boxes = [] }) => {
  if (!ctx) return;

  boxes.forEach(({
    type = SHAPE_TYPE.rectangle,
    fillColor = DEFAULT_BOX_FILL,
    lineColor = DEFAULT_BOX_LINECOLOR,
    lineWidth = DEFAULT_BOX_LINEWIDTH,
    debugDrawOutline = false,
    ...rest
  }) => {
    const data = getBoxBounds(rest);

    if (debugDrawOutline) drawDebugOutline(ctx, data);

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    switch (type) {
      case SHAPE_TYPE.human: drawHuman(ctx, data); break;
      case SHAPE_TYPE.rectangleRounded: drawRectangleRounded(ctx, data); break;
      case SHAPE_TYPE.rectangleProcess: drawRectangleProcess(ctx, data); break;
      case SHAPE_TYPE.ellipse: drawEllipse(ctx, data); break;
      case SHAPE_TYPE.triangle: drawTriangle(ctx, data); break;
      case SHAPE_TYPE.diamond: drawDiamond(ctx, data); break;
      case SHAPE_TYPE.parallelogram: drawParallelogram(ctx, data); break;
      case SHAPE_TYPE.hexagon: drawHexagon(ctx, data); break;
      case SHAPE_TYPE.cylinder: drawCylinder(ctx, data); break;
      default: drawRectangle(ctx, data); break;
    }
  });
}

const drawRectangle = (ctx, data) => {
  const { left, top, w, h } = data;

  ctx.beginPath();

  ctx.rect(left, top, w, h);

  ctx.fill();
  ctx.stroke();
}

const drawDebugOutline = (ctx, data) => {
  const { left, top, w, h } = data;

  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 4;
  ctx.setLineDash([5, 3]);

  ctx.beginPath();

  ctx.strokeRect(left, top, w, h);

  ctx.setLineDash([]);
}

const drawRectangleRounded = (ctx, data) => {
  const { w, top, bottom, left, right } = data;
  const radius = w * 0.2;

  ctx.beginPath();

  ctx.moveTo(left, top + radius);
  ctx.arcTo(left, bottom, left + radius, bottom, radius);
  ctx.arcTo(right, bottom, right, bottom - radius, radius);
  ctx.arcTo(right, top, right - radius, top, radius);
  ctx.arcTo(left, top, left, top + radius, radius);

  ctx.fill();
  ctx.stroke();
}

const drawRectangleProcess = (ctx, data) => {
  drawRectangle(ctx, data);
  ctx.beginPath();

  const { top, bottom } = data;
  const left = data.left + data.w * 0.2;
  const right = data.right - data.w * 0.2;

  ctx.moveTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.moveTo(right, top);
  ctx.lineTo(right, bottom);

  ctx.stroke();
}

const drawEllipse = (ctx, data) => {
  const { w, h, centerX, centerY, } = data;

  ctx.beginPath();

  ctx.ellipse(centerX, centerY, (w * 0.5), (h * 0.5), 0, 0, Math.PI * 2);

  ctx.fill();
  ctx.stroke();
}

const drawTriangle = (ctx, data) => {
  const { left, right, top, bottom, centerY } = data;

  ctx.beginPath();

  ctx.moveTo(right, centerY);
  ctx.lineTo(left, top);
  ctx.lineTo(left, bottom);
  ctx.lineTo(right, centerY);

  ctx.fill();
  ctx.stroke();
}

const drawDiamond = (ctx, data) => {
  const { left, right, top, bottom, centerX, centerY } = data;

  ctx.beginPath();

  ctx.moveTo(centerX, top);
  ctx.lineTo(right, centerY);
  ctx.lineTo(centerX, bottom);
  ctx.lineTo(left, centerY);
  ctx.lineTo(centerX, top);

  ctx.fill();
  ctx.stroke();
}

const drawHexagon = (ctx, data) => {
  const { left, right, top, bottom, centerY, w } = data;
  const almostLeft = left + (w * 0.2);
  const almostRight = right - (w * 0.2);

  ctx.beginPath();

  ctx.moveTo(almostLeft, top);
  ctx.lineTo(almostRight, top);
  ctx.lineTo(right, centerY);
  ctx.lineTo(almostRight, bottom);
  ctx.lineTo(almostLeft, bottom);
  ctx.lineTo(left, centerY);
  ctx.lineTo(almostLeft, top);

  ctx.fill();
  ctx.stroke();
}

const drawParallelogram = (ctx, data) => {
  const { left, right, top, bottom, w } = data;
  const almostLeft = left + (w * 0.2);
  const almostRight = right - (w * 0.2);

  ctx.beginPath();

  ctx.moveTo(almostLeft, top);
  ctx.lineTo(right, top);
  ctx.lineTo(almostRight, bottom);
  ctx.lineTo(left, bottom);
  ctx.lineTo(almostLeft, top);

  ctx.fill();
  ctx.stroke();
}

const drawCylinder = (ctx, data) => {
  const { left, right, top, bottom, centerX, w, h } = data;
  const almostTop = top + (h * 0.2);
  const almostBottom = bottom - (h * 0.2);

  ctx.beginPath();

  ctx.moveTo(left, almostTop);
  ctx.lineTo(left, almostBottom);

  ctx.arcTo(centerX, bottom, right, almostBottom, w);
  ctx.lineTo(right, almostBottom);

  ctx.lineTo(right, almostTop);
  // ctx.lineTo(left, almostTop);
  ctx.fill();
  // ctx.lineTo(left, almostBottom);

  // ctx.arcTo(centerX, almostBottom, (w * 0.5), almostBottom, (h * 0.2));
  // ctx.lineTo(almostRight, bottom);
  // ctx.lineTo(left, bottom);
  // ctx.lineTo(almostLeft, top);

  // ctx.arcTo(left, almostBottom, right, almostBottom, w/4);
  // ctx.bezierCurveTo(left, almostBottom, right, almostBottom, 180,10, 220,140);

  ctx.ellipse(centerX, almostTop, (w * 0.5), (h * 0.2), 0, 0, Math.PI * 2);

  ctx.fill();
  ctx.stroke();
}


const drawHuman = (ctx, data) => {
  const {
    w,
    h,
    top,
    bottom,
    left,
    right,
    centerX,
  } = data;

  const radius = Math.min(w, h) * 0.2;
  const headCenterY = top + radius;
  const headBottom = headCenterY + radius;
  const armStartY = top + (h * 0.5);
  const armEndY = armStartY + (h * 0.1);
  const crotchY = top + (h * 0.75);

  // body:
  ctx.beginPath();
  ctx.moveTo(centerX, headBottom);
  ctx.lineTo(centerX, crotchY);
  ctx.stroke();

  // arms:
  ctx.beginPath();
  ctx.moveTo(centerX, armStartY);
  ctx.lineTo(left, armEndY);
  ctx.moveTo(centerX, armStartY);
  ctx.lineTo(right, armEndY);
  ctx.stroke();

  // legs:
  ctx.beginPath();
  ctx.moveTo(centerX, crotchY);
  ctx.lineTo(left, bottom);
  ctx.moveTo(centerX, crotchY);
  ctx.lineTo(right, bottom);
  ctx.stroke();

  // head:
  ctx.beginPath();
  ctx.arc(centerX, headCenterY, radius, 0, Math.PI * 2);
  ctx.fill();
}

export const getBoxBounds = (rawBox) => {
  const box = { ...DEFAULT_BOX, ...rawBox };

  return {
    ...box,
    top: box.y,
    bottom: box.y + box.h,
    left: box.x,
    right: box.x + box.w,
    centerX: box.x + (box.w / 2),
    centerY: box.y + (box.h / 2),
  }
}
