import React, { useRef, useState, useEffect } from 'react';
import immutableUpdate from 'immutability-helper';

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DEFAULT_BOX,
  SHAPE_TYPE,
  DEFAULT_BOX_W,
  DEFAULT_BOX_H,
  DEFAULT_BOXES,
  DEFAULT_CONNECTIONS,
} from './constants';
import { clearScreen } from './utils/screen';
import { drawBoxes } from './utils/boxes';
import { drawConnections } from './utils/connections';
import { getMouseXY, getDragTargetIndexAndBoxOffsets } from './utils/mouse';

export const Canvas = () => {
  const canvas = useRef();

  const [ctx, setCtx] = useState(null);
  const [boxes, setBoxes] = useState(DEFAULT_BOXES);
  const [connections] = useState(DEFAULT_CONNECTIONS);
  const [dragTargetIndex, setDragTargetIndex] = useState(-1);
  const [dragTargetXOffset, setDragTargetXOffset] = useState(0);
  const [dragTargetYOffset, setDragTargetYOffset] = useState(0);

  useEffect(() => {
    const canvasEle = canvas.current;
    canvasEle.width = canvasEle.clientWidth;
    canvasEle.height = canvasEle.clientHeight;

    setCtx(canvasEle.getContext("2d"));
  }, []);

  useEffect(() => {
    clearScreen({ ctx, canvas });
    // TODO Switch these two later,
    // having them like this for now for easier debugging:
    drawBoxes({ ctx, boxes });
    drawConnections({ ctx, boxes, connections });
  }, [boxes, connections, ctx]);

  const addShape = (data = {}) => {
    console.log(typeof data);
    if (typeof data === 'string') {
      setBoxes([...boxes, { ...DEFAULT_BOX, type: data }]);
    } else {
      setBoxes([...boxes, { ...DEFAULT_BOX, ...data }]);
    }
  }

  const handleMouseDown = event => {
    const [dragTargetIndex, boxXOffset, boxYOffset] = getDragTargetIndexAndBoxOffsets({ event, canvas, boxes });

    if (dragTargetIndex >= 0) {
      setDragTargetXOffset(boxXOffset);
      setDragTargetYOffset(boxYOffset);
      setDragTargetIndex(dragTargetIndex);
    }
  }

  const handleMouseUp = e => {
    setDragTargetIndex(-1);
  }

  const handleMouseMove = event => {
    if (dragTargetIndex < 0) return;

    const [x, y] = getMouseXY({ event, canvas });
    const {
      w: boxW = DEFAULT_BOX_W,
      h: boxH = DEFAULT_BOX_H,
    } = boxes[dragTargetIndex];

    const newBoxX = Math.min(
      canvas.current.clientLeft + canvas.current.clientWidth - boxW,
      Math.max(canvas.current.clientLeft, x - dragTargetXOffset)
    );

    const newBoxY = Math.min(
      canvas.current.clientTop + canvas.current.clientHeight - boxH,
      Math.max(canvas.current.clientTop, y - dragTargetYOffset)
    );

    const newBoxes = immutableUpdate(boxes, {
      [dragTargetIndex]: {
        x: { $set: newBoxX },
        y: { $set: newBoxY },
      },
    });

    setBoxes(newBoxes);
  }

  return (
    <div style={{ display: 'flex' }}>
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvas}
      />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 16,
        padding: 16,
      }}>
        <button onClick={() => addShape()}>Rectangle</button>
        <button onClick={() => addShape(SHAPE_TYPE.rectangleRounded)}>Rounded Rectangle</button>
        <button onClick={() => addShape(SHAPE_TYPE.rectangleProcess)}>Process</button>
        <button onClick={() => addShape(SHAPE_TYPE.ellipse)}>Ellipse</button>
        <button onClick={() => addShape(SHAPE_TYPE.triangle)}>Triangle</button>
        <button onClick={() => addShape(SHAPE_TYPE.diamond)}>Diamond</button>
        <button onClick={() => addShape(SHAPE_TYPE.parallelogram)}>Parallelogram</button>
        <button onClick={() => addShape(SHAPE_TYPE.human)}>User</button>
      </div>
    </div>
  );
}

export default Canvas;
