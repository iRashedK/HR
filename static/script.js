const texts = {
  en: {
    title: 'HR Recommendations',
    uploadBtn: 'Upload',
    langButton: 'عربي',
    dark: '🌙',
    light: '☀️',
    roadmap: 'Roadmap:',
    courses: 'Courses:',
    certs: 'Certifications:',
    download: 'Download PDF',
    loading: 'Loading...'
  },
  ar: {
    title: 'توصيات الموارد البشرية',
    uploadBtn: 'رفع',
    langButton: 'English',
    dark: '🌙',
    light: '☀️',
    roadmap: 'خارطة الطريق:',
    courses: 'الدورات:',
    certs: 'الشهادات:',
    download: 'تحميل PDF',
    loading: 'جاري المعالجة...'
  }
};
let currentLang = 'en';
let dark = false;

function updateTexts() {
  const t = texts[currentLang];
  document.getElementById('title').innerText = t.title;
  document.getElementById('upload-btn').innerText = t.uploadBtn;
  document.getElementById('lang-toggle').innerText = t.langButton;
  document.getElementById('mode-toggle').innerText = dark ? t.light : t.dark;
  const loader = document.querySelector('#loading span');
  if (loader) loader.textContent = t.loading;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  updateTexts();
});

document.getElementById('mode-toggle').addEventListener('click', () => {
  dark = !dark;
  document.body.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  updateTexts();
});

updateTexts();

function createList(items) {
  const ul = document.createElement('ul');
  items.forEach(it => {
    const li = document.createElement('li');
    if (typeof it === 'string') {
      li.textContent = it;
    } else {
      const a = document.createElement('a');
      a.href = it.link || '#';
      a.target = '_blank';
      a.textContent = it.name || it.title || 'Item';
      li.appendChild(a);
      if (it.price) {
        li.appendChild(document.createTextNode(' - ' + it.price));
      }
      if (it.timeline) {
        li.appendChild(document.createTextNode(' (' + it.timeline + ')'));
      }
    }
    ul.appendChild(li);
  });
  return ul;
}

document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('file');
  if (!fileInput.files.length) return;
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  const loading = document.getElementById('loading');
  loading.classList.remove('d-none');
  let data;
  try {
    const resp = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Request failed');
  } catch (err) {
    document.getElementById('alert').classList.remove('d-none');
    document.getElementById('alert').textContent = err.message;
    loading.classList.add('d-none');
    return;
  }
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  document.getElementById('alert').classList.add('d-none');
  data.results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card p-3 flex-fill position-relative';
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = item.employee;
    card.appendChild(title);
    if (item.recommendations.roadmap) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = texts[currentLang].roadmap;
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.roadmap));
    }
    if (item.recommendations.courses) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = texts[currentLang].courses;
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.courses));
    }
    if (item.recommendations.certifications) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = texts[currentLang].certs;
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.certifications));
    }
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-secondary mt-2';
    btn.textContent = texts[currentLang].download;
    btn.addEventListener('click', () => {
      html2pdf().from(card).save(item.employee + '.pdf');
    });
    card.appendChild(btn);
    resultsDiv.appendChild(card);
  });
  loading.classList.add('d-none');
});

