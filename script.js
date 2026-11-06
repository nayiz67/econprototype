const $ = id => document.getElementById(id);

/* ---------- Catalog (generated, prototype data) ---------- */
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const COLORS = { Black:'#22232a', White:'#f5f5f2', Navy:'#1f3a68', Red:'#c0392b', Green:'#2e7d5b', Yellow:'#e0b030', Pink:'#e68fac', Brown:'#7a5230' };
const CN = Object.keys(COLORS);
const CATS = {
  'Shirts':      [45, ['Oxford Shirt','Linen Shirt','Flannel Shirt','Poplin Shirt','Camp Collar Shirt']],
  'T-shirts':    [22, ['Classic Tee','Boxy Tee','Pocket Tee','Ringer Tee','Longline Tee']],
  'Dresses':     [70, ['Wrap Dress','Slip Dress','Shirt Dress','Midi Dress','Sundress']],
  'Socks':       [9,  ['Crew Socks','Ankle Socks','Wool Hiking Socks','Striped Socks','Knee-High Socks']],
  'Shoes':       [80, ['Sneakers','Loafers','Ankle Boots','Sandals','Trail Runners']],
  'Accessories': [25, ['Bucket Hat','Wool Scarf','Canvas Belt','Beanie','Sun Cap']],
  'Shorts':      [35, ['Chino Shorts','Denim Shorts','Cargo Shorts','Linen Shorts','Running Shorts']],
  'Pants':       [55, ['Chinos','Straight Jeans','Cargo Pants','Pleated Trousers','Joggers']]
};
const SHAPES = { 'Average':[44,32,38], 'Hourglass':[42,26,44], 'Pear':[36,30,46], 'Apple':[44,44,38], 'Rectangle':[40,38,38], 'Inverted triangle':[52,32,34] };

const PRODUCTS = [];
Object.entries(CATS).forEach(([cat, [base, names]], k) => names.forEach((n, i) => {
  const col = CN[(i * 3 + k * 2) % 8];
  const ss = cat === 'Shorts' ? SEASONS.slice(0, 2) : SEASONS;
  PRODUCTS.push({ id: PRODUCTS.length, cat, name: `${col} ${n}`, base: n, color: col, hex: COLORS[col],
                  season: ss[(i + k) % ss.length], price: base + (i * 7) % 23 });
}));

/* ---------- Figure drawing (person / body shape) ---------- */
function crop(p) {
  if (p.cat === 'Dresses') return '30 10 140 300';
  if (['Shirts', 'T-shirts'].includes(p.cat)) return '30 10 140 230';
  if (['Shorts', 'Pants'].includes(p.cat)) return '40 150 120 230';
  if (['Socks', 'Shoes'].includes(p.cat)) return '40 290 120 100';
  if (p.base.includes('Belt')) return '40 130 120 100';
  if (p.base.includes('Scarf')) return '50 50 100 110';
  return '50 0 100 80';
}

function fig(p, shape = 'Average', box = '0 0 200 400') {
  const [s, w, h] = SHAPES[shape], c = p.hex, sk = '#d8b79d';
  const L = 100 - h * .45, R = 100 + h * .45, lw = h * .85;
  const ln = 'stroke="rgba(0,0,0,.35)" stroke-width="1"';
  const line = (x1, y1, x2, y2, col, wd) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${wd}" stroke-linecap="round"/>`;
  const legs = (y1, y2, wd) => line(L, y1, L, y2, c, wd).replace('round', 'butt') + line(R, y1, R, y2, c, wd).replace('round', 'butt');
  const waist = `<path d="M${100-w-4} 165L${100+w+4} 165L${100+h+4} 215L${100-h-4} 215Z" fill="${c}" ${ln}/>`;

  const body =
    `<circle cx="100" cy="44" r="20" fill="${sk}"/><rect x="92" y="60" width="16" height="36" fill="${sk}"/>` +
    line(100-s-4, 100, 100-s-10, 205, sk, 12) + line(100+s+4, 100, 100+s+10, 205, sk, 12) +
    legs(210, 365, lw).replace(new RegExp(c, 'g'), sk) +
    `<ellipse cx="${L}" cy="372" rx="13" ry="6" fill="${sk}"/><ellipse cx="${R}" cy="372" rx="13" ry="6" fill="${sk}"/>` +
    `<path d="M${100-s} 92L${100+s} 92L${100+w} 165L${100+h} 215L${100-h} 215L${100-w} 165Z" fill="${sk}"/>`;

  let g = '';
  if (p.cat === 'Shirts' || p.cat === 'T-shirts') {
    const y = p.cat === 'Shirts' ? 210 : 200, sl = p.cat === 'Shirts' ? 200 : 135;
    g = line(100-s-4, 100, 100-s-10, sl, c, 17) + line(100+s+4, 100, 100+s+10, sl, c, 17) +
        `<path d="M${100-s-4} 90L${100+s+4} 90L${100+w+6} 165L${100+h+6} ${y}L${100-h-6} ${y}L${100-w-6} 165Z" fill="${c}" ${ln}/>`;
  } else if (p.cat === 'Dresses') {
    g = `<path d="M${100-s} 92L${100+s} 92L${100+w+4} 165L${100+h+22} 290L${100-h-22} 290L${100-w-4} 165Z" fill="${c}" ${ln}/>`;
  } else if (p.cat === 'Pants') {
    g = legs(205, 362, lw + 6) + waist;
  } else if (p.cat === 'Shorts') {
    g = legs(205, 285, lw + 8) + waist;
  } else if (p.cat === 'Socks') {
    g = legs(318, 368, lw + 3);
  } else if (p.cat === 'Shoes') {
    g = `<ellipse cx="${L}" cy="374" rx="18" ry="9" fill="${c}" ${ln}/><ellipse cx="${R}" cy="374" rx="18" ry="9" fill="${c}" ${ln}/>`;
  } else if (p.base.includes('Belt')) {
    g = `<rect x="${100-w-6}" y="160" width="${2*(w+6)}" height="9" fill="${c}" ${ln}/>`;
  } else if (p.base.includes('Scarf')) {
    g = `<rect x="76" y="80" width="48" height="14" rx="6" fill="${c}" ${ln}/><rect x="104" y="90" width="14" height="44" fill="${c}" ${ln}/>`;
  } else {
    g = `<path d="M76 32Q100 -4 124 32Z" fill="${c}" ${ln}/><ellipse cx="100" cy="33" rx="30" ry="7" fill="${c}" ${ln}/>`;
  }
  return `<svg viewBox="${box}" role="img" aria-label="${p.name} shown on a ${shape.toLowerCase()} build">${body}${g}</svg>`;
}

/* ---------- Filters and shop ---------- */
const st = { cat: 'All', season: 'All', color: null, max: 110, sort: 'featured' };

function renderFilters() {
  $('catChips').innerHTML = ['All', ...Object.keys(CATS)]
    .map(c => `<button class="chip" data-cat="${c}" aria-pressed="${st.cat === c}">${c}</button>`).join('');
  $('swatches').innerHTML = CN
    .map(n => `<button class="sw" data-color="${n}" title="${n}" aria-label="${n}" aria-pressed="${st.color === n}" style="background:${COLORS[n]}"></button>`).join('');
  $('season').value = st.season;
  $('price').value = st.max;
  $('priceOut').textContent = '$' + st.max;
  $('sort').value = st.sort;
}

function renderShop() {
  const list = PRODUCTS.filter(p =>
    (st.cat === 'All' || p.cat === st.cat) && (st.season === 'All' || p.season === st.season) &&
    (!st.color || p.color === st.color) && p.price <= st.max);
  if (st.sort === 'low') list.sort((a, b) => a.price - b.price);
  if (st.sort === 'high') list.sort((a, b) => b.price - a.price);
  const html = Object.keys(CATS).map(cat => {
    const items = list.filter(p => p.cat === cat);
    if (!items.length) return '';
    return `<section class="sec"><h2>${cat} <small>${items.length} items</small></h2><div class="grid">` +
      items.map(p => `<button class="card" data-id="${p.id}">${fig(p, 'Average', crop(p))}
        <div class="meta"><b>${p.name}</b><span>$${p.price} &middot; ${p.season}</span></div></button>`).join('') +
      `</div></section>`;
  }).join('');
  $('shop').innerHTML = html || '<p class="empty">No items match these filters. Clear a filter to see more.</p>';
}

function refresh() { renderFilters(); renderShop(); }

$('catChips').onclick = e => { const b = e.target.closest('[data-cat]'); if (b) { st.cat = b.dataset.cat; refresh(); } };
$('swatches').onclick = e => { const b = e.target.closest('[data-color]'); if (b) { st.color = st.color === b.dataset.color ? null : b.dataset.color; refresh(); } };
$('season').onchange = e => { st.season = e.target.value; renderShop(); };
$('price').oninput = e => { st.max = +e.target.value; $('priceOut').textContent = '$' + st.max; renderShop(); };
$('sort').onchange = e => { st.sort = e.target.value; renderShop(); };
$('reset').onclick = () => { Object.assign(st, { cat: 'All', season: 'All', color: null, max: 110, sort: 'featured' }); refresh(); };

/* ---------- Item detail ---------- */
let cur = null, view = 'person', shape = 'Average', size = 'M';

function drawItem() {
  const p = cur, inCart = cart.some(c => c.id === p.id);
  $('itemBody').innerHTML = `<div class="detail">
    <div class="stage">${fig(p, shape)}<p>${view === 'person' ? 'On an average build' : 'On a ' + shape.toLowerCase() + ' build'}</p></div>
    <div>
      <h2>${p.name}</h2>
      <p>$${p.price} &middot; ${p.season} &middot; ${p.cat}</p>
      <div class="seg" role="group" aria-label="View">
        <button data-v="person" aria-pressed="${view === 'person'}">See on person</button>
        <button data-v="shape" aria-pressed="${view === 'shape'}">See on body shape</button>
      </div>
      ${view === 'shape' ? `<div class="seg" role="group" aria-label="Body shape">${Object.keys(SHAPES)
        .map(s => `<button data-s="${s}" aria-pressed="${s === shape}">${s}</button>`).join('')}</div>` : ''}
      <label>Size <select id="size">${['XS','S','M','L','XL'].map(z => `<option ${z === size ? 'selected' : ''}>${z}</option>`).join('')}</select></label>
      <button class="primary" id="addBtn" ${inCart ? 'disabled' : ''}>${inCart ? 'In cart' : 'Add to cart'}</button>
    </div></div>`;
}

$('shop').onclick = e => {
  const b = e.target.closest('.card'); if (!b) return;
  cur = PRODUCTS[+b.dataset.id]; view = 'person'; shape = 'Average';
  drawItem(); $('itemModal').hidden = false;
};
$('itemBody').onclick = e => {
  const v = e.target.closest('[data-v]'), s = e.target.closest('[data-s]');
  if (v) { view = v.dataset.v; if (view === 'person') shape = 'Average'; drawItem(); }
  else if (s) { shape = s.dataset.s; drawItem(); }
  else if (e.target.id === 'addBtn') { cart.push({ id: cur.id, size }); updateCart(); drawItem(); toast('Added to cart'); }
};
$('itemBody').onchange = e => { if (e.target.id === 'size') size = e.target.value; };

/* ---------- Cart ---------- */
let cart = [];

function updateCart() {
  $('cartCount').textContent = cart.length;
  $('cartList').innerHTML = cart.length ? cart.map((c, i) => {
    const p = PRODUCTS[c.id];
    return `<li>${fig(p, 'Average', crop(p))}<div><b>${p.name}</b><br><small>Size ${c.size} &middot; $${p.price}</small></div>
            <button class="link" data-rm="${i}">Remove</button></li>`;
  }).join('') : '<li>Your cart is empty. Add items from the shop.</li>';
  $('cartTotal').textContent = '$' + cart.reduce((t, c) => t + PRODUCTS[c.id].price, 0);
  $('checkoutBtn').disabled = !cart.length;
}
$('cartBtn').onclick = () => { $('cart').hidden = false; };
$('cartList').onclick = e => {
  const b = e.target.closest('[data-rm]');
  if (b) { cart.splice(+b.dataset.rm, 1); updateCart(); if (cur && !$('itemModal').hidden) drawItem(); }
};

/* ---------- Checkout wheel ---------- */
const WCOL = ['#2F5BFF', '#0F1B2D', '#1F7A5A', '#C2410C', '#7C3AED', '#B45309'];
let pool = [], picks = [], total = 0, rot = 0, spinning = false, pending = 0;

function drawWheel() {
  const cv = $('wheelCv'), x = cv.getContext('2d'), n = pool.length, a = 2 * Math.PI / n, r = 160;
  x.clearRect(0, 0, 320, 320);
  pool.forEach((it, i) => {
    x.beginPath(); x.moveTo(r, r);
    x.arc(r, r, r - 4, -Math.PI / 2 + i * a, -Math.PI / 2 + (i + 1) * a); x.closePath();
    x.fillStyle = WCOL[i % WCOL.length]; x.fill();
    x.strokeStyle = '#fff'; x.lineWidth = 3; x.stroke();
    x.save(); x.translate(r, r); x.rotate(-Math.PI / 2 + (i + .5) * a);
    x.textAlign = 'right'; x.fillStyle = '#fff'; x.font = '600 13px sans-serif';
    x.fillText(it.name.length > 20 ? it.name.slice(0, 19) + '…' : it.name, r - 18, 4);
    x.restore();
  });
}

function wheelUI() {
  const done = picks.length >= total;
  $('wheelMsg').textContent = done ? 'The wheel has chosen. These are the items you can buy.' : `Spin ${picks.length + 1} of ${total}`;
  $('wheelNote').textContent = cart.length < 5 ? `Your cart has ${cart.length} item${cart.length === 1 ? '' : 's'}, so the wheel makes ${total} pick${total === 1 ? '' : 's'}. Add 5 or more for the full five spins.` : '';
  $('wheelWrap').hidden = done; $('spinBtn').hidden = done; $('orderBtn').hidden = !done;
  $('picks').innerHTML = picks.map(p => `<li>${p.name} (size ${p.size}) &middot; $${p.price}</li>`).join('');
  $('picksTotal').innerHTML = done ? '<b>Total: $' + picks.reduce((t, p) => t + p.price, 0) + '</b>' : '';
}

function openWheel() {
  pool = cart.map(c => ({ ...PRODUCTS[c.id], size: c.size }));
  picks = []; total = Math.min(5, pool.length); rot = 0; spinning = false;
  const w = $('wheel'); w.style.transition = 'none'; w.style.transform = 'rotate(0deg)';
  $('cart').hidden = true; $('wheelModal').hidden = false;
  drawWheel(); wheelUI();
}

$('spinBtn').onclick = () => {
  if (spinning || !pool.length) return;
  spinning = true;
  const n = pool.length, a = 360 / n; pending = Math.floor(Math.random() * n);
  const jitter = (Math.random() - .5) * a * .6;
  const target = ((360 - (pending + .5) * a + jitter) % 360 + 360) % 360;
  rot += 360 * 5 + ((target - (rot % 360)) + 360) % 360;
  const w = $('wheel');
  w.style.transition = 'transform 4s cubic-bezier(.15,.7,.1,1)';
  w.style.transform = `rotate(${rot}deg)`;
};

$('wheel').addEventListener('transitionend', () => {
  if (!spinning) return;
  picks.push(pool.splice(pending, 1)[0]);
  rot = 0;
  const w = $('wheel'); w.style.transition = 'none'; w.style.transform = 'rotate(0deg)';
  spinning = false;
  if (pool.length) drawWheel();
  wheelUI();
});

$('checkoutBtn').onclick = () => { if (cart.length) openWheel(); };
$('orderBtn').onclick = () => {
  cart = []; updateCart(); $('wheelModal').hidden = true;
  toast('Prototype order placed. No payment was taken.');
};

/* ---------- Shared UI ---------- */
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) {
    if (!spinning) ['itemModal', 'wheelModal', 'cart'].forEach(id => { if ($(id).contains(e.target)) $(id).hidden = true; });
  } else if (e.target.classList.contains('modal') && !spinning) e.target.hidden = true;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !spinning) ['itemModal', 'wheelModal', 'cart'].forEach(id => $(id).hidden = true);
});

refresh();
updateCart();
