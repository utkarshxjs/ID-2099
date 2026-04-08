const UNIVERSES = ['Nebula-7','Stardust-3','Echo Prime','Mirror Realm','Void Sector','Crystal Ω','Aqua Drift','Nova Basin','Shadow 9','Ember Fold','Zephyr Lane','Lunar Hex'];
const JOBS      = ['Cloud Sculptor','Star Baker','Gravity DJ','Volcano Librarian','Dream Mechanic','Comet Delivery Driver','Ocean Programmer','Time Zone Barista','Fog Architect','Moon Gardener','Galaxy Accountant','Planet Therapist','Tornado Chef','Ice Ring Tour Guide','Nebula Poet'];
const PLANETS   = ['Glimmer','Aquathorn','Vex-9','Soluna','Driftwood','Pyrox','Crystala','Nebulith','Thundera','Zara Prime','Verdant','Moonspire','Eclipsa','Frostveil'];
const BIOS      = ['72% Starlight','Mostly Cloud','60% Ocean Water','Half Moonbeam','Pure Stardust','88% Good Vibes','Built from Rain','Solidified Dreams','Recycled Comets','Woven from Wind'];
const POWERS    = ['Can Nap Anywhere','Finds Parking Instantly','Never Burns Toast','Speaks to WiFi Routers','Remembers Every Dream','Infinite Phone Battery','Animals Always Like Them','Rain Follows Them Everywhere','Always Has a Pen','Never Gets Lost','Perfect Parallel Parking','Feels When Pizza is Ready'];
const HOBBIES   = ['Competitive Cloud Watching','Pro Napper','Amateur Sun Whispering','Competitive Stargazing','Semi-Pro Daydreaming','Intergalactic Gardening','Time Capsule Collecting','Fog Photography','Comet Surfing','Planet Trivia','Asteroid Yoga','Black Hole Tourism'];
const THREATS   = [
  { label:'😇 Totally Harmless',      cls:'pill-safe'   },
  { label:'🤔 Slightly Suspicious',   cls:'pill-medium' },
  { label:'😤 Mildly Chaotic',        cls:'pill-high'   },
  { label:'🌀 Wildly Unpredictable',  cls:'pill-wild'   },
];
const FACTS = [
  n => `In ${n}'s universe, Mondays were abolished in 2031. Nobody misses them.`,
  n => `${n} once defeated a robot in a staring contest. The robot still hasn't recovered.`,
  n => `Scientists say ${n} has the rarest dimension fingerprint ever recorded.`,
  n => `${n}'s laugh accidentally causes small earthquakes. Very endearing ones.`,
  n => `${n} is the only person who knows what the 5th primary color looks like.`,
  n => `${n}'s home planet smells exactly like fresh cookies. Always.`,
  n => `${n} once got lost in space for 10 minutes but found a great café.`,
  n => `Scientists believe ${n} might be at least 4% magical. Possibly more.`,
  n => `${n} is legally required to warn people before telling a joke. They're that funny.`,
  n => `In an alternate timeline, ${n} invented the weekend. Twice.`,
];

function seededRand(seed) {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h, 33) ^ seed.charCodeAt(i);
  return () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 0xFFFFFFFF; };
}
function pick(arr, rand) { return arr[Math.floor(rand() * arr.length)]; }
function uid(rand) { return 'MV-' + Array.from({length:8}, () => '0123456789ABCDEF'[Math.floor(rand()*16)]).join(''); }

function generate() {
  const raw = document.getElementById('name-input').value.trim();
  if (!raw) {
    const inp = document.getElementById('name-input');
    inp.style.borderColor = 'rgba(255,64,129,0.7)';
    inp.placeholder = 'Please enter a name first!';
    setTimeout(() => { inp.style.borderColor = ''; inp.placeholder = 'e.g. Alex, Sarah, João...'; }, 1800);
    return;
  }
  document.getElementById('card-wrap').classList.remove('show');
  document.getElementById('loader').classList.add('show');
  document.getElementById('loading-name').textContent = raw;
  document.getElementById('go-btn').disabled = true;

  setTimeout(() => {
    document.getElementById('loader').classList.remove('show');
    buildCard(raw);
    document.getElementById('card-wrap').classList.add('show');
    document.getElementById('go-btn').disabled = false;
  }, 1500);
}

function buildCard(name) {
  const rand = seededRand(name.toLowerCase());
  const D = name.charAt(0).toUpperCase() + name.slice(1);

  document.getElementById('c-avatar').src = `https://api.dicebear.com/9.x/bottts/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a1333`;
  document.getElementById('c-name').textContent = D;
  document.getElementById('c-job').textContent   = pick(JOBS, rand);
  document.getElementById('c-uid').textContent   = uid(rand);
  document.getElementById('c-universe').textContent = pick(UNIVERSES, rand);
  document.getElementById('c-planet').textContent   = pick(PLANETS, rand);
  document.getElementById('c-bio').textContent      = pick(BIOS, rand);
  document.getElementById('c-power').textContent    = pick(POWERS, rand);
  document.getElementById('c-hobby').textContent    = pick(HOBBIES, rand);
  document.getElementById('c-fact').innerHTML = '💬 <strong>Fun fact:</strong> ' + pick(FACTS, rand)(D);

  const t = pick(THREATS, rand);
  const pill = document.getElementById('c-threat-pill');
  pill.textContent = t.label; pill.className = 'threat-pill ' + t.cls;

  const numLit = Math.floor(rand() * 5) + 1;
  const sr = document.getElementById('c-stars');
  sr.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    s.className = 'star' + (i < numLit ? ' lit' : '');
    sr.appendChild(s);
  }
}

// Holographic tilt
const cardEl = document.getElementById('id-card');
const holoEl = document.getElementById('holo');
document.addEventListener('mousemove', e => {
  if (!document.getElementById('card-wrap').classList.contains('show')) return;
  const r = cardEl.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top)  / r.height;
  if (px < -0.1 || px > 1.1 || py < -0.1 || py > 1.1) return;
  cardEl.style.transform = `perspective(800px) rotateX(${(py-0.5)*7}deg) rotateY(${(px-0.5)*-7}deg)`;
  const h1 = (px * 360) % 360, h2 = (h1 + 100) % 360;
  holoEl.style.background = `radial-gradient(circle at ${px*100}% ${py*100}%, hsla(${h1},100%,75%,0.1) 0%, hsla(${h2},80%,60%,0.06) 50%, transparent 75%)`;
});
cardEl.addEventListener('mouseleave', () => { cardEl.style.transform = ''; holoEl.style.background = 'none'; });

async function downloadCard(btn) {
  btn.textContent = '⏳ Saving...'; btn.disabled = true;
  cardEl.style.transform = 'none';
  try {
    const canvas = await html2canvas(cardEl, { backgroundColor:'#1a1333', scale:2, useCORS:true, logging:false });
    const a = document.createElement('a');
    a.download = `Parallel_ID_${document.getElementById('c-name').textContent || 'me'}.png`;
    a.href = canvas.toDataURL('image/png'); a.click();
    showToast('✅ Saved to your downloads!');
  } catch(e) { showToast('❌ Oops, try again!'); }
  btn.textContent = '⬇️ Save as Image'; btn.disabled = false;
}

function reset() {
  document.getElementById('card-wrap').classList.remove('show');
  document.getElementById('name-input').value = '';
  document.getElementById('name-input').focus();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

document.getElementById('name-input').addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
