<!-- 1. ?? Aplicar tema ANTES de qualquer CSS ou conte�do -->
<script>
  (function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  })();
</script>


<!-- 2. ? Metadados básicos e SEO -->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<%-- Título da página (o mais importante para o Google) --%>
<title>Simulados ENEM 2025 com Questões Comentadas | Quiz Enem</title>
<%-- Descrição do site (o texto que aparece sob o título no Google) --%>

<meta name="description" content="Aprimore seus estudos para o ENEM com simulados gratuitos e questões reais de provas anteriores. Descubra seus pontos fortes e fracos com gráficos e estatísticas personalizadas.">

<%-- Palavras-chave relevantes para o seu site --%>
<meta name="keywords" content="simulado enem, quiz enem, questões enem, estudar para o enem, prova do enem online, simulado ENEM 2025, estudar ENEM online, questões ENEM resolvidas, quiz ENEM gratuito, simulado inteligente, desempenho ENEM, plataforma ENEM gamificada">

<%-- URL canónica (ajuda a evitar conteúdo duplicado) --%>
<link rel="canonical" href="https://quizenem.com.br/">

<%-- Tags para Redes Sociais (Open Graph) - Como o seu site aparece quando partilhado --%>
<meta property="og:title" content="Quiz Enem - A Plataforma Inteligente para Você Gabaritar o ENEM">
<meta property="og:description" content="Simulados gratuitos, desempenho em gráficos, questões atualizadas. O ENEM ficou fácil com o Quiz Enem.">
<meta property="og:image" content="https://quizenem.com.br/assets/criarSimulado.png"> <%-- Sugestão de imagem, pode alterar --%>
<meta property="og:url" content="https://quizenem.com.br/">
<meta property="og:type" content="website">
<%-- ==========================================

<%-- Link para o ícone padrão .ico --%>
<link rel="icon" href="${pageContext.request.contextPath}/favicon.ico" sizes="any">
<%-- Link para um ícone SVG (moderno e escalável) --%>
<link rel="icon" href="${pageContext.request.contextPath}/favicon.svg" type="image/svg+xml">
<%-- Link para o ícone da Apple (usado no iOS) --%>
<link rel="apple-touch-icon" href="${pageContext.request.contextPath}/favicon.png">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Simulados ENEM 2025 com Questões Comentadas | Quiz Enem">
<meta name="twitter:description" content="Simulados gratuitos, desempenho com gráficos e questões resolvidas. Prepare-se com inteligência para o ENEM.">
<meta name="twitter:image" content="https://quizenem.com.br/assets/criarSimulado.png">


<!-- 3. ? Pr�-conex�o para fontes (reduz o tempo de DNS/TLS) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 4. ?? Fontes e �cones externos -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />

<!-- 5. ? Anima��es e estilos de terceiros -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer"/>

<!-- 6. ? Seus estilos locais (com prioridade por virem depois) -->
<link rel="stylesheet" href="${pageContext.request.contextPath}/menu/menu.css">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/loader.css">



<!-- 7. ? Vari�veis JS globais (depois dos estilos serem aplicados) -->
<script>
  const contextPath = "${pageContext.request.contextPath}";
  const materiaFront = '<%= session.getAttribute("materiaFront")%>';
</script>

<!-- 8. ? Bibliotecas JS (com `defer` para evitar bloqueio do render) -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" defer></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js" defer></script>

<!-- 9. ? M�dulo do menu (moderno, executa depois automaticamente) -->
<script type="module" src="${pageContext.request.contextPath}/menu/createMenu.js"></script>

<!-- 10. Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6YXBB4VP4T"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-6YXBB4VP4T');
</script>

<!-- 11. Melhorer SEO ainda mais -->
<script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Quiz Enem",
        "url": "https://quizenem.com.br/",
        "logo": "https://quizenem.com.br/assets/logo.png",
        "description": "Simulados ENEM gratuitos, com correção e estatísticas. Estude de forma inteligente com o Quiz Enem.",
        "sameAs": [
            "https://www.instagram.com/quizenem",
            "https://www.youtube.com/@quizenem"
        ]
    }
</script>
