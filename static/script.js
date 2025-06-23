const texts = {
  en: {
    title: 'HR Recommendations',
    uploadBtn: 'Upload',
    langButton: 'عربي',
    dark: '🌙',
    light: '☀️'
  },
  ar: {
    title: 'توصيات الموارد البشرية',
    uploadBtn: 'رفع',
    langButton: 'English',
    dark: '🌙',
    light: '☀️'
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
  const resp = await fetch('/upload', {
    method: 'POST',
    body: formData
  });
  const data = await resp.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  data.results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card p-3 flex-fill';
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = item.employee;
    card.appendChild(title);
    if (item.recommendations.roadmap) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = 'Roadmap:';
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.roadmap));
    }
    if (item.recommendations.courses) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = 'Courses:';
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.courses));
    }
    if (item.recommendations.certifications) {
      const subtitle = document.createElement('h6');
      subtitle.textContent = 'Certifications:';
      card.appendChild(subtitle);
      card.appendChild(createList(item.recommendations.certifications));
    }
    resultsDiv.appendChild(card);
  });
});

