<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="pt-br" data-theme="dark">
<head>

    <title>Quiz Enem - Monte sua Prova</title>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/criarSimulado/criarSimulado.css">
    <jsp:include page="/includes/head.jsp" />
</head>
<body>
<div class="container"> <!-- Container principal -->
    <div class="card"> <!-- Card principal que reage ao tema -->
        <header class="header"> <!-- Cabeçalho do card -->
            <h1>Monte sua Prova do Seu Jeito</h1>
            <p class="subtitle">Selecione matérias e a quantidade de questões.</p>
        </header>

        <section class="subjects-container"> <!-- Seção para a lista de matérias -->
            <p class="section-desc">Defina a quantidade de questões para cada matéria:</p>
            <div class="subjects-list" id="subjectsList"> <!-- Lista onde as matérias serão renderizadas -->
                <div class="loader" id="subjectsLoader">
                    <div class="dots-loader">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                    <p class="loading-message">Carregando matérias...</p>
                </div>
            </div>
        </section>

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

<script src="${pageContext.request.contextPath}/criarSimulado/js/store.js"></script>
<script>
    // Configura o tipo de simulado para a página "Monte sua Prova"
    document.addEventListener('DOMContentLoaded', () => {
        store.setSimulationType('byMainSubjectOnly');
    });
</script>
<script src="${pageContext.request.contextPath}/criarSimulado/js/summary.js"></script>
<script src="${pageContext.request.contextPath}/criarSimulado/js/simuladoLivre.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', () => {
// Adiciona a classe 'fade-in' assim que a página estiver pronta
        document.body.classList.add('fade-in');
    });
</script>

</body>
</html>
