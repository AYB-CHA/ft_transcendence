export const GAME_CONFIG = {
  width: 274,
  height: 152,
  fov: 45,
  near: 1,
  cameraPosition: [0, 0, 20],
  aspect: 0,
  worldHeight: 0,
  worldWidth: 0,
  paddleSizeY: 0.15, // between 0 and 1
  paddleSizeX: 0.02,
  ballSize: 0.3,
  maxScore: 5,
};

GAME_CONFIG.aspect = GAME_CONFIG.height / GAME_CONFIG.width;

GAME_CONFIG.worldHeight =
  2 *
  GAME_CONFIG.cameraPosition[2] *
  Math.tan(((GAME_CONFIG.fov / 180) * Math.PI) / 2);

GAME_CONFIG.worldWidth = GAME_CONFIG.worldHeight / GAME_CONFIG.aspect;
