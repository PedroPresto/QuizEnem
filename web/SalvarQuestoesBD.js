window.addEventListener("DOMContentLoaded", () => {
  // Só envia se tiver respostas salvas localmente
  const respostasSalvas = sessionStorage.getItem("respostasSimulado");
  if (!respostasSalvas || respostasSalvas === null) return;

  // Envia para o servlet salvarQuestoesBD
  fetch(`salvarQuestoesBD`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    console.log("Respostas gravadas no banco:", data);
    // Limpa o sessionStorage, se quiser evitar envio duplicado
    sessionStorage.removeItem("respostasSimulado");
  })
  .catch(error => {
    console.error("Erro ao salvar respostas no banco:", error);
  });
});
