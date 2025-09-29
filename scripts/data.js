// scripts/data.js
// Requer PapaParse no HTML.

const PATHS = {
  empresas: './data/base1.csv',
  transacoes: './data/base2.csv',
};

// --- utils ---
const toNumber = (v) => {
  if (v == null || v === '') return null;
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

// aceita "dd/mm/aaaa" ou ISO
const toDate = (v) => {
  if (!v) return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [d,m,y] = v.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(v);
};

function parseCSV(path, opts = {}) {
  return new Promise((resolve, reject) => {
    Papa.parse(path, {
      download: true,
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      ...opts,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}

export async function loadEmpresas(path = PATHS.empresas) {
  const rows = await parseCSV(path);
  return rows.map((r) => ({
    cnpj: String(r.ID || '').trim(),
    faturamento: toNumber(r.VL_FATU),
    saldo: toNumber(r.VL_SLDO),
    dataAbertura: toDate(r.DT_ABRT),
    cnaeDescricao: r.DS_CNAE || null,
    dataReferencia: toDate(r.DT_REFE),
    _raw: r,
  })).filter(x => x.cnpj);
}

export async function loadTransacoes(path = PATHS.transacoes) {
  const rows = await parseCSV(path);
  return rows.map((r) => ({
    pagador: String(r.ID_PGTO || '').trim(),
    recebedor: String(r.ID_RCBE || '').trim(),
    valor: toNumber(r.VL),
    tipo: r.DS_TRAN || null,
    data: toDate(r.DT_REFE),
    _raw: r,
  })).filter(x => x.pagador && x.recebedor && x.valor != null && x.data);
}

// helpers
export function uniqBy(arr, key) {
  const seen = new Set();
  return arr.filter(x => !seen.has(x[key]) && seen.add(x[key]));
}

export function formatBRL(n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
