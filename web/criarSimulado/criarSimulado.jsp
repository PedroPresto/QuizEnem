<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="pt-br" data-theme="dark">
    <head>

        <style>
            .card,
            .summary-card,
            .subjects-list {
                visibility: hidden;
            }
        </style>


        <title>Simulado ENEM - Criador de Testes</title>
        <link rel="stylesheet" href="criarSimulado.css" onload="this.media = 'all'">
        <%@ include file="/includes/head.jsp"%>
    </head>

    <body>     
        <div class="container">
            <div class="card">
                <header class="header">
                    <h1>Simulado ENEM</h1>
                    <p class="subtitle">Crie seu simulado personalizado para se preparar para o ENEM.</p>
                </header>

                <section class="year-selector">
                    <h2>Ano da Prova</h2>
                    <div class="slider-container">
                        <input type="range" min="2019" max="2024" value="2024" class="slider" id="yearSlider">
                        <div class="slider-labels">
                            <span>2019</span>
                            <span>2020</span>
                            <span>2021</span>
                            <span>2022</span>
                            <span>2023</span>
                            <span>2024</span>
                        </div>
                        <div class="year-display">
                            <span id="selectedYear">2024</span>
                        </div>
                    </div>
                </section>

                <section class="subjects-container">
                    <h2>Matérias</h2>
                    <p class="section-desc">Selecione a quantidade de quest�es para cada mat�ria (0-20)</p>

                    <div id="subjectsList" class="subjects-list">
                        <!-- Subjects will be dynamically inserted here by JavaScript -->
                    </div>
                </section>
            </div>


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

    <script src="js/store.js"></script>
        <script>
            // Configura o tipo de simulado para a página criarSimulado.jsp
            document.addEventListener('DOMContentLoaded', () => {
                store.setSimulationType('bySubjectAndYear');
            });
        </script>
    <script src="js/subjects.js"></script>
    <script src="js/yearSelector.js"></script>
    <script src="js/subjectCounter.js"></script>
    <script src="js/summary.js"></script>
    <script src="js/main.js"></script>

</body>
</html>