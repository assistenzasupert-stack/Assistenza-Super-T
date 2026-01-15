// filiali-admin.js - gestione page admin per aggiungere un intervento al giorno corrente
// Password admin richiesta: MedMax@000
// Salva -> aggiunge al giorno corrente e scarica filiali.json aggiornato
// Nota: per persistere permanentemente, caricare il file scaricato nella repo (data/filiali.json)

(function(){
  const ADMIN_PW = 'MedMax@000';
  const DATA_URL = 'data/filiali.json';
  const LOCAL_KEY = 'filiali_data_custom';
  const MAX_ROWS_PER_DAY = 8;

  function todayKey(){
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  async function fetchJSON(url){
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if(!res.ok) throw new Error('fetch failed');
      return await res.json();
    } catch(e){
      return {};
    }
  }

  function ensureArrayForKey(data, key){
    if(!data[key] || !Array.isArray(data[key])) data[key] = [];
    // keep max rows but we don't enforce here; entries are appended
    if(data[key].length > MAX_ROWS_PER_DAY) data[key].length = MAX_ROWS_PER_DAY;
  }

  function downloadJSON(filename, obj){
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function showError(text){
    const el = document.getElementById('pw-error');
    el.style.display = 'block';
    el.textContent = text;
  }

  function hideError(){
    const el = document.getElementById('pw-error');
    el.style.display = 'none';
    el.textContent = '';
  }

  async function init(){
    // pw check
    const pwBtn = document.getElementById('pwCheck');
    const pwInput = document.getElementById('adm_password');

    pwBtn.addEventListener('click', async () => {
      const val = pwInput.value || '';
      if(val === ADMIN_PW){
        // show admin form
        document.getElementById('authCard').style.display = 'none';
        document.getElementById('adminForm').style.display = 'block';
        hideError();
      } else {
        showError('Password errata.');
      }
    });

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      // read current stored data (local override) or data/filiali.json
      let data = {};
      const local = localStorage.getItem(LOCAL_KEY);
      if(local){
        try { data = JSON.parse(local); } catch(e){ data = {}; }
      } else {
        data = await fetchJSON(DATA_URL);
      }
      const key = todayKey();
      ensureArrayForKey(data, key);

      // collect fields
      const localita = document.getElementById('f_localita').value.trim();
      const banca = document.getElementById('f_banca').value.trim();
      const km = document.getElementById('f_km').value.trim();
      const materiali = document.getElementById('f_materiali').value.trim();
      const ac = document.getElementById('f_ac').value.trim();

      // add entry (prepend so newest entries appear first for today)
      const entry = { localita, banca, km, materiali, ac };
      // push to beginning
      data[key] = data[key] || [];
      data[key].unshift(entry);
      // cap to MAX_ROWS_PER_DAY
      if(data[key].length > MAX_ROWS_PER_DAY) data[key].length = MAX_ROWS_PER_DAY;

      // save locally (so filiali.html shows immediately)
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      } catch(e){ console.warn('localStorage failed', e); }

      // download file filiali.json
      downloadJSON('filiali.json', data);

      // redirect back to view page
      window.location.href = 'filiali.html';
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();