import {getUserState} from './menu/userState.js';
import {criarFormularioLogin} from './menu/menu.js';

document.addEventListener("DOMContentLoaded", function () {

    // Objeto com todas as imagens dos cards (com as novas adições)
    const cardImages = {
        "cardProvasAnteriores": "assets/anteriores.webp",
        "cardCriarSimulado": "assets/criarSimulado.webp",
        "cardLinguagens": "assets/linguagens.png",
        "cardMatematica": "assets/matematica.png",
        "cardFisica": "assets/fisica.png",
        "cardQuimica": "assets/quimica.png",
        "cardBiologia": "assets/biologia.png",
        "cardGeografia": "assets/geografia.png",
        "cardHistoria": "assets/historia.png",
        "cardSociologia": "assets/sociologia.png",
        "cardFilosofia": "assets/filosofia.png",
        "cardIngles": "assets/ingles.png",
        "cardEspanhol": "assets/espanhol.png",
        "cardLiteratura": "assets/literatura.png", // <- Corrigido
        "cardArtes": "assets/artes.png",         // <- Corrigido
        "cardTI": "assets/TI.png",                // <- Corrigido
        "cardEF": "assets/EF.png"                // <- Corrigido
    };

    // Loop para aplicar as imagens de fundo
    for (const cardId in cardImages) {
        const cardElement = document.getElementById(cardId);
        if (cardElement) {
            const imagePath = cardImages[cardId];
            cardElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${contextPath}/${imagePath}')`;
        }
    }

    // --- O RESTANTE DO SEU CÓDIGO (JÁ ESTÁ CORRETO) ---

    // Função para os cards principais
    selecionarQuestoes("provasAnteriores");

    const devCardButton = document.getElementById('dev-card');
    if (devCardButton) {
        devCardButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const usuario = await getUserState();
            if (usuario && usuario.isLoggedIn) {
                window.location.href = `${contextPath}/criarSimulado/simuladoLivre.jsp`;
            } else {
                criarFormularioLogin();
            }
        });
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
    // Adiciona a lógica de clique para os novos cards
    setupSubjectCardClick("cardLiteratura", "4");
    setupSubjectCardClick("cardArtes", "8");
    setupSubjectCardClick("cardTI", "9");
    setupSubjectCardClick("cardEF", "7");

    function selecionarQuestoes(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", async (e) => {
                e.preventDefault();
                const usuario = await getUserState();
                if (usuario && usuario.isLoggedIn) {
                    window.location.href = contextPath + "/criarSimulado/criarSimulado.jsp";
                } else {
                    criarFormularioLogin();
                }
            });
        }
    }

    function setupSubjectCardClick(cardId, materiaId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", async (e) => {
                e.preventDefault();
                const usuario = await getUserState();
                if (usuario && usuario.isLoggedIn) {
                    window.location.href = `${contextPath}/criarSimulado/selecionarSubmaterias.jsp?idMateria=${materiaId}`;
                } else {
                    criarFormularioLogin();
                }
            });
        }
    }

    const quickActions = document.getElementById('quick-actions');
    if(quickActions) {
        quickActions.querySelectorAll('.btn').forEach(item => {
            item.addEventListener('click', handleMenuItemClick);
        });
    }

    async function handleMenuItemClick(e) {
        e.preventDefault();
        const action = e.currentTarget.getAttribute('data-action');
        const usuario = await getUserState();
        if (usuario && usuario.isLoggedIn) {
            if (action === 'irEstatisticas') {
                window.location.href = contextPath + "/estatisticas";
            } else if (action === 'criarSimulado') {
                window.location.href = contextPath + "/criarSimulado/simuladoLivre.jsp";
            }
        } else {
            criarFormularioLogin();
        }
    }
});