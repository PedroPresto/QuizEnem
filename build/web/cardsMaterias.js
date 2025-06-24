

document.addEventListener("DOMContentLoaded", function () {

//iniciarSimulad("idMateria", "numero de questoes")

// Cards de Simulados
    
    selecionarQuestoes("provasAnteriores");
        
    handleCardClick("dev-card", "1", "20", "Montando simulado de Testes\u2026");
    handleCardClick("cardLinguagens", "3", "20", "Carregando Linguagens e C\u00F3digos\u2026");
    handleCardClick("cardMatematica", "10", "20", "Preparando quest\u00F5es de Matem\u00E1tica\u2026");
    handleCardClick("cardFisica", "12", "20", "Preparando quest\u00F5es de F\u00EDsica\u2026");
    handleCardClick("cardQuimica", "13", "20", "Preparando quest\u00F5es de Qu\u00EDmica\u2026");
    handleCardClick("cardBiologia", "11", "20", "Desvendando a Biologia\u2026");
    handleCardClick("cardGeografia", "15", "20", "Explorando quest\u00F5es de Geografia\u2026");
    handleCardClick("cardHistoria", "14", "20", "Viajando pela Hist\u00F3ria\u2026");
    handleCardClick("cardSociologia", "17", "20", "Desvendando a Sociologia\u2026");
    handleCardClick("cardFilosofia", "16", "20", "Pegando um caf\u00E9 para filosofar\u2026");
    handleCardClick("cardIngles", "5", "10", "Entrando no mundo do Ingl\u00EAs\u2026");
    handleCardClick("cardEspanhol", "6", "10", "\u00A1Preparando quest\u00F5es de Espa\u00F1ol!");

    function selecionarQuestoes(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", (e) => {
                window.location.href = contextPath + "/criarSimulado/criarSimulado.jsp";
                
            });
        }
    }
    

    function handleCardClick(cardId, materia, quantidade, mensagemLoading) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", (e) => {
                e.preventDefault();
                const spinner = document.getElementById("loadingSpinner");
                const message = document.getElementById("loadingMessage");
                if (spinner && message) {
                    spinner.style.display = "flex";
                    message.textContent = mensagemLoading;
                }

                setTimeout(() => {
                    iniciarSimulado(materia, quantidade);
                }, 600);
            });
            console.log(`Clique no card ${cardId} ativado.`);
        } else {
            console.warn(`Card ${cardId} não encontrado no DOM.`);
        }
    }
    
     const quickActions = document.getElementById('quick-actions');
    quickActions.querySelectorAll('.btn').forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });
    
    function handleMenuItemClick(e) {
    e.preventDefault();   
    const action = e.currentTarget.getAttribute('data-action');
    switch (action) {
       
        case 'irEstatisticas':
            window.location.href = contextPath + "/estatisticas";
            break;
        
        case 'criarSimulado':
            window.location.href = contextPath + "/criarSimulado/criarSimulado.jsp"; // <- sua função customizada
            break;
       
        default:
            console.log('Ação não reconhecida:', action);
    }


}


});