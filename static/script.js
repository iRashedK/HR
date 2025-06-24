const texts = {
  ar: {
    title: 'رشُد',
    subtitle: 'منصة الذكاء الاصطناعي لإرشاد الموظفين نحو التطور المهني',
    uploadBtn: 'رفع',
    langButton: 'English',
    dark: '🌙',
    light: '☀️',
    visit: 'زيارة الرابط',
    download: 'حفظ PDF',
    loading: 'جاري المعالجة...'
  },
  en: {
    title: 'Rushed',
    subtitle: 'AI platform guiding employees to professional growth',
    uploadBtn: 'Upload',
    langButton: 'عربي',
    dark: '🌙',
    light: '☀️',
    visit: 'Visit Link',
    download: 'Save PDF',
    loading: 'Loading...'
  }
};

let currentLang = 'ar';
let dark = false;

function updateTexts() {
  const t = texts[currentLang];
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('upload-btn').textContent = t.uploadBtn;
  document.getElementById('lang-toggle').textContent = t.langButton;
  document.getElementById('mode-toggle').textContent = dark ? t.light : t.dark;
  document.getElementById('loading-text').textContent = t.loading;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

document.getElementById('lang-toggle').onclick = () => {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  updateTexts();
};

document.getElementById('mode-toggle').onclick = () => {
  dark = !dark;
  document.body.classList.toggle('dark', dark);
  updateTexts();
};

updateTexts();

function createItem(item, type) {
  const div = document.createElement('div');
  div.className = `item ${type}`;
  const icon = document.createElement('span');
  icon.textContent = type === 'cert' ? '🎓' : '📘';
  const txt = document.createElement('span');
  txt.textContent = `${item.name}` + (item.price ? ` - ${item.price}` : '');
  const link = document.createElement('a');
  link.href = item.link || '#';
  link.textContent = texts[currentLang].visit;
  link.target = '_blank';
  div.appendChild(icon);
  div.appendChild(txt);
  div.appendChild(link);
  return div;
}

function createJourney(steps, courses, certs) {
  const container = document.createElement('div');
  container.className = 'journey';
  const used = new Set();
  steps.forEach((step, idx) => {
    const block = document.createElement('div');
    block.className = 'step';
    const num = document.createElement('div');
    num.className = 'step-number';
    num.textContent = idx + 1;
    block.appendChild(num);
    const desc = document.createElement('div');
    desc.textContent = step;
    block.appendChild(desc);
    courses.forEach(c => {
      if (!used.has(c.name) && step.includes(c.name)) {
        block.appendChild(createItem(c, 'course'));
        used.add(c.name);
      }
    });
    certs.forEach(c => {
      if (!used.has(c.name) && step.includes(c.name)) {
        block.appendChild(createItem(c, 'cert'));
        used.add(c.name);
      }
    });
    container.appendChild(block);
  });
  courses.forEach(c => { if (!used.has(c.name)) container.appendChild(createItem(c, 'course')); });
  certs.forEach(c => { if (!used.has(c.name)) container.appendChild(createItem(c, 'cert')); });
  return container;
}

function printCard(card, name) {
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>${name}</title><link rel="stylesheet" href="/static/style.css"></head><body class="${dark ? 'dark' : 'light'}">${card.outerHTML}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
  win.close();
}

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('file');
  if (!fileInput.files.length) return;
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('alert').classList.add('hidden');
  let data;
  try {
    const resp = await fetch('/upload', { method: 'POST', body: formData });
    data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Request failed');
  } catch (err) {
    const alert = document.getElementById('alert');
    alert.textContent = err.message;
    alert.classList.remove('hidden');
    document.getElementById('overlay').classList.add('hidden');
    return;
  }
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  data.results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const h3 = document.createElement('h3');
    h3.textContent = item.employee;
    card.appendChild(h3);
    const rec = item.recommendations || {};
    if (rec.error) {
      const err = document.createElement('div');
      err.className = 'alert';
      err.textContent = rec.error;
      card.appendChild(err);
    } else if (rec.roadmap) {
      card.appendChild(createJourney(rec.roadmap, rec.courses || [], rec.certifications || []));
    }
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.textContent = texts[currentLang].download;
    btn.onclick = () => printCard(card, item.employee);
    card.appendChild(btn);
    resultsDiv.appendChild(card);
  });
  document.getElementById('overlay').classList.add('hidden');
});
