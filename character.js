// ============================================================
//  character.js — Character creation & Discord OAuth mock
// ============================================================

const GENDERS = ['Male', 'Female', 'Other'];

const OUTFIT_BASES = ['Traveler', 'Warden', 'Strider', 'Nomad', 'Vanguard', 'Courier', 'Rogue', 'Scholar', 'Watcher', 'Ranger', 'Drifter', 'Marshal'];
const OUTFIT_LAYERS = ['Hoodie', 'Cape', 'Coat', 'Wrap', 'Jacket', 'Poncho', 'Mantle', 'Cloak', 'Vest', 'Shell'];
const OUTFIT_COLLARS = ['High Collar', 'Loose Collar', 'Guard Collar', 'Fold Collar', 'Scout Collar', 'Soft Collar'];
const OUTFIT_PATTERNS = ['Plain', 'Trimline', 'Cross-Stitch', 'Chest Band', 'Split Tone', 'Insignia Weave'];
const OUTFIT_ACCENTS = ['Bronze Pin', 'Silver Pin', 'Fiber Seal', 'Guild Mark', 'Strap Lock', 'Shadow Patch'];
const OUTFIT_PALETTES = [
  { cloth: '#2d5f38', shadow: '#1f4126', trim: '#77b86e' },
  { cloth: '#2e4e72', shadow: '#1b3248', trim: '#82b8d9' },
  { cloth: '#6f3f2b', shadow: '#432517', trim: '#d58a59' },
  { cloth: '#4f325f', shadow: '#2f1d38', trim: '#b38ad8' },
  { cloth: '#5d5d32', shadow: '#3c3c1d', trim: '#c7c26f' },
  { cloth: '#375b5b', shadow: '#203737', trim: '#8fc8c8' },
  { cloth: '#6a2e39', shadow: '#431b22', trim: '#d68591' },
  { cloth: '#5f4633', shadow: '#3b2b1d', trim: '#d0ab81' }
];

const COMMON_BASE_NAMES = [
  'Harry', 'Milo', 'Luca', 'Finn', 'Noah', 'Eli', 'Leo', 'Ezra', 'Hugo', 'Owen',
  'Jude', 'Theo', 'Evan', 'Kai', 'Ari', 'Ben', 'Cal', 'Drew', 'Ethan', 'Felix',
  'Gabe', 'Henry', 'Ian', 'Jack', 'Joel', 'Kian', 'Liam', 'Mason', 'Nate', 'Otis',
  'Parker', 'Quinn', 'Ryan', 'Sean', 'Tyler', 'Victor', 'Wyatt', 'Zane', 'Adam', 'Brady',
  'Cody', 'Damon', 'Emmett', 'Frankie', 'George', 'Harvey', 'Isaac', 'Jonah', 'Keegan', 'Logan',
  'Micah', 'Nico', 'Oscar', 'Rowan', 'Simon', 'Toby', 'Vincent', 'Wes', 'Xander', 'Zion',
  'Ava', 'Mia', 'Ella', 'Lily', 'Ruby', 'Nora', 'Ivy', 'Luna', 'Chloe', 'Zoe',
  'Maya', 'Aria', 'Emma', 'Clara', 'Hazel', 'Lucy', 'Sadie', 'Layla', 'Olive', 'Piper',
  'Willow', 'Grace', 'Alice', 'Bella', 'Daisy', 'Elsie', 'Freya', 'Hallie', 'Iris', 'Jade',
  'Kira', 'Lena', 'Mabel', 'Naomi', 'Opal', 'Phoebe', 'Riley', 'Stella', 'Tessa', 'Violet',
  'Wren', 'Yara', 'Zara', 'Anya', 'Brielle', 'Cora', 'Delia', 'Eliza', 'Faye', 'Gia',
  'Heidi', 'Josie', 'Kaia', 'Leah', 'Maren', 'Nina', 'Poppy', 'Rosie', 'Skye', 'Thea'
];

const NAME_PARTS_A = ['Har', 'Mil', 'Luc', 'Fin', 'No', 'El', 'Le', 'Ez', 'Hu', 'Ow', 'Ju', 'The', 'Ev', 'Ka', 'Ar', 'Ben', 'Cal', 'Dr', 'Eth', 'Fel', 'Gab', 'Hen', 'Ia', 'Jac', 'Jo', 'Ki', 'Li', 'Mas', 'Nat', 'Ot', 'Par', 'Qui', 'Ry', 'Se', 'Ty', 'Vic', 'Wy', 'Za', 'Ad', 'Bra', 'Co', 'Da', 'Em', 'Fra', 'Geo', 'Harv', 'Is', 'Jon', 'Kee', 'Log', 'Mi', 'Nic', 'Osc', 'Row', 'Si', 'To', 'Vin', 'We', 'Xan', 'Zi', 'Av', 'Mi', 'El', 'Li', 'Ru', 'Nor', 'Iv', 'Lu', 'Chlo', 'Zo', 'May', 'Ari', 'Em', 'Clar', 'Haz', 'Lu', 'Sa', 'Lay', 'Oli', 'Pi', 'Wil', 'Gra', 'Ali', 'Bel', 'Dai', 'Els', 'Frey', 'Hal', 'Ir', 'Ja', 'Kir', 'Le', 'Ma', 'Na', 'Op', 'Phoe', 'Ri', 'Stel', 'Tes', 'Vio', 'Wre', 'Ya', 'Za', 'An', 'Bri', 'Cor', 'Del', 'Eli', 'Fa', 'Gi', 'Hei', 'Jos', 'Kai', 'Le', 'Mar', 'Ni', 'Pop', 'Ros', 'Sky', 'The'];
const NAME_PARTS_B = ['ry', 'o', 'a', 'ie', 'ah', 'el', 'en', 'on', 'in', 'or', 'an', 'er', 'is', 'ia', 'ey', 'as', 'us', 'ton', 'ley', 'lin', 'ra', 'na', 'la', 'len', 'son'];

let selectedGender = null;
let mockUser = null;

function buildSimpleNamePool() {
  const pool = [...COMMON_BASE_NAMES];
  let index = 0;
  while (pool.length < 600) {
    const first = NAME_PARTS_A[index % NAME_PARTS_A.length];
    const second = NAME_PARTS_B[Math.floor(index / NAME_PARTS_A.length) % NAME_PARTS_B.length];
    const name = `${first}${second}`;
    if (!pool.includes(name) && /^[A-Z][a-zA-Z]+$/.test(name) && name.length >= 3 && name.length <= 8) {
      pool.push(name);
    }
    index++;
    if (index > 4000) break;
  }
  return pool.slice(0, 600);
}

const SIMPLE_NAME_POOL = buildSimpleNamePool();

function getCharacterName(user) {
  const seed = hashString(`${user?.id || 'guest'}:name-roll`);
  if ((seed % 1000) < 6) return 'B4T';
  return SIMPLE_NAME_POOL[seed % SIMPLE_NAME_POOL.length] || 'Harry';
}

function hashString(value) {
  let hash = 0;
  for (const char of String(value || '')) {
    hash = ((hash << 5) - hash) + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateOutfitProfile(user, gender = selectedGender) {
  const seed = hashString(`${user?.id || 'guest'}:${gender || 'other'}`);
  const base = OUTFIT_BASES[seed % OUTFIT_BASES.length];
  const layer = OUTFIT_LAYERS[Math.floor(seed / 3) % OUTFIT_LAYERS.length];
  const collar = OUTFIT_COLLARS[Math.floor(seed / 7) % OUTFIT_COLLARS.length];
  const pattern = OUTFIT_PATTERNS[Math.floor(seed / 11) % OUTFIT_PATTERNS.length];
  const accent = OUTFIT_ACCENTS[Math.floor(seed / 13) % OUTFIT_ACCENTS.length];
  const palette = OUTFIT_PALETTES[Math.floor(seed / 17) % OUTFIT_PALETTES.length];

  return {
    seed,
    palette,
    label: `${base} ${layer}`,
    detail: `${collar} / ${pattern} / ${accent}`
  };
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGenderButtons();
  setupLoginButton();
  checkExistingSession();
});

// ── Check existing session ────────────────────────────────────
function checkExistingSession() {
  const user = PIP.SESSION.user;
  if (user && user.characterCreated) {
    showCharacterProfile(user);
  } else if (user) {
    showCreationPhase(user);
  }
}

// ── Login button ──────────────────────────────────────────────
function setupLoginButton() {
  const btn = document.getElementById('discord-login-btn');
  const emailInput = document.getElementById('auth-email');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const email = PIP.normalizeEmail(emailInput?.value);
    if (!email || !email.includes('@')) {
      logLine('ACCESS DENIED: VALID EMAIL REQUIRED');
      if (emailInput) emailInput.focus();
      return;
    }

    btn.textContent = 'AUTHENTICATING...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    // Simulate Discord OAuth handshake
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      btn.textContent = 'AUTHENTICATING' + '.'.repeat(dots);
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      // Mock user data (in prod this comes from Discord OAuth)
      mockUser = {
        id: Math.floor(Math.random() * 900000000000000000) + 100000000000000000,
        username: 'Adventurer#' + Math.floor(Math.random() * 9000 + 1000),
        email,
        avatar: null,
        joinedAt: new Date().toISOString(),
        characterCreated: false,
        isOwner: email === PIP.OWNER_EMAIL
      };
      PIP.SESSION.user = mockUser;
      logLine('PORTAL AUTH SUCCESSFUL');
      logLine('EMAIL: ' + mockUser.email);
      if (mockUser.isOwner) logLine('OWNER TOOLS ENABLED');
      showCreationPhase(mockUser);
    }, 2400);
  });
}

// ── Show creation phase ───────────────────────────────────────
function showCreationPhase(user) {
  const loginScreen = document.getElementById('login-screen');
  const createScreen = document.getElementById('create-screen');
  const usernameDisplay = document.getElementById('username-display');
  const ownerPill = document.getElementById('owner-pill');

  if (loginScreen) loginScreen.style.display = 'none';
  if (createScreen) createScreen.style.display = 'block';
  if (usernameDisplay) usernameDisplay.textContent = user.characterName || getCharacterName(user);
  if (ownerPill) ownerPill.style.display = PIP.DATA.isOwner(user) ? 'inline-block' : 'none';
}

// ── Gender buttons ────────────────────────────────────────────
function renderGenderButtons() {
  const container = document.getElementById('gender-select');
  if (!container) return;

  GENDERS.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'btn gender-btn';
    btn.textContent = g;
    btn.dataset.gender = g;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGender = g;
      updateConfirmBtn();
    });
    container.appendChild(btn);
  });

  if (!selectedGender) {
    selectedGender = GENDERS[0];
    container.firstElementChild?.classList.add('selected');
  }
}

// ── Update confirm button state ───────────────────────────────
function updateConfirmBtn() {
  const btn = document.getElementById('confirm-btn');
  if (!btn) return;
  const ready = selectedGender;
  btn.disabled = !ready;
  btn.style.opacity = ready ? '1' : '0.4';
}

// ── Confirm character ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const confirmBtn = document.getElementById('confirm-btn');
  if (!confirmBtn) return;

  confirmBtn.addEventListener('click', () => {
    if (!selectedGender) return;

    confirmBtn.textContent = 'CREATING CHARACTER...';
    confirmBtn.disabled = true;

    const user = PIP.SESSION.user || {};
    user.gender = selectedGender;
    user.outfit = generateOutfitProfile(user, selectedGender);
    user.characterName = getCharacterName(user);
    user.characterCreated = true;
    user.createdAt = new Date().toISOString();
    PIP.SESSION.user = user;

    setTimeout(() => {
      showCharacterProfile(user);
    }, 1200);
  });
});

// ── Show character profile ────────────────────────────────────
function showCharacterProfile(user) {
  const createScreen = document.getElementById('create-screen');
  const loginScreen = document.getElementById('login-screen');
  const profileScreen = document.getElementById('profile-screen');

  if (createScreen) createScreen.style.display = 'none';
  if (loginScreen) loginScreen.style.display = 'none';
  if (profileScreen) {
    profileScreen.style.display = 'block';
    const outfit = user.outfit || generateOutfitProfile(user, user.gender);
    user.outfit = outfit;
    PIP.SESSION.user = user;

    // Fill in data
    setText('profile-username', user.characterName || getCharacterName(user));
    setText('profile-gender', user.gender || '—');
    setText('profile-outfit', outfit.label);
    setText('profile-created', formatDate(user.createdAt));
    setText('profile-id', String(user.id).slice(0, 8) + '...');
  }

  logLine('CHARACTER DATA LOADED');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

// ── Log lines ─────────────────────────────────────────────────
function logLine(text) {
  const log = document.getElementById('auth-log');
  if (!log) return;
  const line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = `[${timestamp()}]  ${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

function timestamp() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

// ── Logout ────────────────────────────────────────────────────
window.pipLogout = function () {
  PIP.SESSION.user = null;
  window.location.reload();
};
