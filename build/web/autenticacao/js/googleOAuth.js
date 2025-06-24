
  // Substitua pelo seu Client ID do Google Cloud
const CLIENT_ID = '38814715322-327dbngal89ptbne74bqmfnc8e2e2qtc.apps.googleusercontent.com';

  // Função chamada pelo Google quando o usuário faz login
function handleCredentialResponse(response) {
  const idToken = response.credential;

  fetch(contextPath + '/loginGoogleJs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  })
  .then(res => res.json())
  .then(json => {
    if (json.status === 'ok' || json.success) {
      // 1) Armazenar no mesmo formato do login tradicional
      // seu servlet pode retornar { status: 'ok', nome, isadmin, ispremium }
      localStorage.setItem("nome",     json.nome);
      localStorage.setItem("isadmin",  json.isadmin);
      localStorage.setItem("ispremium",json.ispremium);

      // 2) Mostrar feedback usando a mesma função
      mostrarMensagem('success', 'Login com Google realizado! Redirecionando...');

      // 3) Substituir o histórico para limpar URL do login
      window.history.replaceState(null, "", contextPath + "/");

      // 4) Redirecionar pro index após 500ms
      setTimeout(() => {
        window.location.href = contextPath + "/index.jsp";
      }, 500);

    } else {
      // em vez de alert, use a mesma UI de erro
      mostrarMensagem('error', json.error || 'Falha ao logar com Google.');
    }
  })
  .catch(err => {
    console.error(err);
    mostrarMensagem('error', 'Erro de comunicação com o servidor.');
  });
}


window.onload = () => {
  google.accounts.id.initialize({
    client_id: "38814715322-327dbngal89ptbne74bqmfnc8e2e2qtc.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    ux_mode: 'popup'
  });

  google.accounts.id.renderButton(
    document.getElementById('google-signin-button'),
    { theme: 'outline', size: 'large', shape: 'pill' }
  );

  google.accounts.id.prompt();
};
