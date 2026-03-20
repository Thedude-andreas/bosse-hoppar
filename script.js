const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const levelCaptionElement = document.getElementById("level-caption");
const scoreCaptionElement = document.getElementById("score-caption");
const scoreElement = document.getElementById("score");
const totalCardElement = document.getElementById("total-card");
const totalScoreElement = document.getElementById("total-score");
const scoreCard = document.getElementById("score-card");
const bestCaptionElement = document.getElementById("best-caption");
const bestScoreElement = document.getElementById("best-score");
const levelLabelElement = document.getElementById("level-label");
const startOverlay = document.getElementById("start-overlay");
const leaderboardOverlay = document.getElementById("leaderboard-overlay");
const leaderboardTitle = document.getElementById("leaderboard-title");
const leaderboardStatus = document.getElementById("leaderboard-status");
const leaderboardList = document.getElementById("leaderboard-list");
const leaderboardStart = document.getElementById("leaderboard-start");
const leaderboardBack = document.getElementById("leaderboard-back");
const nameEntryOverlay = document.getElementById("name-entry-overlay");
const nameEntryText = document.getElementById("name-entry-text");
const nameEntryForm = document.getElementById("name-entry-form");
const nameEntryInput = document.getElementById("name-entry-input");
const nameEntrySkip = document.getElementById("name-entry-skip");
const nameEntryFeedback = document.getElementById("name-entry-feedback");
const gameOverOverlay = document.getElementById("game-over-overlay");
const hockeyLevelOverlay = document.getElementById("hockey-level-overlay");
const hockeyLevelTitle = document.getElementById("hockey-level-title");
const hockeyLevelComment = document.getElementById("hockey-level-comment");
const hockeyLevelScore = document.getElementById("hockey-level-score");
const cheatOverlay = document.getElementById("cheat-overlay");
const cheatForm = document.getElementById("cheat-form");
const cheatInput = document.getElementById("cheat-input");
const cheatCancel = document.getElementById("cheat-cancel");
const cheatFeedback = document.getElementById("cheat-feedback");
const finalScoreElement = document.getElementById("final-score");
const gameShell = document.getElementById("game-shell");
const runnerButton = document.getElementById("runner-button");
const mazeButton = document.getElementById("maze-button");
const hockeyButton = document.getElementById("hockey-button");
const restartButton = document.getElementById("restart-button");
const menuButton = document.getElementById("menu-button");
const joystick = document.getElementById("joystick");
const joystickBase = document.getElementById("joystick-base");
const joystickKnob = document.getElementById("joystick-knob");

const groundY = 330;
const gravity = 0.72;
const jumpVelocity = -16.5;
const flappyGravity = 0.52;
const flappyVelocity = -9.2;
const baseSpeed = 6.2;
const elephantInterval = 1280;
const carrotInterval = 2100;
const siggeInterval = 4200;
const bestScoreKey = "bosse-hoppar-best-score";
const leaderboardLimit = 10;
const leaderboardStorageKeys = {
  runner: "bosse-hoppar-runner-scores",
  maze: "bosse-hoppar-maze-scores",
  hockey: "bosse-hoppar-hockey-scores",
};
const gameMeta = {
  runner: { key: "runner", label: "Bosse Hoppar" },
  maze: { key: "maze", label: "Bosse Vimsar" },
  hockey: { key: "hockey", label: "Bosse på is" },
};
const mazeCell = 40;
const totalMazeLevels = 10;
const mazeLevels = [
  { cols: 13, rows: 11, carrots: 3, elephants: 2, carrotPoints: 20, clearBonus: 120 },
  { cols: 15, rows: 11, carrots: 3, elephants: 3, carrotPoints: 25, clearBonus: 180 },
  { cols: 17, rows: 13, carrots: 4, elephants: 3, carrotPoints: 30, clearBonus: 250 },
  { cols: 19, rows: 13, carrots: 4, elephants: 4, carrotPoints: 35, clearBonus: 330 },
  { cols: 21, rows: 15, carrots: 5, elephants: 4, carrotPoints: 40, clearBonus: 420 },
  { cols: 23, rows: 15, carrots: 5, elephants: 5, carrotPoints: 45, clearBonus: 520 },
  { cols: 25, rows: 17, carrots: 6, elephants: 5, carrotPoints: 50, clearBonus: 630 },
  { cols: 27, rows: 19, carrots: 6, elephants: 6, carrotPoints: 55, clearBonus: 750 },
  { cols: 29, rows: 21, carrots: 7, elephants: 6, carrotPoints: 60, clearBonus: 880 },
  { cols: 31, rows: 23, carrots: 8, elephants: 7, carrotPoints: 70, clearBonus: 1020 },
];
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
const hockeyRink = {
  x: 300,
  y: 72,
  width: 360,
  height: 320,
};
let lastScoreTapAt = 0;
let cheatResumeRunning = false;
let supabaseClient = null;
const crocodileSprite = new Image();
crocodileSprite.src = "assets/crocodile-photo-sprite.png";

const state = {
  running: false,
  gameOver: false,
  score: 0,
  bestScore: 0,
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
  mazeCelebrationText: "",
  cheatOpen: false,
  runnerFlappyMode: false,
  runnerFlyingElephants: false,
  runnerCarrotRainTimer: 0,
  runnerCarrotRainSpawnTimer: 0,
  runnerSuperTimer: 0,
  runnerCrocodile: null,
  leaderboardEntries: [],
  leaderboardGame: null,
  pendingScoreEntry: null,
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
  hockey: createHockeyState(),
};

bestScoreElement.textContent = "0";
updateHud();

function createMazeState() {
  return createMazeLevel(0);
}

function createHockeyState() {
  return {
    level: 1,
    shotsTakenLevel: 0,
    goalsThisLevel: 0,
    charging: false,
    shotPower: 0,
    aim: 0,
    steer: 0,
    dragPointerId: null,
    dragStartX: 0,
    dragStartY: 0,
    goals: 0,
    saves: 0,
    shots: [],
    fireworks: [],
    levelOverlayOpen: false,
    pendingNextLevel: 2,
    messageTimer: 2400,
    flashTimer: 0,
    flashType: "",
    message: "Level 1: sätt minst 6 av 10 skott.",
    goalie: {
      x: canvas.width / 2,
      targetX: canvas.width / 2,
      reactionDelay: 0,
      reach: 22,
      mood: "ready",
    },
  };
}

function createMazeLevel(levelIndex) {
  const config = mazeLevels[levelIndex];
  const walls = generateMazeWalls(config.cols, config.rows, levelIndex + 1);
  const openCells = collectOpenCells(walls);
  const start = { x: 1, y: 1 };
  const reserved = new Set([cellKey(start.x, start.y)]);
  const distantCells = [...openCells]
    .filter((cell) => cell.x !== start.x || cell.y !== start.y)
    .sort((a, b) => {
      const distA = Math.hypot(a.x - start.x, a.y - start.y);
      const distB = Math.hypot(b.x - start.x, b.y - start.y);
      return distB - distA;
    });
  const carrots = pickMazeCells(distantCells, config.carrots, reserved, 3.2);
  const elephants = pickMazeCells(distantCells, config.elephants, reserved, 2.4).map((cell, index) => {
    const dir = index % 2 === 0 ? { x: 1, y: 0 } : { x: 0, y: 1 };
    return createMazeElephant(cell.x, cell.y, dir.x, dir.y, 1.65 + levelIndex * 0.13);
  });

  return {
    levelIndex,
    levelNumber: levelIndex + 1,
    cols: config.cols,
    rows: config.rows,
    walls,
    cameraX: 0,
    cameraY: 0,
    start,
    bunny: {
      cellX: start.x,
      cellY: start.y,
      px: start.x,
      py: start.y,
      dir: { x: 0, y: 0 },
      nextDir: { x: 0, y: 0 },
      speed: 3.4,
      moving: false,
      fromX: start.x,
      fromY: start.y,
      targetX: start.x,
      targetY: start.y,
      progress: 0,
    },
    carrots,
    elephants,
    carrotPoints: config.carrotPoints,
    clearBonus: config.clearBonus,
    celebrationTimer: 0,
    transitionTimer: 0,
    confetti: [],
    levelComplete: false,
  };
}

function generateMazeWalls(cols, rows, seed) {
  const width = cols % 2 === 0 ? cols + 1 : cols;
  const height = rows % 2 === 0 ? rows + 1 : rows;
  const grid = Array.from({ length: height }, () => Array(width).fill("#"));
  const stack = [{ x: 1, y: 1 }];
  const random = createSeededRandom(seed * 9973);
  grid[1][1] = ".";

  while (stack.length) {
    const current = stack[stack.length - 1];
    const neighbors = [
      { x: current.x + 2, y: current.y, betweenX: current.x + 1, betweenY: current.y },
      { x: current.x - 2, y: current.y, betweenX: current.x - 1, betweenY: current.y },
      { x: current.x, y: current.y + 2, betweenX: current.x, betweenY: current.y + 1 },
      { x: current.x, y: current.y - 2, betweenX: current.x, betweenY: current.y - 1 },
    ].filter((neighbor) =>
      neighbor.x > 0 &&
      neighbor.x < width - 1 &&
      neighbor.y > 0 &&
      neighbor.y < height - 1 &&
      grid[neighbor.y][neighbor.x] === "#"
    );

    if (!neighbors.length) {
      stack.pop();
      continue;
    }

    const next = neighbors[Math.floor(random() * neighbors.length)];
    grid[next.betweenY][next.betweenX] = ".";
    grid[next.y][next.x] = ".";
    stack.push({ x: next.x, y: next.y });
  }

  const loopCandidates = [];
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      if (grid[y][x] !== "#") {
        continue;
      }
      const horizontalConnector =
        grid[y][x - 1] === "." &&
        grid[y][x + 1] === "." &&
        grid[y - 1][x] === "#" &&
        grid[y + 1][x] === "#";
      const verticalConnector =
        grid[y - 1][x] === "." &&
        grid[y + 1][x] === "." &&
        grid[y][x - 1] === "#" &&
        grid[y][x + 1] === "#";

      if (horizontalConnector || verticalConnector) {
        loopCandidates.push({ x, y });
      }
    }
  }

  const extraPassages = Math.min(
    loopCandidates.length,
    Math.max(4, Math.floor((width * height) / 95) + Math.floor(seed * 0.8))
  );
  for (let index = 0; index < extraPassages; index += 1) {
    const pickIndex = Math.floor(random() * loopCandidates.length);
    const [candidate] = loopCandidates.splice(pickIndex, 1);
    if (!candidate) {
      break;
    }
    grid[candidate.y][candidate.x] = ".";
  }

  return grid.map((row) => row.join(""));
}

function collectOpenCells(walls) {
  const openCells = [];
  for (let y = 0; y < walls.length; y += 1) {
    for (let x = 0; x < walls[y].length; x += 1) {
      if (walls[y][x] === ".") {
        openCells.push({ x, y });
      }
    }
  }
  return openCells;
}

function pickMazeCells(cells, count, reserved, minDistance) {
  const selected = [];
  let spacing = minDistance;

  while (selected.length < count && spacing >= 0) {
    for (const cell of cells) {
      const key = cellKey(cell.x, cell.y);
      if (reserved.has(key)) {
        continue;
      }
      const farEnough = selected.every((picked) => Math.hypot(cell.x - picked.x, cell.y - picked.y) >= spacing);
      if (!farEnough) {
        continue;
      }
      selected.push(cell);
      reserved.add(key);
      if (selected.length === count) {
        break;
      }
    }
    spacing -= 0.8;
  }

  return selected;
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return function seededRandom() {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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
  state.runnerFlappyMode = false;
  state.runnerFlyingElephants = false;
  state.runnerCarrotRainTimer = 0;
  state.runnerCarrotRainSpawnTimer = 0;
  state.runnerSuperTimer = 0;
  state.runnerCrocodile = null;
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
  state.bestScore = 0;
  state.leaderboardEntries = [];
  state.leaderboardGame = null;
  scoreElement.textContent = "0";
  totalScoreElement.textContent = "0";
  bestScoreElement.textContent = "0";
  updateHud();
  updateMobileMode();
  updateShellLayout();
  closeCheatDialog();
  closeHockeyLevelOverlay();
  closeLeaderboardOverlay();
  closeNameEntryOverlay();
  startOverlay.classList.remove("hidden");
  gameOverOverlay.classList.add("hidden");
}

function startRunnerGame() {
  requestGameFullscreen();
  resetRunnerState(true);
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  closeHockeyLevelOverlay();
  closeLeaderboardOverlay();
  closeNameEntryOverlay();
  closeCheatDialog();
  updateMobileMode();
  updateShellLayout();
}

function startMazeGame() {
  requestGameFullscreen();
  loadMazeLevel(0, true);
}

function startHockeyGame() {
  requestGameFullscreen();
  resetHockeyState(true);
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  closeLeaderboardOverlay();
  closeNameEntryOverlay();
  closeCheatDialog();
  updateMobileMode();
  updateShellLayout();
}

function loadMazeLevel(levelIndex, resetScore) {
  state.mode = "maze";
  state.selectedGame = "maze";
  state.running = true;
  state.gameOver = false;
  if (resetScore) {
    state.score = 0;
  }
  scoreElement.textContent = String(state.score);
  state.lastTime = 0;
  state.mazeMessageTimer = 1800;
  state.mazeCelebrationText = "";
  state.maze = createMazeLevel(levelIndex);
  startOverlay.classList.add("hidden");
  gameOverOverlay.classList.add("hidden");
  closeHockeyLevelOverlay();
  closeLeaderboardOverlay();
  closeNameEntryOverlay();
  closeCheatDialog();
  updateMazeCamera();
  updateHud();
  updateMobileMode();
  updateShellLayout();
}

function resetHockeyState(resetScore) {
  state.mode = "hockey";
  state.selectedGame = "hockey";
  state.running = true;
  state.gameOver = false;
  state.lastTime = 0;
  state.hockey = createHockeyState();
  if (resetScore) {
    state.score = 0;
  }
  scoreElement.textContent = String(state.score);
  totalScoreElement.textContent = String(state.score);
  closeHockeyLevelOverlay();
  updateHud();
}

function completeMazeLevel() {
  const maze = state.maze;
  if (maze.levelComplete) {
    return;
  }

  maze.levelComplete = true;
  maze.celebrationTimer = 2400;
  maze.transitionTimer = 2400;
  maze.confetti = createConfettiBursts(140);
  state.score += maze.clearBonus;
  scoreElement.textContent = String(state.score);
  state.mazeCelebrationText = `Hurra! Bana ${maze.levelNumber} klar! +${maze.clearBonus} poäng`;
  state.mazeMessageTimer = 2200;
  persistBestScore();
}

function advanceMazeLevel() {
  if (state.maze.levelIndex + 1 >= totalMazeLevels) {
    finishMazeAdventure();
    return;
  }
  loadMazeLevel(state.maze.levelIndex + 1, false);
}

function finishMazeAdventure() {
  state.running = false;
  state.gameOver = true;
  persistBestScore();
  updateShellLayout();
  void handleFinishedGame({
    game: "maze",
    score: state.score,
    title: "Alla banor klara!",
    message: `Bosse klarade alla 10 banor och samlade ihop ${state.score} poäng i labyrinten.`,
    restartLabel: "Spela från bana 1",
    restartAction: "maze-reset",
  });
}

function endGame(message) {
  state.running = false;
  state.gameOver = true;
  persistBestScore();
  updateShellLayout();
  const game = state.selectedGame === "maze" ? "maze" : "runner";
  void handleFinishedGame({
    game,
    score: state.score,
    title: "Oj! Bosse snubblade.",
    message: message || `Du fick ${state.score} poäng.`,
    restartLabel: "Spela igen",
    restartAction: "retry-current",
  });
}

function persistBestScore() {
  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    bestScoreElement.textContent = String(state.bestScore);
  }
}

function updateHud() {
  const isHockey = state.mode === "hockey";
  totalCardElement.classList.toggle("hidden", !isHockey);
  levelCaptionElement.textContent = isHockey ? "Level" : "Spel";
  scoreCaptionElement.textContent = isHockey ? "Skott" : "Poäng";
  bestCaptionElement.textContent = "Bästa";
  if (state.mode === "menu") {
    if (state.selectedGame && gameMeta[state.selectedGame]) {
      levelLabelElement.textContent = gameMeta[state.selectedGame].label.replace("Bosse ", "");
    } else {
      levelLabelElement.textContent = "Välj";
    }
    return;
  }
  if (state.mode === "maze") {
    const levelNumber = state.maze?.levelNumber || 1;
    levelLabelElement.textContent = `Vimsar ${levelNumber}/${totalMazeLevels}`;
  } else if (state.mode === "hockey") {
    levelLabelElement.textContent = String(state.hockey.level);
    scoreElement.textContent = `${state.hockey.goalsThisLevel}/${state.hockey.shotsTakenLevel}`;
    totalScoreElement.textContent = String(state.score);
  } else {
    levelLabelElement.textContent = "Hoppar";
  }
}

function getConfiguredGame(game) {
  return gameMeta[game] || gameMeta.runner;
}

function getSupabaseConfig() {
  return window.BOSSE_SUPABASE_CONFIG || { url: "", anonKey: "" };
}

function hasSupabaseConfig() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey && window.supabase?.createClient);
}

function getSupabaseClient() {
  if (supabaseClient || !hasSupabaseConfig()) {
    return supabaseClient;
  }
  const config = getSupabaseConfig();
  supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  return supabaseClient;
}

function normalizeLeaderboardEntries(entries) {
  return [...entries]
    .map((entry) => ({
      name: String(entry.name || "Anonym").trim().slice(0, 20) || "Anonym",
      score: Number(entry.score || 0),
      created_at: entry.created_at || new Date().toISOString(),
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => (b.score - a.score) || a.created_at.localeCompare(b.created_at))
    .slice(0, leaderboardLimit);
}

function readLocalLeaderboard(game) {
  const key = leaderboardStorageKeys[game];
  if (!key) {
    return [];
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? normalizeLeaderboardEntries(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function writeLocalLeaderboard(game, entries) {
  const key = leaderboardStorageKeys[game];
  if (!key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(normalizeLeaderboardEntries(entries)));
}

async function fetchLeaderboard(game) {
  const client = getSupabaseClient();
  if (client) {
    const { data, error } = await client
      .from("highscores")
      .select("name, score, created_at")
      .eq("game", game)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(leaderboardLimit);
    if (!error) {
      return {
        entries: normalizeLeaderboardEntries(data || []),
        status: "Topp 10 i världen",
      };
    }
  }

  return {
    entries: readLocalLeaderboard(game),
    status: hasSupabaseConfig() ? "Visar lokal reservlista" : "Lokal topplista tills Supabase är konfigurerat",
  };
}

async function saveLeaderboardEntry(game, name, score) {
  const entry = {
    game,
    name: String(name || "Anonym").trim().slice(0, 20) || "Anonym",
    score,
    created_at: new Date().toISOString(),
  };
  const client = getSupabaseClient();
  if (client) {
    const { error } = await client.from("highscores").insert({
      game: entry.game,
      name: entry.name,
      score: entry.score,
    });
    if (!error) {
      return { ok: true, remote: true };
    }
  }

  const localEntries = readLocalLeaderboard(game);
  localEntries.push(entry);
  writeLocalLeaderboard(game, localEntries);
  return { ok: true, remote: false };
}

function qualifiesForLeaderboard(entries, score) {
  if (entries.length < leaderboardLimit) {
    return true;
  }
  const cutoff = entries[entries.length - 1];
  return score >= cutoff.score;
}

function updateBestScoreFromEntries(entries) {
  state.bestScore = entries[0]?.score || 0;
  bestScoreElement.textContent = String(state.bestScore);
}

function renderLeaderboard(entries) {
  leaderboardList.innerHTML = "";
  if (!entries.length) {
    const empty = document.createElement("li");
    empty.className = "leaderboard-empty";
    empty.textContent = "Ingen topplista ännu. Första rundan blir förstaplatsen.";
    leaderboardList.append(empty);
    return;
  }

  for (let index = 0; index < leaderboardLimit; index += 1) {
    const entry = entries[index];
    const item = document.createElement("li");
    item.className = "leaderboard-item";
    if (entry) {
      item.innerHTML = `
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">${entry.name}</span>
        <span class="leaderboard-score">${entry.score}</span>
      `;
    } else {
      item.innerHTML = `
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-name">Ledig plats</span>
        <span class="leaderboard-score">-</span>
      `;
    }
    leaderboardList.append(item);
  }
}

function closeLeaderboardOverlay() {
  leaderboardOverlay.classList.add("hidden");
}

function closeNameEntryOverlay() {
  nameEntryOverlay.classList.add("hidden");
  nameEntryFeedback.textContent = "";
  state.pendingScoreEntry = null;
}

function closeHockeyLevelOverlay() {
  hockeyLevelOverlay.classList.add("hidden");
  state.hockey.levelOverlayOpen = false;
  state.hockey.fireworks = [];
}

function getHockeyLevelComment(goals) {
  if (goals === 10) {
    return "10/10! Helt overkligt.";
  }
  if (goals >= 8) {
    return "Traffsakert!";
  }
  if (goals >= 6) {
    return "Snygga skott.";
  }
  if (goals >= 4) {
    return "Helt okej, Bosse.";
  }
  if (goals === 3) {
    return "Det dar klarade sig.";
  }
  if (goals === 6) {
    return "Precis over gransen.";
  }
  if (goals === 5) {
    return "1 traff ifran game over.";
  }
  return "Inte jattebra.";
}

function createHockeyFireworksBursts(count) {
  const colors = ["#ffd84d", "#ff8c42", "#7ed7ff", "#ff6f91", "#7ddf6f", "#fff6c4"];
  const bursts = [];
  for (let burstIndex = 0; burstIndex < count; burstIndex += 1) {
    const cx = 180 + Math.random() * (canvas.width - 360);
    const cy = 90 + Math.random() * 120;
    const particles = 26 + Math.floor(Math.random() * 14);
    for (let index = 0; index < particles; index += 1) {
      const angle = (Math.PI * 2 * index) / particles + Math.random() * 0.2;
      const speed = 1.8 + Math.random() * 3.6;
      bursts.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: colors[(burstIndex + index) % colors.length],
        life: 900 + Math.random() * 500,
      });
    }
  }
  return bursts;
}

function showHockeyLevelOverlay() {
  const goals = state.hockey.goalsThisLevel;
  const nextLevel = state.hockey.level + 1;
  state.hockey.levelOverlayOpen = true;
  state.hockey.pendingNextLevel = nextLevel;
  hockeyLevelTitle.textContent = goals === 10 ? `Level ${state.hockey.level} perfekt!` : `Level ${state.hockey.level} klar`;
  hockeyLevelComment.textContent = getHockeyLevelComment(goals);
  hockeyLevelScore.textContent = `Du satte ${goals} av 10 skott.`;
  if (goals === 10) {
    state.hockey.fireworks = createHockeyFireworksBursts(6);
  } else {
    state.hockey.fireworks = [];
  }
  hockeyLevelOverlay.classList.remove("hidden");
}

function continueHockeyAfterLevel() {
  if (state.mode !== "hockey" || !state.hockey.levelOverlayOpen) {
    return;
  }
  closeHockeyLevelOverlay();
  state.hockey.level = state.hockey.pendingNextLevel;
  state.hockey.shotsTakenLevel = 0;
  state.hockey.goalsThisLevel = 0;
  state.hockey.message = `Level ${state.hockey.level}: sätt minst 6 av 10 skott.`;
  state.hockey.messageTimer = 1800;
  state.hockey.flashType = "level";
  state.hockey.flashTimer = 720;
  updateHud();
}

function showGameOverOverlay(title, message, restartLabel = "Spela igen", restartAction = "retry-current") {
  gameOverOverlay.querySelector("h2").textContent = title;
  finalScoreElement.textContent = message;
  restartButton.textContent = restartLabel;
  restartButton.dataset.action = restartAction;
  gameOverOverlay.classList.remove("hidden");
}

async function showLeaderboardForGame(game) {
  const meta = getConfiguredGame(game);
  state.selectedGame = game;
  state.mode = "menu";
  state.running = false;
  state.gameOver = false;
  state.score = 0;
  scoreElement.textContent = "0";
  totalScoreElement.textContent = "0";
  updateHud();
  updateShellLayout();
  closeCheatDialog();
  closeHockeyLevelOverlay();
  closeNameEntryOverlay();
  gameOverOverlay.classList.add("hidden");
  startOverlay.classList.add("hidden");
  leaderboardTitle.textContent = `${meta.label} · Topp 10`;
  leaderboardStatus.textContent = "Läser topplistan...";
  leaderboardOverlay.classList.remove("hidden");
  renderLeaderboard([]);

  const { entries, status } = await fetchLeaderboard(game);
  state.leaderboardEntries = entries;
  state.leaderboardGame = game;
  leaderboardStatus.textContent = status;
  updateBestScoreFromEntries(entries);
  renderLeaderboard(entries);
}

function openNameEntryOverlay(game, score, finishConfig) {
  const meta = getConfiguredGame(game);
  state.pendingScoreEntry = { game, score, finishConfig };
  nameEntryText.textContent = `${meta.label}: ${score} poäng räcker till topp 10. Skriv ditt namn.`;
  nameEntryInput.value = "";
  nameEntryFeedback.textContent = "";
  gameOverOverlay.classList.add("hidden");
  nameEntryOverlay.classList.remove("hidden");
  queueMicrotask(() => nameEntryInput.focus());
}

async function completeGameFinish(finishConfig) {
  const { entries, status } = await fetchLeaderboard(finishConfig.game);
  state.leaderboardEntries = entries;
  state.leaderboardGame = finishConfig.game;
  updateBestScoreFromEntries(entries);
  leaderboardStatus.textContent = status;
  renderLeaderboard(entries);
  closeNameEntryOverlay();
  showGameOverOverlay(
    finishConfig.title,
    finishConfig.message,
    finishConfig.restartLabel,
    finishConfig.restartAction
  );
}

async function showSavedLeaderboard(game, statusText) {
  const { entries, status } = await fetchLeaderboard(game);
  state.leaderboardEntries = entries;
  state.leaderboardGame = game;
  updateBestScoreFromEntries(entries);
  leaderboardTitle.textContent = `${getConfiguredGame(game).label} · Topp 10`;
  leaderboardStatus.textContent = statusText || status;
  renderLeaderboard(entries);
  closeNameEntryOverlay();
  gameOverOverlay.classList.add("hidden");
  leaderboardOverlay.classList.remove("hidden");
}

async function handleFinishedGame(finishConfig) {
  const { entries, status } = await fetchLeaderboard(finishConfig.game);
  state.leaderboardEntries = entries;
  state.leaderboardGame = finishConfig.game;
  leaderboardStatus.textContent = status;
  renderLeaderboard(entries);
  updateBestScoreFromEntries(entries);
  if (qualifiesForLeaderboard(entries, finishConfig.score)) {
    openNameEntryOverlay(finishConfig.game, finishConfig.score, finishConfig);
    return;
  }
  showGameOverOverlay(
    finishConfig.title,
    finishConfig.message,
    finishConfig.restartLabel,
    finishConfig.restartAction
  );
}

function isLandscapeMobileMode() {
  return window.innerWidth > window.innerHeight;
}

function isTouchMobileMode() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function requestGameFullscreen() {
  if (!isTouchMobileMode() || !isLandscapeMobileMode() || document.fullscreenElement) {
    return;
  }
  const target = document.documentElement;
  if (typeof target.requestFullscreen === "function") {
    target.requestFullscreen().catch(() => {});
    return;
  }
  if (typeof target.webkitRequestFullscreen === "function") {
    target.webkitRequestFullscreen();
  }
}

function updateMobileMode() {
  const inGame = state.mode !== "menu";
  const landscapeMode = isTouchMobileMode() && inGame && isLandscapeMobileMode();
  document.body.classList.toggle("mobile-game", landscapeMode);
  document.body.classList.toggle("mobile-landscape", landscapeMode);
  const showJoystick = landscapeMode && state.mode === "maze";
  joystick.classList.toggle("hidden", !showJoystick);
  joystick.setAttribute("aria-hidden", String(!showJoystick));
}

function updateShellLayout() {
  const menuVisible = state.mode === "menu" || state.gameOver;
  gameShell.classList.toggle("menu-open", menuVisible);
}

function openCheatDialog() {
  if (state.mode !== "runner" || state.gameOver) {
    return;
  }
  cheatResumeRunning = state.mode === "runner" && state.running && !state.gameOver;
  state.running = false;
  state.cheatOpen = true;
  cheatOverlay.classList.remove("hidden");
  cheatFeedback.textContent = "";
  cheatInput.value = "";
  queueMicrotask(() => cheatInput.focus());
}

function closeCheatDialog() {
  state.cheatOpen = false;
  cheatOverlay.classList.add("hidden");
  cheatFeedback.textContent = "";
  if (cheatResumeRunning && state.mode === "runner" && !state.gameOver) {
    state.running = true;
  }
  cheatResumeRunning = false;
}

function spawnSigge(xOffset = 0) {
  state.sigges.push({
    x: canvas.width + 120 + xOffset,
    y: groundY + 10,
    width: 74,
    height: 48,
    petted: false,
    jumpOffset: 0,
    nextHopIn: 180 + Math.random() * 500,
    hopTimer: 0,
  });
}

function activateCharlieCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  for (let index = 0; index < 12; index += 1) {
    spawnSigge(index * 58);
  }
  cheatFeedback.textContent = "Charlie aktiverad. Massor av Sigge kommer!";
}

function activatePelleCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  state.runnerFlyingElephants = true;
  for (const elephant of state.elephants) {
    elephant.flying = true;
    elephant.baseY = elephant.baseY ?? 160 + Math.random() * 120;
    elephant.bobOffset = elephant.bobOffset ?? Math.random() * Math.PI * 2;
    elephant.bobSpeed = elephant.bobSpeed ?? (0.0035 + Math.random() * 0.002);
    elephant.bobAmplitude = elephant.bobAmplitude ?? (10 + Math.random() * 12);
  }
  cheatFeedback.textContent = "Pelle aktiverad. Elefanterna flyger nu!";
}

function activateFlappyCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  state.runnerFlappyMode = true;
  state.bunny.velocityY = flappyVelocity;
  cheatFeedback.textContent = "Flappy aktiverad. Bosse kan nu flyga!";
}

function spawnRunnerCarrotBurst(count, baseX = canvas.width + 70) {
  for (let index = 0; index < count; index += 1) {
    state.carrots.push({
      x: baseX + Math.random() * 120 + index * (10 + Math.random() * 10),
      y: 78 + Math.random() * 220,
      width: 30,
      height: 18,
      collected: false,
    });
  }
}

function activateMorotCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  state.runnerCarrotRainTimer = 10000;
  state.runnerCarrotRainSpawnTimer = 0;
  spawnRunnerCarrotBurst(10, canvas.width + 30);
  cheatFeedback.textContent = "Morot aktiverad. Det regnar morötter i 10 sekunder!";
}

function activateSuperBosseCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  state.runnerSuperTimer = 10000;
  cheatFeedback.textContent = "SuperBosse aktiverad. Bosse blir supersnabb och odödlig i 10 sekunder!";
}

function activateKrokodilCheat() {
  if (state.mode !== "runner") {
    cheatFeedback.textContent = "Starta Bosse Hoppar först.";
    return;
  }
  state.runnerCrocodile = {
    x: state.bunny.x + 96,
    y: groundY + 4,
    width: 138,
    height: 92,
    timer: 10000,
    mode: "active",
    facing: 1,
    stride: 0,
  };
  cheatFeedback.textContent = "Krokodil aktiverad. Den springer framfor Bosse i 10 sekunder!";
}

function isSuperBosseActive() {
  return state.runnerSuperTimer > 0;
}

function isSuperBosseAuraActive() {
  return state.runnerSuperTimer > 2000;
}

function launchRunnerElephant(elephant, sourceX, boost = 1) {
  elephant.launched = true;
  elephant.launchVx = (16 + Math.random() * 4) * boost;
  elephant.launchVy = -11 - Math.random() * 3;
  elephant.launchY = elephant.renderY ?? elephant.y;
  elephant.rotation = 0;
  elephant.x = Math.max(elephant.x, sourceX + 6);
}

function jump() {
  if (!state.running || state.gameOver || state.mode !== "runner") {
    return;
  }

  if (state.runnerFlappyMode) {
    state.bunny.velocityY = flappyVelocity;
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

function getHockeyGoalBounds() {
  return {
    left: hockeyRink.x + 100,
    right: hockeyRink.x + hockeyRink.width - 100,
    top: hockeyRink.y + 26,
    bottom: hockeyRink.y + 60,
    centerX: hockeyRink.x + hockeyRink.width / 2,
    lineY: hockeyRink.y + 52,
    creaseY: hockeyRink.y + 92,
  };
}

function getHockeyAimTarget(aim = state.hockey.aim) {
  const goal = getHockeyGoalBounds();
  return {
    x: lerp(goal.left + 12, goal.right - 12, (clamp(aim, -1, 1) + 1) * 0.5),
    y: goal.lineY - 4,
  };
}

function getHockeyStickPose(charge = 0) {
  const bodyX = hockeyRink.x + hockeyRink.width / 2;
  const bodyY = hockeyRink.y + hockeyRink.height - 54;
  const pivotX = bodyX + 6;
  const pivotY = bodyY - 4;
  const swingAngle = charge * 1.15;
  const shaftLength = 58;
  const bladeLength = 16;
  const dirX = Math.cos(swingAngle);
  const dirY = Math.sin(swingAngle);
  const bladeAngle = swingAngle + 0.14;
  const bladeDirX = Math.cos(bladeAngle);
  const bladeDirY = Math.sin(bladeAngle);
  const handleX = pivotX - dirX * 6;
  const handleY = pivotY - dirY * 6;
  const bladeBaseX = pivotX + dirX * shaftLength;
  const bladeBaseY = pivotY + dirY * shaftLength;
  const bladeTipX = bladeBaseX + bladeDirX * bladeLength;
  const bladeTipY = bladeBaseY + bladeDirY * bladeLength;
  const puckX = bladeBaseX + dirX * 10;
  const puckY = bladeBaseY + dirY * 10;

  return {
    bodyX,
    bodyY,
    pivotX,
    pivotY,
    swingAngle,
    puckX,
    puckY,
    handleX,
    handleY,
    bladeBaseX,
    bladeBaseY,
    bladeTipX,
    bladeTipY,
    shaftEndX: pivotX + dirX * (shaftLength - 10),
    shaftEndY: pivotY + dirY * (shaftLength - 10),
  };
}

function getHockeyGoalieBounds() {
  const goal = getHockeyGoalBounds();
  const centerX = state.hockey.goalie.x;
  const centerY = goal.creaseY - 6;
  return {
    left: centerX - 19,
    right: centerX + 19,
    top: centerY - 21,
    bottom: centerY + 13,
  };
}

function getHockeyGoalieEllipse() {
  const goal = getHockeyGoalBounds();
  return {
    cx: state.hockey.goalie.x,
    cy: goal.creaseY - 6,
    rx: 21,
    ry: 15,
  };
}

function hockeyShotHitsGoalie(shotX, shotY, radiusX = 9, radiusY = 6) {
  const goalie = getHockeyGoalieBounds();
  return (
    shotX + radiusX > goalie.left &&
    shotX - radiusX < goalie.right &&
    shotY + radiusY > goalie.top &&
    shotY - radiusY < goalie.bottom
  );
}

function reflectHockeyShotFromGoalie(shot, incomingVx, incomingVy) {
  const ellipse = getHockeyGoalieEllipse();
  const dx = shot.x - ellipse.cx;
  const dy = shot.y - ellipse.cy;
  let nx = dx / (ellipse.rx * ellipse.rx);
  let ny = dy / (ellipse.ry * ellipse.ry);
  const normalLength = Math.hypot(nx, ny) || 1;
  nx /= normalLength;
  ny /= normalLength;

  const dot = incomingVx * nx + incomingVy * ny;
  let reflectedVx = incomingVx - 2 * dot * nx;
  let reflectedVy = incomingVy - 2 * dot * ny;

  if (reflectedVy < 1.8) {
    reflectedVy = Math.abs(reflectedVy) + 1.8;
  }

  return {
    vx: reflectedVx * 0.22,
    vy: reflectedVy * 0.22,
  };
}

function beginHockeyCharge(pointerX = null, pointerY = null, pointerId = null) {
  if (
    state.mode !== "hockey" ||
    state.gameOver ||
    !state.running ||
    state.hockey.shots.length ||
    state.hockey.charging
  ) {
    return;
  }
  state.hockey.charging = true;
  state.hockey.shotPower = 0;
  state.hockey.steer = 0;
  state.hockey.dragPointerId = pointerId;
  state.hockey.dragStartX = pointerX ?? hockeyRink.x + hockeyRink.width / 2;
  state.hockey.dragStartY = pointerY ?? canvas.height - 38;
}

function updateHockeyCharge(pointerX, pointerY) {
  if (state.mode !== "hockey" || !state.hockey.charging) {
    return;
  }
  if (typeof pointerY === "number") {
    state.hockey.shotPower = clamp((pointerY - state.hockey.dragStartY) / 160, 0, 1);
  }
  if (typeof pointerX === "number") {
    state.hockey.aim = clamp((pointerX - state.hockey.dragStartX) / 95, -1, 1);
  }
}

function releaseHockeyShot() {
  if (state.mode !== "hockey" || !state.hockey.charging || state.hockey.shots.length) {
    return;
  }
  const aim = getHockeyAimTarget();
  const power = Math.max(0.2, state.hockey.shotPower);
  const stickPose = getHockeyStickPose(state.hockey.shotPower);
  const originX = stickPose.puckX;
  const originY = stickPose.puckY;
  state.hockey.charging = false;
  state.hockey.dragPointerId = null;
  state.hockey.steer = 0;
  state.hockey.shotPower = 0;
  state.hockey.goalie.targetX = aim.x;
  state.hockey.goalie.reactionDelay = Math.max(150, 360 - power * 120);
  state.hockey.goalie.mood = "alert";
  state.hockey.shots.push({
    x: originX,
    y: originY,
    startX: originX,
    startY: originY,
    targetX: aim.x,
    targetY: aim.y,
    progress: 0,
    power,
    resolved: false,
    counted: false,
    bouncing: false,
    bounceLife: 0,
    vx: 0,
    vy: 0,
    lastX: originX,
    lastY: originY,
  });
}

function advanceHockeyLevel() {
  showHockeyLevelOverlay();
}

function endHockeyGame() {
  state.running = false;
  state.gameOver = true;
  closeHockeyLevelOverlay();
  persistBestScore();
  updateShellLayout();
  void handleFinishedGame({
    game: "hockey",
    score: state.score,
    title: "Game over",
    message: "Game over, Bosse satte färre än 6 skott",
    restartLabel: "Spela igen",
    restartAction: "retry-current",
  });
}

function finishHockeyShot(shot) {
  const goal = getHockeyGoalBounds();
  const puckRadiusX = 9;
  const puckRadiusY = 6;
  const postMargin = 6;
  const insideGoalX =
    shot.x - puckRadiusX > goal.left + postMargin &&
    shot.x + puckRadiusX < goal.right - postMargin;
  const insideGoalY =
    shot.y - puckRadiusY > goal.top + 2 &&
    shot.y + puckRadiusY < goal.bottom + 14;
  const insideGoal = insideGoalX && insideGoalY;
  const goalieCanSave = Boolean(shot.saved);
  if (shot.counted) {
    return;
  }
  shot.counted = true;
  state.hockey.shotsTakenLevel += 1;

  if (insideGoal && !goalieCanSave) {
    state.hockey.goalsThisLevel += 1;
    state.hockey.goals += 1;
    state.score += state.hockey.level;
    state.hockey.flashType = "goal";
    state.hockey.flashTimer = 720;
    state.hockey.messageTimer = 1100;
    state.hockey.message = `Mål! ${state.hockey.goalsThisLevel}/${state.hockey.shotsTakenLevel} i level ${state.hockey.level}.`;
    state.hockey.goalie.mood = "beaten";
  } else {
    state.hockey.saves += 1;
    state.hockey.flashType = "save";
    state.hockey.flashTimer = 720;
    state.hockey.messageTimer = 1100;
    state.hockey.message = `Missat skott. ${state.hockey.goalsThisLevel}/${state.hockey.shotsTakenLevel} i level ${state.hockey.level}.`;
    state.hockey.goalie.mood = "save";
  }

  if (state.hockey.shotsTakenLevel >= 10) {
    if (state.hockey.goalsThisLevel < 6) {
      updateHud();
      endHockeyGame();
      return;
    }
    advanceHockeyLevel();
  }

  scoreElement.textContent = `${state.hockey.goalsThisLevel}/${state.hockey.shotsTakenLevel}`;
  totalScoreElement.textContent = String(state.score);
  persistBestScore();
  updateHud();
}

function update(delta) {
  if (state.mode === "hockey" && state.hockey.levelOverlayOpen) {
    updateHockeyFireworks(delta);
    return;
  }
  if (!state.running) {
    return;
  }

  if (state.mode === "maze") {
    updateMaze(delta);
  } else if (state.mode === "hockey") {
    updateHockey(delta);
  } else {
    updateRunner(delta);
  }
}

function updateHockeyFireworks(delta) {
  for (const particle of state.hockey.fireworks) {
    if (particle.life <= 0) {
      continue;
    }
    particle.life = Math.max(0, particle.life - delta);
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.06;
    particle.vx *= 0.992;
  }
}

function updateHockey(delta) {
  const hockey = state.hockey;
  const frameScale = delta / (1000 / 60);
  if (hockey.charging && hockey.dragPointerId === null) {
    hockey.shotPower = clamp(hockey.shotPower + delta * 0.0012, 0, 1);
    hockey.aim = clamp(hockey.aim + hockey.steer * delta * 0.0028, -1, 1);
  }

  if (hockey.messageTimer > 0) {
    hockey.messageTimer = Math.max(0, hockey.messageTimer - delta);
  }
  if (hockey.flashTimer > 0) {
    hockey.flashTimer = Math.max(0, hockey.flashTimer - delta);
  }

  const goalie = hockey.goalie;
  if (hockey.charging && !hockey.shots.length) {
    goalie.targetX = getHockeyAimTarget().x;
    if (goalie.mood !== "alert") {
      goalie.mood = "alert";
    }
  } else if (!hockey.shots.length && !hockey.charging) {
    goalie.targetX = getHockeyGoalBounds().centerX;
    if (goalie.mood !== "ready") {
      goalie.mood = "ready";
    }
  }
  if (goalie.reactionDelay > 0) {
    goalie.reactionDelay = Math.max(0, goalie.reactionDelay - delta);
  } else {
    const moveSpeed = hockey.charging && !hockey.shots.length
      ? 0.018 + hockey.goals * 0.0008
      : 0.038 + hockey.goals * 0.0018;
    goalie.x += (goalie.targetX - goalie.x) * Math.min(1, moveSpeed * frameScale);
  }
  goalie.x = clamp(goalie.x, getHockeyGoalBounds().left + 18, getHockeyGoalBounds().right - 18);

  for (const shot of hockey.shots) {
    if (shot.bouncing) {
      shot.bounceLife = Math.max(0, shot.bounceLife - delta);
      shot.x += shot.vx * frameScale;
      shot.y += shot.vy * frameScale;
      shot.vy += 0.22 * frameScale;
      shot.vx *= 0.99;
      continue;
    }

    shot.lastX = shot.x;
    shot.lastY = shot.y;
    shot.progress = Math.min(1, shot.progress + (0.018 + shot.power * 0.024) * frameScale);
    shot.x = lerp(shot.startX, shot.targetX, shot.progress);
    shot.y = lerp(shot.startY, shot.targetY, shot.progress);

    if (!shot.resolved && hockeyShotHitsGoalie(shot.x, shot.y, 6, 4) && shot.y <= getHockeyGoalBounds().creaseY + 8) {
      shot.saved = true;
      shot.resolved = true;
      finishHockeyShot(shot);
      shot.bouncing = true;
      shot.bounceLife = 520;
      const reflected = reflectHockeyShotFromGoalie(
        shot,
        shot.x - shot.lastX,
        shot.y - shot.lastY
      );
      shot.vx = reflected.vx;
      shot.vy = reflected.vy;
      continue;
    }

    if (shot.progress >= 1 && !shot.resolved) {
      shot.resolved = true;
      finishHockeyShot(shot);
    }
  }

  hockey.shots = hockey.shots.filter((shot) => {
    if (shot.bouncing) {
      return shot.bounceLife > 0 && shot.y < hockeyRink.y + hockeyRink.height + 28;
    }
    return shot.progress < 1 || !shot.resolved;
  });
}

function updateRunner(delta) {
  const bunny = state.bunny;
  const frameScale = delta / (1000 / 60);
  const crocodile = state.runnerCrocodile;
  state.distance += delta * 0.01;
  if (state.runnerSuperTimer > 0) {
    state.runnerSuperTimer = Math.max(0, state.runnerSuperTimer - delta);
  }
  const speedMultiplier = isSuperBosseActive() ? 2 : 1;
  const targetSpeed = (baseSpeed + Math.min(5, state.distance * 0.018)) * speedMultiplier;
  const pettingSlowdown = state.pettingTimer > 0 ? 2.8 : 0;
  state.speed = Math.max(2.4, targetSpeed - pettingSlowdown);
  state.cloudsOffset += state.speed * 0.15 * frameScale;

  if (state.pettingTimer > 0) {
    state.pettingTimer = Math.max(0, state.pettingTimer - delta);
  }
  if (state.runnerCarrotRainTimer > 0) {
    state.runnerCarrotRainTimer = Math.max(0, state.runnerCarrotRainTimer - delta);
    state.runnerCarrotRainSpawnTimer += delta;
    while (state.runnerCarrotRainSpawnTimer >= 160) {
      spawnRunnerCarrotBurst(4 + Math.floor(Math.random() * 3));
      state.runnerCarrotRainSpawnTimer -= 160;
    }
  } else {
    state.runnerCarrotRainSpawnTimer = 0;
  }
  if (crocodile) {
    crocodile.stride += delta * 0.015;
    if (crocodile.mode === "active") {
      crocodile.timer = Math.max(0, crocodile.timer - delta);
      crocodile.facing = 1;
      const targetX = bunny.x + 108;
      crocodile.x += (targetX - crocodile.x) * Math.min(1, 0.12 * frameScale);
      crocodile.y = groundY + 4 + Math.sin(crocodile.stride) * 1.5;
      if (crocodile.timer === 0) {
        crocodile.mode = "exiting";
        crocodile.facing = -1;
      }
    } else {
      crocodile.x -= (state.speed + 7.5) * frameScale;
      crocodile.y = groundY + 4 + Math.sin(crocodile.stride) * 1.5;
      if (crocodile.x + crocodile.width < -120) {
        state.runnerCrocodile = null;
      }
    }
  }

  const activeGravity = state.runnerFlappyMode ? flappyGravity : gravity;
  bunny.velocityY += activeGravity * frameScale;
  bunny.y += bunny.velocityY * frameScale;
  if (bunny.y > groundY) {
    bunny.y = groundY;
    bunny.velocityY = 0;
  }
  if (state.runnerFlappyMode && bunny.y < 88) {
    bunny.y = 88;
    bunny.velocityY = Math.max(0, bunny.velocityY * 0.35);
  }
  bunny.jumpStretch = Math.max(0, Math.min(1, Math.abs(bunny.velocityY) / 18));

  state.elephantTimer += delta;
  if (state.elephantTimer > elephantInterval - state.speed * 35) {
    const elephantScale = 0.92 + Math.random() * 0.18;
    const flying = state.runnerFlyingElephants;
    state.elephants.push({
      x: canvas.width + 70 + Math.random() * 130,
      y: flying ? 160 + Math.random() * 120 : groundY + 8 + Math.random() * 6,
      baseY: flying ? 160 + Math.random() * 120 : groundY + 8 + Math.random() * 6,
      renderY: flying ? 160 + Math.random() * 120 : groundY + 8 + Math.random() * 6,
      width: 68 * elephantScale,
      height: 52 * elephantScale,
      flying,
      bobOffset: Math.random() * Math.PI * 2,
      bobSpeed: 0.0035 + Math.random() * 0.002,
      bobAmplitude: 10 + Math.random() * 12,
    });
    state.elephantTimer = 0;
  }

  state.carrotTimer += delta;
  if (state.carrotTimer > carrotInterval) {
    const carrotCount = Math.random() < 0.35 ? 2 : 1;
    spawnRunnerCarrotBurst(carrotCount, canvas.width + 60);
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
    if (elephant.launched) {
      elephant.launchVx -= 0.18 * frameScale;
      elephant.launchVy += 0.56 * frameScale;
      elephant.x += elephant.launchVx * frameScale;
      elephant.launchY += elephant.launchVy * frameScale;
      elephant.rotation = (elephant.rotation || 0) + 0.18 * frameScale;
      elephant.renderY = elephant.launchY;
      continue;
    }
    if (elephant.flying) {
      elephant.renderY = elephant.baseY + Math.sin(performance.now() * elephant.bobSpeed + elephant.bobOffset) * elephant.bobAmplitude;
    } else {
      elephant.renderY = elephant.y;
    }
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

  state.elephants = state.elephants.filter((elephant) => {
    if (elephant.launched) {
      return elephant.x < canvas.width + 180 && elephant.renderY + elephant.height > -160;
    }
    return elephant.x + elephant.width > -30;
  });
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
      y: (elephant.renderY ?? elephant.y) - elephant.height + 10,
      width: elephant.width - 18,
      height: elephant.height - 14,
    })) {
      if (isSuperBosseActive()) {
        launchRunnerElephant(elephant, bunnyHitbox.x + bunnyHitbox.width, 1.08);
        continue;
      }
      endGame(`En elefant tog Bosse. Du fick ${state.score} poäng.`);
      return;
    }
  }

  if (state.runnerCrocodile) {
    const crocHitbox = {
      x: state.runnerCrocodile.x + (state.runnerCrocodile.facing > 0 ? 16 : 28),
      y: state.runnerCrocodile.y - state.runnerCrocodile.height + 16,
      width: state.runnerCrocodile.width - 34,
      height: state.runnerCrocodile.height - 20,
    };
    for (const elephant of state.elephants) {
      if (elephant.launched) {
        continue;
      }
      if (intersects(crocHitbox, {
        x: elephant.x + 8,
        y: (elephant.renderY ?? elephant.y) - elephant.height + 10,
        width: elephant.width - 18,
        height: elephant.height - 14,
      })) {
        launchRunnerElephant(elephant, crocHitbox.x + crocHitbox.width, 1.12);
      }
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

  if (maze.levelComplete) {
    updateConfetti(maze.confetti, delta);
    maze.celebrationTimer = Math.max(0, maze.celebrationTimer - delta);
    maze.transitionTimer = Math.max(0, maze.transitionTimer - delta);
    if (maze.transitionTimer === 0) {
      advanceMazeLevel();
    }
    return;
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

  for (const carrot of maze.carrots) {
    if (carrot.collected) {
      continue;
    }
    if (Math.hypot(bunny.px - carrot.x, bunny.py - carrot.y) < 0.28) {
      carrot.collected = true;
      state.score += maze.carrotPoints;
      scoreElement.textContent = String(state.score);
      persistBestScore();
    }
  }

  if (maze.carrots.every((carrot) => carrot.collected)) {
    completeMazeLevel();
  }
}

function updateMazeCamera() {
  const worldWidth = state.maze.cols * mazeCell;
  const worldHeight = state.maze.rows * mazeCell;
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
  const maze = state.maze;
  if (x < 0 || x >= maze.cols || y < 0 || y >= maze.rows) {
    return false;
  }
  return maze.walls[y][x] !== "#";
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

function roundRect(context, x, y, width, height, radius) {
  const limitedRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + limitedRadius, y);
  context.arcTo(x + width, y, x + width, y + height, limitedRadius);
  context.arcTo(x + width, y + height, x, y + height, limitedRadius);
  context.arcTo(x, y + height, x, y, limitedRadius);
  context.arcTo(x, y, x + width, y, limitedRadius);
  context.closePath();
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
  } else if (state.mode === "hockey") {
    drawHockey();
  } else {
    drawRunner();
  }
}

function drawHockey() {
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#08263e");
  bg.addColorStop(1, "#0d4268");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawHockeyCrowd();
  drawRink();
  drawHockeyFireworks();
  drawHockeyAimLine();
  drawGoalieAlf();
  for (const shot of state.hockey.shots) {
    drawHockeyPuck(shot);
  }
  drawHockeyBosse();

  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.font = "700 18px 'Baloo 2'";
  const hint = state.hockey.charging
    ? "Håll nere för att ladda. Styr med vänster och höger medan du siktar."
    : state.hockey.messageTimer > 0 && state.hockey.flashType === "goal"
    ? state.hockey.message
    : state.hockey.messageTimer > 0 && state.hockey.flashType === "save"
    ? state.hockey.message
    : state.hockey.messageTimer > 0 && state.hockey.flashType === "level"
    ? state.hockey.message
    : "Pil ned för att ladda. Styr siktet med vänster och höger. På mobil: tryck, dra och släpp.";
  ctx.textAlign = "left";
  ctx.fillText(hint, 28, 34);

  ctx.textAlign = "right";
  ctx.fillText(`Total ${state.score}`, canvas.width - 28, 26);
  ctx.fillText(`Level ${state.hockey.level}`, canvas.width - 28, 46);
  ctx.textAlign = "left";
}

function drawHockeyFireworks() {
  for (const particle of state.hockey.fireworks) {
    if (particle.life <= 0) {
      continue;
    }
    const alpha = Math.min(1, particle.life / 500);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawHockeyCrowd() {
  ctx.fillStyle = "rgba(8, 38, 62, 0.92)";
  ctx.fillRect(0, 0, canvas.width, 60);

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 11; col += 1) {
      const x = 70 + col * 74 + (row % 2) * 18;
      const y = 68 + row * 14;
      ctx.fillStyle = ["#f7d34e", "#ff8b6b", "#78d0ff", "#d8f4ff"][(row + col) % 4];
      ctx.beginPath();
      ctx.arc(x, y, 9 - row * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawRink() {
  ctx.fillStyle = "#eff8ff";
  roundRect(ctx, hockeyRink.x, hockeyRink.y, hockeyRink.width, hockeyRink.height, 62);
  ctx.fill();

  ctx.strokeStyle = "#db222b";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = "#8ac6e8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hockeyRink.x + 18, hockeyRink.y + 102);
  ctx.lineTo(hockeyRink.x + hockeyRink.width - 18, hockeyRink.y + 102);
  ctx.moveTo(hockeyRink.x + 18, hockeyRink.y + hockeyRink.height - 102);
  ctx.lineTo(hockeyRink.x + hockeyRink.width - 18, hockeyRink.y + hockeyRink.height - 102);
  ctx.moveTo(hockeyRink.x + hockeyRink.width / 2, hockeyRink.y + 18);
  ctx.lineTo(hockeyRink.x + hockeyRink.width / 2, hockeyRink.y + hockeyRink.height - 18);
  ctx.stroke();

  ctx.strokeStyle = "#db222b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(hockeyRink.x + hockeyRink.width / 2, hockeyRink.y + hockeyRink.height / 2, 42, 0, Math.PI * 2);
  ctx.stroke();

  const goal = getHockeyGoalBounds();
  ctx.fillStyle = "rgba(208, 38, 44, 0.1)";
  ctx.fillRect(goal.left - 18, goal.lineY - 2, goal.right - goal.left + 36, 38);
  ctx.strokeStyle = "#d31a22";
  ctx.lineWidth = 5;
  ctx.strokeRect(goal.left, goal.top, goal.right - goal.left, goal.bottom - goal.top + 24);

  ctx.strokeStyle = "rgba(60, 118, 164, 0.24)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(goal.centerX, goal.creaseY, 74, 42, 0, Math.PI, 0, true);
  ctx.stroke();
}

function drawHockeyAimLine() {
  if (!state.hockey.charging || state.hockey.shots.length) {
    return;
  }
  const stickPose = getHockeyStickPose(state.hockey.shotPower);
  const aim = getHockeyAimTarget();
  ctx.save();
  ctx.strokeStyle = "rgba(255, 99, 71, 0.82)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(stickPose.puckX, stickPose.puckY);
  ctx.lineTo(aim.x, aim.y);
  ctx.stroke();
  ctx.restore();
}

function drawHockeyPuck(shot) {
  ctx.fillStyle = "#11161a";
  ctx.beginPath();
  ctx.ellipse(shot.x, shot.y, 9, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(shot.x - 2, shot.y - 1, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawHockeyBosse() {
  const charge = state.hockey.charging ? state.hockey.shotPower : 0;
  const stickPose = getHockeyStickPose(charge);
  const x = stickPose.bodyX;
  const y = stickPose.bodyY;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#7a879d";
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dfe6ef";
  ctx.beginPath();
  ctx.arc(0, -10, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c3540";
  ctx.beginPath();
  ctx.arc(-5, -10, 2, 0, Math.PI * 2);
  ctx.arc(5, -10, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f68b2c";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-18, 8);
  ctx.lineTo(-20, 38);
  ctx.moveTo(18, 8);
  ctx.lineTo(20, 38);
  ctx.stroke();
  ctx.strokeStyle = "#7a879d";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(16, -2);
  ctx.lineTo(stickPose.pivotX - x, stickPose.pivotY - y);
  ctx.stroke();
  ctx.strokeStyle = "#4a2f18";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(stickPose.handleX - x, stickPose.handleY - y);
  ctx.lineTo(stickPose.shaftEndX - x, stickPose.shaftEndY - y);
  ctx.stroke();
  ctx.strokeStyle = "#f4d97d";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(stickPose.bladeBaseX - x - Math.cos(stickPose.swingAngle) * 4, stickPose.bladeBaseY - y - Math.sin(stickPose.swingAngle) * 4);
  ctx.lineTo(stickPose.bladeTipX - x, stickPose.bladeTipY - y);
  ctx.stroke();
  ctx.restore();

  if (state.hockey.charging && !state.hockey.shots.length) {
    ctx.fillStyle = "#11161a";
    ctx.beginPath();
    ctx.ellipse(stickPose.puckX, stickPose.puckY, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.arc(stickPose.puckX - 2, stickPose.puckY - 1, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGoalieAlf() {
  const goalie = state.hockey.goalie;
  const goal = getHockeyGoalBounds();
  const padSpread = goalie.mood === "save" ? 24 : 16;
  ctx.save();
  ctx.translate(goalie.x, goal.creaseY - 6);
  ctx.fillStyle = "#7b4a2d";
  ctx.beginPath();
  ctx.ellipse(0, 0, 28, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -16, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c88b5c";
  ctx.beginPath();
  ctx.ellipse(0, -12, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#221913";
  ctx.beginPath();
  ctx.arc(-5, -18, 2.2, 0, Math.PI * 2);
  ctx.arc(5, -18, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#f4f8ff";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-12, 12);
  ctx.lineTo(-padSpread, 24);
  ctx.moveTo(12, 12);
  ctx.lineTo(padSpread, 24);
  ctx.stroke();
  ctx.restore();
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
    if (elephant.launched) {
      ctx.save();
      ctx.translate(elephant.x + elephant.width / 2, (elephant.renderY ?? elephant.y) - elephant.height / 2);
      ctx.rotate(elephant.rotation || 0);
      drawElephant(-elephant.width / 2, elephant.height / 2, elephant.width, elephant.height, false, elephant.flying);
      ctx.restore();
    } else {
      drawElephant(elephant.x, elephant.renderY ?? elephant.y, elephant.width, elephant.height, false, elephant.flying);
    }
  }
  if (state.runnerCrocodile) {
    drawCrocodile(state.runnerCrocodile);
  }
  drawBunnyRunner();

  ctx.fillStyle = "rgba(33, 64, 75, 0.7)";
  ctx.font = "700 22px 'Baloo 2'";
  const hint = isSuperBosseActive()
    ? "SuperBosse-lage: Bosse blinkar, springer dubbelt sa snabbt och studsar bort elefanter."
    : state.runnerCrocodile
    ? state.runnerCrocodile.mode === "active"
      ? "Krokodil-lage: krokodilen springer framfor Bosse och knuffar undan elefanter."
      : "Krokodilen vander om och forsvinner at vanster."
    : state.runnerFlappyMode
    ? "Flappy-lage: tryck for att flaxa med Bosse."
    : state.runnerCarrotRainTimer > 0
    ? "Morot-lage: det regnar morotter!"
    : state.pettingTimer > 0
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
  ctx.fillRect(0, 0, state.maze.cols * mazeCell, state.maze.rows * mazeCell);
  drawMazeWalls();

  highlightMazeCell(state.maze.start.x, state.maze.start.y, "rgba(126, 215, 255, 0.18)");
  for (const carrot of state.maze.carrots) {
    if (carrot.collected) {
      continue;
    }
    highlightMazeCell(carrot.x, carrot.y, "rgba(246, 139, 44, 0.22)");
    drawCarrotAtCell(carrot.x, carrot.y);
  }
  for (const elephant of state.maze.elephants) {
    drawElephant(elephant.px * mazeCell + mazeCell / 2 - 20, elephant.py * mazeCell + mazeCell / 2 + 14, 40, 30, true);
  }
  drawMazeBunny();
  drawConfetti(state.maze.confetti);
  ctx.restore();

  drawMazeLegend();

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 22px 'Baloo 2'";
  const remainingCarrots = state.maze.carrots.filter((carrot) => !carrot.collected).length;
  const text = state.maze.levelComplete
    ? state.mazeCelebrationText
    : state.mazeMessageTimer > 0
      ? `Bana ${state.maze.levelNumber}: ta ${remainingCarrots} morötter och undvik elefanterna.`
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
  if (isSuperBosseAuraActive()) {
    const neonColors = ["#44f7ff", "#ff5cf4", "#b8ff35", "#ffe45e"];
    const colorIndex = Math.floor(performance.now() / 90) % neonColors.length;
    const neon = neonColors[colorIndex];
    ctx.save();
    ctx.translate(state.bunny.x + state.bunny.width * 0.48, state.bunny.y - state.bunny.height * 0.38);
    const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 58);
    aura.addColorStop(0, `${neon}aa`);
    aura.addColorStop(0.45, `${neon}4a`);
    aura.addColorStop(1, `${neon}00`);
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.ellipse(0, 6, 52, 66, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.shadowColor = neon;
    ctx.shadowBlur = 26;
    drawBunnyShape(state.bunny.x, state.bunny.y - state.bunny.height, state.bunny.jumpStretch);
    ctx.restore();
    return;
  }
  drawBunnyShape(state.bunny.x, state.bunny.y - state.bunny.height, state.bunny.jumpStretch);
}

function drawCrocodile(crocodile) {
  const top = crocodile.y - crocodile.height;
  const scaleX = crocodile.width / 138;
  const scaleY = crocodile.height / 92;
  const sway = Math.sin(crocodile.stride) * 2.8;
  const armSwing = Math.sin(crocodile.stride) * 5.5;

  if (crocodileSprite.complete && crocodileSprite.naturalWidth > 0) {
    const spriteRatio = crocodileSprite.naturalWidth / crocodileSprite.naturalHeight;
    const drawHeight = crocodile.height * 1.1;
    const drawWidth = drawHeight * spriteRatio;
    const bounce = Math.sin(crocodile.stride) * 3;
    ctx.save();
    ctx.translate(crocodile.x + crocodile.width / 2, crocodile.y - drawHeight * 0.48 + bounce);
    ctx.scale(-crocodile.facing, 1);
    ctx.rotate((12 * crocodile.facing * Math.PI) / 180);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(crocodileSprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(crocodile.x + (crocodile.facing < 0 ? crocodile.width : 0), top);
  ctx.scale(scaleX * crocodile.facing, scaleY);

  const plush = ctx.createLinearGradient(-12, 6, 118, 86);
  plush.addColorStop(0, "#aeb860");
  plush.addColorStop(0.52, "#92a246");
  plush.addColorStop(1, "#788733");

  const shadow = ctx.createLinearGradient(4, 18, 100, 84);
  shadow.addColorStop(0, "rgba(58, 68, 22, 0.04)");
  shadow.addColorStop(1, "rgba(58, 68, 22, 0.24)");

  ctx.lineCap = "round";
  ctx.fillStyle = plush;

  ctx.beginPath();
  ctx.moveTo(42, 16);
  ctx.quadraticCurveTo(64, 7, 90, 11);
  ctx.quadraticCurveTo(113, 15, 116, 26);
  ctx.quadraticCurveTo(118, 38, 108, 45);
  ctx.quadraticCurveTo(85, 52, 57, 47);
  ctx.quadraticCurveTo(35, 41, 33, 29);
  ctx.quadraticCurveTo(33, 20, 42, 16);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(45, 40);
  ctx.quadraticCurveTo(58, 35, 66, 42);
  ctx.lineTo(67, 72);
  ctx.quadraticCurveTo(65, 82, 55, 83);
  ctx.quadraticCurveTo(45, 83, 42, 73);
  ctx.lineTo(41, 47);
  ctx.quadraticCurveTo(41, 42, 45, 40);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(38, 44);
  ctx.quadraticCurveTo(28, 42, 16, 47 + sway * 0.2);
  ctx.quadraticCurveTo(2, 53 + armSwing * 0.25, -8, 67 + armSwing * 0.3);
  ctx.quadraticCurveTo(-14, 77 + armSwing * 0.1, -6, 82 + armSwing * 0.05);
  ctx.quadraticCurveTo(4, 84, 12, 73 + armSwing * 0.2);
  ctx.quadraticCurveTo(25, 59, 37, 55);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(66, 46);
  ctx.quadraticCurveTo(79, 46, 90, 53 - sway * 0.15);
  ctx.quadraticCurveTo(101, 63 - armSwing * 0.18, 110, 80 - armSwing * 0.28);
  ctx.quadraticCurveTo(115, 89 - armSwing * 0.12, 110, 95 - armSwing * 0.08);
  ctx.quadraticCurveTo(102, 100, 94, 90 - armSwing * 0.08);
  ctx.quadraticCurveTo(85, 79 - armSwing * 0.22, 73, 63 - armSwing * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(47, 81);
  ctx.quadraticCurveTo(59, 78, 65, 86);
  ctx.quadraticCurveTo(69, 96, 63, 110);
  ctx.quadraticCurveTo(57, 124, 55, 136);
  ctx.quadraticCurveTo(52, 145, 44, 144);
  ctx.quadraticCurveTo(36, 142, 37, 131);
  ctx.quadraticCurveTo(39, 117, 42, 104);
  ctx.quadraticCurveTo(45, 90, 47, 81);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(43, 87);
  ctx.quadraticCurveTo(22, 83, 0, 78);
  ctx.quadraticCurveTo(-21, 73, -38, 72);
  ctx.quadraticCurveTo(-49, 72, -56, 76);
  ctx.quadraticCurveTo(-48, 81, -36, 84);
  ctx.quadraticCurveTo(-18, 88, 2, 91);
  ctx.quadraticCurveTo(24, 95, 42, 97);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(52, 63, 18, 33, 0.03, 0, Math.PI * 2);
  ctx.fill();

  const stripeColor = "rgba(88, 98, 38, 0.5)";
  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = 4.8;

  for (let x = 47; x <= 107; x += 8) {
    ctx.beginPath();
    ctx.moveTo(x, 14);
    ctx.lineTo(x - 1, 45);
    ctx.stroke();
  }

  for (let y = 47; y <= 78; y += 6) {
    ctx.beginPath();
    ctx.moveTo(44, y);
    ctx.lineTo(66, y);
    ctx.stroke();
  }

  for (let x = 33; x >= -48; x -= 8) {
    ctx.beginPath();
    ctx.moveTo(x, 82 + Math.max(0, (33 - x) * 0.03));
    ctx.lineTo(x - 3, 92 + Math.max(0, (33 - x) * 0.03));
    ctx.stroke();
  }

  for (let y = 92; y <= 140; y += 8) {
    ctx.beginPath();
    ctx.moveTo(46, y);
    ctx.lineTo(58, y + 1);
    ctx.stroke();
  }

  [
    [22, 49, -6, 78],
    [72, 51, 106, 90],
  ].forEach(([x1, y1, x2, y2]) => {
    const steps = 5;
    for (let step = 0; step <= steps; step += 1) {
      const t = step / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 3);
      ctx.lineTo(x + 4, y + 3);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "#607021";
  ctx.beginPath();
  ctx.arc(47, 28, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#708033";
  ctx.beginPath();
  ctx.arc(111, 28, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawMazeBunny() {
  const bunny = state.maze.bunny;
  highlightMazeCell(Math.round(bunny.px), Math.round(bunny.py), "rgba(255,255,255,0.14)");
  ctx.save();
  ctx.translate(bunny.px * mazeCell + mazeCell / 2 - 12, bunny.py * mazeCell + mazeCell / 2 - 18);
  ctx.scale(0.56, 0.56);
  drawBunnyShape(0, 0, 0.05);
  ctx.restore();
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
  for (let row = 0; row < state.maze.rows; row += 1) {
    for (let col = 0; col < state.maze.cols; col += 1) {
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
  ctx.fillRect(baseX, baseY, 520, 34);

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

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText(`Kvar ${state.maze.carrots.filter((carrot) => !carrot.collected).length}`, baseX + 324, baseY + 23);
  ctx.fillText(`Målbonus +${state.maze.clearBonus}`, baseX + 404, baseY + 23);
}

function createConfettiBursts(count) {
  const colors = ["#ffd84d", "#ff8c42", "#7ed7ff", "#ff6f91", "#7ddf6f", "#fff6c4"];
  return Array.from({ length: count }, () => ({
    x: mazeViewport.width / 2 + (Math.random() - 0.5) * 180,
    y: mazeViewport.height / 2 + (Math.random() - 0.5) * 80,
    vx: (Math.random() - 0.5) * 10,
    vy: -2 - Math.random() * 6,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.24,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1100 + Math.random() * 1200,
  }));
}

function updateConfetti(confetti, delta) {
  for (const piece of confetti) {
    if (piece.life <= 0) {
      continue;
    }
    piece.life = Math.max(0, piece.life - delta);
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.18;
    piece.rotation += piece.spin;
  }
}

function drawConfetti(confetti) {
  for (const piece of confetti) {
    if (piece.life <= 0) {
      continue;
    }
    ctx.save();
    ctx.translate(piece.x + state.maze.cameraX, piece.y + state.maze.cameraY);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
    ctx.restore();
  }
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

function drawElephant(x, y, width, height, mazeMode, flying = false) {
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

  if (flying && !mazeMode) {
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.ellipse(18, 10, 9, 4.5, -0.35, 0, Math.PI * 2);
    ctx.ellipse(48, 9, 9, 4.5, 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

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
  if (!hockeyLevelOverlay.classList.contains("hidden")) {
    event.preventDefault();
    continueHockeyAfterLevel();
    return;
  }

  if (!nameEntryOverlay.classList.contains("hidden")) {
    if (event.code === "Escape") {
      const finishConfig = state.pendingScoreEntry?.finishConfig;
      closeNameEntryOverlay();
      showGameOverOverlay(
        finishConfig?.title || "Oj! Bosse snubblade.",
        finishConfig?.message || `Du fick ${state.score} poäng.`,
        finishConfig?.restartLabel || "Spela igen",
        finishConfig?.restartAction || "retry-current"
      );
    }
    return;
  }

  if (state.cheatOpen) {
    if (event.code === "Escape") {
      closeCheatDialog();
    }
    return;
  }

  if (event.code === "KeyC") {
    event.preventDefault();
    openCheatDialog();
    return;
  }

  if (handleMazeDirection(event.code)) {
    event.preventDefault();
    return;
  }

  if (state.mode === "hockey" && state.hockey.charging && (event.code === "ArrowLeft" || event.code === "ArrowRight")) {
    event.preventDefault();
    state.hockey.steer = event.code === "ArrowLeft" ? -1 : 1;
    return;
  }

  if (event.code === "ArrowDown" && state.mode === "hockey") {
    event.preventDefault();
    beginHockeyCharge();
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

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowDown" && state.mode === "hockey") {
    event.preventDefault();
    releaseHockeyShot();
    return;
  }
  if (state.mode === "hockey" && (event.code === "ArrowLeft" || event.code === "ArrowRight")) {
    event.preventDefault();
    if ((event.code === "ArrowLeft" && state.hockey.steer < 0) || (event.code === "ArrowRight" && state.hockey.steer > 0)) {
      state.hockey.steer = 0;
    }
  }
});

canvas.addEventListener("pointerdown", (event) => {
  if (!hockeyLevelOverlay.classList.contains("hidden")) {
    event.preventDefault();
    continueHockeyAfterLevel();
    return;
  }

  if (state.mode === "hockey") {
    beginHockeyCharge(event.clientX, event.clientY, event.pointerId);
    updateHockeyCharge(event.clientX, event.clientY);
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  if (state.mode === "runner") {
    handleRunnerJump();
  }
});

canvas.addEventListener("pointermove", (event) => {
  if (state.mode !== "hockey" || state.hockey.dragPointerId !== event.pointerId) {
    return;
  }
  updateHockeyCharge(event.clientX, event.clientY);
});

function endHockeyPointer(pointerId) {
  if (state.mode !== "hockey" || state.hockey.dragPointerId !== pointerId) {
    return;
  }
  if (canvas.hasPointerCapture(pointerId)) {
    canvas.releasePointerCapture(pointerId);
  }
  releaseHockeyShot();
}

canvas.addEventListener("pointerup", (event) => {
  endHockeyPointer(event.pointerId);
});

canvas.addEventListener("pointercancel", (event) => {
  endHockeyPointer(event.pointerId);
});

scoreCard.addEventListener("pointerup", () => {
  if (!isTouchMobileMode()) {
    return;
  }
  const now = performance.now();
  if (now - lastScoreTapAt < 360) {
    openCheatDialog();
    lastScoreTapAt = 0;
    return;
  }
  lastScoreTapAt = now;
});

runnerButton.addEventListener("click", () => {
  void showLeaderboardForGame("runner");
});

mazeButton.addEventListener("click", () => {
  void showLeaderboardForGame("maze");
});

hockeyButton.addEventListener("click", () => {
  void showLeaderboardForGame("hockey");
});

leaderboardStart.addEventListener("click", () => {
  if (state.selectedGame === "maze") {
    startMazeGame();
  } else if (state.selectedGame === "hockey") {
    startHockeyGame();
  } else {
    startRunnerGame();
  }
});

leaderboardBack.addEventListener("click", () => {
  showMenu();
});

restartButton.addEventListener("click", () => {
  gameOverOverlay.classList.add("hidden");
  if (state.selectedGame === "maze") {
    if (restartButton.dataset.action === "maze-reset") {
      startMazeGame();
    } else {
      loadMazeLevel(state.maze.levelIndex, false);
    }
  } else if (state.selectedGame === "hockey") {
    startHockeyGame();
  } else {
    startRunnerGame();
  }
});

menuButton.addEventListener("click", () => {
  showMenu();
});

nameEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.pendingScoreEntry) {
    return;
  }
  const name = nameEntryInput.value.trim();
  if (!name) {
    nameEntryFeedback.textContent = "Skriv ett namn först.";
    return;
  }
  nameEntryFeedback.textContent = "Sparar...";
  const game = state.pendingScoreEntry.game;
  await saveLeaderboardEntry(game, name, state.pendingScoreEntry.score);
  await showSavedLeaderboard(game, "Ditt resultat är sparat i topplistan.");
});

nameEntrySkip.addEventListener("click", async () => {
  if (!state.pendingScoreEntry) {
    return;
  }
  await completeGameFinish(state.pendingScoreEntry.finishConfig);
});

cheatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = cheatInput.value.trim().toLowerCase();
  if (code === "charlie") {
    activateCharlieCheat();
  } else if (code === "pelle") {
    activatePelleCheat();
  } else if (code === "flappy") {
    activateFlappyCheat();
  } else if (code === "morot") {
    activateMorotCheat();
  } else if (code === "krokodil") {
    activateKrokodilCheat();
  } else if (code === "superbosse") {
    activateSuperBosseCheat();
  } else {
    cheatFeedback.textContent = "Fel kod.";
    return;
  }
  closeCheatDialog();
});

cheatCancel.addEventListener("click", () => {
  closeCheatDialog();
});

cheatOverlay.addEventListener("pointerdown", (event) => {
  if (event.target === cheatOverlay) {
    closeCheatDialog();
  }
});

hockeyLevelOverlay.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  continueHockeyAfterLevel();
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
