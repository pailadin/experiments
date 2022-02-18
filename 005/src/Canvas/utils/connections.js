import { DEFAULT_BOX, MARGIN } from '../constants';
import { getBoxBounds } from './boxes';

export const drawConnections = ({ ctx, boxes = [], connections = [] }) => {
  if (!ctx) return;

  connections.map(connection => drawConnection({ ctx, boxes, connection }));
}

const drawConnection = ({ ctx, boxes = [], connection }) => {
  try {
    const {
      from: fromBoxIndex,
      to: toBoxIndex,
      fromTop = false,
      fromBottom = false,
      fromLeft = false,
      fromRight = false,
      toTop = false,
      toBottom = false,
      toLeft = false,
      toRight = false,
      color = 'black',
      width: lineWidth = 1,
      isStraightLine = false,
      pivotPoint = 0.5,
    } = connection;

    const fromBox = { ...DEFAULT_BOX, ...boxes[fromBoxIndex] };
    const toBox = { ...DEFAULT_BOX, ...boxes[toBoxIndex] };

    let lineStartX = fromBox.x;
    let lineStartY = fromBox.y;
    let lineEndX = toBox.x;
    let lineEndY = toBox.y;

    if (fromRight) {
      lineStartX += fromBox.w;
    } else if (!fromLeft) {
      lineStartX += fromBox.w / 2;
    }

    if (fromBottom) {
      lineStartY += fromBox.h;
    } else if (!fromTop) {
      lineStartY += fromBox.h / 2;
    }

    if (toRight) {
      lineEndX += toBox.w;
    } else if (!toLeft) {
      lineEndX += toBox.w / 2;
    }

    if (toBottom) {
      lineEndY += toBox.h;
    } else if (!toTop) {
      lineEndY += toBox.h / 2;
    }

    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);

    if (!isStraightLine) {
      // "pivot" may not be the right word:
      createPivotLinePath(ctx, {
        // fromBox,
        // toBox,
        lineStartX,
        lineStartY,
        lineEndX,
        lineEndY,
        pivotPoint,
        // toBoxXLeft: toBox.x,
        // toBoxXRight: toBox.x + (toBox.w || DEFAULT_BOX_W),
        // toBoxYTop: toBox.y,
        // toBoxYBottom: toBox.y + (toBox.h || DEFAULT_BOX_H),
        fromTop,
        fromBottom,
        fromLeft,
        fromRight,
        toTop,
        toBottom,
        toLeft,
        toRight,
        fromBoxBounds: getBoxBounds(fromBox),
        toBoxBounds: getBoxBounds(toBox),
        lineBetweenX: (lineStartX + lineEndX) * 0.5,
        lineBetweenY: (lineStartY + lineEndY) * 0.5,
      });
    }

    ctx.lineTo(lineEndX, lineEndY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

  } catch(e) {
    console.warn("Error drawing connection:", e);
  }
}

const createPivotLinePath = (ctx, data) => {
  const {
    lineStartX,
    lineStartY,
    lineEndX,
    lineEndY,
    fromTop,
    fromBottom,
    fromLeft,
    fromRight,
    toTop,
    toBottom,
    toLeft,
    toRight,
    fromBoxBounds,
    toBoxBounds,
  } = data;

  let currentXY = { currentX: lineStartX, currentY: lineStartY };

  if (fromTop && toTop) {
    currentXY = goSlightyAboveHigher(ctx, currentXY, data);
    currentXY = goTowardsEndX(ctx, currentXY, data);
  }

  else if (fromTop && toBottom) {
    if (isCloseToOrBelow(fromBoxBounds.top, toBoxBounds.bottom)) {
      currentXY = goSlightlyUp(ctx, currentXY, data);
      currentXY = goBetweenStartEndX(ctx, currentXY, data);
      currentXY = goSlightyBelowEndY(ctx, currentXY, data);
      currentXY = goSlightlyBelowEnd(ctx, currentXY, data);
    } else {
      currentXY = goBetweenStartEndY(ctx, currentXY, data);
      currentXY = goTowardsEndX(ctx, currentXY, data);
    }
  }

  else if (fromTop && toLeft) {
    const isLeft = isCloseToOrLeft(lineStartX, toBoxBounds.left);
    const isBelow = isCloseToOrBelow(lineStartY, lineEndY);

    if (isBelow && !isLeft) {
      currentXY = goSlightlyUp(ctx, currentXY, data);
      currentXY = goBetweenStartEndX(ctx, currentXY, data);
      currentXY = goTowardsEndY(ctx, currentXY, data)
    } else if (isBelow || isLeft) {
      currentXY = goSlightyAboveHigher(ctx, currentXY, data);
      currentXY = goSlightlyBeyondMoreLeft(ctx, currentXY, data);
      currentXY = goTowardsEndY(ctx, currentXY, data)
    } else {
      currentXY = goTowardsEndY(ctx, currentXY, data);
    }
  }

  else if (fromTop && toRight) {
    // TODO
  }

  else if (fromBottom && toBottom) {
    currentXY = goSlightyBelowLower(ctx, currentXY, data);
    currentXY = goSlightlyBelowEnd(ctx, currentXY, data);
  }

  else if (fromBottom && toTop) {
    if (isCloseToOrBelow(fromBoxBounds.bottom, toBoxBounds.top)) {
      currentXY = goBetweenStartEndY(ctx, currentXY, data);
      currentXY = goTowardsEndX(ctx, currentXY, data);
    } else {
      currentXY = goSlightlyDown(ctx, currentXY, data);
      currentXY = goBetweenStartEndX(ctx, currentXY, data);
      currentXY = goSlightyAboveEndY(ctx, currentXY, data);
      currentXY = goTowardsEndX(ctx, currentXY, data);
    }
  }

  else if (fromBottom && toLeft) {
    // TODO
  }

  else if (fromBottom && toRight) {
    // TODO
  }

  else {
    currentXY = goTowardsEndY(ctx, currentXY, data);
  }

  return currentXY;
}

// "Actions":
const goSlightlyUp = (ctx, { currentX, currentY }) => {
  return lineToAndReturnXY(ctx, currentX, currentY - MARGIN);
}

const goSlightlyDown = (ctx, { currentX, currentY }) => {
  return lineToAndReturnXY(ctx, currentX, currentY + MARGIN);
}

/*
const getAlmostToEndX = ({ fromBoxBounds, toBoxBounds, currentX }) => {
  return
}

const getSlightlyBeyondEndX = ({ fromBoxBounds, toBoxBounds, currentX }) => {
  return isCloseToOrLeft(fromBoxBounds.centerX, toBoxBounds.centerX)
    ? currentX + MARGIN
    : currentX - MARGIN;
}
*/

const goAlmostToEndX = (
  ctx,
  { currentY },
  { fromBoxBounds, toBoxBounds },
) => {
  const newX = isCloseToOrLeft(fromBoxBounds.centerX, toBoxBounds.centerX)
    ? toBoxBounds.right + MARGIN
    : toBoxBounds.left - MARGIN;

  return lineToAndReturnXY(ctx, newX, currentY);
}

const goSlightlyBeyondEndX = (
  ctx,
  { currentY },
  { fromBoxBounds, toBoxBounds },
) => {
  const newX = isCloseToOrLeft(fromBoxBounds.centerX, toBoxBounds.centerX)
    ? toBoxBounds.left - MARGIN
    : toBoxBounds.right + MARGIN;

  return lineToAndReturnXY(ctx, newX, currentY);
}

const goSlightlyBeyondMoreLeft = (
  ctx,
  { currentY },
  { fromBoxBounds, toBoxBounds },
) => {
  const newX = Math.min(fromBoxBounds.left, toBoxBounds.left) - MARGIN;

  return lineToAndReturnXY(ctx, newX, currentY);
}

const goBetweenStartEndX = (ctx, { currentY }, { lineBetweenX }) => {
  return lineToAndReturnXY(ctx, lineBetweenX, currentY)
}

const goBetweenStartEndY = (ctx, { currentX }, { lineBetweenY }) => {
  return lineToAndReturnXY(ctx, currentX, lineBetweenY)
}

const goSlightyBelowEndY = (ctx, { currentX }, { lineEndY }) => {
  return lineToAndReturnXY(ctx, currentX, lineEndY + MARGIN);
}

const goSlightyAboveEndY = (ctx, { currentX }, { lineEndY }) => {
  return lineToAndReturnXY(ctx, currentX, lineEndY - MARGIN);
}

const goSlightlyBelowEnd = (ctx, { currentY }, { lineEndX },) => {
  return lineToAndReturnXY(ctx, lineEndX, currentY);
}

const goSlightyAboveHigher = (ctx, { currentX }, { fromBoxBounds, toBoxBounds }) => {
  return lineToAndReturnXY(ctx, currentX, getHigher(fromBoxBounds.top, toBoxBounds.top) - MARGIN);
}

const goSlightyBelowLower = (ctx, { currentX }, { fromBoxBounds, toBoxBounds }) => {
  return lineToAndReturnXY(ctx, currentX, getLower(fromBoxBounds.bottom, toBoxBounds.bottom) + MARGIN);
}

const goTowardsEndX = (ctx, { currentY }, { lineEndX }) => {
  return lineToAndReturnXY(ctx, lineEndX, currentY);
}

const goTowardsEndY = (ctx, { currentX }, { lineEndY }) => {
  return lineToAndReturnXY(ctx, currentX, lineEndY);
}

// Other helpers:
const lineToAndReturnXY = (ctx, x, y) => {
  ctx.lineTo(x, y);
  return { currentX: x, currentY: y };
}

const getHigher = (a, b) => a < b ? a : b;

const getLower = (a, b) => a > b ? a : b;

const isCloseTo = (a, b, deviation = 0) =>
  Math.floor(Math.abs(a - b)) <= deviation;
  // Math.floor(a - b) <= deviation;

const isCloseToOrAbove = (from, to, deviation = 0) => {
  if (to > from) return false;

  return from > to || isCloseTo(from, to, deviation);
}

const isCloseToOrBelow = (from, to, deviation = 0) => {
  if (to < from) return false;

  return from < to || isCloseTo(from, to, deviation);
}

const isCloseToOrLeft = (...args) => isCloseToOrAbove(...args);

const isCloseToOrRight = (...args) => isCloseToOrBelow(...args);
