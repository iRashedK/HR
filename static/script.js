const texts = {
  ar: {
    title: 'رشُد',
    subtitle: 'منصة الذكاء الاصطناعي لإرشاد الموظفين نحو التطور المهني',
    drop: 'اسحب الملف هنا أو اضغط لاختياره',
    employees: 'عدد الموظفين',
    totalCost: 'إجمالي التكلفة',
    badge: 'مقترحة بشدة',
    failed: '❌ فشل التحليل',
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
    drop: 'Drag file here or click to choose',
    employees: 'Employees',
    totalCost: 'Total Cost',
    badge: 'Highly recommended',
    failed: '❌ Analysis failed',
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
let progressInterval;

function updateTexts() {
  const t = texts[currentLang];
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
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
    uploadFile();
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    selectedFile = fileInput.files[0];
    fileInfo.textContent = selectedFile.name;
    uploadFile();
  }
});

updateTexts();

function startProgress() {
  const bar = document.getElementById('progress-bar');
  let val = 0;
  bar.style.width = '0';
  progressInterval = setInterval(() => {
    val = Math.min(90, val + 1);
    bar.style.width = val + '%';
  }, 100);
}

function stopProgress() {
  const bar = document.getElementById('progress-bar');
  clearInterval(progressInterval);
  bar.style.width = '100%';
  setTimeout(() => { bar.style.width = '0'; }, 300);
}

function createItem(item, type, highlight = false, stepIndex = 1) {
  if (!item || !item.name) return document.createElement('div');
  const div = document.createElement('div');
  div.className = `item ${type} step-${stepIndex}`;

  const header = document.createElement('div');
  header.className = 'item-header';
  const icon = document.createElement('span');
  icon.className = 'item-icon';
  icon.textContent = type === 'cert' ? '🎓' : '📘';
  const title = document.createElement('span');
  title.className = 'item-title tooltip';
  title.textContent = item.name;
  if (item.name.length > 25) {
    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.textContent = item.name;
    title.appendChild(tip);
  }
  if (item.desc) {
    const tip = document.createElement('span');
    tip.className = 'tip';
    tip.textContent = item.desc;
    title.appendChild(tip);
  }
  header.appendChild(icon);
  header.appendChild(title);
  if (item.price) {
    const priceBadge = document.createElement('span');
    priceBadge.className = 'badge price-badge tooltip';
    priceBadge.textContent = `💸${item.price}`;
    if (String(item.price).length > 6) {
      const tip = document.createElement('span');
      tip.className = 'tip';
      tip.textContent = item.price;
      priceBadge.appendChild(tip);
    }
    header.appendChild(priceBadge);
  }
  div.appendChild(header);

  const body = document.createElement('div');
  body.className = 'item-body';
  const link = document.createElement('a');
  link.href = item.link || '#';
  link.className = 'link-btn';
  link.textContent = texts[currentLang].visit;
  link.target = '_blank';
  body.appendChild(link);
  div.appendChild(body);

  const badge = document.createElement('div');
  badge.className = 'step-number';
  badge.textContent = stepIndex;
  div.appendChild(badge);

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
    const desc = document.createElement('div');
    desc.textContent = step;
    block.appendChild(desc);

    const stepLower = step.toLowerCase();

    function takeMatches(list, type) {
      let item;
      for (let i = 0; i < list.length; i++) {
        if (stepLower.includes(list[i].name.toLowerCase())) {
          item = list.splice(i, 1)[0];
          block.appendChild(createItem(item, type, first.includes(item.name), idx + 1));
          i--;
        }
      }
    }

    takeMatches(remainingCourses, 'course');
    takeMatches(remainingCerts, 'cert');

    if (!block.querySelector('.item')) {
      if (remainingCourses.length) {
        const item = remainingCourses.shift();
        block.appendChild(createItem(item, 'course', first.includes(item.name), idx + 1));
      } else if (remainingCerts.length) {
        const item = remainingCerts.shift();
        block.appendChild(createItem(item, 'cert', first.includes(item.name), idx + 1));
      }
    }

    container.appendChild(block);
  });

  const extraStep = steps.length + 1;
  remainingCourses.forEach(c => container.appendChild(createItem(c, 'course', first.includes(c.name), extraStep)));
  remainingCerts.forEach(c => container.appendChild(createItem(c, 'cert', first.includes(c.name), extraStep)));

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

async function render(data) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  const allCourses = [];
  const allCerts = [];
  data.results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    const h3 = document.createElement('h3');
    h3.textContent = item.employee;
    card.appendChild(h3);
    if (item.status !== 'done') {
      const wait = document.createElement('div');
      wait.textContent = texts[currentLang].loading;
      card.appendChild(wait);
    } else {
      const rec = item.recommendations || {};
      if (rec.error) {
        card.classList.add('error');
        const failed = document.createElement('div');
        failed.className = 'error-title';
        failed.textContent = texts[currentLang].failed;
        card.appendChild(failed);
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
        const budget = 2000;
        const progress = document.createElement('div');
        progress.className = 'budget';
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = Math.min(100, (total / budget) * 100) + '%';
        progress.appendChild(bar);
        card.appendChild(progress);
        if (rec.courses) allCourses.push(...rec.courses);
        if (rec.certifications) allCerts.push(...rec.certifications);
      }
    }
    const btn = document.createElement('button');
    btn.className = 'secondary';
    btn.textContent = texts[currentLang].download;
    btn.onclick = () => printCard(card, item.employee);
    card.appendChild(btn);
    resultsDiv.appendChild(card);
  });
  localStorage.setItem('catalog', JSON.stringify({ courses: allCourses, certifications: allCerts }));
  localStorage.setItem('results', JSON.stringify(data.results));
}

async function poll(jobId, count) {
  let done = 0;
  while (done < count) {
    const resp = await fetch(`/results?job=${jobId}`);
    const data = await resp.json();
    await render(data);
    done = data.results.filter(r => r.status === 'done' || r.status === 'error').length;
    const progress = Math.round((done / count) * 100);
    document.getElementById('progress-bar').style.width = progress + '%';
    if (done < count) await new Promise(res => setTimeout(res, 3000));
  }
  document.getElementById('overlay').classList.add('hidden');
  stopProgress();
}

async function uploadFile() {
  if (!selectedFile) return;
  const formData = new FormData();
  formData.append('file', selectedFile);
  document.getElementById('overlay').classList.remove('hidden');
  startProgress();
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
    stopProgress();
    return;
  }
  fileInfo.textContent = `${selectedFile.name} - ${data.count} ${texts[currentLang].employees}`;
  selectedFile = null;
  poll(data.job_id, data.count);
}

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  uploadFile();
});
