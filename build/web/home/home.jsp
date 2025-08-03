<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Quiz Enem - Simulados realistas, corre��o instant�nea e estat�sticas detalhadas para maximizar suas chances de aprova��o no ENEM." />
    <title>Quiz Enem - Simulados Realistas para o ENEM</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="home.css">
  </head>
  <body>
    <header class="header">
      <div class="container header-content">
        <a href="#" class="logo">
          <img src="https://api.iconify.design/lucide:book-open.svg?color=%2310b981" alt="" class="logo-icon">
          <span>Quiz Enem</span>
        </a>

        <nav class="nav-desktop">
          <a href="#beneficios">Benef�cios</a>
          <a href="#depoimentos">Depoimentos</a>
          <a href="#como-funciona">Como Funciona</a>
        </nav>

        <div class="auth-buttons">
          <a href="../autenticacao/login.jsp" class="btn btn-outline">Entrar</a>
          <a href="#" class="btn btn-primary">Cadastrar</a>
        </div>

        <button class="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav class="nav-mobile">
        <a href="#beneficios">Benef�cios</a>
        <a href="#depoimentos">Depoimentos</a>
        <a href="#como-funciona">Como Funciona</a>
        <a href="../autenticacao/login.jsp" class="btn btn-outline">Entrar</a>
        <a href="#" class="btn btn-primary">Cadastrar</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="container hero-content">
          <div class="hero-text">
            <h1 class="fade-in">
              <span>Prepare-se para o</span>
              <span class="highlight">ENEM como nunca antes</span>
            </h1>
            <p class="fade-in delay-100">
              Simulados realistas, corre��o instant�nea e estat�sticas detalhadas para maximizar suas chances de aprova��o.
            </p>
            <div class="hero-buttons fade-in delay-200">
              <a href="../index.jsp" class="btn btn-primary">Come�ar Simulado</a>
              <a href="#" class="btn btn-outline">
                <img src="https://api.iconify.design/lucide:play-circle.svg" alt="" class="btn-icon">
                Ver como funciona
              </a>
            </div>
            <p class="hero-stats fade-in delay-300">
              J� utilizado por <strong class="highlight">+50.000</strong> estudantes em todo o Brasil
            </p>
          </div>
          <div class="hero-image fade-in delay-300">
            <div class="hero-image-wrapper">
              <img src="https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Estudante fazendo simulado">
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" class="benefits">
        <div class="container">
          <h2 class="section-title">
            Por que escolher <span class="highlight">Quiz Enem</span>
          </h2>
          <p class="section-subtitle">
            Ferramentas poderosas para impulsionar sua prepara��o e garantir seu sucesso no ENEM
          </p>

          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:clock.svg?color=white" alt="">
              </div>
              <h3>Corre��o em tempo real</h3>
              <p>Veja seus resultados instantaneamente ap�s finalizar cada simulado</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:award.svg?color=white" alt="">
              </div>
              <h3>Ranking nacional</h3>
              <p>Compare seu desempenho com estudantes de todo o Brasil</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:zap.svg?color=white" alt="">
              </div>
              <h3>Modo simulado do dia</h3>
              <p>Um novo desafio di�rio para manter sua const�ncia nos estudos</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:bar-chart.svg?color=white" alt="">
              </div>
              <h3>Estat�sticas detalhadas</h3>
              <p>An�lise completa de desempenho por mat�ria e conte�do</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:brain.svg?color=white" alt="">
              </div>
              <h3>Conte�do personalizado</h3>
              <p>Recomenda��es de estudo baseadas nas suas dificuldades</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">
                <img src="https://api.iconify.design/lucide:target.svg?color=white" alt="">
              </div>
              <h3>Foco no que importa</h3>
              <p>Priorize os t�picos com maior incid�ncia no ENEM</p>
            </div>
          </div>
        </div>
      </section>

      <section id="depoimentos" class="testimonials">
        <div class="container">
          <h2 class="section-title">
            O que nossos <span class="highlight">alunos</span> dizem
          </h2>
          <p class="section-subtitle">
            Hist�rias reais de estudantes que transformaram sua prepara��o para o ENEM
          </p>

          <div class="testimonials-carousel">
            <button class="carousel-arrow prev">
              <img src="https://api.iconify.design/lucide:chevron-left.svg" alt="Anterior">
            </button>
            <button class="carousel-arrow next">
              <img src="https://api.iconify.design/lucide:chevron-right.svg" alt="Pr�ximo">
            </button>

            <div class="carousel-container">
              <div class="carousel-track">
                <div class="testimonial-card">
                  <div class="quote-icon">
                    <img src="https://api.iconify.design/lucide:quote.svg?color=%2310b981" alt="">
                  </div>
                  <p class="testimonial-text">O Quiz Enem transformou minha prepara��o! Em tr�s meses, melhorei significativamente minha pontua��o em matem�tica e linguagens. Consegui minha aprova��o em Medicina na UFMG.</p>
                  <div class="testimonial-author">
                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Mariana Silva">
                    <div>
                      <h4>Mariana Silva</h4>
                      <p>Aprovada em Medicina - UFMG</p>
                    </div>
                  </div>
                </div>
                <div class="testimonial-card">
                  <div class="quote-icon">
                    <img src="https://api.iconify.design/lucide:quote.svg?color=%2310b981" alt="">
                  </div>
                  <p class="testimonial-text">Os simulados s�o extremamente realistas e me ajudaram a identificar minhas fraquezas. O sistema de estat�sticas � incr�vel para acompanhar sua evolu��o ao longo do tempo.</p>
                  <div class="testimonial-author">
                    <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Lucas Oliveira">
                    <div>
                      <h4>Lucas Oliveira</h4>
                      <p>Aprovado em Engenharia - USP</p>
                    </div>
                  </div>
                </div>
                <div class="testimonial-card">
                  <div class="quote-icon">
                    <img src="https://api.iconify.design/lucide:quote.svg?color=%2310b981" alt="">
                  </div>
                  <p class="testimonial-text">Estudar com o Quiz Enem me deu confian�a para fazer a prova. As quest�es s�o muito parecidas com as do ENEM real e a an�lise de desempenho � fant�stica!</p>
                  <div class="testimonial-author">
                    <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Juliana Costa">
                    <div>
                      <h4>Juliana Costa</h4>
                      <p>Aprovada em Direito - UFRJ</p>
                    </div>
                  </div>
                </div>
                <div class="testimonial-card">
                  <div class="quote-icon">
                    <img src="https://api.iconify.design/lucide:quote.svg?color=%2310b981" alt="">
                  </div>
                  <p class="testimonial-text">O modo simulado do dia me manteve consistente nos estudos. Em menos de 6 meses, consegui evoluir o suficiente para entrar no curso que sempre sonhei.</p>
                  <div class="testimonial-author">
                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=120" alt="Gabriel Santos">
                    <div>
                      <h4>Gabriel Santos</h4>
                      <p>Aprovado em Ci�ncia da Computa��o - UNICAMP</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="carousel-dots"></div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="how-it-works">
        <div class="container">
          <h2 class="section-title">
            Como <span class="highlight">funciona</span>
          </h2>
          <p class="section-subtitle">
            Tr�s passos simples para transformar sua prepara��o para o ENEM
          </p>

          <div class="steps">
            <div class="step">
              <div class="step-icon">
                <img src="https://api.iconify.design/lucide:user-plus.svg?color=white" alt="">
                <div class="step-number">1</div>
              </div>
              <h3>Crie sua conta</h3>
              <p>Cadastre-se gratuitamente em menos de 1 minuto e tenha acesso imediato � plataforma</p>
            </div>
            <div class="step">
              <div class="step-icon">
                <img src="https://api.iconify.design/lucide:file-spreadsheet.svg?color=white" alt="">
                <div class="step-number">2</div>
              </div>
              <h3>Fa�a simulados</h3>
              <p>Escolha simulados completos ou por mat�ria, com quest�es similares �s do ENEM</p>
            </div>
            <div class="step">
              <div class="step-icon">
                <img src="https://api.iconify.design/lucide:bar-chart-2.svg?color=white" alt="">
                <div class="step-number">3</div>
              </div>
              <h3>Acompanhe seu desempenho</h3>
              <p>Visualize estat�sticas detalhadas e saiba exatamente onde precisa melhorar</p>
            </div>
          </div>

          <div class="cta-center">
            <a href="#" class="btn btn-primary btn-large">Come�ar agora</a>
            <p>J� s�o mais de 10 milh�es de quest�es respondidas na plataforma!</p>
          </div>
        </div>
      </section>

      <section class="final-cta">
        <div class="container">
          <div class="cta-content">
            <h2>Pronto para aumentar suas chances no ENEM?</h2>
            <p>Junte-se a milhares de estudantes que j� est�o se preparando de forma inteligente</p>
            
            <div class="features">
              <div class="feature">
                <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" alt="" class="feature-icon">
                <span>Acesso a milhares de quest�es similares ao ENEM</span>
              </div>
              <div class="feature">
                <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" alt="" class="feature-icon">
                <span>An�lises e estat�sticas detalhadas de desempenho</span>
              </div>
              <div class="feature">
                <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" alt="" class="feature-icon">
                <span>Corre��o instant�nea ap�s cada simulado</span>
              </div>
              <div class="feature">
                <img src="https://api.iconify.design/lucide:check-circle.svg?color=%2310b981" alt="" class="feature-icon">
                <span>Material complementar para revisar conte�dos</span>
              </div>
            </div>
            
            <a href="#" class="btn btn-white btn-large">Quero testar agora!</a>
            <p class="cta-note">Totalmente gratuito. Sem necessidade de cart�o de cr�dito.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <img src="https://api.iconify.design/lucide:book-open.svg?color=%2310b981" alt="" class="logo-icon">
              <span>Quiz Enem</span>
            </div>
            <p>A plataforma que transforma sua prepara��o para o ENEM com simulados realistas e an�lises detalhadas de desempenho.</p>
            <div class="social-links">
              <a href="#"><img src="https://api.iconify.design/lucide:instagram.svg?color=currentColor" alt="Instagram"></a>
              <a href="#"><img src="https://api.iconify.design/lucide:twitter.svg?color=currentColor" alt="Twitter"></a>
              <a href="#"><img src="https://api.iconify.design/lucide:facebook.svg?color=currentColor" alt="Facebook"></a>
              <a href="#"><img src="https://api.iconify.design/lucide:mail.svg?color=currentColor" alt="Email"></a>
            </div>
          </div>

          <div class="footer-links">
            <h3>Plataforma</h3>
            <ul>
              <li><a href="#">Simulados</a></li>
              <li><a href="#">Quest�es por mat�ria</a></li>
              <li><a href="#">Reda��o</a></li>
              <li><a href="#">Estat�sticas</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h3>Suporte</h3>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Sobre n�s</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div class="footer-links">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Termos de Uso</a></li>
              <li><a href="#">Pol�tica de Privacidade</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 Quiz Enem. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>

    <script type="module" src="teste.js"></script>
  </body>
</html>