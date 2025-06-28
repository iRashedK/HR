const texts = {
  ar: {
    employees: 'عدد الموظفين',
    totalCost: 'إجمالي التكلفة',
    lang: 'English'
  },
  en: {
    employees: 'Employees',
    totalCost: 'Total Cost',
    lang: 'عربي'
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
function toggleLang() { currentLang = currentLang === 'ar' ? 'en' : 'ar'; updateUI(); }
function toggleMode() { dark = !dark; document.body.classList.toggle('dark', dark); updateUI(); }
document.getElementById('lang-toggle').onclick = toggleLang;
document.getElementById('mode-toggle').onclick = toggleMode;
updateUI();

function renderCharts() {
  const results = JSON.parse(localStorage.getItem('results') || '[]');
  const employees = results.length;
  document.getElementById('emp-count').textContent = employees;
  const cost = results.reduce((sum, r) => {
    const rec = r.recommendations || {};
    const items = [...(rec.courses||[]), ...(rec.certifications||[])];
    return sum + items.reduce((s,x)=>s+(Number(x.price)||0),0);
  },0);
  document.getElementById('total-cost').textContent = cost;
  const labels = results.map(r=>r.employee);
  const totals = results.map(r=>{
    const rec=r.recommendations||{};
    return [...(rec.courses||[]),...(rec.certifications||[])]
      .reduce((s,x)=>s+(Number(x.price)||0),0);
  });
  const ctx=document.getElementById('costChart');
  new Chart(ctx,{type:'bar',data:{labels:labels,datasets:[{label:texts[currentLang].totalCost,data:totals,backgroundColor:'#4b6bfb'}]}});
}
renderCharts();
