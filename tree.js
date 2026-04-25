// ============================================================
//  tree.js — Interactive command node graph
//  Supports: drag to pan, scroll to zoom, click to expand
// ============================================================

const TREE_DATA = {
  nodes: [
    // Root
    { id: 'pip',        label: '.pip',        type: 'root',    x: 600, y: 80,  desc: 'Opens the Pip OS website. Your gateway to everything.' },

    // ── Main hubs ──────────────────────────────────────────
    { id: 'profile',    label: 'PROFILE',     type: 'hub',     x: 150, y: 240, desc: 'Player identity, stats, and progression tracking.' },
    { id: 'economy',    label: 'ECONOMY',     type: 'hub',     x: 420, y: 240, desc: 'Coins, shards, earning, spending, trading.' },
    { id: 'combat',     label: 'COMBAT',      type: 'hub',     x: 680, y: 240, desc: 'PvP fighting system with weapons and tactics.' },
    { id: 'world',      label: 'WORLD',       type: 'hub',     x: 920, y: 240, desc: 'Exploration, maps, and area travel.' },
    { id: 'minigames',  label: 'MINI-GAMES',  type: 'hub',     x: 1130, y: 240, desc: 'Quick games for bonus coins and rewards.' },

    // ── Profile ────────────────────────────────────────────
    { id: 'stats',      label: '.stats',      type: 'cmd',     x: 50,  y: 430, desc: 'Show your full player card: HP, ATK, DEF, crit, weapon, rank, stamina.' },
    { id: 'showxp',     label: '.showxp',     type: 'cmd',     x: 180, y: 430, desc: 'Display your XP card with progress bar to next level.' },
    { id: 'rank',       label: '.rank',       type: 'cmd',     x: 50,  y: 560, desc: 'View your adventure rank (F1 → SSS) and rank-up requirements.' },
    { id: 'rankup',     label: '.rankup',     type: 'cmd',     x: 180, y: 560, desc: 'Attempt to advance your adventure rank if requirements are met.' },
    { id: 'journey',    label: '.journey',    type: 'cmd',     x: 50,  y: 680, desc: 'View your progress roadmap across all role tiers and levels.' },
    { id: 'userinfo',   label: '.userinfo',   type: 'cmd',     x: 180, y: 680, desc: 'Detailed user card: join date, level, combat history, area.' },
    { id: 'top',        label: '.top',        type: 'cmd',     x: 115, y: 790, desc: 'Server leaderboard. Top 10 players by XP/level.' },

    // ── Economy ────────────────────────────────────────────
    { id: 'balC',       label: '.balanceC',   type: 'cmd',     x: 310, y: 430, desc: 'Check your current Coin (C) balance.' },
    { id: 'balCs',      label: '.balanceCs',  type: 'cmd',     x: 450, y: 430, desc: 'Check your current Shard (Cs) balance.' },
    { id: 'work',       label: '.work',       type: 'cmd',     x: 350, y: 560, desc: 'Work a job to earn coins. 1hr cooldown. Job type affects payout.' },
    { id: 'beg',        label: '.beg',        type: 'cmd',     x: 480, y: 560, desc: 'Beg for coins. Outcome varies by your current area. May lose coins.' },
    { id: 'convert',    label: '.convert',    type: 'cmd',     x: 350, y: 680, desc: 'Convert Shards (Cs) to Coins. Rate: 1 Cs = 1,000 C.' },
    { id: 'trade',      label: '.trade',      type: 'cmd',     x: 480, y: 680, desc: 'Send coins to another player. Usage: .trade [amount] @user' },

    // ── Combat ─────────────────────────────────────────────
    { id: 'fight',      label: '.fight',      type: 'cmd',     x: 580, y: 430, desc: 'Challenge another player to 1v1 combat. 5min cooldown. Weapon matters.' },
    { id: 'combstat',   label: '.stats',      type: 'cmd',     x: 730, y: 430, desc: 'Your combat card — ATK, DEF, HP, crit%, dodge%. Includes weapon stats.' },
    { id: 'inventory',  label: '.inventory',  type: 'cmd',     x: 655, y: 560, desc: 'View your weapon inventory. Shows all owned weapons.' },
    { id: 'inf',        label: '.inf',        type: 'cmd',     x: 785, y: 560, desc: 'Inspect a weapon or entity by name. Shows full stats.' },

    // ── World ──────────────────────────────────────────────
    { id: 'map',        label: '.map',        type: 'cmd',     x: 870, y: 430, desc: 'Open the 3-layer world map. Navigate Surface, Underground, Aboveground.' },
    { id: 'blacksmith', label: '.blacksmith', type: 'cmd',     x: 1000, y: 430, desc: 'Browse the weapon shop. Buy weapons with C or Cs.' },
    { id: 'buy',        label: '.buy',        type: 'cmd',     x: 870, y: 560, desc: 'Purchase a weapon by name. Usage: .buy [weapon name]' },
    { id: 'roles',      label: '.roles',      type: 'cmd',     x: 1000, y: 560, desc: 'View all server role tiers and their level requirements.' },

    // ── Mini-games ─────────────────────────────────────────
    { id: 'trivia',     label: '.trivia',     type: 'cmd',     x: 1060, y: 430, desc: 'Answer a trivia question. Correct = +200 C. 20s cooldown.' },
    { id: 'dice',       label: '.dice',       type: 'cmd',     x: 1175, y: 430, desc: 'Roll the dice. Random outcome: win or lose up to 1,000 C. 10min cooldown.' },
    { id: 'coinflip',   label: '.coinflip',   type: 'cmd',     x: 1120, y: 560, desc: 'Bet coins on a 50/50 flip. Usage: .coinflip [amount]. 1min cooldown.' },
  ],

  edges: [
    // Root → Hubs
    ['pip', 'profile'], ['pip', 'economy'], ['pip', 'combat'],
    ['pip', 'world'], ['pip', 'minigames'],

    // Profile
    ['profile', 'stats'], ['profile', 'showxp'],
    ['profile', 'rank'], ['profile', 'rankup'],
    ['profile', 'journey'], ['profile', 'userinfo'],
    ['profile', 'top'],
    ['rank', 'rankup'],

    // Economy
    ['economy', 'balC'], ['economy', 'balCs'],
    ['economy', 'work'], ['economy', 'beg'],
    ['economy', 'convert'], ['economy', 'trade'],
    ['work', 'convert'],

    // Combat
    ['combat', 'fight'], ['combat', 'combstat'],
    ['combat', 'inventory'], ['combat', 'inf'],
    ['inventory', 'inf'],

    // World
    ['world', 'map'], ['world', 'blacksmith'],
    ['world', 'buy'], ['world', 'roles'],
    ['blacksmith', 'buy'],

    // Mini-games
    ['minigames', 'trivia'], ['minigames', 'dice'], ['minigames', 'coinflip'],
  ]
};

// ── Color map ─────────────────────────────────────────────────
const COLORS = {
  root:    { fill: '#032403', shadow: '#001100', stroke: '#00ff41', text: '#c7ffd2', accent: '#79ff8a' },
  hub:     { fill: '#0d1f0d', shadow: '#061106', stroke: '#67ff57', text: '#b9fdb1', accent: '#34dd53' },
  cmd:     { fill: '#071107', shadow: '#020702', stroke: '#1b8f34', text: '#7be78d', accent: '#104d18' },
  hover:   { fill: '#123212', shadow: '#071507', stroke: '#99ff90', text: '#effff1', accent: '#45e35a' },
  selected:{ fill: '#174417', shadow: '#0b1d0b', stroke: '#00ff41', text: '#ffffff', accent: '#94ff9c', glow: true },
};

// ── State ─────────────────────────────────────────────────────
let panX = 0, panY = 0;
let zoom = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let hoveredNode = null;
let selectedNode = null;

// ── Canvas setup ──────────────────────────────────────────────
const canvas = document.getElementById('tree-canvas');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tree-tooltip');

function resize() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  draw();
}

window.addEventListener('resize', resize);

// ── Transform helpers ─────────────────────────────────────────
function worldToScreen(wx, wy) {
  return {
    x: wx * zoom + panX + canvas.width  / 2,
    y: wy * zoom + panY + canvas.height / 2,
  };
}

function screenToWorld(sx, sy) {
  return {
    x: (sx - panX - canvas.width  / 2) / zoom,
    y: (sy - panY - canvas.height / 2) / zoom,
  };
}

// ── Draw ──────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  // Background grid
  drawGrid();

  // Edges
  TREE_DATA.edges.forEach(([a, b]) => {
    const na = TREE_DATA.nodes.find(n => n.id === a);
    const nb = TREE_DATA.nodes.find(n => n.id === b);
    if (!na || !nb) return;
    const pa = worldToScreen(na.x, na.y);
    const pb = worldToScreen(nb.x, nb.y);

    const isActive = (selectedNode === na.id || selectedNode === nb.id);
    const midX = Math.round((pa.x + pb.x) / 2);
    const glowColor = isActive ? '#00ff41' : '#0a4514';

    ctx.strokeStyle = glowColor;
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(Math.round(pa.x), Math.round(pa.y));
    ctx.lineTo(midX, Math.round(pa.y));
    ctx.lineTo(midX, Math.round(pb.y));
    ctx.lineTo(Math.round(pb.x), Math.round(pb.y));
    ctx.stroke();

    ctx.strokeStyle = isActive ? '#b8ffbf' : '#1d7d2d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(pa.x), Math.round(pa.y));
    ctx.lineTo(midX, Math.round(pa.y));
    ctx.lineTo(midX, Math.round(pb.y));
    ctx.lineTo(Math.round(pb.x), Math.round(pb.y));
    ctx.stroke();
  });

  // Nodes
  TREE_DATA.nodes.forEach(node => drawNode(node));
}

function drawGrid() {
  const step = Math.max(18, Math.round(48 * zoom));
  const offX = (panX + canvas.width  / 2) % step;
  const offY = (panY + canvas.height / 2) % step;

  ctx.fillStyle = '#020802';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#082008';
  ctx.lineWidth = 1;

  for (let x = offX; x < canvas.width; x += step) {
    const px = Math.round(x);
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, canvas.height); ctx.stroke();
  }
  for (let y = offY; y < canvas.height; y += step) {
    const py = Math.round(y);
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(canvas.width, py); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
  ctx.lineWidth = 1;
  for (let x = offX; x < canvas.width; x += step * 4) {
    const px = Math.round(x);
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, canvas.height); ctx.stroke();
  }
  for (let y = offY; y < canvas.height; y += step * 4) {
    const py = Math.round(y);
    ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(canvas.width, py); ctx.stroke();
  }
}

function drawNode(node) {
  const p = worldToScreen(node.x, node.y);
  const isHovered  = hoveredNode  === node.id;
  const isSelected = selectedNode === node.id;

  const w = node.type === 'root' ? 116 : node.type === 'hub' ? 112 : 96;
  const h = node.type === 'root' ? 40  : node.type === 'hub' ? 36  : 30;

  const c = isSelected ? COLORS.selected
          : isHovered  ? COLORS.hover
          : COLORS[node.type];

  const x = Math.round(p.x - w / 2);
  const y = Math.round(p.y - h / 2);

  if (isSelected || node.type === 'root') {
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur  = 14;
  }

  ctx.fillStyle = c.shadow;
  ctx.fillRect(x + 5, y + 5, w, h);

  ctx.fillStyle = c.fill;
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = c.accent;
  ctx.fillRect(x + 2, y + 2, w - 4, 6);

  ctx.strokeStyle = c.stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Corner accents (root & hub only)
  if (node.type !== 'cmd') {
    const cs = 7;
    ctx.strokeStyle = '#d8ffdd';
    ctx.lineWidth = 2;
    const corners = [
      [x, y, cs, 0, 0, cs],
      [x + w, y, -cs, 0, 0, cs],
      [x, y + h, cs, 0, 0, -cs],
      [x + w, y + h, -cs, 0, 0, -cs],
    ];
    corners.forEach(([cx, cy, dx1, dy1, dx2, dy2]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx1, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy2);
      ctx.stroke();
    });
  }

  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  // Label
  ctx.fillStyle  = c.text;
  ctx.font = node.type === 'root'
    ? `bold ${Math.max(12, 18 * zoom)}px 'VT323', monospace`
    : node.type === 'hub'
    ? `${Math.max(9, 12 * zoom)}px 'Share Tech Mono', monospace`
    : `${Math.max(8, 10 * zoom)}px 'Share Tech Mono', monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.label, Math.round(p.x), Math.round(p.y) + 1);
}

// ── Hit test ──────────────────────────────────────────────────
function hitTest(sx, sy) {
  const w = { x: (sx - panX - canvas.width/2) / zoom, y: (sy - panY - canvas.height/2) / zoom };
  for (const node of [...TREE_DATA.nodes].reverse()) {
    const nw = node.type === 'root' ? 100 : node.type === 'hub' ? 100 : 90;
    const nh = node.type === 'root' ? 36  : node.type === 'hub' ? 32  : 28;
    if (
      w.x >= node.x - nw/2 && w.x <= node.x + nw/2 &&
      w.y >= node.y - nh/2 && w.y <= node.y + nh/2
    ) return node;
  }
  return null;
}

// ── Mouse events ──────────────────────────────────────────────
canvas.addEventListener('mousedown', e => {
  isDragging = true;
  dragStart  = { x: e.clientX - panX, y: e.clientY - panY };
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;

  if (isDragging) {
    panX = e.clientX - dragStart.x;
    panY = e.clientY - dragStart.y;
    draw();
    return;
  }

  const node = hitTest(sx, sy);
  if (node !== (hoveredNode ? TREE_DATA.nodes.find(n=>n.id===hoveredNode) : null)) {
    hoveredNode = node ? node.id : null;
    canvas.style.cursor = node ? 'pointer' : 'grab';
    draw();
  }

  if (node) {
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top  = (e.clientY - 10) + 'px';
    tooltip.innerHTML  = `<strong>${node.label}</strong><br>${node.desc}`;
  } else {
    tooltip.style.display = 'none';
  }
});

canvas.addEventListener('mouseup', e => {
  if (!isDragging || (Math.abs(e.clientX - (dragStart.x + panX)) < 4 && Math.abs(e.clientY - (dragStart.y + panY)) < 4)) {
    const rect = canvas.getBoundingClientRect();
    const node = hitTest(e.clientX - rect.left, e.clientY - rect.top);
    if (node) {
      selectedNode = node.id === selectedNode ? null : node.id;
      updateInfoPanel(node);
      draw();
    }
  }
  isDragging = false;
  canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  tooltip.style.display = 'none';
  canvas.style.cursor = 'grab';
});

// ── Scroll zoom ───────────────────────────────────────────────
canvas.addEventListener('wheel', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;

  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.min(3, Math.max(0.3, zoom * factor));

  panX = sx - (sx - panX) * (newZoom / zoom);
  panY = sy - (sy - panY) * (newZoom / zoom);
  zoom = newZoom;

  draw();
  updateZoomDisplay();
}, { passive: false });

// ── Touch support ─────────────────────────────────────────────
let lastTouchDist = null;

canvas.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    isDragging = true;
    dragStart  = { x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY };
  } else if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: true });

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    panX = e.touches[0].clientX - dragStart.x;
    panY = e.touches[0].clientY - dragStart.y;
    draw();
  } else if (e.touches.length === 2 && lastTouchDist) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const factor = dist / lastTouchDist;
    zoom = Math.min(3, Math.max(0.3, zoom * factor));
    lastTouchDist = dist;
    draw();
    updateZoomDisplay();
  }
}, { passive: false });

canvas.addEventListener('touchend', () => {
  isDragging = false;
  lastTouchDist = null;
});

// ── Info panel ────────────────────────────────────────────────
function updateInfoPanel(node) {
  const panel = document.getElementById('node-info');
  if (!panel) return;

  if (!node) {
    panel.innerHTML = '<span class="text-dim">Click a node to inspect it.</span>';
    return;
  }

  panel.innerHTML = `
    <div class="stat-row">
      <span class="stat-key">COMMAND</span>
      <span class="stat-val" style="font-size:20px">${node.label}</span>
    </div>
    <div class="stat-row">
      <span class="stat-key">TYPE</span>
      <span class="tag tag-green">${node.type.toUpperCase()}</span>
    </div>
    <div class="stat-row">
      <span class="stat-key">COORD</span>
      <span class="stat-val" style="font-size:14px">${node.x},${node.y}</span>
    </div>
    <div style="margin-top:12px; color: var(--green-dim); font-size:13px; line-height:1.7">
      ${node.desc}
    </div>
  `;
}

// ── Zoom display ──────────────────────────────────────────────
function updateZoomDisplay() {
  const el = document.getElementById('zoom-level');
  if (el) el.textContent = Math.round(zoom * 100) + '%';
}

// ── Controls ──────────────────────────────────────────────────
window.zoomIn   = () => { zoom = Math.min(3, zoom * 1.2); draw(); updateZoomDisplay(); };
window.zoomOut  = () => { zoom = Math.max(0.3, zoom / 1.2); draw(); updateZoomDisplay(); };
window.resetView = () => { zoom = 1; panX = 0; panY = 0; draw(); updateZoomDisplay(); };

// ── Init ──────────────────────────────────────────────────────
window.addEventListener('load', () => {
  resize();
  canvas.style.cursor = 'grab';
  updateInfoPanel(null);
  updateZoomDisplay();

  // Center on root node
  const root = TREE_DATA.nodes.find(n => n.id === 'pip');
  if (root) {
    panX = -root.x * zoom;
    panY = -root.y * zoom + 80;
  }
  draw();
});
