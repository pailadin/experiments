export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 800;

export const MARGIN = 64;

export const SHAPE_TYPE = {
  rectangle: 'RECTANGLE',
  rectangleRounded: 'RECTANGLE_ROUNDED',
  rectangleProcess: 'RECTANGLE_PROCESS',
  ellipse: 'ELLIPSE',
  triangle: 'TRIANGLE',
  diamond: 'DIAMOND',
  parallelogram: 'PARALLELOGRAM',
  human: 'HUMAN',
}

export const DEFAULT_BOX_W = 100;
export const DEFAULT_BOX_H = 50;
export const DEFAULT_BOX_FILL = 'white';
export const DEFAULT_BOX_LINECOLOR = 'black';
export const DEFAULT_BOX_LINEWIDTH = 4;

export const DEFAULT_BOX = {
  type: SHAPE_TYPE.box,
  x: 0,
  y: 0,
  w: DEFAULT_BOX_W,
  h: DEFAULT_BOX_H,
  fillColor: DEFAULT_BOX_FILL,
  lineColor: DEFAULT_BOX_LINECOLOR,
  lineWidth: DEFAULT_BOX_LINEWIDTH,
};

export const DEFAULT_BOXES = [
  { x: 200, y: 320, w: 100, h: 50, fillColor: 'darkgreen' },
  { x: 100, y: 120, w: 200, h: 100, debugDrawOutline: true, type: SHAPE_TYPE.parallelogram },
  { x: 400, y: 517, w: 30, h: 75, fillColor: '#E75480' },
];

export const DEFAULT_CONNECTIONS = [
  {
    from: 0,
    to: 2,
    color: 'red',
    width: 5,
    // pivotPoint: 0.75,

    fromTop: true,
    // fromBottom: true,
    // fromLeft: true,
    // fromRight: true,

    // toTop: true,
    // toBottom: true,
    toLeft: true,
    // toRight: true,
  },
  {
    from: 0,
    to: 1,
    color: 'blue',
    width: 3,
    isStraightLine: true,

    fromTop: true,
    fromLeft: true,
    toBottom: true,
    toRight: true,
  },
];
