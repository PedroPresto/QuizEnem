

document.addEventListener("DOMContentLoaded", function () {

//iniciarSimulad("idMateria", "numero de questoes")

// Cards de Simulados
    
    selecionarQuestoes("provasAnteriores");

    setupSubjectCardClick("dev-card", "1"); // Exemplo para o card 'dev-test'
    setupSubjectCardClick("cardLinguagens", "3"); // ID 3 para Português (Linguagens e Códigos)
    setupSubjectCardClick("cardMatematica", "10"); // ID 10 para Matemática
    setupSubjectCardClick("cardFisica", "12");
    setupSubjectCardClick("cardQuimica", "13");
    setupSubjectCardClick("cardBiologia", "11");
    setupSubjectCardClick("cardGeografia", "15");
    setupSubjectCardClick("cardHistoria", "14");
    setupSubjectCardClick("cardSociologia", "17");
    setupSubjectCardClick("cardFilosofia", "16");
    setupSubjectCardClick("cardIngles", "5");
    setupSubjectCardClick("cardEspanhol", "6");

    function selecionarQuestoes(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", (e) => {
                window.location.href = contextPath + "/criarSimulado/criarSimulado.jsp";
            });
        }
    }


    function setupSubjectCardClick(cardId, materiaId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener("click", (e) => {
                e.preventDefault();
                // Redireciona para a nova página de seleção de sub-matérias, passando o ID da matéria
                window.location.href = `criarSimulado/selecionarSubmaterias.jsp?idMateria=${materiaId}`;
            });
            console.log(`Clique no card '${cardId}' para seleção de sub-matérias (ID: ${materiaId}) ativado.`);
        } else {
            console.warn(`Card '${cardId}' não encontrado no DOM.`);
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