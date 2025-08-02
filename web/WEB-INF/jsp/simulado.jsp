<%@page contentType="text/html" pageEncoding="UTF-8"%>
<head>
        <title>Questões Enem - O maior simulado de questões para o Enem!</title>
        <meta name="theme-color" content="#0F172A">
        <link rel="stylesheet" href="css/style.css">
        <%@ include file="/includes/head.jsp"%>
    </head>

    <body>  
        <div id="loadingSpinner" class="spinner-overlay">
            <div class="spinner"></div>
        </div>

        <div class="app">
            
            <header class="header">
                <div class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    <h1>Quiz Enem</h1>
                </div>

                <p class="subtitle">O maior quiz de simulados para o Enem!</p>
            </header>

            <main class="quiz-container">
                <div class="quiz-header">
                    <div class="tag-container">

                        <span class="tag">
                            <!-- �cone de livro aberto -->
                            <svg class="tag-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m0-12c-1.333 1.333-4 2-8 2v12c4 0 6.667-.667 8-2m0-12c1.333 1.333 4 2 8 2v12c-4 0-6.667-.667-8-2" />
                            </svg>
                            <span id ="nomeMateriaSpan"> <%= session.getAttribute("materiaFront")%></span>
                        </span>


                        <span class="tag" id="questaoAtualFront">
                            <!-- �cone de checklist -->
                            <svg class="tag-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />
                            </svg>
                            <span id="questaoTexto">Quest�o 1 de <%= session.getAttribute("qQntd")%></span>
                        </span>

                        <!--
                        <span class="tag" id="questaoAtualFront">

                            <svg class="tag-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />
                            </svg>
                            <span id="idQuestao">ID: <%= session.getAttribute("idQuestao")%></span>
                        </span>
                        
                        <span class="tag" id="questaoAtualFront">

                            <svg class="tag-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />
                            </svg>
                            <span id="numeroQuestao">N: <%= session.getAttribute("numeroQuestao")%></span>
                        </span>
                        -->

                        <span class="tag timer">
                            <svg class="tag-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span id="quizTimer">00:00</span>
                        </span>
                    </div>

                    <!-- <div class="progress">Quest�o  de 10</div> -->
                </div>



                <div class="question-card"> <!-- div das quest�es -->

                    <div id="question-card"></div>
                    <span class="botoes"></span>
                </div>

                <div class="question-info">


                    <div class="stats-card" >
                        <h3>Estatísticas</h3>
                        <div class="stat-item">
                            <span>Progresso</span>
                            <div class="stat-bar">
                                <div class="stat-fill" id = "questoesRespondidasBar" style="width: 0%"></div>
                            </div>
                            <span class="stat-value" id="questoesRespondidasNum">0%</span>
                        </div>

                        <div class="stat-item">
                            <span>Taxa de Acerto</span>
                            <div class="stat-bar">
                                <div class="stat-fill" id = "taxaAcertoBar" style="width: 0%"></div>
                            </div>
                            <span class="stat-value" id ="taxaAcertoNum">0%</span>
                        </div>
                    </div>

                    <div class="info-card">
                        <h3>Informações</h3>
                        <ul>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                <span id="qntdQuestoes-span">10 quest�es</span>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                                <span>25 minutos</span>
                            </li>
                            <li id="acertosInfo">Respostas Corretas: 0</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>

        <script src="script.js"></script>


        <div id="loadingSpinner" class="spinner-overlay" style="display: none;">
            <div class="spinner-content">
                <div class="dots-loader">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
                <p id="loadingMessage" class="loading-message">Carregando...</p>
            </div>
        </div>


        <script>
            document.body.classList.add("loading");

            window.addEventListener("load", () => {
                const spinner = document.getElementById("loadingSpinner");

                // Garante que o layout j� foi pintado antes de remover
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (spinner) {
                            spinner.classList.add("fade-out");

                            setTimeout(() => {
                                spinner.style.display = "none";
                                document.body.classList.remove("loading");
                            }, 400);
                        }
                    });
                });
            });
        </script>

    </body> 

</html>