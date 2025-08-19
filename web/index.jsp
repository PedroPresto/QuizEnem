<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <link rel="preload" as="image" href="assets/criarSimulador.webp">
    <link rel="preload" as="image" href="assets/anteriores.webp">

    <meta name="theme-color" content="#0F172A">
    <%@ include file="/includes/head.jsp" %>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Enem | Simulado Enem Online com Questões Comentadas</title>
    <meta name="description"
          content="Treine para o Enem com simulados gratuitos, questões comentadas por especialistas e estatísticas personalizadas. Pratique agora no Quiz Enem!">
    <meta name="keywords"
          content="simulado Enem, Enem online, questões comentadas Enem, prova Enem, estudar para o Enem, Quiz Enem, questões personalizadas">

    <%-- login.css vai ser aplicado sempre que necessário --%>
    <link rel="stylesheet" href="css/index.css">

    <style>
        #cardCriarSimulado {
            background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('assets/anteriores.webp');
        }

        #cardProvasAnteriores {
            background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('assets/anteriores.webp');
        }
    </style>




    <link rel="stylesheet" href="autenticacao/fragment/login.css">


    <script type="module" src="autenticacao/fragment/autenticacao.js" defer></script>
    <script type="module" src="autenticacao/fragment/googleOAuth.js" defer></script>
    <script src="https://accounts.google.com/gsi/client" async defer></script>

</head>
<body>

<div class="app">
    <header class="header">
        <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m9 12 2 2 4-4"/>
            </svg>
            <h1>Quiz Enem</h1>
        </div>
        <p class="subtitle">Estude com +13.000 questões comentadas, análises inteligentes e foco total na sua aprovação
            no Enem.
        </p>
    </header>


    <main class="home-container">
        <section class="featured-exams">

            <h2>Simulados Enem</h2>
            <div class="exam-cards">

                <div class="exam-card" id="cardCriarSimulado"
                     style="background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('assets/anteriores.webp');">

                    <div class="exam-card-content">
                        <div class="exam-card-header">
                            <h3>Monte sua prova do seu jeito</h3>
                        </div>
                        <p>Questões exclusivas com comentários feitos por especialistas</p>
                        <div class="exam-stats">
                            <span>12.1k estudantes</span>
                            <span>12.364 questões</span>
                        </div>
                        <button class="btn btn-primary" id="dev-card" type="button">Começar Agora</button>
                    </div>
                </div>


                <div class="exam-card" id="cardProvasAnteriores"
                     style="background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('assets/criarSimulador.webp');">

                    <div class="free-tag">GRÁTIS!</div>

                    <div class="exam-card-content">
                        <div class="exam-card-header">
                            <h3>Edições passadas do Enem</h3>
                        </div>
                        <p>Resolva questões oficiais do Enem com comentários explicativos.</p>
                        <div class="exam-stats">
                            <span>11.3k estudantes</span>
                            <span>2.160 questões</span>
                        </div>
                        <button class="btn btn-primary" id="provasAnteriores" type="button">Começar agora</button>
                    </div>
                </div>
            </div>
            <!--
              Card "Criar Simulado" com a imagem de fundo aplicada diretamente.
            -->


        </section>

        <section class="subjects-grid">
            <h2>Estude por matérias do Enem</h2>
            <div class="subject-cards">

                <div class="subject-card" id="cardLinguagens">
                    <i class="fa-solid fa-spell-check"></i>
                    <h3>Português</h3>
                    <span>2531 questões</span>
                </div>

                <div class="subject-card" id="cardMatematica">
                    <i class="fa-solid fa-square-root-variable"></i>
                    <h3>Matemática</h3>
                    <span>2453 questões</span>
                </div>

                <div class="subject-card" id="cardGeografia">
                    <i class="fa-solid fa-earth-americas"></i>
                    <h3>Geografia</h3>
                    <span>2186 questões</span>
                </div>

                <div class="subject-card" id="cardHistoria">
                    <i class="fa-solid fa-calendar-check"></i>
                    <h3>História</h3>
                    <span>2294 questões</span>
                </div>


                <div class="subject-card" id="cardFisica">
                    <i class="fa-solid fa-apple-whole"></i>
                    <h3>Fisica</h3>
                    <span>1215 questões</span>
                </div>

                <div class="subject-card" id="cardQuimica">
                    <i class="fa-solid fa-vial-circle-check"></i>
                    <h3>Quimica</h3>
                    <span>1238 questões</span>
                </div>

                <div class="subject-card" id="cardBiologia">
                    <i class="fa-solid fa-dna"></i>
                    <h3>Biologia</h3>
                    <span>1227 questões</span>
                </div>

                <div class="subject-card" id="cardFilosofia">
                    <i class="fa-solid fa-landmark"></i>
                    <h3>Filosofia</h3>
                    <span>1194 questões</span>
                </div>

                <div class="subject-card" id="cardSociologia">
                    <i class="fa-solid fa-users-viewfinder"></i>
                    <h3>Sociologia</h3>
                    <span>1224 questões</span>
                </div>

                <div class="subject-card" id="cardIngles">
                    <i class="fa-solid fa-flag-usa"></i>
                    <h3>Inglês</h3>
                    <span>998 questões</span>
                </div>

                <div class="subject-card" id="cardEspanhol">
                    <i class="fa-solid fa-pepper-hot"></i>
                    <h3>Espanhol</h3>
                    <span>945 questões</span>
                </div>

                <div class="subject-card" id="cardLiteratura">
                    <i class="fa-solid fa-quote-left"></i>
                    <h3>Literatura</h3>
                    <span>813 questões</span>
                </div>

                <div class="subject-card" id="cardArtes">
                    <i class="fa-solid fa-signature"></i>
                    <h3>Artes</h3>
                    <span>903 questões</span>
                </div>

                <div class="subject-card" id="cardTI">
                    <i class="fa-solid fa-computer"></i>
                    <h3>T.I</h3>
                    <span>920 questões</span>
                </div>

                <div class="subject-card" id="cardEF">
                    <i class="fa-solid fa-dumbbell"></i>
                    <h3>Ed. Física</h3>
                    <span>604 questões</span>
                </div>

            </div>
        </section>

        <section class="quick-actions" id="quick-actions">
            <h2>Ferramentas de Aprendizado</h2>
            <div class="action-cards">

                <div class="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    <h3>Criar Simulado Personalizado</h3>
                    <p>Escolha as matérias, o número de questões e personalize conforme sua estratégia.</p>
                    <button class="btn btn-outline" data-action="criarSimulado">Começar Personalização</button>
                </div>

                <div class="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 3v18h18"/>
                        <path d="m19 9-5 5-4-4-3 3"/>
                    </svg>
                    <h3>Acompanhe Sua Evolução</h3>
                    <p>Visualize estatísticas, identifique pontos fortes e foque no que precisa melhorar</p>
                    <button class="btn btn-outline" data-action="irEstatisticas">Ver Desempenho</button>
                </div>

                <div class="action-card">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <h3>Explore questões aleatórias</h3>
                    <p>Treine com perguntas variadas e descubra como se sairia na prova do Enem.</p>
                    <button class="btn btn-outline">Começar Desafio</button>
                </div>
            </div>
        </section>
    </main>
</div>


<script src="script.js"></script>
<script type="module" src="cardsMaterias.js"></script>
<script src="SalvarQuestoesBD.js"></script>

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

<%
    Boolean mostrarToast = (Boolean) session.getAttribute("mostrarToast");
    if (mostrarToast != null && mostrarToast) {
        session.removeAttribute("mostrarToast");
%>
<script>
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Parabéns! Sua conta agora é Premium. \uD83E\uDD73',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showClass: {
            popup: `
                                                  animate__animated
                                                  animate__fadeInRight
                                                  animate__faster`
        },
        hideClass: {
            popup: `
                                                  animate__animated
                                                  animate__fadeOutRight
                                                  animate__faster`
        }
    });
</script>

<div id="toast-container"></div>


<%
    }
%>
</body>
</html>