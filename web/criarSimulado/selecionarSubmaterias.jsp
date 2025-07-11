
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="pt-br" data-theme="dark">
<head>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/criarSimulado/criarSimulado.css">
    <jsp:include page="/includes/head.jsp" /> <%-- Inclui seu head.jsp global --%>
    <title>Quiz Enem - Selecionar Disciplinas</title>
    <%-- Reutiliza o CSS do criarSimulado.jsp como base --%>

    <%-- Se quiser estilos específicos para esta página sem afetar criarSimulado.css, adicione um novo link CSS aqui --%>
</head>
<body>
<div class="container">
    <div class="card">
        <header class="header">
            <h1>Selecionar Disciplinas</h1>
            <p class="subtitle">Escolha as disciplinas para montar seu simulado.</p>
        </header>


        <section class="subjects-container">
            <p class="section-desc">Defina a quantidade de questões para cada disciplina:</p>
            <div class="subjects-list" id="disciplinesList">
                <%-- As sub-disciplinas com seus contadores serão renderizadas aqui via JavaScript --%>
                <div class="loader" id="disciplinesLoader">
                    <div class="dots-loader">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                    <p class="loading-message">Carregando disciplinas...</p>
                </div>
            </div>
        </section>

        <%-- Remova a seção de seleção de ano, pois a matéria já define o contexto do ano (aleatório) --%>
        <%-- Ou, se quiser manter a opção de ano para sub-matérias, adicione-a de volta aqui. --%>
        <%-- Por enquanto, seguiremos o fluxo mais simples (ano aleatório para sub-matérias). --%>

        <%-- Seção de Resumo e Botão Iniciar (reutiliza IDs do criarSimulado.jsp) --%>
        <div class="summary-card">
            <section class="summary-section">
                <div class="test-summary">
                    <div class="summary-item">
                        <span>Total de questões</span>
                        <span id="totalQuestions">0</span>
                    </div>
                    <div class="summary-item">
                        <span>Tempo estimado</span>
                        <span id="estimatedTime">0 min</span>
                    </div>
                </div>
            </section>
            <button id="startButton" class="start-button" disabled>
                <span class="button-text">Iniciar Simulado</span>
                <span class="button-icon"></span>
            </button>

        </div>
    </div>
</div>

<%-- Carregar os scripts JavaScript que serão reutilizados --%>
<script src="${pageContext.request.contextPath}/criarSimulado/js/store.js"></script>
<script>
    // Configura o tipo de simulado para a página selecionarSubmaterias.jsp
    document.addEventListener('DOMContentLoaded', () => {
        store.setSimulationType('bySubSubject');
    });
</script>
<%-- Por enquanto, vamos copiar as funções essenciais para este script,
     para garantir que elas rodem ANTES das que dependem delas.
     Idealmente, refatoraríamos subjects.js e summary.js para serem mais genéricos. --%>
<script src="${pageContext.request.contextPath}/criarSimulado/js/summary.js"></script>
<script src="js/selecionarSubmaterias.js"></script>

<%-- NOVO: Script específico para inicializar a lógica da página de sub-matérias --%>

</body>
</html>