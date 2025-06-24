
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="pt-br" data-theme="dark">
<head>
    <jsp:include page="/includes/head.jsp" /> <%-- Inclui seu head.jsp global --%>
    <title>Quiz Enem - Selecionar Disciplinas</title>
    <%-- Reutiliza o CSS do criarSimulado.jsp como base --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/criarSimulado/criarSimulado.css">
    <%-- Se quiser estilos específicos para esta página sem afetar criarSimulado.css, adicione um novo link CSS aqui --%>
</head>
<body>
<div class="container">
    <div class="card">
        <header class="header">
            <h1>Selecionar Disciplinas</h1>
            <p class="subtitle">Escolha as disciplinas para montar seu simulado.</p>
        </header>

        <%-- Título que exibirá o nome da matéria principal (ex: Português) --%>
        <h2 id="mainSubjectTitle" class="section-title"></h2>

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
        <section class="summary-section">
            <h2>Resumo do Simulado</h2>
            <div class="test-summary">
                <div class="summary-item">
                    <span>Questões:</span>
                    <span id="totalQuestions">0</span>
                </div>
                <div class="summary-item">
                    <span>Tempo Estimado:</span>
                    <span id="estimatedTime">0 min</span>
                </div>
            </div>
            <button id="startButton" class="start-button" disabled>
                <span class="button-text">Iniciar Simulado</span>
                <i class="fas fa-play button-icon"></i>
            </button>
        </section>
    </div>
</div>

<%-- Carregar os scripts JavaScript que serão reutilizados --%>
<script src="${pageContext.request.contextPath}/criarSimulado/js/store.js"></script>
<%-- Por enquanto, vamos copiar as funções essenciais para este script,
     para garantir que elas rodem ANTES das que dependem delas.
     Idealmente, refatoraríamos subjects.js e summary.js para serem mais genéricos. --%>
<script src="${pageContext.request.contextPath}/criarSimulado/js/summary.js"></script>
<script src="js/selecionarSubmaterias.js"></script>

<%-- NOVO: Script específico para inicializar a lógica da página de sub-matérias --%>

</body>
</html>