const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const levelLabelElement = document.getElementById("level-label");
const startOverlay = document.getElementById("start-overlay");
const gameOverOverlay = document.getElementById("game-over-overlay");
const finalScoreElement = document.getElementById("final-score");
const gameShell = document.getElementById("game-shell");
const runnerButton = document.getElementById("runner-button");
const mazeButton = document.getElementById("maze-button");
const restartButton = document.getElementById("restart-button");
const menuButton = document.getElementById("menu-button");
const joystick = document.getElementById("joystick");
const joystickBase = document.getElementById("joystick-base");
const joystickKnob = document.getElementById("joystick-knob");

const groundY = 330;
const gravity = 0.82;
const jumpVelocity = -16.5;
const baseSpeed = 6.2;
const elephantInterval = 1350;
const carrotInterval = 2900;
const siggeInterval = 4200;
const bestScoreKey = "bosse-hoppar-best-score";
const mazeCell = 40;
const mazeWalls = [
  "#############################",
  "#...........#.......#.......#",
  "#.#####.###.#.###.#.#.###.#.#",
  "#.#...#...#.#...#.#...#...#.#",
  "#.#.#.###.#.###.#.#####.###.#",
  "#...#.....#.....#.....#.....#",
  "###.#####.#####.#####.#.###.#",
  "#...#...#.....#...#...#.#...#",
  "#.###.#.#####.###.#.###.#.###",
  "#.....#...#.....#.#.....#...#",
  "#.#######.#.###.#.#####.###.#",
  "#.#.......#.#...#.....#.....#",
  "#.#.#######.#.#######.#####.#",
  "#...#.......#.....#...#.....#",
  "###.#.###########.#.###.###.#",
  "#.....#...........#.....#...#",
  "#############################",
];
const mazeCols = mazeWalls[0].length;
const mazeRows = mazeWalls.length;
const mazeViewport = {
  x: 44,
  y: 62,
  width: canvas.width - 88,
  height: canvas.height - 138,
};
const mazeWallColor = "#8fd0ff";
const mazeFloorColor = "#0f2233";
const mazeLineWidth = 10;
const directions = {
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
};
const joystickState = {
  active: false,
  pointerId: null,
};

const state = {
  running: false,
  gameOver: false,
  score: 0,
  bestScore: Number(localStorage.getItem(bestScoreKey) || 0),
  mode: "menu",
  selectedGame: null,
  distance: 0,
  speed: baseSpeed,
  lastTime: 0,
  elephantTimer: 0,
  carrotTimer: 1200,
  siggeTimer: 2600,
  cloudsOffset: 0,
  pettingTimer: 0,
  mazeMessageTimer: 0,
  bunny: {
    x: 130,
    y: groundY,
    width: 78,
    height: 74,
    velocityY: 0,
    jumpStretch: 0,
  },
  elephants: [],
  carrots: [],
  sigges: [],
  maze: createMazeState(),
};

bestScoreElement.textContent = String(state.bestScore);
updateHud();

function createMazeState() {
  return {
    cameraX: 0,
    cameraY: 0,
    bunny: {
      cellX: 1,
      cellY: 1,
      px: 1,
      py: 1,
      dir: { x: 0, y: 0 },
      nextDir: { x: 0, y: 0 },
      speed: 3.4,
      moving: false,
      fromX: 1,
      fromY: 1,
      targetX: 1,
      targetY: 1,
      progress: 0,
    },
    carrot: { x: 25, y: 15 },
    elephants: [
      createMazeElephant(13, 1, -1, 0, 2.1),
      createMazeElephant(9, 7, 0, 1, 1.95),
      createMazeElephant(21, 11, -1, 0, 1.9),
    ],
  };
}

function createMazeElephant(cellX, cellY, dirX, dirY, speed) {
  return {
    cellX,
    cellY,
    px: cellX,
    py: cellY,
    dir: { x: dirX, y: dirY },
    speed,
    moving: false,
    fromX: cellX,
    fromY: cellY,
    targetX: cellX,
    targetY: cellY,
    progress: 0,
  };
}

function resetRunnerState(resetScore) {
  state.mode = "runner";
  state.selectedGame = "runner";
  state.running = true;
  state.gameOver = false;
  state.distance = 0;
  state.speed = baseSpeed;
  state.lastTime = 0;
  state.elephantTimer = 0;
  state.carrotTimer = 1200;
  state.siggeTimer = 2600;
  state.cloudsOffset = 0;
  state.pettingTimer = 0;
  state.mazeMessageTimer = 0;
  state.elephants = [];
  state.carrots = [];
  state.sigges = [];
  state.bunny.y = groundY;
  state.bunny.velocityY = 0;
  state.bunny.jumpStretch = 0;
  if (resetScore) {
    state.score = 0;
  }
  scoreElement.textContent = String(state.score);
  updateHud();
}

function showMenu() {
  state.mode = "menu";
  state.selectedGame = null;
  state.running = false;
  state.gameOver = false;
  state.score = 0;
  scoreElement.textContent = "0";
  updateHud();
  updateMobileMode();
  updateShellLayout();
  startOverlay.classList.remove("hidden");
  gameOverOverlay.classList.add("hidden");
}

function startRunnerGame() {
  resetRunnerState(true);
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  updateMobileMode();
  updateShellLayout();
}

function startMazeGame() {
  state.mode = "maze";
  state.selectedGame = "maze";
  state.running = true;
  state.gameOver = false;
  state.score = 0;
  scoreElement.textContent = "0";
  state.lastTime = 0;
  state.mazeMessageTimer = 1600;
  state.maze = createMazeState();
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  updateMazeCamera();
  updateHud();
  updateMobileMode();
  updateShellLayout();
}

function completeMazeLevel() {
  state.score += 150;
  scoreElement.textContent = String(state.score);
  finalScoreElement.textContent = `Bosse hittade moroten i labyrinten och fick totalt ${state.score} poäng.`;
  gameOverOverlay.classList.remove("hidden");
  gameOverOverlay.querySelector("h2").textContent = "Bana klar!";
  restartButton.textContent = "Spela igen";
  state.running = false;
  state.gameOver = true;
  persistBestScore();
  updateShellLayout();
}

function endGame(message) {
  state.running = false;
  state.gameOver = true;
  finalScoreElement.textContent = message || `Du fick ${state.score} poäng.`;
  gameOverOverlay.querySelector("h2").textContent = "Oj! Bosse snubblade.";
  restartButton.textContent = "Spela igen";
  gameOverOverlay.classList.remove("hidden");
  persistBestScore();
  updateShellLayout();
}

function persistBestScore() {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    localStorage.setItem(bestScoreKey, String(state.bestScore));
    bestScoreElement.textContent = String(state.bestScore);
  }
}

function updateHud() {
  if (state.mode === "menu") {
    levelLabelElement.textContent = "Välj";
    return;
  }
  if (state.mode === "maze") {
    levelLabelElement.textContent = "Vimsar";
  } else {
    levelLabelElement.textContent = "Hoppar";
  }
}

function isLandscapeMobileMode() {
  return window.matchMedia("(hover: none) and (pointer: coarse) and (orientation: landscape)").matches;
}

function updateMobileMode() {
  const enabled = isLandscapeMobileMode() && state.mode !== "menu";
  document.body.classList.toggle("mobile-landscape", enabled);
  const showJoystick = enabled && state.mode === "maze";
  joystick.classList.toggle("hidden", !showJoystick);
  joystick.setAttribute("aria-hidden", String(!showJoystick));
}

function updateShellLayout() {
  const menuVisible = state.mode === "menu" || state.gameOver;
  gameShell.classList.toggle("menu-open", menuVisible);
}

function jump() {
  if (!state.running || state.gameOver || state.mode !== "runner") {
    return;
  }

  if (state.bunny.y >= groundY) {
    state.bunny.velocityY = jumpVelocity;
  }
}

function handleMazeDirection(code) {
  const dir = directions[code];
  if (!dir || state.mode !== "maze" || !state.running) {
    return false;
  }
  state.maze.bunny.nextDir = { ...dir };
  return true;
}

function handleRunnerJump() {
  if (!state.running && !state.gameOver) {
    startRunnerGame();
  } else if (state.gameOver) {
    startRunnerGame();
  }
  jump();
}

function update(delta) {
  if (!state.running) {
    return;
  }

  if (state.mode === "maze") {
    updateMaze(delta);
  } else {
    updateRunner(delta);
  }
}

function updateRunner(delta) {
  const bunny = state.bunny;
  const frameScale = delta / (1000 / 60);
  state.distance += delta * 0.01;
  const targetSpeed = baseSpeed + Math.min(5, state.distance * 0.018);
  const pettingSlowdown = state.pettingTimer > 0 ? 2.8 : 0;
  state.speed = Math.max(2.4, targetSpeed - pettingSlowdown);
  state.cloudsOffset += state.speed * 0.15 * frameScale;

  if (state.pettingTimer > 0) {
    state.pettingTimer = Math.max(0, state.pettingTimer - delta);
  }

  bunny.velocityY += gravity;
  bunny.y += bunny.velocityY;
  if (bunny.y > groundY) {
    bunny.y = groundY;
    bunny.velocityY = 0;
  }
  bunny.jumpStretch = Math.max(0, Math.min(1, Math.abs(bunny.velocityY) / 18));

  state.elephantTimer += delta;
  if (state.elephantTimer > elephantInterval - state.speed * 35) {
    state.elephants.push({ x: canvas.width + 60, y: groundY + 10, width: 68, height: 52 });
    state.elephantTimer = 0;
  }

  state.carrotTimer += delta;
  if (state.carrotTimer > carrotInterval) {
    state.carrots.push({
      x: canvas.width + 60,
      y: 220 + Math.random() * 55,
      width: 30,
      height: 18,
      collected: false,
    });
    state.carrotTimer = 0;
  }

  state.siggeTimer += delta;
  if (state.siggeTimer > siggeInterval) {
    state.sigges.push({
      x: canvas.width + 120,
      y: groundY + 10,
      width: 74,
      height: 48,
      petted: false,
      jumpOffset: 0,
      nextHopIn: 600 + Math.random() * 1200,
      hopTimer: 0,
    });
    state.siggeTimer = 0;
  }

  for (const elephant of state.elephants) {
    elephant.x -= state.speed * frameScale;
  }
  for (const carrot of state.carrots) {
    carrot.x -= (state.speed + 0.8) * frameScale;
  }
  for (const sigge of state.sigges) {
    sigge.x -= state.speed * 0.72 * frameScale;
    sigge.nextHopIn -= delta;
    if (sigge.nextHopIn <= 0) {
      sigge.hopTimer = 520;
      sigge.nextHopIn = 1200 + Math.random() * 1700;
    }
    if (sigge.hopTimer > 0) {
      sigge.hopTimer = Math.max(0, sigge.hopTimer - delta);
      const phase = 1 - sigge.hopTimer / 520;
      sigge.jumpOffset = Math.sin(phase * Math.PI) * 16;
    } else {
      sigge.jumpOffset = 0;
    }
  }

  state.elephants = state.elephants.filter((elephant) => elephant.x + elephant.width > -30);
  state.carrots = state.carrots.filter((carrot) => carrot.x + carrot.width > -20 && !carrot.collected);
  state.sigges = state.sigges.filter((sigge) => sigge.x + sigge.width > -30);

  const bunnyHitbox = {
    x: bunny.x + 12,
    y: bunny.y - bunny.height + 10,
    width: bunny.width - 20,
    height: bunny.height - 10,
  };

  for (const elephant of state.elephants) {
    if (intersects(bunnyHitbox, {
      x: elephant.x + 8,
      y: elephant.y - elephant.height + 10,
      width: elephant.width - 18,
      height: elephant.height - 14,
    })) {
      endGame(`En elefant tog Bosse. Du fick ${state.score} poäng.`);
      return;
    }
  }

  for (const carrot of state.carrots) {
    if (intersects(bunnyHitbox, {
      x: carrot.x,
      y: carrot.y - carrot.height,
      width: carrot.width,
      height: carrot.height,
    })) {
      carrot.collected = true;
      state.score += 25;
    }
  }

  for (const sigge of state.sigges) {
    if (intersects(bunnyHitbox, {
      x: sigge.x + 6,
      y: sigge.y - sigge.height - sigge.jumpOffset + 8,
      width: sigge.width - 12,
      height: sigge.height - 10,
    }) && !sigge.petted) {
      sigge.petted = true;
      state.pettingTimer = 900;
      state.score = Math.max(0, state.score - 10);
    }
  }

  state.score += Math.floor(delta * 0.012);
  scoreElement.textContent = String(state.score);
}

function updateMaze(delta) {
  const maze = state.maze;
  const bunny = maze.bunny;
  if (state.mazeMessageTimer > 0) {
    state.mazeMessageTimer = Math.max(0, state.mazeMessageTimer - delta);
  }

  updateMazeBunny(bunny, delta);

  for (const elephant of maze.elephants) {
    updateMazeElephant(elephant, delta);

    if (Math.hypot(elephant.px - bunny.px, elephant.py - bunny.py) < 0.45) {
      endGame(`Elefanterna åt nästan upp Bosse i labyrinten. Du fick ${state.score} poäng.`);
      return;
    }
  }

  updateMazeCamera();

  if (Math.hypot(bunny.px - maze.carrot.x, bunny.py - maze.carrot.y) < 0.28) {
    completeMazeLevel();
  }
}

function updateMazeCamera() {
  const worldWidth = mazeCols * mazeCell;
  const worldHeight = mazeRows * mazeCell;
  const targetX = state.maze.bunny.px * mazeCell + mazeCell / 2 - mazeViewport.width / 2;
  const targetY = state.maze.bunny.py * mazeCell + mazeCell / 2 - mazeViewport.height / 2;
  state.maze.cameraX = clamp(targetX, 0, Math.max(0, worldWidth - mazeViewport.width));
  state.maze.cameraY = clamp(targetY, 0, Math.max(0, worldHeight - mazeViewport.height));
}

function updateMazeBunny(bunny, delta) {
  if (!bunny.moving) {
    const chosenDir = pickBunnyDirection(bunny);
    if (chosenDir) {
      startBunnyStep(bunny, chosenDir);
    }
    return;
  }

  bunny.progress = Math.min(1, bunny.progress + bunny.speed * delta * 0.001);
  bunny.px = lerp(bunny.fromX, bunny.targetX, bunny.progress);
  bunny.py = lerp(bunny.fromY, bunny.targetY, bunny.progress);

  if (bunny.progress < 1) {
    return;
  }

  bunny.cellX = bunny.targetX;
  bunny.cellY = bunny.targetY;
  bunny.px = bunny.cellX;
  bunny.py = bunny.cellY;
  bunny.moving = false;

  const chosenDir = pickBunnyDirection(bunny);
  if (chosenDir) {
    startBunnyStep(bunny, chosenDir);
  } else {
    bunny.dir = { x: 0, y: 0 };
  }
}

function pickBunnyDirection(bunny) {
  if (canMove(bunny.cellX, bunny.cellY, bunny.nextDir)) {
    return { ...bunny.nextDir };
  }
  if (canMove(bunny.cellX, bunny.cellY, bunny.dir)) {
    return { ...bunny.dir };
  }
  return null;
}

function startBunnyStep(bunny, dir) {
  bunny.dir = { ...dir };
  bunny.moving = true;
  bunny.progress = 0;
  bunny.fromX = bunny.cellX;
  bunny.fromY = bunny.cellY;
  bunny.targetX = bunny.cellX + dir.x;
  bunny.targetY = bunny.cellY + dir.y;
  bunny.px = bunny.fromX;
  bunny.py = bunny.fromY;
}

function updateMazeElephant(elephant, delta) {
  if (!elephant.moving) {
    const chosenDir = pickElephantDirection(elephant);
    if (chosenDir) {
      startMazeStep(elephant, chosenDir);
    }
    return;
  }

  elephant.progress = Math.min(1, elephant.progress + elephant.speed * delta * 0.001);
  elephant.px = lerp(elephant.fromX, elephant.targetX, elephant.progress);
  elephant.py = lerp(elephant.fromY, elephant.targetY, elephant.progress);

  if (elephant.progress < 1) {
    return;
  }

  elephant.cellX = elephant.targetX;
  elephant.cellY = elephant.targetY;
  elephant.px = elephant.cellX;
  elephant.py = elephant.cellY;
  elephant.moving = false;

  const chosenDir = pickElephantDirection(elephant);
  if (chosenDir) {
    startMazeStep(elephant, chosenDir);
  } else {
    elephant.dir = { x: 0, y: 0 };
  }
}

function pickElephantDirection(elephant) {
  const choices = getElephantChoices(elephant);
  if (!choices.length) {
    return null;
  }

  if (choices.length === 1) {
    return choices[0];
  }

  const forward = choices.find((dir) => dir.x === elephant.dir.x && dir.y === elephant.dir.y);
  const sideChoices = choices.filter((dir) => dir.x !== elephant.dir.x || dir.y !== elephant.dir.y);

  if (sideChoices.length === 1 && forward) {
    return sideChoices[0];
  }

  return choices[Math.floor(Math.random() * choices.length)];
}

function getElephantChoices(elephant) {
  let choices = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ].filter((dir) => canMove(elephant.cellX, elephant.cellY, dir));

  if (!choices.length) {
    return choices;
  }

  const reverse = { x: -elephant.dir.x, y: -elephant.dir.y };
  const nonReverseChoices = choices.filter((dir) => dir.x !== reverse.x || dir.y !== reverse.y);
  if (nonReverseChoices.length) {
    choices = nonReverseChoices;
  }

  return choices;
}

function startMazeStep(actor, dir) {
  actor.dir = { ...dir };
  actor.moving = true;
  actor.progress = 0;
  actor.fromX = actor.cellX;
  actor.fromY = actor.cellY;
  actor.targetX = actor.cellX + dir.x;
  actor.targetY = actor.cellY + dir.y;
  actor.px = actor.fromX;
  actor.py = actor.fromY;
}

function moveMazeActor(actor, delta, useNextDir) {
  const speed = actor.speed * delta * 0.0019;
  actor.cellX = Math.round(actor.px);
  actor.cellY = Math.round(actor.py);

  if (useNextDir) {
    tryTurn(actor, actor.nextDir, true);
  }

  if (!canMove(actor.cellX, actor.cellY, actor.dir)) {
    actor.dir = { x: 0, y: 0 };
    return;
  }

  if (actor.dir.x !== 0) {
    actor.py = snapToCell(actor.py);
  }
  if (actor.dir.y !== 0) {
    actor.px = snapToCell(actor.px);
  }

  const nextX = actor.px + actor.dir.x * speed;
  const nextY = actor.py + actor.dir.y * speed;

  if (canOccupy(nextX, nextY, useNextDir ? 0.18 : 0.28)) {
    actor.px = nextX;
    actor.py = nextY;
  } else {
    actor.px = snapToCell(actor.px);
    actor.py = snapToCell(actor.py);
    actor.dir = { x: 0, y: 0 };
  }

  actor.cellX = Math.round(actor.px);
  actor.cellY = Math.round(actor.py);
}

function reachedCellCenter(actor) {
  return Math.abs(actor.px - Math.round(actor.px)) < 0.12 && Math.abs(actor.py - Math.round(actor.py)) < 0.12;
}

function tryTurn(actor, desiredDir, allowReverse = false) {
  if (!desiredDir || (desiredDir.x === 0 && desiredDir.y === 0)) {
    return;
  }

  const cellX = Math.round(actor.px);
  const cellY = Math.round(actor.py);
  const nearCenterX = Math.abs(actor.px - cellX) < 0.32;
  const nearCenterY = Math.abs(actor.py - cellY) < 0.32;

  if (
    allowReverse &&
    desiredDir.x === -actor.dir.x &&
    desiredDir.y === -actor.dir.y &&
    !(desiredDir.x === 0 && desiredDir.y === 0)
  ) {
    actor.dir = { ...desiredDir };
    return;
  }

  if (desiredDir.x !== 0 && nearCenterY && canMove(cellX, cellY, desiredDir)) {
    actor.py = cellY;
    actor.dir = { ...desiredDir };
    return;
  }

  if (desiredDir.y !== 0 && nearCenterX && canMove(cellX, cellY, desiredDir)) {
    actor.px = cellX;
    actor.dir = { ...desiredDir };
  }
}

function snapToCell(value) {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) < 0.18 ? rounded : value;
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function canMove(cellX, cellY, dir) {
  if (!dir || (dir.x === 0 && dir.y === 0)) {
    return true;
  }
  return isOpenCell(cellX + dir.x, cellY + dir.y);
}

function canOccupy(px, py, margin = 0.28) {
  const left = Math.floor(px + margin);
  const right = Math.ceil(px - margin);
  const top = Math.floor(py + margin);
  const bottom = Math.ceil(py - margin);
  return isOpenCell(left, top) && isOpenCell(right, top) && isOpenCell(left, bottom) && isOpenCell(right, bottom);
}

function isOpenCell(x, y) {
  if (x < 0 || x >= mazeCols || y < 0 || y >= mazeRows) {
    return false;
  }
  return mazeWalls[y][x] !== "#";
}

function mazeToCanvasX(value) {
  return mazeViewport.x + value * mazeCell + mazeCell / 2 - state.maze.cameraX;
}

function mazeToCanvasY(value) {
  return mazeViewport.y + value * mazeCell + mazeCell / 2 - state.maze.cameraY;
}

function distance(ax, bx, ay, by) {
  return Math.hypot(ax - bx, ay - by);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function draw() {
  if (state.mode === "maze") {
    drawMaze();
  } else {
    drawRunner();
  }
}

function drawRunner() {
  drawRunnerBackground();
  for (const carrot of state.carrots) {
    drawCarrot(carrot);
  }
  for (const sigge of state.sigges) {
    drawSigge(sigge);
  }
  for (const elephant of state.elephants) {
    drawElephant(elephant.x, elephant.y, elephant.width, elephant.height, false);
  }
  drawBunnyRunner();

  ctx.fillStyle = "rgba(33, 64, 75, 0.7)";
  ctx.font = "700 22px 'Baloo 2'";
  const hint = state.pettingTimer > 0
    ? "Bosse klappar Sigge... tiden tickar medan han gosar."
    : "Hoppa över elefanter, akta Sigge och ta morötter.";
  ctx.fillText(hint, 28, 38);
}

function drawMaze() {
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#15304a");
  bg.addColorStop(1, "#0b1622");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(22, 18, canvas.width - 44, 24);

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(mazeViewport.x - 2, mazeViewport.y - 2, mazeViewport.width + 4, mazeViewport.height + 4);

  ctx.save();
  ctx.beginPath();
  ctx.rect(mazeViewport.x, mazeViewport.y, mazeViewport.width, mazeViewport.height);
  ctx.clip();
  ctx.translate(mazeViewport.x - state.maze.cameraX, mazeViewport.y - state.maze.cameraY);

  ctx.fillStyle = mazeFloorColor;
  ctx.fillRect(0, 0, mazeCols * mazeCell, mazeRows * mazeCell);
  drawMazeWalls();

  highlightMazeCell(1, 1, "rgba(126, 215, 255, 0.18)");
  highlightMazeCell(state.maze.carrot.x, state.maze.carrot.y, "rgba(246, 139, 44, 0.22)");
  drawCarrotAtCell(state.maze.carrot.x, state.maze.carrot.y);
  for (const elephant of state.maze.elephants) {
    drawElephant(elephant.px * mazeCell + mazeCell / 2 - 20, elephant.py * mazeCell + mazeCell / 2 + 14, 40, 30, true);
  }
  drawMazeBunny();
  ctx.restore();

  drawMazeLegend();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 22px 'Baloo 2'";
  const text = state.mazeMessageTimer > 0
    ? "Labyrintbana: nå moroten innan elefanterna fångar Bosse."
    : "Piltangenter eller WASD för att svänga i labyrinten.";
  ctx.fillText(text, 28, 38);
}

function drawRunnerBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#7ed7ff");
  sky.addColorStop(0.65, "#d8f6ff");
  sky.addColorStop(1, "#eafcd9");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffd84d";
  ctx.beginPath();
  ctx.arc(790, 82, 42, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 5; i += 1) {
    const x = ((i * 220) - state.cloudsOffset) % (canvas.width + 140);
    drawCloud((x + canvas.width + 140) % (canvas.width + 140) - 80, 70 + (i % 2) * 34, 1 + (i % 3) * 0.14);
  }

  ctx.fillStyle = "#96dd72";
  ctx.fillRect(0, groundY + 8, canvas.width, canvas.height - groundY);
  ctx.fillStyle = "#70c15a";
  ctx.fillRect(0, groundY + 18, canvas.width, 22);
  ctx.fillStyle = "#4c9b3c";
  for (let i = 0; i < canvas.width; i += 28) {
    ctx.fillRect(i, groundY + 18, 14, 22);
  }
}

function drawCloud(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.arc(22, -10, 22, 0, Math.PI * 2);
  ctx.arc(48, -2, 18, 0, Math.PI * 2);
  ctx.arc(22, 8, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBunnyRunner() {
  drawBunnyShape(state.bunny.x, state.bunny.y - state.bunny.height, state.bunny.jumpStretch);
}

function drawMazeBunny() {
  const bunny = state.maze.bunny;
  highlightMazeCell(Math.round(bunny.px), Math.round(bunny.py), "rgba(255,255,255,0.14)");
  drawBunnyShape(bunny.px * mazeCell + mazeCell / 2 - 24, bunny.py * mazeCell + mazeCell / 2 - 36, 0.05);
}

function highlightMazeCell(cellX, cellY, color) {
  const x = cellX * mazeCell;
  const y = cellY * mazeCell;
  ctx.fillStyle = color;
  ctx.fillRect(x + 8, y + 8, mazeCell - 16, mazeCell - 16);
}

function drawMazeWalls() {
  ctx.strokeStyle = mazeWallColor;
  ctx.lineWidth = mazeLineWidth;
  ctx.lineCap = "round";
  for (let row = 0; row < mazeRows; row += 1) {
    for (let col = 0; col < mazeCols; col += 1) {
      if (!isOpenCell(col, row)) {
        continue;
      }
      const x = col * mazeCell;
      const y = row * mazeCell;
      if (!isOpenCell(col, row - 1)) {
        drawMazeWallSegment(x, y, x + mazeCell, y);
      }
      if (!isOpenCell(col + 1, row)) {
        drawMazeWallSegment(x + mazeCell, y, x + mazeCell, y + mazeCell);
      }
      if (!isOpenCell(col, row + 1)) {
        drawMazeWallSegment(x, y + mazeCell, x + mazeCell, y + mazeCell);
      }
      if (!isOpenCell(col - 1, row)) {
        drawMazeWallSegment(x, y, x, y + mazeCell);
      }
    }
  }
}

function drawMazeWallSegment(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawMazeLegend() {
  const baseX = 26;
  const baseY = canvas.height - 68;
  ctx.fillStyle = "rgba(9, 20, 34, 0.72)";
  ctx.fillRect(baseX, baseY, 330, 34);

  ctx.fillStyle = "#c9cdd3";
  ctx.beginPath();
  ctx.arc(baseX + 16, baseY + 17, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "700 18px 'Baloo 2'";
  ctx.fillText("Bosse", baseX + 30, baseY + 23);

  ctx.fillStyle = "#f1c92c";
  ctx.beginPath();
  ctx.arc(baseX + 112, baseY + 17, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("Elefant", baseX + 126, baseY + 23);

  ctx.fillStyle = "#f68b2c";
  ctx.beginPath();
  ctx.arc(baseX + 228, baseY + 17, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("Morot", baseX + 242, baseY + 23);
}

function drawBunnyShape(x, y, jumpStretch) {
  ctx.save();
  ctx.translate(x, y);
  const earDrop = jumpStretch * 2;
  const fur = ctx.createLinearGradient(6, 0, 62, 96);
  fur.addColorStop(0, "#8da0ba");
  fur.addColorStop(0.45, "#71839d");
  fur.addColorStop(1, "#5d6f87");
  const innerFur = ctx.createLinearGradient(24, 18, 40, 96);
  innerFur.addColorStop(0, "#f1f2f0");
  innerFur.addColorStop(1, "#dce0e1");

  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(38, 18, 17, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(38, 55, 23, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(18, 30 + earDrop, 8, 24, 0.08, 0, Math.PI * 2);
  ctx.ellipse(58, 31 + earDrop, 8, 24, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#c6cdd4";
  ctx.beginPath();
  ctx.ellipse(18, 34 + earDrop, 5.5, 19, 0.08, 0, Math.PI * 2);
  ctx.ellipse(58, 35 + earDrop, 5.5, 19, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = innerFur;
  ctx.beginPath();
  ctx.ellipse(38, 26, 11, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(38, 60, 16, 31, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fur;
  ctx.beginPath();
  ctx.ellipse(18, 58, 6.5, 15, 0.18, 0, Math.PI * 2);
  ctx.ellipse(58, 58, 6.5, 15, -0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e8eceb";
  ctx.beginPath();
  ctx.ellipse(20, 92, 11, 8.5, 0.08, 0, Math.PI * 2);
  ctx.ellipse(56, 92, 11, 8.5, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f0f2ef";
  ctx.beginPath();
  ctx.ellipse(38, 31, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#313942";
  ctx.beginPath();
  ctx.arc(32, 20.5, 1.6, 0, Math.PI * 2);
  ctx.arc(44, 20.5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8f86af";
  ctx.beginPath();
  ctx.ellipse(38, 25.8, 5.8, 4.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#6b7180";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(33.5, 31.5);
  ctx.quadraticCurveTo(38, 33.5, 42.5, 31.5);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(27, 6);
  ctx.lineTo(33, 1);
  ctx.moveTo(49, 6);
  ctx.lineTo(43, 1);
  ctx.stroke();
  ctx.restore();
}

function drawElephant(x, y, width, height, mazeMode) {
  const top = y - height;
  const scaleX = width / 68;
  const scaleY = height / 52;
  ctx.save();
  ctx.translate(x, top);
  ctx.scale(scaleX, scaleY);
  const plush = ctx.createLinearGradient(8, 6, 58, 46);
  plush.addColorStop(0, mazeMode ? "#f6db55" : "#f6de67");
  plush.addColorStop(1, mazeMode ? "#e7c52f" : "#edcf49");

  ctx.fillStyle = plush;
  ctx.beginPath();
  ctx.ellipse(34, 22, 17, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(22, 20, 12, 15, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(13, 16);
  ctx.quadraticCurveTo(6, 4, 16, 6);
  ctx.quadraticCurveTo(24, 8, 26, 16);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(43, 18);
  ctx.quadraticCurveTo(57, 4, 63, 11);
  ctx.quadraticCurveTo(68, 18, 63, 25);
  ctx.quadraticCurveTo(57, 21, 55, 28);
  ctx.quadraticCurveTo(52, 35, 48, 27);
  ctx.quadraticCurveTo(44, 20, 43, 18);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(31, 39, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#232b34";
  ctx.beginPath();
  ctx.arc(39, 19, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#dfbb27";
  ctx.lineWidth = 4.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(18, 45);
  ctx.lineTo(18, 51);
  ctx.moveTo(29, 46);
  ctx.lineTo(29, 52);
  ctx.moveTo(39, 45);
  ctx.lineTo(39, 52);
  ctx.moveTo(49, 43);
  ctx.lineTo(49, 49);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(18, 13);
  ctx.quadraticCurveTo(30, 8, 40, 14);
  ctx.stroke();
  ctx.restore();
}

function drawCarrot(carrot) {
  drawCarrotShape(carrot.x, carrot.y - carrot.height);
}

function drawCarrotAtCell(cellX, cellY) {
  drawCarrotShape(cellX * mazeCell + mazeCell / 2 - 14, cellY * mazeCell + mazeCell / 2 - 9);
}

function drawCarrotShape(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#49a54b";
  ctx.beginPath();
  ctx.moveTo(4, 6);
  ctx.lineTo(14, 0);
  ctx.lineTo(11, 8);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(10, 6);
  ctx.lineTo(22, 2);
  ctx.lineTo(16, 10);
  ctx.fill();
  ctx.fillStyle = "#f68b2c";
  ctx.beginPath();
  ctx.moveTo(6, 6);
  ctx.lineTo(30, 10);
  ctx.lineTo(10, 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSigge(sigge) {
  const top = sigge.y - sigge.height - sigge.jumpOffset;
  ctx.save();
  ctx.translate(sigge.x, top);
  ctx.fillStyle = "#d6b793";
  ctx.beginPath();
  ctx.ellipse(35, 28, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(54, 24, 14, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(20, 16, 10, 16, -0.6, 0, Math.PI * 2);
  ctx.ellipse(30, 15, 10, 16, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f3ebe1";
  ctx.beginPath();
  ctx.ellipse(52, 28, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c3b42";
  ctx.beginPath();
  ctx.arc(58, 22, 2.2, 0, Math.PI * 2);
  ctx.arc(54, 28, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#b18e67";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(24, 42);
  ctx.lineTo(23, 49);
  ctx.moveTo(38, 42);
  ctx.lineTo(37, 49);
  ctx.moveTo(49, 41);
  ctx.lineTo(48, 48);
  ctx.stroke();
  if (sigge.petted) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "700 18px 'Baloo 2'";
    ctx.fillText("klapp", 10, -2);
  }
  ctx.restore();
}

function drawSmiley(smiley) {
  ctx.save();
  ctx.translate(smiley.x + smiley.width / 2, smiley.y + smiley.height / 2);
  ctx.fillStyle = "#ffe052";
  ctx.beginPath();
  ctx.arc(0, 0, smiley.width / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c3b42";
  ctx.beginPath();
  ctx.arc(-6, -4, 2.4, 0, Math.PI * 2);
  ctx.arc(6, -4, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "#2c3b42";
  ctx.beginPath();
  ctx.arc(0, 2, 9, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.restore();
}

function frame(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }
  const delta = Math.min(32, timestamp - state.lastTime);
  state.lastTime = timestamp;
  update(delta);
  draw();
  requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
  if (handleMazeDirection(event.code)) {
    event.preventDefault();
    return;
  }

  if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    if (state.mode === "runner") {
      if (!state.running && !state.gameOver) {
        startRunnerGame();
      } else if (state.gameOver) {
        startRunnerGame();
      }
      jump();
    }
  }
});

canvas.addEventListener("pointerdown", () => {
  if (state.mode === "runner") {
    handleRunnerJump();
  }
});

runnerButton.addEventListener("click", () => {
  startRunnerGame();
});

mazeButton.addEventListener("click", () => {
  startMazeGame();
});

restartButton.addEventListener("click", () => {
  gameOverOverlay.classList.add("hidden");
  if (state.selectedGame === "maze") {
    startMazeGame();
  } else {
    startRunnerGame();
  }
});

menuButton.addEventListener("click", () => {
  showMenu();
});

joystickBase.addEventListener("pointerdown", (event) => {
  if (state.mode !== "maze") {
    return;
  }
  event.preventDefault();
  joystickState.active = true;
  joystickState.pointerId = event.pointerId;
  joystickBase.setPointerCapture(event.pointerId);
  updateJoystickFromPoint(event.clientX, event.clientY);
});

joystickBase.addEventListener("pointermove", (event) => {
  if (!joystickState.active || joystickState.pointerId !== event.pointerId) {
    return;
  }
  event.preventDefault();
  updateJoystickFromPoint(event.clientX, event.clientY);
});

function releaseJoystick(pointerId) {
  joystickState.active = false;
  joystickState.pointerId = null;
  resetJoystick();
  if (pointerId !== null && joystickBase.hasPointerCapture(pointerId)) {
    joystickBase.releasePointerCapture(pointerId);
  }
}

joystickBase.addEventListener("pointerup", (event) => {
  releaseJoystick(event.pointerId);
});

joystickBase.addEventListener("pointercancel", (event) => {
  releaseJoystick(event.pointerId);
});

function updateJoystickFromPoint(clientX, clientY) {
  const rect = joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rawX = clientX - centerX;
  const rawY = clientY - centerY;
  const radius = rect.width * 0.5;
  const maxDistance = radius - 28;
  const distance = Math.hypot(rawX, rawY);
  const limited = distance > maxDistance && distance > 0
    ? maxDistance / distance
    : 1;
  const knobX = rawX * limited;
  const knobY = rawY * limited;
  joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

  if (distance < 18) {
    return;
  }

  if (Math.abs(rawX) > Math.abs(rawY)) {
    handleMazeDirection(rawX > 0 ? "ArrowRight" : "ArrowLeft");
  } else {
    handleMazeDirection(rawY > 0 ? "ArrowDown" : "ArrowUp");
  }
}

function resetJoystick() {
  joystickKnob.style.transform = "translate(-50%, -50%)";
}

window.addEventListener("resize", updateMobileMode);
window.addEventListener("orientationchange", updateMobileMode);

showMenu();
requestAnimationFrame(frame);
