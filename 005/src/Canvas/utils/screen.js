export const clearScreen = ({ ctx, canvas }) => {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, 0, canvas.current.clientWidth, canvas.current.clientHeight);
}
