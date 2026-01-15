// Gestione della pagina di login.
// Password richiesta (client-side): "FBSAIMA" (tutto maiuscolo).
// NOTA: questo controllo è solo lato client (non è sicuro per proteggere dati sensibili).
// Serve per impedire l'accesso casuale; per sicurezza vera serve autenticazione server o Firebase.

(function(){
  const FORM_ID = 'pwForm';
  const INPUT_ID = 'password';
  const ERROR_ID = 'pw-error';
  const CORRECT = 'FBSAIMA';

  function getQueryParam(name){
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById(FORM_ID);
    const pwInput = document.getElementById(INPUT_ID);
    const err = document.getElementById(ERROR_ID);

    // Focus automatico sul campo password
    pwInput.focus();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const val = pwInput.value || '';
      if (val === CORRECT) {
        // Imposta flag in sessionStorage e redirect alla pagina richiesta (o index.html)
        try {
          sessionStorage.setItem('superT_auth', '1');
        } catch(e) {
          // ignore
        }
        const next = getQueryParam('next') || 'index.html';
        // Redirect
        window.location.href = next;
      } else {
        err.style.display = 'block';
        err.textContent = 'Password errata. Riprova.';
        pwInput.select();
      }
    });

    // Permetti invio con Enter e pulizia messaggio di errore
    pwInput.addEventListener('input', () => {
      err.style.display = 'none';
      err.textContent = '';
    });
  });
})();