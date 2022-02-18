import { DEFAULT_BOX_W, DEFAULT_BOX_H } from '../constants';

export const getMouseXY = ({ event, canvas }) => {
  if (!event || !canvas) {
    if (!event) console.error(`"event" is false!`);
    if (!canvas) console.error(`"canvas" is false!`);

    return { x: 0, y: 0 }; // just in case
  }

  const x = parseInt(event.nativeEvent.offsetX - canvas.current.clientLeft);
  const y = parseInt(event.nativeEvent.offsetY - canvas.current.clientTop);

  return [x, y];
}

export const getDragTargetIndexAndBoxOffsets = ({ event, canvas, boxes = [] }) => {
  const [mouseX, mouseY] = getMouseXY({ event, canvas });

  for (let i = 0; i < boxes.length; i++) {
    const {
      x: boxX = 0,
      y: boxY = 0,
      w: boxW = DEFAULT_BOX_W,
      h: boxH = DEFAULT_BOX_H,
    } = boxes[i];

    if (mouseX >= boxX && mouseX <= boxX + boxW && mouseY >= boxY && mouseY <= boxY + boxH) {
      return [i, mouseX - boxX, mouseY - boxY];
    }
  }

  return [-1];
}
