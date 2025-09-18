// scripts/individual.js
import { loadEmpresas, loadTransacoes, formatBRL } from './data.js';

const byMonthKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;

function aggFluxoMensal(cnpj, transacoes) {
  const map = new Map();
  for (const t of transacoes) {
    const ym = byMonthKey(t.data);
    const val = (t.recebedor === cnpj ? +t.valor : 0) + (t.pagador === cnpj ? -t.valor : 0);
    map.set(ym, (map.get(ym) || 0) + val);
  }
  return [...map.entries()].sort(([a],[b]) => a.localeCompare(b));
}

function topRelacionamentos(cnpj, transacoes, limit=5) {
  const map = new Map();
  for (const t of transacoes) {
    if (t.pagador !== cnpj && t.recebedor !== cnpj) continue;
    const other = t.pagador === cnpj ? t.recebedor : t.pagador;
    map.set(other, (map.get(other) || 0) + Math.abs(t.valor || 0));
  }
  return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0, limit);
}

(async function boot() {
  const params = new URLSearchParams(location.search);
  const cnpj = params.get('cnpj');
  if (!cnpj) return;

  const [empresas, transacoes] = await Promise.all([loadEmpresas(), loadTransacoes()]);
  const emp = empresas.find(e => e.cnpj === cnpj);

  // Cabeçalho
  document.querySelector('.empresa-header h2').textContent = cnpj;
  document.querySelector('.empresa-header span').textContent = `CNAE: ${emp?.cnaeDescricao ?? '—'}`;

  // Cards
  const cards = document.querySelectorAll('.cards .card .value');
  if (cards[0]) cards[0].textContent = emp?.saldo != null ? formatBRL(emp.saldo) : '—';
  const mensal = aggFluxoMensal(cnpj, transacoes).map(([_,v])=>v);
  const media = mensal.length ? mensal.reduce((a,b)=>a+b,0)/mensal.length : 0;
  if (cards[1]) cards[1].textContent = media ? formatBRL(media) : '—';
  if (cards[2]) cards[2].textContent = emp?.perfil ?? '—';
  if (cards[3]) cards[3].textContent = emp?.cnaeDescricao ?? '—';

  // Gráfico linha (fluxo líquido por mês)
  const serie = aggFluxoMensal(cnpj, transacoes);
  const labels = serie.map(([k]) => k);
  const data = serie.map(([_,v]) => v);
  const ctx = document.getElementById('lineChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Fluxo líquido (R$)', data, borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,.1)', fill: true, tension: .3, pointRadius: 3 }] },
    options: { plugins: { tooltip: { callbacks: { label: (c)=>formatBRL(c.raw) } } },
               scales: { y: { ticks: { callback: v => formatBRL(v) } } } }
  });

  // Tabela: principais relacionamentos
  const rel = topRelacionamentos(cnpj, transacoes, 5);
  const tbody1 = document.querySelector('.tables tbody');
  if (tbody1) {
    tbody1.innerHTML = rel.map(([doc, total]) =>
      `<tr><td>${doc}</td><td>—</td><td>${formatBRL(total)}</td><td>${formatBRL(-total)}</td></tr>`
    ).join('');
  }

  // Tabela: empresas semelhantes (mesmo CNAE, faturamento próximo)
  const semelhantes = empresas
    .filter(e => e.cnpj !== cnpj && e.cnaeDescricao === emp?.cnaeDescricao)
    .sort((a,b)=>Math.abs((a.faturamento||0)-(emp?.faturamento||0)) - Math.abs((b.faturamento||0)-(emp?.faturamento||0)))
    .slice(0,5);
  const tbody2 = document.querySelectorAll('.tables tbody')[1];
  if (tbody2) {
    tbody2.innerHTML = semelhantes.map(e =>
      `<tr><td>${e.cnpj}</td><td>${emp?.cnaeDescricao ?? '—'}</td><td>${e.perfil ?? '—'}</td></tr>`
    ).join('');
  }
})();
