const canvas = document.getElementById('pixel-canvas');
let cols = 70;
let rows = 0;
let allPixels = [];

const font = {
  0:[0x7,0x5,0x5,0x5,0x7], 1:[0x2,0x6,0x2,0x2,0x7], 2:[0x7,0x1,0x7,0x4,0x7],
  3:[0x7,0x1,0x7,0x1,0x7], 4:[0x5,0x5,0x7,0x1,0x1], 5:[0x7,0x4,0x7,0x1,0x7],
  6:[0x7,0x4,0x7,0x5,0x7], 7:[0x7,0x1,0x2,0x2,0x2], 8:[0x7,0x5,0x7,0x5,0x7],
  9:[0x7,0x5,0x7,0x1,0x1], ':':[0x0,0x2,0x0,0x2,0x0]
};

function initGrid() {
  const pixelSize = canvas.offsetWidth / cols;
  rows = Math.floor((window.innerHeight * 0.55) / pixelSize);

  canvas.innerHTML = '';
  allPixels = [];

  for (let i = 0; i < cols * rows; i++) {
    const p = document.createElement('div');
    p.classList.add('p');
    // Randomize wave delay for a natural look
    p.style.animationDelay = `${Math.random() * 5}s`;
    canvas.appendChild(p);
    allPixels.push(p);
  }
}

function drawChar(char, x, y) {
  const bitmap = font[char];
  if (!bitmap) return;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      if ((bitmap[r] >> (2 - c)) & 1) {
        const idx = ((y + r) * cols) + (x + c);
        if (allPixels[idx]) allPixels[idx].classList.add('on');
      }
    }
  }
}

function update() {
  // Las Vegas PDT (UTC-7)
  const target = new Date("2026-05-20T17:15:00-07:00").getTime();
  const now = new Date().getTime();
  const diff = target - now;

  let str = "00:00:00:00";
  if (diff > 0) {
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    str = `${d.toString().padStart(2,'0')}:${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }

  allPixels.forEach(p => p.classList.remove('on'));

  let totalWidth = str.length * 4;
  let startX = Math.floor((cols - totalWidth) / 2);
  let startY = Math.floor((rows - 5) / 2);

  for (let i = 0; i < str.length; i++) {
    drawChar(str[i], startX + (i * 4), startY);
  }
}

initGrid();
update();
setInterval(update, 1000);

window.addEventListener('resize', () => {
  initGrid();
  update();
});
