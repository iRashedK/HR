const texts = {
  ar: {
    title: 'توصيات الموارد البشرية',
    uploadBtn: 'رفع',
    langButton: 'English',
    dark: '🌙',
    light: '☀️',
    roadmap: 'خارطة الطريق',
    courses: 'الدورات',
    certs: 'الشهادات',
    visit: 'زيارة الرابط',
    download: 'حفظ PDF',
    loading: 'جاري المعالجة...'
  },
  en: {
    title: 'HR Recommendations',
    uploadBtn: 'Upload',
    langButton: 'عربي',
    dark: '🌙',
    light: '☀️',
    roadmap: 'Roadmap',
    courses: 'Courses',
    certs: 'Certifications',
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
  const left = document.createElement('span');
  left.textContent = type === 'cert' ? '🎓' : '📘';
  const middle = document.createElement('span');
  middle.textContent = `${item.name || item.title}` + (item.price ? ` - ${item.price}` : '');
  const link = document.createElement('a');
  link.href = item.link || '#';
  link.textContent = texts[currentLang].visit;
  link.target = '_blank';
  div.appendChild(left);
  div.appendChild(middle);
  div.appendChild(link);
  return div;
}

function createRoadmap(steps) {
  const container = document.createElement('div');
  steps.forEach((step, idx) => {
    const row = document.createElement('div');
    row.className = 'roadmap-step';
    const num = document.createElement('span');
    num.className = 'roadmap-step-number';
    num.textContent = idx + 1;
    const text = document.createElement('span');
    text.textContent = step;
    row.appendChild(num);
    row.appendChild(text);
    container.appendChild(row);
  });
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
    }
    if (rec.roadmap) {
      const label = document.createElement('h4');
      label.textContent = texts[currentLang].roadmap;
      card.appendChild(label);
      card.appendChild(createRoadmap(rec.roadmap));
    }
    if (rec.courses) {
      const label = document.createElement('h4');
      label.textContent = texts[currentLang].courses;
      card.appendChild(label);
      rec.courses.forEach(c => card.appendChild(createItem(c, 'course')));
    }
    if (rec.certifications) {
      const label = document.createElement('h4');
      label.textContent = texts[currentLang].certs;
      card.appendChild(label);
      rec.certifications.forEach(c => card.appendChild(createItem(c, 'cert')));
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
