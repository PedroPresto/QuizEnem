<%@page contentType="text/html" pageEncoding="UTF-8"%>
<html lang="pt-br" data-theme="dark">
    <head>

        <title>Resultado do Simulado</title>
        <meta name="theme-color" content="#0F172A">
        <%@ include file="/includes/head.jsp"%>
        <link rel="stylesheet" href="resultadoSimulado/resultado.css" />
        <script type="module" src="resultadoSimulado/resultadoSimulado.js"></script>
    </head>
    <body>
        
        <main class="container">
            <h1>Resultado do Simulado</h1>

            <div class="main-content">
                <div class="left-panel">
                    <div class="chart-container animate-fade-in" style="animation-delay: 0.2s">
                        <canvas id="resultsChart"></canvas>

                    </div>

                    <div class="progress-container animate-fade-in" style="animation-delay: 0.4s">
                        <h3>Taxa de Aproveitamento</h3>
                        <div class="trend-indicator positive"><i class="fas fa-arrow-up"></i> 1,3% acima da média</div>
                        <div class="progress-bar">
                            <div id="progressBar" class="progress-bar-fill"></div>
                        </div>
                        <p id="progressText" class="progress-text">0%</p>
                    </div>
                </div>

                <div class="right-panel">
                    <div class="stats-table animate-fade-in" style="animation-delay: 0.8s">
                        <h3>Estatátiscas Detalhadas</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Métrica</th>
                                    <th>Valor</th>
                                    <th>Porcentagem</th>
                                </tr>
                            </thead>
                            <tbody id="statsTable"></tbody>
                        </table>
                    </div>

                    <div class="cards-container">
                        <div class="card animate-fade-in">
                            <h3><i class="fas fa-list-ol total"></i> Total de Questões</h3>
                            <p id="totalQuestions">-</p>
                        </div>
                        <div class="card animate-fade-in" style="animation-delay: 0.2s">
                            <h3><i class="fas fa-check-circle success"></i> Acertos</h3>
                            <p id="correctAnswers" class="success">-</p>
                        </div>
                        <div class="card animate-fade-in" style="animation-delay: 0.4s">
                            <h3><i class="fas fa-times-circle error"></i> Erros</h3>
                            <p id="wrongAnswers" class="error">-</p>
                        </div>
                        <div class="card animate-fade-in" style="animation-delay: 0.6s">
                            <h3><i class="fas fa-question-circle warning"></i> Não Respondidas</h3>
                            <p id="unansweredQuestions" class="warning">-</p>
                        </div>
                    </div>


                </div>
            </div>

        </main>   

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
        <script src="SalvarQuestoesBD.js"></script>
        <script src="script.js"></script>
       
        
    </body>
</html>