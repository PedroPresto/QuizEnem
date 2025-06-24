<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <title>Meu Progresso</title> 
        <link rel="stylesheet" href="${pageContext.request.contextPath}/estatisticas/estatisticas.css"> 
        <%@ include file="/includes/head.jsp"%>
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>Estatísticas</h1>
                <p class="subtitle">Acompanhe seu desempenho</p>
            </header>

            <%@ include file="/estatisticas/profile-card.jsp"%>

            <div class="ranking-card">
                <div class="ranking-icon" style="background-color: #9CA3AF">
                    <span class="stat-icon"><i class="fa-solid fa-award"></i></span>
                </div>
                <div class="ranking-content">
                    <p class="ranking-label">Ranking Global</p>
                    <p class="ranking-position">12º lugar entre 5.000 estudantes</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 20.6%"></div>
                    </div>
                    <p class="percentile">Top 45.3%</p>
                </div>
            </div>

             <%@ include file="/estatisticas/desempenho.jsp"%>

            <div class="stats-grid">
                <h3>Estatísticas Detalhadas</h3>
                <div class="grid">
                    <div class="stat-item">
                        <div class="stat-icon" style="background-color: #BFDBFE">
                            <i class="fa-solid fa-award"></i>
                        </div>
                        <span class="stat-value">486</span>
                        <span class="stat-label">Questões Respondidas</span>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon" style="background-color: #FACC15">
                            ?
                        </div>
                        <span class="stat-value">27</span>
                        <span class="stat-label">Simulados Completos</span>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon" style="background-color: #E879F9">
                            ??
                        </div>
                        <span class="stat-value">32h 45m</span>
                        <span class="stat-label">Tempo de Estudo</span>
                    </div>
                </div>
            </div>

            <button class="view-quizzes-btn"  onclick="window.location.href = contextPath + '/revisao'">
                Revisar Questões Respondidas
            </button>
        </div>

        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/estatisticas.js"></script>
        
        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/estat-json.js"></script>
        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/profile.js"></script>

    </body>
</html>