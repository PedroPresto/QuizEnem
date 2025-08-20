// =================================================================================
// Quiz Enem - Lógica da Página Inicial
// Arquivo: [seu-arquivo-principal].js
// Atualizado em: 19 de agosto de 2025
// =================================================================================

// Importações necessárias (já presentes no seu código)
import { getUserState } from './menu/userState.js';
import { criarFormularioLogin } from './menu/menu.js';

// --- FUNÇÕES DE APOIO ---

/**
 * Exibe um pop-up (usando SweetAlert2) para incentivar o upgrade para o plano Premium.
 */
function mostrarAvisoPremium() {
    Swal.fire({
        title: 'Área exclusiva para assinantes',
        html: `
    <p style="margin-bottom: 1em;">Assine para desbloquear recursos avançados:</p>
    <ul style="text-align: left; list-style: none; padding-left: 0; font-size: 1.1rem;>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Acesso a <strong>13456+ questões</strong> comentadas</li>
      <li style="margin-bottom: 0.5em; margin-top: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Revisão inteligente com gráficos de desempenho</li>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Criação de <strong>simulados personalizados</strong></li>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Estatísticas detalhadas por matéria</li>
      <li><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Suporte prioritário e novidades em primeira mão</li>
    </ul>
  `,
        icon: 'warning',
        footer: "Assine agora e estude com tudo que você merece.",
        theme: 'dark',
        showCancelButton: true,
        confirmButtonText: 'Liberar acesso Premium',
        cancelButtonText: 'Voltar',
        width: 350, // reforça o tamanho menor
        padding: '1em', // reforça o padding
        customClass: {
            title: 'my-sw-title',
            popup: 'my-swal',
            // confirmButton: 'my-sw-confirm',
            // cancelButton: 'my-sw-cancel',
            htmlContainer: 'my-sw-text'
        }

    }).then((result) => {
        if (result.isConfirmed) {
            criarSessaoCheckout();
        }
    });
}

/**
 * Gerencia o clique em qualquer card ou botão, verificando login e status premium.
 * @param {string} destinationUrl - A URL para onde o usuário será levado.
 * @param {boolean} [isPremiumFeature=true] - Define se a funcionalidade é exclusiva para premium.
 */
async function handleCardClick(destinationUrl, isPremiumFeature = true) {
    const usuario = await getUserState();

    // 1. Se não estiver logado, abre o pop-up de login.
    if (!usuario || !usuario.isLoggedIn) {
        criarFormularioLogin();
        return;
    }

    // 2. Se a funcionalidade for premium E o usuário não for premium, mostra o aviso.
    if (isPremiumFeature && !usuario.isPremium) {
        mostrarAvisoPremium();
        return;
    }

    // 3. Se todas as verificações passaram, redireciona o usuário.
    window.location.href = destinationUrl;
}


// --- LÓGICA PRINCIPAL DA PÁGINA (Executa quando o HTML é carregado) ---

document.addEventListener("DOMContentLoaded", function () {

    // --- CARD GRATUITO ---

    function selecionarQuestoes(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                // Chama o handler com 'false' para indicar que esta funcionalidade é gratuita.
                handleCardClick(`${contextPath}/criarSimulado/criarSimulado.jsp`, false);
            });
        }
    }
    // Associa a função ao botão dentro do card de provas anteriores
    selecionarQuestoes("provasAnteriores");


    // --- CARDS PREMIUM ---

    // Card "Monte sua prova"
    const devCardButton = document.getElementById('dev-card');
    if (devCardButton) {
        devCardButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Chama o handler. Como é premium, o segundo argumento é 'true' por padrão.
            handleCardClick(`${contextPath}/criarSimulado/simuladoLivre.jsp`);
        });
    }

    // Função que configura os cards de matéria (todos premium)
    function setupSubjectCardClick(cardId, materiaId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", (e) => {
                e.preventDefault();
                handleCardClick(`${contextPath}/criarSimulado/selecionarSubmaterias.jsp?idMateria=${materiaId}`);
            });
        }
    }

    // Configura os cliques para todos os cards de matéria
    setupSubjectCardClick("cardLinguagens", "3");
    setupSubjectCardClick("cardMatematica", "10");
    setupSubjectCardClick("cardFisica", "12");
    setupSubjectCardClick("cardQuimica", "13");
    setupSubjectCardClick("cardBiologia", "11");
    setupSubjectCardClick("cardGeografia", "15");
    setupSubjectCardClick("cardHistoria", "14");
    setupSubjectCardClick("cardSociologia", "17");
    setupSubjectCardClick("cardFilosofia", "16");
    setupSubjectCardClick("cardIngles", "5");
    setupSubjectCardClick("cardEspanhol", "6");
    setupSubjectCardClick("cardLiteratura", "4");
    setupSubjectCardClick("cardArtes", "8");
    setupSubjectCardClick("cardTI", "9");
    setupSubjectCardClick("cardEF", "7");


    // --- BOTÕES DE AÇÃO RÁPIDA (QUICK ACTIONS) ---

    // Função de clique para os botões de ação rápida
    function handleMenuItemClick(e) {
        e.preventDefault();
        const action = e.currentTarget.getAttribute('data-action');

        if (action === 'irEstatisticas') {
            // Acesso às estatísticas é uma funcionalidade premium
            handleCardClick(`${contextPath}/estatisticas`);
        } else if (action === 'criarSimulado') {
            // Criar simulado a partir daqui também é premium
            handleCardClick(`${contextPath}/criarSimulado/simuladoLivre.jsp`);
        }
    }

    // Associa a função de clique a todos os botões na seção 'quick-actions'
    const quickActions = document.getElementById('quick-actions');
    if(quickActions) {
        quickActions.querySelectorAll('.btn').forEach(item => {
            item.addEventListener('click', handleMenuItemClick);
        });
    }
});


function criarSessaoCheckout() {
    fetch("CriarSessaoCheckout", {
        method: "POST"
    })
        .then(response => response.text())
        .then(url => {
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                console.error("URL inválida:", url);
            }
        })
        .catch(err => console.error("Erro:", err));
}