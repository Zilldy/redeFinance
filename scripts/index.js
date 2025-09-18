// scripts/index.js
import { loadEmpresas, loadTransacoes, uniqBy } from './data.js';

const quantile = (arr, q) => {
  const a = [...arr].filter(n => n != null && !isNaN(n)).sort((x,y)=>x-y);
  if (!a.length) return null;
  const pos = (a.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return a[base] + ((a[base + 1] ?? a[base]) - a[base]) * (rest || 0);
};

function classificarEmpresas(empresas) {
  const fats = empresas.map(e => e.faturamento).filter(v => v != null);
  const q33 = quantile(fats, 1/3);
  const q66 = quantile(fats, 2/3);

  return empresas.map(e => {
    if (e.saldo < 0) return { ...e, perfil: 'Declínio' };
    if (e.faturamento == null) return { ...e, perfil: 'Início' };
    if (e.faturamento <= q33) return { ...e, perfil: 'Início' };
    if (e.faturamento <= q66) return { ...e, perfil: 'Expansão' };
    return { ...e, perfil: 'Madura' };
  });
}

function groupCount(arr, key) {
  const map = new Map();
  for (const x of arr) {
    const k = x[key] ?? 'N/A';
    map.set(k, (map.get(k) || 0) + 1);
  }
  return map;
}

function groupSum(arr, keyGroup, keyValue) {
  const map = new Map();
  for (const x of arr) {
    const k = x[keyGroup] ?? 'N/A';
    map.set(k, (map.get(k) || 0) + (Number(x[keyValue]) || 0));
  }
  return map;
}

function renderKPIs(empresas, transacoes) {
  const unicas = uniqBy(empresas, 'cnpj');
  const total = unicas.length;
  const risco = unicas.filter(e => e.perfil === 'Declínio').length;

  const byMonth = new Map();
  for (const t of transacoes) {
    const ym = `${t.data.getFullYear()}-${String(t.data.getMonth()+1).padStart(2,'0')}`;
    byMonth.set(ym, (byMonth.get(ym) || 0) + (t.valor || 0));
  }
  const months = [...byMonth.keys()].sort();
  let cres = '—';
  if (months.length >= 2) {
    const first = byMonth.get(months[0]);
    const last  = byMonth.get(months[months.length-1]);
    const pct = first ? ((last - first) / first) * 100 : 0;
    cres = `${pct >= 0 ? '+' : ''}${Math.round(pct)}%`;
  }

  document.querySelectorAll('.kpis .kpi .value')[0].textContent = total;
  document.querySelectorAll('.kpis .kpi .value')[1].textContent = risco;
  document.querySelectorAll('.kpis .kpi .value')[2].textContent = cres;
}

let donutChart, barChart;

function renderDonut(empresas) {
  const map = groupCount(empresas, 'perfil');
  const labels = [...map.keys()];
  const data = [...map.values()];
  const ctx = document.getElementById('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data }] },
    options: { responsive: true, cutout: '60%', plugins: { legend: { position: 'bottom' } } }
  });

  const total = data.reduce((a,b)=>a+b,0);
  document.getElementById('legendPerfil').innerHTML =
    labels.map((l,i)=> `<span>${l} (${Math.round((data[i]/total)*100)}%)</span>`).join(' ');
}

function renderBarrasTransacoes(transacoes) {
  const map = groupSum(transacoes, 'tipo', 'valor');
  const labels = [...map.keys()];
  const data = [...map.values()];
  const ctx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Valor total (R$)', data }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

function renderLista(empresas) {
  const grid = document.querySelector('.empresas-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const unicas = uniqBy(empresas, 'cnpj').slice(0, 8);
  const col1 = document.createElement('div'); col1.className = 'coluna';
  const col2 = document.createElement('div'); col2.className = 'coluna';

  const mk = (e) => {
    const a = document.createElement('a');
    a.className = 'empresa-item';
    a.href = `individual.html?cnpj=${encodeURIComponent(e.cnpj)}`;
    a.innerHTML = `
      <div class="icon">🏢</div>
      <div>
        <strong>${e.cnpj}</strong>
        <div class="cnpj">${e.cnaeDescricao ?? '—'}</div>
      </div>`;
    return a;
  };

  unicas.forEach((e,i)=> (i%2?col2:col1).appendChild(mk(e)));
  grid.appendChild(col1); grid.appendChild(col2);
}

(async function boot() {
  const [empresasRaw, transacoes] = await Promise.all([loadEmpresas(), loadTransacoes()]);
  const empresas = classificarEmpresas(empresasRaw);

  renderKPIs(empresas, transacoes);
  renderDonut(empresas);
  renderBarrasTransacoes(transacoes);
  renderLista(empresas);
})();
