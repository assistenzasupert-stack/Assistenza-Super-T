// Piccolo modulo per proteggere le pagine: richiede che sessionStorage contenga 'superT_auth' = '1'.
// Uso: chiamare requireAuth() all'apertura di una pagina che si vuole proteggere.

function requireAuth() {
  try {
    const ok = sessionStorage.getItem('superT_auth');
    if (ok !== '1') {
      // Redirect to login page (manteniamo la pagina di destinazione come query per un redirect post-login)
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = 'login.html?next=' + next;
    }
  } catch (e) {
    // In caso di errori con sessionStorage, reindirizziamo comunque
    window.location.href = 'login.html';
  }
}
