const texts = {
  ar: {
    lang: 'English',
    free: 'مجانية',
    visit: 'زيارة الرابط'
  },
  en: {
    lang: 'عربي',
    free: 'Free',
    visit: 'Visit'
  }
};
let currentLang = 'ar';
let dark = false;
function updateUI() {
  const t = texts[currentLang];
  document.getElementById('lang-toggle').textContent = t.lang;
  document.getElementById('mode-toggle').textContent = dark ? '☀️' : '🌙';
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}
document.getElementById('lang-toggle').onclick = () => { currentLang = currentLang === 'ar' ? 'en' : 'ar'; updateUI(); render(); };
document.getElementById('mode-toggle').onclick = () => { dark = !dark; document.body.classList.toggle('dark', dark); updateUI(); };
updateUI();

function render() {
  const catalog = JSON.parse(localStorage.getItem('catalog') || '{"courses":[],"certifications":[]}');
  const type = document.getElementById('type-filter').value;
  const price = document.getElementById('price-filter').value;
  const list = [...catalog.courses.map(c=>({...c,type:'course'})), ...catalog.certifications.map(c=>({...c,type:'cert'}))];
  const container = document.getElementById('catalog');
  container.innerHTML = '';
  list.forEach(item => {
    if (type !== 'all' && item.type !== type) return;
    if (price === 'free' && Number(item.price)>0) return;
    if (price === 'paid' && (!item.price || Number(item.price)==0)) return;
    const card = document.createElement('div');
    card.className = `item ${item.type}`;
    const header = document.createElement('div');
    header.className = 'item-header';
    const icon = document.createElement('span');
    icon.className = 'item-icon';
    icon.textContent = item.type==='cert'?'🎓':'📘';
    const title = document.createElement('span');
    title.textContent = item.name;
    header.appendChild(icon); header.appendChild(title);
    card.appendChild(header);
    if (item.price) {
      const p = document.createElement('span');
      p.className = 'price-badge badge';
      p.textContent = `💸${item.price}`;
      header.appendChild(p);
    }
    const body = document.createElement('div');
    body.className = 'item-body';
    if (item.link) {
      const a = document.createElement('a');
      a.className = 'link-btn';
      a.textContent = texts[currentLang].visit;
      a.href = item.link;
      a.target = '_blank';
      body.appendChild(a);
    }
    card.appendChild(body);
    container.appendChild(card);
  });
}

document.getElementById('type-filter').onchange = render;
document.getElementById('price-filter').onchange = render;
render();
