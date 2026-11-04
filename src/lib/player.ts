// Shared walking state. Kept outside React so the joystick never re-renders the scene.
export const playerInput = { x: 0, y: 0 };

export const playerState = {
  x: 0,
  z: 18,
  yaw: Math.PI,
  active: false,
  walking: false,
};

export function setPlayerInput(x: number, y: number) {
  playerInput.x = x;
  playerInput.y = y;
}
