// Semplice JS per caricare data/materiali.json e popolare la tabella.
// Puoi sostituire l'URL con la tua API/Firestore REST endpoint.

async function fetchJSON(url){
  const res = await fetch(url, { cache: "no-cache" });
  if(!res.ok) throw new Error('Errore caricamento dati');
  return res.json();
}

async function loadMateriali(){
  try {
    const materiali = await fetchJSON('data/materiali.json');
    renderMateriali(materiali);
    populateFilter(materiali);
    setSearch(materiali);
  } catch(e){
    console.error(e);
    document.getElementById('empty').textContent = 'Errore caricamento dati.';
    document.getElementById('empty').style.display = 'block';
  }
}

function renderMateriali(materiali){
  const tbody = document.querySelector('#table-materiali tbody');
  tbody.innerHTML = '';
  if(!materiali || materiali.length === 0){
    document.getElementById('empty').style.display = 'block';
    return;
  }
  document.getElementById('empty').style.display = 'none';
  for(const m of materiali){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(m.codice)}</td>
      <td>${escapeHtml(m.descrizione)}</td>
      <td>${escapeHtml(m.categoria||'')}</td>
      <td>${Number(m.quantita)}</td>
      <td>${escapeHtml(m.ubicazione||'')}</td>
    `;
    tbody.appendChild(tr);
  }
}

function populateFilter(materiali){
  const sel = document.getElementById('filter-cat');
  const cats = [...new Set(materiali.map(m => m.categoria).filter(Boolean))].sort();
  for(const c of cats){
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  }
  sel.addEventListener('change', () => filterAndRender(materiali));
}

function setSearch(materiali){
  const search = document.getElementById('search');
  search.addEventListener('input', () => filterAndRender(materiali));
}

function filterAndRender(materiali){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('filter-cat').value;
  const filtered = materiali.filter(m => {
    const inCat = !cat || m.categoria === cat;
    const inQuery = !q || [m.codice, m.descrizione, m.categoria, m.ubicazione]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
    return inCat && inQuery;
  });
  renderMateriali(filtered);
}

function escapeHtml(text){
  if(!text && text!==0) return '';
  return String(text).replace(/[&<>"'`]/g, (s) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;', '`':'&#96;'
  })[s]);
}
