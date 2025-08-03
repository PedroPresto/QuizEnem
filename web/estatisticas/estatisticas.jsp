<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
                    <p class="ranking-position">14.423º lugar entre 15.933 estudantes</p>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 20.6%"></div>
                    </div>
                    <p class="percentile">Top 2.3%</p>
                </div>
            </div>

             <%@ include file="/estatisticas/desempenho.jsp"%>

            <button class="view-quizzes-btn"  onclick="window.location.href = contextPath + '/revisao'">
                Revisar Questões Respondidas
            </button>
        </div>

        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/estatisticas.js"></script>
        
        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/estat-json.js"></script>
        <script type="module" src="${pageContext.request.contextPath}/estatisticas/js/profile.js"></script>

    </body>
</html>