<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado do Simulado</title>
    <link rel="stylesheet" href="resultadoSimulado/resultado.css" />
    <%@ include file="/includes/head.jsp"%>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">


</head>
<body>


<div class="resultado-page-wrapper">
    <main class="resultado-container">
        <header class="resultado-header">
            <div id="progressCircle" class="progress-circle">
                <div id="progressValue" class="progress-value">- %</div>
            </div>
            <h1>Seu Desempenho</h1>
            <p id="resultadoSummary" class="resultado-summary">Calculando resultado...</p>
        </header>

        <section class="stats-summary">
            <div class="stat-card acertos">
                <i data-lucide="check-circle-2"></i>
                <span id="totalAcertos" class="stat-value">-</span>
                <span class="stat-label">Acertos</span>
            </div>
            <div class="stat-card erros">
                <i data-lucide="x-circle"></i>
                <span id="totalErros" class="stat-value">-</span>
                <span class="stat-label">Erros</span>
            </div>
            <div class="stat-card sem-resposta">
                <i data-lucide="help-circle"></i>
                <span id="totalNaoRespondidas" class="stat-value">-</span>
                <span class="stat-label">Em branco</span>
            </div>
        </section>

        <section class="cta-buttons">
            <button id="verGabaritoBtn" class="cta-btn primary">
                <i data-lucide="file-text"></i> Ver Gabarito
            </button>
            <a href="javascript:reiniciarSimulado()" data-action="reiniciarSimulado" class="cta-btn secondary">
                <i data-lucide="rotate-cw"></i> Refazer Simulado
            </a>
            <a href="index.jsp" class="cta-btn secondary">
                <i data-lucide="home"></i> Voltar ao Início
            </a>
        </section>

        <section class="gabarito-detalhado" id="gabaritoDetalhado">
            <h2>Gabarito Detalhado</h2>
            <div id="listaQuestoesContainer">
                <p>Funcionalidade de gabarito detalhado a ser implementada.</p>
            </div>
        </section>
    </main>
</div>

<div id="loadingSpinner" class="spinner-overlay" style="display: flex;">
    <div class="spinner-content">
        <div class="dots-loader">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </div>
        <p id="loadingMessage" class="loading-message">Carregando seu resultado...</p>
    </div>
</div>

<script src="https://unpkg.com/lucide@latest"></script>
<script src="resultadoSimulado/resultadoSimulado.js"></script>
<script src="script.js"></script>



</body>
</html>