const texts = {
  ar: {
    title: 'رشُد',
    subtitle: 'منصة الذكاء الاصطناعي لإرشاد الموظفين نحو التطور المهني',
  uploadBtn: 'رفع',
  drop: 'اسحب الملف هنا أو اضغط لاختياره',
  employees: 'عدد الموظفين',
  totalCost: 'إجمالي التكلفة',
  badge: 'مقترحة بشدة',
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
  drop: 'Drag file here or click to choose',
  employees: 'Employees',
  totalCost: 'Total Cost',
  badge: 'Highly recommended',
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
let selectedFile = null;

function updateTexts() {
  const t = texts[currentLang];
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('upload-btn').textContent = t.uploadBtn;
  document.getElementById('drop-text').textContent = t.drop;
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

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file');
const fileInfo = document.getElementById('file-info');

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('over');
  if (e.dataTransfer.files.length) {
    selectedFile = e.dataTransfer.files[0];
    fileInfo.textContent = selectedFile.name;
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    selectedFile = fileInput.files[0];
    fileInfo.textContent = selectedFile.name;
  }
});

updateTexts();

function createItem(item, type, highlight = false) {
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
  if (highlight) {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = texts[currentLang].badge;
    div.appendChild(b);
  }
  return div;
}

function createJourney(steps, courses, certs) {
  const container = document.createElement('div');
  container.className = 'journey';
  const first = steps[0] || '';
  const remainingCourses = [...(courses || [])];
  const remainingCerts = [...(certs || [])];

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

    const stepLower = step.toLowerCase();

    function takeMatches(list, type) {
      let item;
      for (let i = 0; i < list.length; i++) {
        if (stepLower.includes(list[i].name.toLowerCase())) {
          item = list.splice(i, 1)[0];
          block.appendChild(createItem(item, type, first.includes(item.name)));
          i--;
        }
      }
    }

    takeMatches(remainingCourses, 'course');
    takeMatches(remainingCerts, 'cert');

    if (!block.querySelector('.item')) {
      if (remainingCourses.length) {
        const item = remainingCourses.shift();
        block.appendChild(createItem(item, 'course', first.includes(item.name)));
      }
      if (remainingCerts.length) {
        const item = remainingCerts.shift();
        block.appendChild(createItem(item, 'cert', first.includes(item.name)));
      }
    }

    container.appendChild(block);
  });

  remainingCourses.forEach(c => container.appendChild(createItem(c, 'course', first.includes(c.name))));
  remainingCerts.forEach(c => container.appendChild(createItem(c, 'cert', first.includes(c.name))));

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
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append('file', selectedFile);
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
  fileInfo.textContent = `${selectedFile.name} - ${data.results.length} ${texts[currentLang].employees}`;
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
      const total = [...(rec.courses || []), ...(rec.certifications || [])]
        .reduce((s, x) => s + (Number(x.price) || 0), 0);
      const totEl = document.createElement('div');
      totEl.className = 'total';
      totEl.textContent = `${texts[currentLang].totalCost}: ${total}`;
      card.appendChild(totEl);
    }
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.textContent = texts[currentLang].download;
    btn.onclick = () => printCard(card, item.employee);
    card.appendChild(btn);
    resultsDiv.appendChild(card);
  });
  document.getElementById('overlay').classList.add('hidden');
  selectedFile = null;
});
