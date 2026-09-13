// ═══════════════════════════════════════
// آینده‌ساز
// ═══════════════════════════════════════

const todayJalali = () => new Date().toLocaleDateString('fa-IR');
const todayKey = () => new Date().toISOString().slice(0, 10);
const $ = id => document.getElementById(id);
const getData = k => JSON.parse(localStorage.getItem(k) || '[]');
const setData = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); }
  catch(e) { alert('حافظه پر شده. پشتیبان بگیر.'); }
};

const HIER = {
  customer: {
    'خریدار': ['خرید', 'معاوضه'],
    'مستأجر': ['رهن و اجاره'],
    'معاوضه': ['معاوضه']
  },
  property: {
    'فروشنده': ['فروش', 'معاوضه'],
    'موجر': ['رهن و اجاره'],
    'معاوضه': ['معاوضه']
  }
};

const CATEGORIES = {
  'مسکونی': ['آپارتمان', 'خانه', 'ویلا', 'سوئیت'],
  'تجاری': ['مغازه', 'پاساژ', 'تجاری', 'انبار', 'کارگاه'],
  'اداری': ['دفتر کار', 'اداری', 'مطب', 'کلینیک'],
  'زمین': ['زمین مسکونی', 'زمین تجاری', 'زمین کشاورزی', 'زمین صنعتی'],
  'باغ و ویلا': ['باغ', 'باغچه', 'ویلا', 'باغ ویلا']
};

function normalize(s) {
  if (!s) return '';
  return String(s)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[يى]/g, 'ی').replace(/[ك]/g, 'ک')
    .replace(/[أإآا]/g, 'ا').replace(/[ؤئ]/g, 'ی')
    .replace(/\u200c/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  $('tab-' + tab).classList.add('active');
  if (btn) btn.classList.add('active');
}
function openModal(id) { $(id).classList.add('show'); }
function closeModal(id) { $(id).classList.remove('show'); }
function toggleChip(btn) { btn.classList.toggle('selected'); }
function getChipsValues(id) { const el = $(id); return el ? Array.from(el.querySelectorAll('.chip.selected')).map(c => c.dataset.v) : []; }
function selectChipsValues(id, v) { const el = $(id); if (el) el.querySelectorAll('.chip').forEach(c => c.classList.toggle('selected', v.includes(c.dataset.v))); }
function clearChips(id) { const el = $(id); if (el) el.querySelectorAll('.chip').forEach(c => c.classList.remove('selected')); }

let state = {
  customer: { role: '', deal: '', cat: '', type: '' },
  property: { role: '', deal: '', cat: '', type: '' }
};

function pickRole(btn, mode) {
  const role = btn.dataset.v;
  state[mode] = { role: role, deal: '', cat: '', type: '' };
  const rc = mode === 'customer' ? 'c-role-chips' : 'p-role-chips';
  document.querySelectorAll('#' + rc + ' .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  const ds = mode === 'customer' ? 'c-deal-step' : 'p-deal-step';
  const dc = mode === 'customer' ? 'c-deal-chips' : 'p-deal-chips';
  const deals = HIER[mode][role] || [];
  $(dc).innerHTML = deals.map(d => {
    const em = d === 'خرید' ? '🛒' : d === 'فروش' ? '💰' : d === 'رهن و اجاره' ? '🔑' : '🔄';
    return '<button type="button" class="chip" data-v="' + d + '" onclick="pickDeal(this,\'' + mode + '\')">' + em + ' ' + d + '</button>';
  }).join('');
  $(ds).style.display = 'block';
  $(mode === 'customer' ? 'c-cat-step' : 'p-cat-step').style.display = 'none';
  $(mode === 'customer' ? 'c-type-step' : 'p-type-step').style.display = 'none';
  $(mode === 'customer' ? 'c-rest' : 'p-rest').style.display = 'none';
  const hs = $(mode === 'customer' ? 'c-hint' : 'p-hint');
  hs.style.display = 'block';
  hs.textContent = '👆 حالا نوع معامله رو انتخاب کن';
}

function pickDeal(btn, mode) {
  state[mode].deal = btn.dataset.v;
  state[mode].cat = '';
  state[mode].type = '';
  const dc = mode === 'customer' ? 'c-deal-chips' : 'p-deal-chips';
  document.querySelectorAll('#' + dc + ' .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  $(mode === 'customer' ? 'c-cat-step' : 'p-cat-step').style.display = 'block';
  $(mode === 'customer' ? 'c-type-step' : 'p-type-step').style.display = 'none';
  $(mode === 'customer' ? 'c-rest' : 'p-rest').style.display = 'none';
  const cc = mode === 'customer' ? 'c-cat-chips' : 'p-cat-chips';
  document.querySelectorAll('#' + cc + ' .chip').forEach(c => c.classList.remove('selected'));
  $(mode === 'customer' ? 'c-hint' : 'p-hint').textContent = '👆 حالا دسته ملک رو انتخاب کن';
}

function pickCat(btn, mode) {
  const cat = btn.dataset.v;
  state[mode].cat = cat;
  state[mode].type = '';
  const cc = mode === 'customer' ? 'c-cat-chips' : 'p-cat-chips';
  document.querySelectorAll('#' + cc + ' .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  const tc = mode === 'customer' ? 'c-type-chips' : 'p-type-chips';
  const types = CATEGORIES[cat] || [];
  $(tc).innerHTML = types.map(t => {
    const cls = cat === 'تجاری' ? 'chip comm' : cat === 'اداری' ? 'chip office' : 'chip';
    return '<button type="button" class="' + cls + '" data-v="' + t + '" onclick="pickType(this,\'' + mode + '\')">' + t + '</button>';
  }).join('');
  $(mode === 'customer' ? 'c-type-step' : 'p-type-step').style.display = 'block';
  $(mode === 'customer' ? 'c-rest' : 'p-rest').style.display = 'none';
  $(mode === 'customer' ? 'c-hint' : 'p-hint').textContent = '👆 حالا نوع ملک رو انتخاب کن';
}

function pickType(btn, mode) {
  const type = btn.dataset.v;
  state[mode].type = type;
  const tc = mode === 'customer' ? 'c-type-chips' : 'p-type-chips';
  document.querySelectorAll('#' + tc + ' .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  $(mode === 'customer' ? 'c-rest' : 'p-rest').style.display = 'block';
  $(mode === 'customer' ? 'c-hint' : 'p-hint').style.display = 'none';
  if (mode === 'property' && !$('p-title').value) {
    const area = $('p-area').value;
    $('p-title').value = type + (area ? ' ' + area + ' متری' : '') + (state.property.deal ? ' - ' + state.property.deal : '');
  }
}

let currentPhotos = { customer: [], property: [] };

function handlePhotos(e, target) {
  const files = Array.from(e.target.files || []);
  const max = target === 'property' ? 5 : 3;
  const remaining = max - currentPhotos[target].length;
  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      compressImage(ev.target.result, 800, 0.7, (c) => {
        currentPhotos[target].push(c);
        renderPhotoGrid(target);
      });
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

function compressImage(dataUrl, maxWidth, quality, cb) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    cb(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = dataUrl;
}

function renderPhotoGrid(target) {
  const gridId = target === 'customer' ? 'c-photos' : 'p-photos';
  const inputId = target === 'customer' ? 'c-photo-input' : 'p-photo-input';
  const grid = $(gridId);
  if (!grid) return;
  const max = target === 'property' ? 5 : 3;
  let html = currentPhotos[target].map((p, i) =>
    '<div class="photo-item"><img src="' + p + '"><button type="button" class="remove" onclick="removePhoto(\'' + target + '\',' + i + ')">✕</button></div>'
  ).join('');
  if (currentPhotos[target].length < max) {
    html += '<div class="photo-add" onclick="document.getElementById(\'' + inputId + '\').click()">＋</div>';
  }
  grid.innerHTML = html;
}
function removePhoto(target, i) { currentPhotos[target].splice(i, 1); renderPhotoGrid(target); }

let currentLocation = null;
function captureLocation() {
  if (!navigator.geolocation) { $('p-location-status').textContent = '❌ پشتیبانی نمی‌کنه'; return; }
  $('p-location-status').textContent = '⏳ در حال دریافت...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const link = 'https://maps.google.com/?q=' + currentLocation.lat + ',' + currentLocation.lng;
      $('p-location-status').innerHTML = '✅ ثبت شد • <a href="' + link + '" target="_blank" style="color:#2563EB;font-weight:700">مشاهده</a>';
    },
    (err) => {
      $('p-location-status').innerHTML = '⚠️ نمی‌شه گرفت.<br><span style="color:#6B7280;font-size:12px">از فیلد آدرس و دکمهٔ زیر استفاده کن 👇</span>';
      const addr = $('p-address').value.trim() || $('p-location').value.trim();
      if (addr) {
        const mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(addr);
        $('p-location-status').innerHTML += '<br><a href="' + mapsUrl + '" target="_blank" style="color:#2563EB;font-weight:700;display:inline-block;margin-top:6px">🗺 جستجو در گوگل مپ</a>';
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}
function clearLocation() { currentLocation = null; $('p-location-status').textContent = 'لوکیشن ثبت نشده'; }

const GEMINI_KEY = 'AQ.Ab8RN6JvOLPxL9x9GUZcAkL5dsr-SCRkzGY62APo7ofiEDQtfQ';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + GEMINI_KEY;
let ocrRunning = false;
let geminiResult = null;

function openScanFor(target) {
  geminiResult = null;
  $('ocr-preview').style.display = 'none';
  $('ocr-preview').src = '';
  $('ocr-progress-wrap').style.display = 'none';
  $('ocr-result-wrap').style.display = 'none';
  $('ocr-error-wrap').style.display = 'none';
  $('ocr-detect-wrap').style.display = 'none';
  $('ocr-file-camera').value = '';
  $('ocr-file-gallery').value = '';
  openModal('modal-scan');
}

function handleImageSelect(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    $('ocr-preview').src = ev.target.result;
    $('ocr-preview').style.display = 'block';
    runGeminiOcr(ev.target.result);
  };
  reader.readAsDataURL(file);
}

async function runGeminiOcr(imageSrc) {
  ocrRunning = true;
  $('ocr-progress-wrap').style.display = 'block';
  $('ocr-result-wrap').style.display = 'none';
  $('ocr-error-wrap').style.display = 'none';
  $('ocr-detect-wrap').style.display = 'none';
  $('ocr-progress-fill').style.width = '20%';
  $('ocr-status').textContent = '✨ ارسال به Gemini...';
  const base64 = imageSrc.split(',')[1];
  const mimeMatch = imageSrc.match(/data:([^;]+);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const prompt = 'این تصویر آگهی ملک یا یادداشت مشاور املاک یا اسکرین‌شات است. اطلاعات را به JSON برگردان. فقط JSON خالص. اگر نبود خالی یا null. اعداد انگلیسی، مبالغ کامل تومان.\n{"docType":"owner یا buyer یا unknown","role":"فروشنده یا موجر یا خریدار یا مستأجر یا معاوضه یا خالی","deal":"فروش یا رهن و اجاره یا خرید یا معاوضه یا خالی","category":"مسکونی یا تجاری یا اداری یا زمین یا باغ و ویلا یا خالی","propertyType":"آپارتمان یا خانه یا ویلا یا سوئیت یا مغازه یا پاساژ یا تجاری یا انبار یا کارگاه یا دفتر کار یا اداری یا مطب یا کلینیک یا زمین مسکونی یا زمین تجاری یا زمین کشاورزی یا باغ یا باغچه یا باغ ویلا یا خالی","title":"عنوان","location":"محدوده","address":"آدرس","area":null,"usableArea":null,"rooms":null,"floor":null,"totalFloors":null,"unitsPerFloor":null,"year":null,"unitPosition":"","direction":"","cabin":"","floorType":"","extra":"","price":null,"deposit":null,"rent":null,"loan":null,"goodwill":null,"features":[],"ownerName":"","ownerPhone":"","ownerPhone2":"","doc":"","ownership":"","note":"متن کامل"}';
  try {
    $('ocr-progress-fill').style.width = '50%';
    $('ocr-status').textContent = '🧠 Gemini در حال تحلیل...';
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }] }],
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
      })
    });
    $('ocr-progress-fill').style.width = '85%';
    if (!response.ok) {
      const t = await response.text();
      throw new Error('HTTP ' + response.status + ' - ' + t.substring(0, 200));
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) throw new Error('پاسخ خالی');
    let jt = text.trim();
    const jm = jt.match(/\{[\s\S]*\}/);
    if (jm) jt = jm[0];
    const parsed = JSON.parse(jt);
    geminiResult = parsed;
    $('ocr-progress-fill').style.width = '100%';
    $('ocr-progress-wrap').style.display = 'none';
    const tm = { owner: '🏠 مالک', buyer: '👤 خواهان', unknown: '❓ نامشخص' };
    $('ocr-detect-info').innerHTML =
      '<b>نوع:</b> ' + (tm[parsed.docType] || 'نامشخص') + '<br>' +
      '<b>نقش:</b> ' + (parsed.role || '-') + '<br>' +
      '<b>معامله:</b> ' + (parsed.deal || '-') + '<br>' +
      '<b>دسته:</b> ' + (parsed.category || '-') + '<br>' +
      '<b>ملک:</b> ' + (parsed.propertyType || '-') + '<br>' +
      '<b>محدوده:</b> ' + (parsed.location || '-') + '<br>' +
      '<b>متراژ:</b> ' + (parsed.area ? parsed.area + ' متر' : '-') + '<br>' +
      '<b>خواب:</b> ' + (parsed.rooms || '-') + '<br>' +
      '<b>قیمت:</b> ' + (parsed.price ? fmtPrice(parsed.price) + ' تومان' : '-') + '<br>' +
      '<b>مالک:</b> ' + (parsed.ownerName || '-') + '<br>' +
      '<b>شماره:</b> ' + (parsed.ownerPhone || '-');
    $('ocr-text').textContent = parsed.note || text;
    $('ocr-result-wrap').style.display = 'block';
    $('ocr-detect-wrap').style.display = 'block';
  } catch (err) {
    console.error(err);
    $('ocr-progress-wrap').style.display = 'none';
    $('ocr-error-wrap').style.display = 'block';
    $('ocr-error-text').textContent = err.message || 'خطا';
  } finally {
    ocrRunning = false;
  }
}

function applyOcrResult(target) {
  if (!geminiResult) { alert('اول اسکن کن'); return; }
  if (target === 'customer') applyCustomerJson(geminiResult);
  else applyPropertyJson(geminiResult);
  closeModal('modal-scan');
}

function inferCategory(type) {
  const map = {
    'آپارتمان': 'مسکونی', 'خانه': 'مسکونی', 'ویلا': 'مسکونی', 'سوئیت': 'مسکونی',
    'مغازه': 'تجاری', 'پاساژ': 'تجاری', 'تجاری': 'تجاری', 'انبار': 'تجاری', 'کارگاه': 'تجاری',
    'دفتر کار': 'اداری', 'اداری': 'اداری', 'مطب': 'اداری', 'کلینیک': 'اداری',
    'زمین مسکونی': 'زمین', 'زمین تجاری': 'زمین', 'زمین کشاورزی': 'زمین', 'زمین صنعتی': 'زمین',
    'باغ': 'باغ و ویلا', 'باغچه': 'باغ و ویلا', 'باغ ویلا': 'باغ و ویلا'
  };
  return map[type] || '';
}

function setHierarchy(mode, role, deal, cat, type) {
  state[mode] = { role: role, deal: deal, cat: cat, type: type };
  const rc = mode === 'customer' ? 'c-role-chips' : 'p-role-chips';
  document.querySelectorAll('#' + rc + ' .chip').forEach(c => c.classList.toggle('selected', c.dataset.v === role));
  const ds = mode === 'customer' ? 'c-deal-step' : 'p-deal-step';
  const dc = mode === 'customer' ? 'c-deal-chips' : 'p-deal-chips';
  const deals = HIER[mode][role] || [];
  $(dc).innerHTML = deals.map(d =>
    '<button type="button" class="chip ' + (d === deal ? 'selected' : '') + '" data-v="' + d + '" onclick="pickDeal(this,\'' + mode + '\')">' + d + '</button>'
  ).join('');
  $(ds).style.display = 'block';
  $(mode === 'customer' ? 'c-cat-step' : 'p-cat-step').style.display = 'block';
  const cc = mode === 'customer' ? 'c-cat-chips' : 'p-cat-chips';
  document.querySelectorAll('#' + cc + ' .chip').forEach(c => c.classList.toggle('selected', c.dataset.v === cat));
  const types = CATEGORIES[cat] || [];
  const tc = mode === 'customer' ? 'c-type-chips' : 'p-type-chips';
  $(tc).innerHTML = types.map(t => {
    const cls = cat === 'تجاری' ? 'chip comm' : cat === 'اداری' ? 'chip office' : 'chip';
    return '<button type="button" class="' + cls + ' ' + (t === type ? 'selected' : '') + '" data-v="' + t + '" onclick="pickType(this,\'' + mode + '\')">' + t + '</button>';
  }).join('');
  $(mode === 'customer' ? 'c-type-step' : 'p-type-step').style.display = 'block';
  $(mode === 'customer' ? 'c-rest' : 'p-rest').style.display = 'block';
  $(mode === 'customer' ? 'c-hint' : 'p-hint').style.display = 'none';
}

function applyPropertyJson(r) {
  let role = r.role || 'فروشنده';
  let deal = r.deal || 'فروش';
  if (deal === 'رهن' || deal === 'اجاره') deal = 'رهن و اجاره';
  let type = r.propertyType || 'آپارتمان';
  let cat = r.category || inferCategory(type);
  if (!cat || !CATEGORIES[cat]) cat = inferCategory(type) || 'مسکونی';
  if (!HIER.property[role]) role = 'فروشنده';
  if (!HIER.property[role].includes(deal)) deal = HIER.property[role][0];
  if (!CATEGORIES[cat].includes(type)) type = CATEGORIES[cat][0];
  setHierarchy('property', role, deal, cat, type);
  if (r.title) $('p-title').value = r.title;
  else if (type && r.area) $('p-title').value = type + ' ' + r.area + ' متری' + (r.location ? ' در ' + r.location : '');
  if (r.location) $('p-location').value = r.location;
  if (r.address) $('p-address').value = r.address;
  if (r.area) $('p-area').value = r.area;
  if (r.usableArea) $('p-usable-area').value = r.usableArea;
  if (r.rooms) $('p-rooms').value = r.rooms;
  if (r.floor) $('p-floor').value = r.floor;
  if (r.totalFloors) $('p-total-floors').value = r.totalFloors;
  if (r.unitsPerFloor) $('p-units-per-floor').value = r.unitsPerFloor;
  if (r.year) $('p-year').value = r.year;
  if (r.unitPosition) $('p-unit-position').value = r.unitPosition;
  if (r.direction) $('p-direction').value = r.direction;
  if (r.cabin) $('p-cabin').value = r.cabin;
  if (r.floorType) $('p-floor-type').value = r.floorType;
  if (r.extra) $('p-extra').value = r.extra;
  if (r.price) $('p-price').value = r.price;
  if (r.deposit) $('p-deposit').value = r.deposit;
  if (r.rent) $('p-rent').value = r.rent;
  if (r.loan) $('p-loan').value = r.loan;
  if (r.goodwill) $('p-goodwill').value = r.goodwill;
  if (r.features && r.features.length) selectChipsValues('p-features', r.features);
  if (r.ownerName) $('p-owner-name').value = r.ownerName;
  if (r.ownerPhone) $('p-owner-phone').value = r.ownerPhone;
  if (r.ownerPhone2) $('p-owner-phone2').value = r.ownerPhone2;
  if (r.doc) { const s = $('p-doc'); for (let i = 0; i < s.options.length; i++) { if (s.options[i].value === r.doc) { s.selectedIndex = i; break; } } }
  if (r.ownership) { const s = $('p-ownership'); for (let i = 0; i < s.options.length; i++) { if (s.options[i].value === r.ownership) { s.selectedIndex = i; break; } } }
  if (r.note) $('p-note').value = r.note;
  updatePricePerMeter();
  alert('✅ فیلدها پر شد');
}

function applyCustomerJson(r) {
  let role = r.role || 'خریدار';
  if (role === 'فروشنده') role = 'خریدار';
  if (role === 'موجر') role = 'مستأجر';
  if (!HIER.customer[role]) role = 'خریدار';
  let deal = r.deal || '';
  if (deal === 'فروش' || deal === 'خرید') deal = 'خرید';
  if (deal === 'رهن' || deal === 'اجاره') deal = 'رهن و اجاره';
  if (!deal || !HIER.customer[role].includes(deal)) deal = HIER.customer[role][0];
  let type = r.propertyType || 'آپارتمان';
  let cat = r.category || inferCategory(type);
  if (!cat || !CATEGORIES[cat]) cat = inferCategory(type) || 'مسکونی';
  if (!CATEGORIES[cat].includes(type)) type = CATEGORIES[cat][0];
  setHierarchy('customer', role, deal, cat, type);
  if (r.ownerName) $('c-name').value = r.ownerName;
  if (r.location) $('c-location').value = r.location;
  if (r.area) { $('c-area-from').value = r.area; $('c-area-to').value = r.area + 20; }
  if (r.rooms) $('c-rooms').value = r.rooms;
  if (r.price) { $('c-budget-from').value = Math.round(r.price * 0.8); $('c-budget-to').value = r.price; }
  if (r.deposit) $('c-deposit').value = r.deposit;
  if (r.rent) $('c-rent').value = r.rent;
  if (r.ownerPhone) $('c-phone').value = r.ownerPhone;
  if (r.ownerPhone2) $('c-phone2').value = r.ownerPhone2;
  if (r.features && r.features.length) selectChipsValues('c-features', r.features);
  if (r.note) $('c-note').value = r.note;
  alert('✅ فیلدها پر شد');
}
// ═══════════ ابزارها ═══════════
function fmtPrice(p) {
  if (!p) return '';
  const n = parseInt(p);
  if (isNaN(n)) return p;
  if (n >= 1e9) return (n / 1e9).toFixed(1) + ' میلیارد';
  if (n >= 1e6) return Math.floor(n / 1e6) + ' میلیون';
  return n.toLocaleString('fa-IR');
}
function statusLabel(s) {
  const m = { active: '🟢 فعال', reserved: '🟡 رزرو', done: '✅ معامله', canceled: '❌ منصرف' };
  return m[s] || '';
}
function badgeClass(d) {
  if (!d) return 'badge-sell';
  if (d.includes('تجاری')) return 'badge-comm';
  if (d.includes('اداری')) return 'badge-office';
  if (d === 'معاوضه') return 'badge-swap';
  if (d === 'فروش' || d === 'خرید') return 'badge-sell';
  if (d === 'رهن و اجاره') return 'badge-rent';
  return 'badge-sell';
}
function isForSale(d) { return d && (d.includes('فروش') || d.includes('خرید') || d === 'معاوضه'); }
function phoneLink(phone) {
  if (!phone) return '';
  const clean = phone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[^\d+]/g, '');
  return '<a href="tel:' + clean + '" style="color:#2563EB;text-decoration:none;font-weight:700" dir="ltr">' + phone + '</a>';
}

// ═══════════ تطبیق ═══════════
function matchScore(c, p) {
  let score = 0, max = 0;
  const reasons = [];
  if (c.deal && p.deal) {
    max += 30;
    let m = false;
    if (c.deal === 'خرید' && p.deal === 'فروش') m = true;
    else if (c.deal === 'رهن و اجاره' && p.deal === 'رهن و اجاره') m = true;
    else if (c.deal === 'معاوضه' && p.deal === 'معاوضه') m = true;
    else if (c.deal === p.deal) m = true;
    if (m) { score += 30; reasons.push('معامله'); }
  }
  if (c.type && p.type) { max += 20; if (c.type === p.type) { score += 20; reasons.push('نوع ملک'); } }
  if (c.location && p.location) {
    max += 15;
    const cl = normalize(c.location), pl = normalize(p.location);
    if (cl === pl || cl.includes(pl) || pl.includes(cl)) { score += 15; reasons.push('محدوده'); }
  }
  if (p.area) {
    const a = parseInt(p.area);
    const f = parseInt(c.areaFrom) || 0, t = parseInt(c.areaTo) || Infinity;
    if (f || c.areaTo) {
      max += 20;
      if (a >= f && a <= t) { score += 20; reasons.push('متراژ'); }
      else {
        const dF = f ? Math.abs(a - f) / f : 1, dT = t !== Infinity ? Math.abs(a - t) / t : 1;
        if (Math.min(dF, dT) < 0.15) score += 10;
      }
    }
  }
  if (c.rooms && p.rooms) { max += 10; if (String(c.rooms) === String(p.rooms)) { score += 10; reasons.push('خواب'); } }
  if (isForSale(c.deal)) {
    if (p.price && (c.budgetFrom || c.budgetTo)) {
      max += 25;
      const pr = parseInt(p.price), f = parseInt(c.budgetFrom) || 0, t = parseInt(c.budgetTo) || Infinity;
      if (pr >= f && pr <= t) { score += 25; reasons.push('بودجه'); }
    }
  } else {
    if (p.deposit && c.deposit) {
      max += 12;
      const pd = parseInt(p.deposit), cd = parseInt(c.deposit);
      if (cd && Math.abs(pd - cd) / cd < 0.15) { score += 12; reasons.push('ودیعه'); }
    }
    if (p.rent && c.rent) {
      max += 13;
      const pr = parseInt(p.rent), cr = parseInt(c.rent);
      if (cr && Math.abs(pr - cr) / cr < 0.15) { score += 13; reasons.push('اجاره'); }
    }
  }
  if (c.features && c.features.length && p.features && p.features.length) {
    max += 10;
    const co = c.features.filter(f => p.features.includes(f));
    if (co.length) { score += Math.round(co.length / c.features.length * 10); reasons.push('امکانات'); }
  }
  return { score: max ? Math.round(score / max * 100) : 0, reasons: reasons };
}
function findPropertyMatches(c) { return getData('properties').map(p => Object.assign({ item: p }, matchScore(c, p))).filter(m => m.score >= 40).sort((a, b) => b.score - a.score); }
function findCustomerMatches(p) { return getData('customers').map(c => Object.assign({ item: c }, matchScore(c, p))).filter(m => m.score >= 40).sort((a, b) => b.score - a.score); }
function scoreClass(s) { return s >= 75 ? 'score-hi' : s >= 55 ? 'score-md' : 'score-lo'; }

// ═══════════ صف پیامک ═══════════
function getSmsQueue() { return JSON.parse(localStorage.getItem('sms_queue') || '[]'); }
function setSmsQueue(v) { localStorage.setItem('sms_queue', JSON.stringify(v)); }

function addToSmsQueue(customerId, propertyId, score) {
  const queue = getSmsQueue();
  const exists = queue.find(q => q.customerId === customerId && q.propertyId === propertyId);
  if (exists) return;
  const c = getData('customers').find(x => x.id === customerId);
  const p = getData('properties').find(x => x.id === propertyId);
  if (!c || !p) return;
  const text = 'سلام ' + c.name + ' عزیز،\n' +
    'پیرو درخواست شما برای ' + c.deal + ' ' + c.type +
    (c.location ? ' در ' + c.location : '') +
    (c.areaFrom ? ' (' + c.areaFrom + ' تا ' + c.areaTo + ' متر)' : '') +
    '، فایل مناسبی پیدا شد:\n\n' +
    '🏠 ' + p.type + ' ' + (p.area ? p.area + ' متری' : '') +
    (p.location ? ' در ' + p.location : '') + '\n' +
    (isForSale(p.deal)
      ? (p.price ? '💰 قیمت: ' + fmtPrice(p.price) + ' تومان\n' : '')
      : ('💰 ودیعه: ' + (fmtPrice(p.deposit) || '?') + ' تومان\n📆 اجاره: ' + (fmtPrice(p.rent) || '?') + ' تومان\n')) +
    (p.rooms ? '🛏 ' + p.rooms + ' خواب\n' : '') +
    '\nبرای هماهنگی بازدید تماس بگیرید.';
  queue.push({
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    customerId: customerId,
    propertyId: propertyId,
    customerName: c.name,
    propertyTitle: p.title,
    phone: c.phone || c.phone2,
    text: text,
    score: score,
    createdAt: Date.now()
  });
  setSmsQueue(queue);
}

function showSmsQueue() {
  const queue = getSmsQueue();
  let html = '';
  if (!queue.length) {
    html = '<div class="empty"><div class="empty-icon">📭</div>صف پیامک خالیه</div>';
  } else {
    html = '<div style="text-align:center;color:#6B7280;font-size:13px;margin-bottom:16px">' + queue.length + ' پیامک آماده</div>';
    html += queue.map((q, i) =>
      '<div style="background:#fff;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,.04)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<div style="font-weight:700">' + q.customerName + '</div>' +
          '<div style="background:rgba(0,184,148,.12);color:#00A37D;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:800">' + (q.score || 0) + '%</div>' +
        '</div>' +
        '<div style="font-size:12px;color:#6B7280;margin-bottom:8px">فایل: ' + q.propertyTitle + '</div>' +
        '<div class="sms-preview"><textarea id="qsms-' + i + '" style="min-height:140px">' + q.text + '</textarea></div>' +
        '<div class="btn-row" style="margin-top:10px">' +
          '<button class="btn-blue" onclick="sendQueuedSms(\'' + q.id + '\')">📤 ارسال</button>' +
          '<button class="btn-danger" onclick="removeFromQueue(\'' + q.id + '\')">🗑 حذف</button>' +
        '</div>' +
        '<button class="btn-cancel" onclick="editQueueText(\'' + q.id + '\',\'qsms-' + i + '\')" style="margin-top:6px">✏️ ذخیره ویرایش</button>' +
      '</div>'
    ).join('');
  }
  $('sms-queue-body').innerHTML = html;
  openModal('modal-sms-queue');
  render();
}

function sendQueuedSms(id) {
  const queue = getSmsQueue();
  const q = queue.find(x => x.id === id);
  if (!q) return;
  if (!q.phone) { alert('شماره موجود نیست'); return; }
  const phone = q.phone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  window.location.href = 'sms:' + phone + '?body=' + encodeURIComponent(q.text);
}
function removeFromQueue(id) {
  if (!confirm('حذف بشه؟')) return;
  setSmsQueue(getSmsQueue().filter(x => x.id !== id));
  showSmsQueue();
}
function editQueueText(id, elemId) {
  const queue = getSmsQueue();
  const q = queue.find(x => x.id === id);
  if (!q) return;
  q.text = $(elemId).value;
  setSmsQueue(queue);
  alert('✅ ذخیره شد');
}

// ═══════════ پیگیری‌ها ═══════════
function showFollowups() {
  const customers = getData('customers');
  const today = todayJalali();
  const due = customers.filter(c => c.nextDate && c.nextDate <= today && c.status !== 'done' && c.status !== 'lost');
  const upcoming = customers.filter(c => c.nextDate && c.nextDate > today && c.status !== 'done' && c.status !== 'lost');
  let html = '';
  if (!due.length && !upcoming.length) {
    html = '<div class="empty"><div class="empty-icon">🎉</div>پیگیری خاصی نداری</div>';
  } else {
    if (due.length) {
      html += '<div class="section-title">🔴 سررسید شده (' + due.length + ')</div>';
      html += due.map(c => customerFollowRow(c, 'due')).join('');
    }
    if (upcoming.length) {
      html += '<div class="section-title">🟡 در پیش (' + upcoming.length + ')</div>';
      html += upcoming.map(c => customerFollowRow(c, 'up')).join('');
    }
  }
  $('followups-body').innerHTML = html;
  openModal('modal-followups');
}
function customerFollowRow(c, type) {
  return '<div class="card" style="border-right:4px solid ' + (type === 'due' ? '#DC2626' : '#F59E0B') + '" onclick="closeModal(\'modal-followups\');showCustomerDetail(\'' + c.id + '\')">' +
    '<div class="card-header"><div class="card-title">' + (c.role ? c.role + ' • ' : '') + c.name + '</div></div>' +
    (c.location ? '<div class="card-sub">📍 ' + c.location + ' • ' + (c.type || '') + '</div>' : '') +
    (c.phone ? '<div class="card-sub">📞 ' + phoneLink(c.phone) + '</div>' : '') +
    '<div class="card-sub" style="margin-top:6px;color:' + (type === 'due' ? '#DC2626' : '#F59E0B') + ';font-weight:700">📅 ' + c.nextDate + '</div>' +
    '</div>';
}

// ═══════════ پشتیبان‌گیری ═══════════
function backupNow() {
  const data = {
    version: 1,
    date: new Date().toISOString(),
    dateJalali: todayJalali(),
    customers: getData('customers'),
    properties: getData('properties'),
    smsQueue: getSmsQueue(),
    lastBackup: Date.now()
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ayandeh-backup-' + todayKey() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  localStorage.setItem('lastBackup', Date.now().toString());
  alert('✅ فایل پشتیبان دانلود شد\nآنجا امن نگه‌دار.');
  render();
}

function restoreBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!confirm('همه‌ی داده‌های فعلی جایگزین می‌شن. مطمئنی؟')) return;
        if (data.customers) setData('customers', data.customers);
        if (data.properties) setData('properties', data.properties);
        if (data.smsQueue) setSmsQueue(data.smsQueue);
        alert('✅ بازیابی شد');
        render();
      } catch(err) {
        alert('❌ فایل خرابه');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function checkWeeklyBackup() {
  const last = parseInt(localStorage.getItem('lastBackup') || '0');
  const week = 7 * 24 * 60 * 60 * 1000;
  const diff = Date.now() - last;
  const info = $('backup-info');
  if (!info) return;
  if (!last || diff > week) {
    info.style.display = 'block';
    info.style.background = 'rgba(245,158,11,.1)';
    info.style.color = '#D97706';
    info.style.borderRadius = '16px';
    info.style.padding = '16px';
    info.style.marginBottom = '20px';
    info.style.fontSize = '14px';
    info.style.fontWeight = '700';
    info.style.cursor = 'pointer';
    info.style.textAlign = 'center';
    info.onclick = backupNow;
    if (!last) info.innerHTML = '💾 هنوز پشتیبان نگرفتی<br><span style="font-weight:500;font-size:12px">همین الان بزن یه نسخه بگیر</span>';
    else info.innerHTML = '⏰ یه هفته از آخرین پشتیبان گذشته<br><span style="font-weight:500;font-size:12px">الان بزن یه نسخه بگیر</span>';
  } else {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    info.style.display = 'block';
    info.style.background = 'rgba(0,184,148,.08)';
    info.style.color = '#00A37D';
    info.style.borderRadius = '16px';
    info.style.padding = '12px';
    info.style.marginBottom = '20px';
    info.style.fontSize = '13px';
    info.style.textAlign = 'center';
    info.style.cursor = 'pointer';
    info.onclick = backupNow;
    info.innerHTML = '✅ آخرین پشتیبان: ' + (days === 0 ? 'امروز' : days + ' روز پیش');
  }
}

// ═══════════ مشتری ═══════════
let custFilter = 'all';
function setCustFilter(f, btn) {
  custFilter = f;
  document.querySelectorAll('#cust-filter .filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCustomers();
}

function openCustomerModal(editId) {
  ['c-id','c-name','c-phone','c-phone2','c-location','c-area-from','c-area-to','c-rooms','c-floor','c-year-from','c-budget-from','c-budget-to','c-deposit','c-rent','c-next-date','c-note'].forEach(id => { if ($(id)) $(id).value = ''; });
  state.customer = { role: '', deal: '', cat: '', type: '' };
  document.querySelectorAll('#c-role-chips .chip').forEach(c => c.classList.remove('selected'));
  $('c-deal-step').style.display = 'none';
  $('c-cat-step').style.display = 'none';
  $('c-type-step').style.display = 'none';
  $('c-rest').style.display = 'none';
  $('c-hint').style.display = 'block';
  $('c-hint').textContent = '👆 اول نقش خودت رو انتخاب کن';
  $('c-date').value = todayJalali();
  clearChips('c-features');
  currentPhotos.customer = [];
  $('cust-modal-title').textContent = 'مشتری جدید';

  if (editId) {
    const c = getData('customers').find(x => x.id === editId);
    if (c) {
      $('cust-modal-title').textContent = 'ویرایش';
      $('c-id').value = c.id;
      const map = { name: 'c-name', phone: 'c-phone', phone2: 'c-phone2', location: 'c-location', areaFrom: 'c-area-from', areaTo: 'c-area-to', rooms: 'c-rooms', floor: 'c-floor', yearFrom: 'c-year-from', budgetFrom: 'c-budget-from', budgetTo: 'c-budget-to', deposit: 'c-deposit', rent: 'c-rent', nextDate: 'c-next-date', note: 'c-note', date: 'c-date' };
      Object.keys(map).forEach(k => { if ($(map[k])) $(map[k]).value = c[k] || ''; });
      selectChipsValues('c-features', c.features || []);
      const role = c.role || 'خریدار';
      const deal = c.deal || (HIER.customer[role] ? HIER.customer[role][0] : 'خرید');
      const type = c.type || 'آپارتمان';
      const cat = c.category || inferCategory(type) || 'مسکونی';
      setHierarchy('customer', role, deal, cat, type);
    }
  }
  renderPhotoGrid('customer');
  openModal('modal-customer');
}

function saveCustomer() {
  const name = $('c-name').value.trim();
  if (!name) { alert('نام رو وارد کن'); return; }
  if (!state.customer.role) { alert('نقش رو انتخاب کن'); return; }
  const id = $('c-id').value || Date.now().toString();
  const cust = {
    id: id,
    name: name,
    role: state.customer.role,
    category: state.customer.cat,
    phone: $('c-phone').value.trim(),
    phone2: $('c-phone2').value.trim(),
    deal: state.customer.deal,
    type: state.customer.type,
    location: $('c-location').value.trim(),
    areaFrom: $('c-area-from').value,
    areaTo: $('c-area-to').value,
    rooms: $('c-rooms').value,
    floor: $('c-floor').value.trim(),
    yearFrom: $('c-year-from').value,
    budgetFrom: $('c-budget-from').value,
    budgetTo: $('c-budget-to').value,
    deposit: $('c-deposit').value,
    rent: $('c-rent').value,
    features: getChipsValues('c-features'),
    date: $('c-date').value || todayJalali(),
    nextDate: $('c-next-date').value.trim(),
    note: $('c-note').value.trim(),
    photos: currentPhotos.customer || []
  };
  const list = getData('customers');
  const idx = list.findIndex(x => x.id === id);
  if (idx >= 0) list[idx] = cust;
  else list.unshift(cust);
  setData('customers', list);
  closeModal('modal-customer');
  render();
  const matches = findPropertyMatches(cust);
  if (matches.length) {
    matches.forEach(m => addToSmsQueue(cust.id, m.item.id, m.score));
    setTimeout(() => {
      if (confirm('🎯 ' + matches.length + ' فایل مناسب پیدا شد!\nبه صف پیامک اضافه شد.\nمی‌خوای ببینیشون؟')) {
        showSmsQueue();
      }
    }, 300);
  }
}

function renderCustomers() {
  const q = normalize($('search-customers').value || '');
  let list = getData('customers');
  if (custFilter !== 'all') list = list.filter(c => c.role === custFilter);
  if (q) list = list.filter(c => normalize(Object.values(c).filter(v => typeof v === 'string').join(' ')).includes(q));
  const el = $('customers-list');
  if (!list.length) { el.innerHTML = '<div class="empty"><div class="empty-icon">👥</div>موردی یافت نشد</div>'; return; }
  el.innerHTML = list.map(c => {
    const b = (c.budgetFrom || c.budgetTo) ? '💰 ' + (fmtPrice(c.budgetFrom) || '?') + ' - ' + (fmtPrice(c.budgetTo) || '?') + ' تومان' : '';
    const a = (c.areaFrom || c.areaTo) ? '📐 ' + (c.areaFrom || '?') + ' - ' + (c.areaTo || '?') + ' متر' : '';
    const mc = findPropertyMatches(c).length;
    return '<div class="card" onclick="showCustomerDetail(\'' + c.id + '\')">' +
      '<div class="card-header"><div class="card-title">' + (c.role ? c.role + ' • ' : '') + c.name + '</div><span class="badge ' + badgeClass(c.deal) + '">' + (c.deal || '') + '</span></div>' +
      (c.phone ? '<div class="card-sub">📞 ' + phoneLink(c.phone) + '</div>' : '') +
      (c.location ? '<div class="card-sub">📍 ' + c.location + ' • ' + (c.type || '') + '</div>' : '') +
      (a ? '<div class="card-sub">' + a + '</div>' : '') +
      (b ? '<div class="card-price">' + b + '</div>' : '') +
      (c.nextDate ? '<div class="card-sub" style="margin-top:8px;color:#D97706;font-weight:700">📅 ' + c.nextDate + '</div>' : '') +
      (mc ? '<div style="margin-top:10px;background:rgba(0,184,148,.1);color:#00A37D;padding:8px 12px;border-radius:12px;font-size:12px;font-weight:700;text-align:center">🎯 ' + mc + ' فایل مناسب</div>' : '') +
      '</div>';
  }).join('');
}

function showCustomerDetail(id) {
  const c = getData('customers').find(x => x.id === id);
  if (!c) return;
  const mc = findPropertyMatches(c).length;
  const rows = [
    ['نقش', c.role], ['دسته', c.category], ['نام', c.name],
    ['تماس ۱', c.phone ? phoneLink(c.phone) : ''],
    ['تماس ۲', c.phone2 ? phoneLink(c.phone2) : ''],
    ['— درخواست —', ''],
    ['معامله', c.deal], ['نوع ملک', c.type], ['محدوده', c.location],
    ['متراژ', (c.areaFrom || c.areaTo) ? (c.areaFrom || '?') + ' تا ' + (c.areaTo || '?') + ' متر' : ''],
    ['خواب', c.rooms], ['طبقه', c.floor],
    ['— بودجه —', ''],
    ['بودجه', (c.budgetFrom || c.budgetTo) ? (fmtPrice(c.budgetFrom) || '?') + ' - ' + (fmtPrice(c.budgetTo) || '?') + ' تومان' : ''],
    ['ودیعه', fmtPrice(c.deposit)], ['اجاره', fmtPrice(c.rent)],
    ['— پیگیری —', ''],
    ['امکانات', (c.features || []).join(' • ')],
    ['تاریخ ثبت', c.date], ['پیگیری بعدی', c.nextDate], ['یادداشت', c.note]
  ].filter(r => r[1] !== undefined && r[1] !== '');
  $('detail-body').innerHTML = rows.map(r =>
    r[1] === '' ? '<div class="section-title" style="margin:20px 0 10px">' + r[0] + '</div>' : '<div class="detail-row"><span class="detail-label">' + r[0] + '</span><span class="detail-value">' + r[1] + '</span></div>'
  ).join('') +
    (c.phone ? '<div class="btn-row" style="margin-top:16px"><a class="btn-blue" style="text-decoration:none;text-align:center;padding:14px;border-radius:16px;font-weight:700;display:block" href="tel:' + c.phone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)) + '">📞 تماس</a><button class="btn-blue" onclick="openSmsModal(\'customer\',\'' + c.id + '\')">💬 پیامک</button></div>' : '') +
    (mc ? '<button class="btn-green" onclick="closeModal(\'modal-detail\');showMatchesForCustomer(\'' + c.id + '\')">🎯 نمایش ' + mc + ' فایل مناسب</button>' : '') +
    '<button class="btn-primary" onclick="closeModal(\'modal-detail\');openCustomerModal(\'' + c.id + '\')">✏️ ویرایش</button>' +
    '<button class="btn-danger" onclick="deleteCustomer(\'' + c.id + '\')">🗑 حذف</button>';
  openModal('modal-detail');
}

function deleteCustomer(id) {
  if (!confirm('مطمئنی؟')) return;
  setData('customers', getData('customers').filter(x => x.id !== id));
  closeModal('modal-detail');
  render();
}

// ═══════════ فایل ═══════════
let propFilter = 'all';
function setPropFilter(f, btn) {
  propFilter = f;
  document.querySelectorAll('#prop-filter .filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProperties();
}

function openPropertyModal(editId) {
  const ids = ['p-id','p-title','p-code','p-location','p-address','p-plate','p-area','p-usable-area','p-rooms','p-floor','p-total-floors','p-units-per-floor','p-year','p-age','p-price','p-price-per-meter','p-deposit','p-rent','p-prepayment','p-loan','p-goodwill','p-owner-name','p-owner-phone','p-owner-phone2','p-doc-number','p-extra','p-note'];
  ids.forEach(id => { if ($(id)) $(id).value = ''; });
  state.property = { role: '', deal: '', cat: '', type: '' };
  document.querySelectorAll('#p-role-chips .chip').forEach(c => c.classList.remove('selected'));
  $('p-deal-step').style.display = 'none';
  $('p-cat-step').style.display = 'none';
  $('p-type-step').style.display = 'none';
  $('p-rest').style.display = 'none';
  $('p-hint').style.display = 'block';
  $('p-hint').textContent = '👆 اول نقش خودت رو انتخاب کن';
  $('p-direction').value = '';
  $('p-unit-position').value = '';
  $('p-doc').value = '';
  $('p-ownership').value = '';
  $('p-status').value = 'active';
  $('p-cabin').value = '';
  $('p-floor-type').value = '';
  $('p-date').value = todayJalali();
  clearChips('p-features');
  currentPhotos.property = [];
  currentLocation = null;
  $('p-location-status').textContent = 'لوکیشن ثبت نشده';
  $('prop-modal-title').textContent = 'فایل جدید';

  if (editId) {
    const p = getData('properties').find(x => x.id === editId);
    if (p) {
      $('prop-modal-title').textContent = 'ویرایش';
      $('p-id').value = p.id;
      const map = { title: 'p-title', code: 'p-code', location: 'p-location', address: 'p-address', plate: 'p-plate', area: 'p-area', usableArea: 'p-usable-area', rooms: 'p-rooms', floor: 'p-floor', totalFloors: 'p-total-floors', unitsPerFloor: 'p-units-per-floor', year: 'p-year', age: 'p-age', price: 'p-price', deposit: 'p-deposit', rent: 'p-rent', prepayment: 'p-prepayment', loan: 'p-loan', goodwill: 'p-goodwill', ownerName: 'p-owner-name', ownerPhone: 'p-owner-phone', ownerPhone2: 'p-owner-phone2', ownership: 'p-ownership', doc: 'p-doc', docNumber: 'p-doc-number', status: 'p-status', date: 'p-date', note: 'p-note', cabin: 'p-cabin', floorType: 'p-floor-type', extra: 'p-extra', unitPosition: 'p-unit-position', direction: 'p-direction' };
      Object.keys(map).forEach(k => { if ($(map[k]) && p[k] !== undefined) $(map[k]).value = p[k] || ''; });
      selectChipsValues('p-features', p.features || []);
      currentPhotos.property = p.photos ? p.photos.slice() : [];
      if (p.locationCoord) {
        currentLocation = p.locationCoord;
        const link = 'https://maps.google.com/?q=' + currentLocation.lat + ',' + currentLocation.lng;
        $('p-location-status').innerHTML = '✅ ثبت شده • <a href="' + link + '" target="_blank" style="color:#2563EB;font-weight:700">مشاهده</a>';
      }
      const role = p.role || 'فروشنده';
      const deal = p.deal || (HIER.property[role] ? HIER.property[role][0] : 'فروش');
      const type = p.type || 'آپارتمان';
      const cat = p.category || inferCategory(type) || 'مسکونی';
      setHierarchy('property', role, deal, cat, type);
      updatePricePerMeter();
    }
  }
  renderPhotoGrid('property');
  openModal('modal-property');
}

function updatePricePerMeter() {
  const p = parseInt($('p-price').value) || 0;
  const a = parseInt($('p-area').value) || 0;
  $('p-price-per-meter').value = (p && a) ? fmtPrice(Math.round(p / a)) + ' تومان' : '';
}

function saveProperty() {
  const title = $('p-title').value.trim();
  if (!title) { alert('عنوان رو وارد کن'); return; }
  if (!state.property.role) { alert('نقش رو انتخاب کن'); return; }
  const id = $('p-id').value || Date.now().toString();
  const prop = {
    id: id, title: title,
    code: $('p-code').value.trim(),
    role: state.property.role,
    category: state.property.cat,
    type: state.property.type,
    deal: state.property.deal,
    location: $('p-location').value.trim(),
    address: $('p-address').value.trim(),
    plate: $('p-plate').value.trim(),
    area: $('p-area').value,
    usableArea: $('p-usable-area').value,
    rooms: $('p-rooms').value,
    floor: $('p-floor').value,
    totalFloors: $('p-total-floors').value,
    unitsPerFloor: $('p-units-per-floor').value,
    unitPosition: $('p-unit-position').value,
    year: $('p-year').value,
    age: $('p-age').value,
    direction: $('p-direction').value,
    cabin: $('p-cabin').value,
    floorType: $('p-floor-type').value,
    extra: $('p-extra').value.trim(),
    price: $('p-price').value,
    deposit: $('p-deposit').value,
    rent: $('p-rent').value,
    prepayment: $('p-prepayment').value,
    loan: $('p-loan').value,
    goodwill: $('p-goodwill').value,
    features: getChipsValues('p-features'),
    ownerName: $('p-owner-name').value.trim(),
    ownerPhone: $('p-owner-phone').value.trim(),
    ownerPhone2: $('p-owner-phone2').value.trim(),
    ownership: $('p-ownership').value,
    doc: $('p-doc').value,
    docNumber: $('p-doc-number').value.trim(),
    status: $('p-status').value,
    date: $('p-date').value || todayJalali(),
    note: $('p-note').value.trim(),
    photos: currentPhotos.property || [],
    locationCoord: currentLocation
  };
  const list = getData('properties');
  const idx = list.findIndex(x => x.id === id);
  if (idx >= 0) list[idx] = prop;
  else list.unshift(prop);
  setData('properties', list);
  closeModal('modal-property');
  render();
  const matches = findCustomerMatches(prop);
  if (matches.length) {
    matches.forEach(m => addToSmsQueue(m.item.id, prop.id, m.score));
    setTimeout(() => {
      if (confirm('🎯 ' + matches.length + ' مشتری مناسب پیدا شد!\nبه صف پیامک اضافه شد.\nمی‌خوای ببینیشون؟')) {
        showSmsQueue();
      }
    }, 300);
  }
}

function renderProperties() {
  const q = normalize($('search-properties').value || '');
  let list = getData('properties');
  if (propFilter !== 'all') list = list.filter(p => p.role === propFilter);
  if (q) list = list.filter(p => normalize(Object.values(p).filter(v => typeof v === 'string').join(' ')).includes(q));
  const el = $('properties-list');
  if (!list.length) { el.innerHTML = '<div class="empty"><div class="empty-icon">🏘️</div>موردی یافت نشد</div>'; return; }
  el.innerHTML = list.map(p => {
    const cls = badgeClass(p.deal);
    const pt = isForSale(p.deal) ? (p.price ? fmtPrice(p.price) + ' تومان' : '') : ('ودیعه: ' + (fmtPrice(p.deposit) || '?') + ' • اجاره: ' + (fmtPrice(p.rent) || '?'));
    const mc = findCustomerMatches(p).length;
    let icon = '';
    if (p.category === 'تجاری') icon = '🏢 ';
    else if (p.category === 'اداری') icon = '💼 ';
    else if (p.category === 'زمین') icon = '🌍 ';
    else if (p.category === 'باغ و ویلا') icon = '🌳 ';
    const t = p.photos && p.photos[0] ? '<img class="card-thumb" src="' + p.photos[0] + '">' : '';
    return '<div class="card" onclick="showPropertyDetail(\'' + p.id + '\')">' + t +
      '<div class="card-header"><div class="card-title">' + icon + p.title + (p.code ? '<span style="color:#9CA3AF;font-size:12px">(' + p.code + ')</span>' : '') + '</div><span class="badge ' + cls + '">' + p.deal + '</span></div>' +
      (p.location ? '<div class="card-sub">📍 ' + p.location + '</div>' : '') +
      '<div class="card-sub">' + (p.area ? p.area + ' متر' : '') + ' ' + (p.rooms ? '• ' + p.rooms + ' خواب' : '') + ' ' + (p.floor ? '• طبقه ' + p.floor + (p.totalFloors ? '/' + p.totalFloors : '') : '') + '</div>' +
      (pt ? '<div class="card-price">' + pt + '</div>' : '') +
      '<div class="card-sub" style="margin-top:10px;color:#6C5CE7;font-weight:700">' + statusLabel(p.status) + ' • 📅 ' + (p.date || '') + '</div>' +
      (mc ? '<div style="margin-top:10px;background:rgba(0,184,148,.1);color:#00A37D;padding:8px 12px;border-radius:12px;font-size:12px;font-weight:700;text-align:center">🎯 ' + mc + ' مشتری مناسب</div>' : '') +
      '</div>';
  }).join('');
}

function showPropertyDetail(id) {
  const p = getData('properties').find(x => x.id === id);
  if (!p) return;
  const mc = findCustomerMatches(p).length;
  const rows = [
    ['عنوان', p.title], ['کد', p.code], ['نقش', p.role], ['دسته', p.category], ['نوع', p.type], ['معامله', p.deal],
    ['— موقعیت —', ''],
    ['محدوده', p.location], ['آدرس', p.address], ['پلاک', p.plate],
    ['— مشخصات —', ''],
    ['متراژ', p.area ? p.area + ' متر' : ''], ['مفید', p.usableArea ? p.usableArea + ' متر' : ''],
    ['خواب', p.rooms], ['طبقه', p.floor ? 'طبقه ' + p.floor + (p.totalFloors ? ' از ' + p.totalFloors : '') : ''],
    ['موقعیت', p.unitPosition], ['سال ساخت', p.year], ['جهت', p.direction],
    ['نوع کابین', p.cabin], ['نوع کف', p.floorType], ['سایر مشخصات', p.extra],
    ['— قیمت —', ''],
    ['قیمت کل', p.price ? fmtPrice(p.price) + ' تومان' : ''],
    ['هر متر', (p.price && p.area) ? fmtPrice(Math.round(p.price / p.area)) + ' تومان' : ''],
    ['ودیعه', fmtPrice(p.deposit)], ['اجاره', fmtPrice(p.rent)],
    ['وام', fmtPrice(p.loan)], ['سرقفلی', fmtPrice(p.goodwill)],
    ['— امکانات —', ''],
    ['امکانات', (p.features || []).join(' • ')],
    ['— مالک —', ''],
    ['نام مالک', p.ownerName],
    ['تماس ۱', p.ownerPhone ? phoneLink(p.ownerPhone) : ''],
    ['تماس ۲', p.ownerPhone2 ? phoneLink(p.ownerPhone2) : ''],
    ['— سند —', ''],
    ['مالکیت', p.ownership], ['نوع سند', p.doc], ['شماره سند', p.docNumber],
    ['— وضعیت —', ''],
    ['وضعیت', statusLabel(p.status)], ['تاریخ', p.date], ['توضیحات', p.note]
  ].filter(r => r[1] !== undefined && r[1] !== '');
  let lh = '';
  if (p.locationCoord) {
    const link = 'https://maps.google.com/?q=' + p.locationCoord.lat + ',' + p.locationCoord.lng;
    lh = '<div class="location-box">📍 <b>موقعیت</b><br><a href="' + link + '" target="_blank">مشاهده روی نقشه</a></div>';
  }
  let ph = '';
  if (p.photos && p.photos.length) ph = '<div class="section-title">📸 عکس‌ها</div><div class="photo-grid">' + p.photos.map(pc => '<div class="photo-item"><img src="' + pc + '" onclick="window.open(\'' + pc + '\')"></div>').join('') + '</div>';
  $('detail-body').innerHTML = rows.map(r =>
    r[1] === '' ? '<div class="section-title" style="margin:20px 0 10px">' + r[0] + '</div>' : '<div class="detail-row"><span class="detail-label">' + r[0] + '</span><span class="detail-value">' + r[1] + '</span></div>'
  ).join('') + lh + ph +
    '<div class="section-title" style="margin-top:24px">عملیات</div>' +
    ((p.ownerPhone || p.ownerPhone2) ? '<div class="btn-row"><a class="btn-blue" style="text-decoration:none;text-align:center;padding:14px;border-radius:16px;font-weight:700;display:block" href="tel:' + p.ownerPhone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)) + '">📞 تماس</a><button class="btn-blue" onclick="openSmsModal(\'property\',\'' + p.id + '\')">💬 پیامک</button></div>' : '') +
    '<button class="btn-red" onclick="closeModal(\'modal-detail\');openDivarModal(\'' + p.id + '\')">🏠 ثبت در دیوار</button>' +
    (mc ? '<button class="btn-green" onclick="closeModal(\'modal-detail\');showMatchesForProperty(\'' + p.id + '\')">🎯 نمایش ' + mc + ' مشتری مناسب</button>' : '') +
    '<button class="btn-primary" onclick="closeModal(\'modal-detail\');openPropertyModal(\'' + p.id + '\')">✏️ ویرایش</button>' +
    '<button class="btn-danger" onclick="deleteProperty(\'' + p.id + '\')">🗑 حذف</button>';
  openModal('modal-detail');
}

function deleteProperty(id) {
  if (!confirm('مطمئنی؟')) return;
  setData('properties', getData('properties').filter(x => x.id !== id));
  closeModal('modal-detail');
  render();
}

// ═══════════ تطبیق‌ها ═══════════
function renderMatches(title, sub, matches, type) {
  let html = '<div class="match-header"><div class="match-icon">🎯</div><div style="font-weight:800;font-size:18px">' + title + '</div><div class="match-sub">' + sub + '</div></div>';
  if (!matches.length) html += '<div class="empty"><div class="empty-icon">🔍</div>تطبیقی پیدا نشد</div>';
  else html += matches.map(m => {
    const it = m.item;
    const tt = it.title || it.name;
    const sb = type === 'property'
      ? ((it.location || '') + ' • ' + (it.area ? it.area + ' متر' : '') + ' • ' + (it.type || ''))
      : ((it.phone || '') + ' • ' + (it.location || '') + ' • ' + (it.type || ''));
    const pr = type === 'property'
      ? (isForSale(it.deal) ? (it.price ? fmtPrice(it.price) + ' تومان' : '') : ('ودیعه: ' + (fmtPrice(it.deposit) || '?') + ' • اجاره: ' + (fmtPrice(it.rent) || '?')))
      : '';
    const rT = m.reasons.map(r => '<span class="reason-tag">✓ ' + r + '</span>').join('');
    const oc = type === 'property'
      ? 'onclick="closeModal(\'modal-matches\');showPropertyDetail(\'' + it.id + '\')"'
      : 'onclick="closeModal(\'modal-matches\');showCustomerDetail(\'' + it.id + '\')"';
    return '<div class="match-card" ' + oc + '><div class="match-score ' + scoreClass(m.score) + '">' + m.score + '%</div><div style="font-weight:700;font-size:15px;margin-bottom:6px;padding-left:50px">' + tt + '</div><div style="font-size:13px;color:#6B7280">' + sb + '</div>' + (pr ? '<div style="font-size:14px;color:#00A37D;font-weight:700;margin-top:8px">' + pr + '</div>' : '') + '<div class="match-reasons">' + rT + '</div></div>';
  }).join('');
  $('matches-body').innerHTML = html;
  openModal('modal-matches');
}

function showMatchesForCustomer(id) {
  const c = getData('customers').find(x => x.id === id);
  if (!c) return;
  const m = findPropertyMatches(c);
  renderMatches('تطبیق برای: ' + c.name, m.length + ' فایل مناسب', m, 'property');
}

function showMatchesForProperty(id) {
  const p = getData('properties').find(x => x.id === id);
  if (!p) return;
  const m = findCustomerMatches(p);
  renderMatches('تطبیق برای: ' + p.title, m.length + ' مشتری مناسب', m, 'customer');
}

// ═══════════ پیامک تکی ═══════════
function openSmsModal(type, id) {
  let name, phone, body;
  if (type === 'customer') {
    const c = getData('customers').find(x => x.id === id);
    if (!c) return;
    name = c.name;
    phone = c.phone || c.phone2;
    body = 'سلام ' + c.name + ' عزیز،\nپیرو درخواست شما برای ' + c.deal + ' ' + c.type + (c.location ? ' در ' + c.location : '') + '، خبرهای خوبی داریم. لطفاً تماس بگیرید.';
  } else {
    const p = getData('properties').find(x => x.id === id);
    if (!p) return;
    name = p.ownerName || '';
    phone = p.ownerPhone || p.ownerPhone2;
    body = 'سلام ' + name + ' عزیز،\nپیرو فایل ' + p.deal + ' ' + p.type + ' شما در ' + (p.location || '') + '، مشتری مناسبی داریم. لطفاً تماس بگیرید.';
  }
  if (!phone) { alert('شماره موجود نیست'); return; }
  const cleanPhone = phone.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  $('sms-body').innerHTML =
    '<div style="font-size:14px;color:#6B7280;margin-bottom:8px">گیرنده: <b>' + name + '</b></div>' +
    '<div style="font-size:14px;color:#6B7280;margin-bottom:16px">شماره: <b dir="ltr">' + phone + '</b></div>' +
    '<div class="section-title">متن پیامک</div>' +
    '<div class="sms-preview"><textarea id="sms-text">' + body + '</textarea></div>' +
    '<button class="btn-primary" onclick="sendSms(\'' + cleanPhone + '\')">📤 ارسال</button>' +
    '<button class="btn-cancel" onclick="closeModal(\'modal-sms\')">انصراف</button>';
  openModal('modal-sms');
}

function sendSms(phone) {
  const text = $('sms-text').value.trim();
  window.location.href = 'sms:' + phone + '?body=' + encodeURIComponent(text);
  setTimeout(() => closeModal('modal-sms'), 500);
}

// ═══════════ دیوار ═══════════
function openDivarModal(id) {
  const p = getData('properties').find(x => x.id === id);
  if (!p) return;
  const lines = [];
  lines.push('🏠 ' + p.deal + ' ' + p.type);
  if (p.area) lines.push('📐 متراژ: ' + p.area + ' متر');
  if (p.rooms) lines.push('🛏 خواب: ' + p.rooms);
  if (p.floor) lines.push('🏢 طبقه ' + p.floor + (p.totalFloors ? ' از ' + p.totalFloors : ''));
  if (p.year) lines.push('📅 سال ساخت: ' + p.year);
  if (p.cabin && p.cabin !== 'ندارد / نامشخص' && p.cabin !== 'ندارد') lines.push('🚗 کابین: ' + p.cabin);
  if (p.floorType) lines.push('🧱 کف: ' + p.floorType);
  if (p.extra) lines.push('📝 ' + p.extra);
  if (p.features && p.features.length) lines.push('✨ امکانات: ' + p.features.join(' • '));
  if (p.location) lines.push('📍 محدوده: ' + p.location);
  if (isForSale(p.deal)) {
    if (p.price) lines.push('💰 قیمت: ' + fmtPrice(p.price) + ' تومان');
    if (p.price && p.area) lines.push('📊 هر متر: ' + fmtPrice(Math.round(p.price / p.area)) + ' تومان');
  } else {
    if (p.deposit) lines.push('💰 ودیعه: ' + fmtPrice(p.deposit) + ' تومان');
    if (p.rent) lines.push('📆 اجاره: ' + fmtPrice(p.rent) + ' تومان');
  }
  const adText = lines.join('\n');
  $('divar-body').innerHTML =
    '<div style="background:rgba(239,68,68,.08);border-radius:14px;padding:14px;margin-bottom:16px;font-size:13px;color:#DC2626;font-weight:700">⚠️ نام مالک و آدرس دقیق حذف شده.</div>' +
    '<div class="section-title">📝 متن آگهی</div>' +
    '<div class="divar-box"><textarea id="divar-text">' + adText + '</textarea></div>' +
    '<button class="btn-primary" onclick="copyDivarText()">📋 کپی</button>' +
    '<button class="btn-orange" onclick="window.open(\'https://divar.ir/s/tehran\',\'_blank\')" style="margin-top:10px">🏠 باز کردن دیوار</button>' +
    '<button class="btn-cancel" onclick="closeModal(\'modal-divar\')">بستن</button>';
  openModal('modal-divar');
}

function copyDivarText() {
  const el = $('divar-text');
  el.select();
  el.setSelectionRange(0, 99999);
  try { document.execCommand('copy'); alert('✅ کپی شد'); } catch(e) { alert('کپی نشد'); }
}

// ═══════════ رندر اصلی ═══════════
function render() {
  const c = getData('customers');
  const p = getData('properties');
  $('stat-customers').textContent = c.length.toLocaleString('fa-IR');
  $('stat-properties').textContent = p.length.toLocaleString('fa-IR');
  const today = todayJalali();
  const followCount = c.filter(x => x.nextDate && x.nextDate <= today && x.status !== 'done' && x.status !== 'lost').length;
  $('stat-followups').textContent = followCount.toLocaleString('fa-IR');
  $('stat-sms').textContent = getSmsQueue().length.toLocaleString('fa-IR');
  let tm = 0;
  c.forEach(x => { tm += findPropertyMatches(x).length; });
  let sug = 'با ثبت مشتری و فایل، پیشنهادهای هوشمند اینجا نمایش داده می‌شود.';
  if (c.length && p.length) {
    if (tm) sug = '🎯 ' + tm + ' تطبیق بین مشتری‌ها و فایل‌های شما پیدا شد!';
    else sug = c.length + ' مشتری و ' + p.length + ' فایل فعال داری، ولی تطبیقی پیدا نشد.';
  }
  $('suggest-text').textContent = sug;
  renderCustomers();
  renderProperties();
  checkWeeklyBackup();
}
// ═══════════ ارسال به تلگرام ═══════════
const TG_TOKEN = '8652184822:AAGScp19P9v5s7nTyNW1U-eZbTdf51RD68c';
const TG_CHAT = '783877843';

async function sendToTelegram() {
  const data = {
    version: 1,
    date: new Date().toISOString(),
    dateJalali: todayJalali(),
    customers: getData('customers'),
    properties: getData('properties'),
    smsQueue: getSmsQueue()
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = 'ayandeh-backup-' + todayKey() + '.json';
  const form = new FormData();
  form.append('chat_id', TG_CHAT);
  form.append('document', blob, fileName);
  form.append('caption', 'پشتیبان آینده‌ساز - ' + todayJalali() + ' - مشتری: ' + data.customers.length + ' فایل: ' + data.properties.length);
  try {
    const res = await fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendDocument', { method: 'POST', body: form });
    if (!res.ok) throw new Error('خطا: ' + res.status);
    localStorage.setItem('lastBackup', Date.now().toString());
    alert('✅ پشتیبان به تلگرام ارسال شد!');
    render();
  } catch(err) {
    alert('❌ ' + err.message + '\n\nمطمئن شو توی تلگرام چت ربات رو Start کردی.');
  }
}

document.addEventListener('input', e => {
  if (e.target.id === 'p-price' || e.target.id === 'p-area') updatePricePerMeter();
});

render();
