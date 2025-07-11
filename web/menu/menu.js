// State management
let isMenuOpen = false;
let materia = localStorage.getItem("materia");
let isPremium = false;
let isLoggedIn = false;


import {getUserState, toggleLoginState} from './userState.js';


// Function to create and inject the menu HTML
export async function createMenu() {
    const menuWrapper = document.createElement('div');
    menuWrapper.className = 'menu-wrapper';
    // Menu button (hamburger)
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-button';
    menuButton.setAttribute('aria-label', 'Toggle menu');
    menuButton.innerHTML = `
    <div class="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;
    // Menu container
    const menu = document.createElement('div');
    menu.className = 'side-menu';
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    // Append elements to DOM
    menuWrapper.appendChild(menuButton);
    menuWrapper.appendChild(menu);
    menuWrapper.appendChild(overlay);
    document.body.appendChild(menuWrapper);
    // Add event listeners
    menuButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);
    // Populate menu content
    const usuario = await getUserState();
    updateMenuContent(usuario);
}

// Toggle menu state
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    const menuButton = document.querySelector('.menu-button');
    const menu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.menu-overlay');
    if (isMenuOpen) {
        menuButton.classList.add('active');
        menu.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    } else {
        menuButton.classList.remove('active');
        menu.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

// Close menu
function closeMenu() {
    if (isMenuOpen) {
        toggleMenu();
    }
}

// Update menu content based on current page and login state
async function updateMenuContent(usuario) {
    const menu = document.querySelector('.side-menu');
    if (!menu)
        return;
    if (!usuario) {
        usuario = {
            isLoggedIn: false,
            nome: 'Visitante',
            isPremium: false,
            isAdmin: false
        };
    }

    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.includes('index.jsp') || currentPath === '/';
    const isSimuladoPage = currentPath.includes('iniciarSimulado');
    const isResultadoPage = currentPath.includes('verResultado');
    const isStatisticsPage = currentPath.includes('criarSimulado') || currentPath.includes('estatisticas') || currentPath.includes('revisao');

    isPremium = usuario.isPremium;
    isLoggedIn = usuario.isLoggedIn
    console.log("usuario menu2:", usuario);
    console.log("Tipo de usuário:", typeof usuario);
    console.log("Campos:", usuario?.nome, usuario?.id, usuario?.isLoggedIn);
    menu.innerHTML = ` 
   <div class="menu-header"> 
      <span class="menu-title">Menu</span>
      <button class="menu-close-btn" aria-label="Close menu">×</button>
    </div> 

    <div class="menu-section profile-section"> <!-- SEÇÃO PERFIL -->

      <div class="user-profile"> 
  <div class="avatar-container">
    <div class="avatar">
      ${usuario.isLoggedIn && usuario.foto
        ? `<img src="${usuario.foto}" alt="Avatar" class="avatar-img">`
        : (usuario.isLoggedIn && usuario.iniciais
            ? usuario.iniciais
            : '?')}
    </div>
  </div>

  <div class="user-info">
    <div class="user-name">Olá, ${usuario.isLoggedIn ? usuario.nome : 'Visitante'}</div>

    ${
        usuario.isLoggedIn
            ? (
                usuario.isPremium
                    ? `<button class="menu-btn premium-btn shine-btn" disabled>Premium Ativo</button>`
                    : `<button class="menu-btn premium-btn shine-btn">Obter Premium</button>`
            )
            : `<button class="menu-btn login-btn login-btntest">Fazer Login</button>`
    }
  </div>
</div>
</div>
    </div>

    <div class="menu-section actions-section"> <!-- SEÇÃO PÁGINA INICIAL -->
      <div class="section-title">${isIndexPage || isStatisticsPage ? 'Página Inicial' : 'Simulado'}</div>
      <ul class="menu-list">
        ${isIndexPage || isStatisticsPage ? ` <!-- SEÇÃO PÁGINA INICIAL INDEX -->


          <li><a href="#stats" class="menu-item" data-action="irEstatisticas"><i class="fas fa-chart-line icon"></i> Meu progresso</a></li>
          <li><a href="#respondidas" class="menu-item" data-action="fazerRevisao"><i class="fas fa-list-check icon"></i> Fazer Revisão</a></li>
          <li><a href="#continuar" class="menu-item ${!materia ? 'disabled' : ''}"  ${materia ? 'data-action="retomarSimulado"' : ''}><i class="fas fa-forward icon"></i> Retomar simulado</a></li>
          ${isStatisticsPage ? `<li><a href="${contextPath}/index.jsp" class="menu-item" data-action="home"><i class="fas fa-house icon"></i> Voltar ao início</a></li>` : ''}
          ${isStatisticsPage ? `<li><a href="#theme" data-action="toggleTheme" class="menu-item"><i class="fas fa-circle-half-stroke icon"></i> Alterar tema</a></li>` : ''}

        `
        : isSimuladoPage || isResultadoPage ? ` <!-- SEÇÃO PÁGINA INICIAL SIMULADO -->

          <li><a href="reiniciarSimulado" class="menu-item" data-action="reiniciarSimulado"><i class="fas fa-rotate-right icon"></i> Reiniciar simulado</a></li>
          ${isSimuladoPage ? `<li><a href="#stats" class="menu-item" data-action="finalizarSimulado"><i class="fas fa-chart-bar icon"></i>Encerrar e ver desempenho</a></li>` : ''}
        ` : `
          <li><a href="${contextPath}/index.jsp" class="menu-item" data-action="home"><i class="fas fa-house icon"></i> Voltar ao início</a></li>
          
        `}
      </ul>
    </div>

    <!-- GERAL -->
    ${usuario.isLoggedIn ? `
      <div class="menu-section general-section"> 
        <div class="section-title">Geral</div>
        <ul class="menu-list">
        ${isSimuladoPage ? `
          <li><a href="${contextPath}/index.jsp" class="menu-item" data-action="home"><i class="fas fa-house icon"></i> Voltar ao início</a></li> 
          <li><a href="#theme" data-action="toggleTheme" class="menu-item"><i class="fas fa-circle-half-stroke icon"></i> Alterar tema</a></li>
    ` : ''}
          <li><a href="#logout" class="menu-item" data-action="criarSimulado"><i class="fa-solid fa-pen-to-square icon"></i> Criar Simulado</a></li>  
          <li><a href="#logout" class="menu-item"><i class="fa-solid fa-user-group icon"></i> Quiz Multiplayer</a></li>
          <li><a href="adminReview" class="menu-item" data-action="irAdminReview"><i class="fa-solid fa-user-group icon"></i> Admin Review</a></li>
        </ul>
      </div>
    ` : ''}

    <!-- RODAPÉ FIXO -->
    ${usuario.isLoggedIn ? `
      <div class="menu-section rodape"> 
        <div class="section-title">Perfil</div>
        <ul class="menu-list">
          <li><a href="#logout" class="menu-item"><i class="fa-solid fa-user icon"></i> Meu Perfil</a></li>
          <li><a href="#logout" class="menu-item" data-action="logout"><i class="fas fa-right-from-bracket icon"></i> Sair</a></li>

        </ul>
      </div>
    ` : ''}
  `;
    // Add event listeners
    menu.querySelector('.menu-close-btn').addEventListener('click', closeMenu);
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });

    const actionButton = menu.querySelector('.premium-btn, .login-btntest');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            if (usuario.isLoggedIn) {
                fetch("CriarSessaoCheckout", {
                    method: "POST"
                })
                    .then(response => response.text())
                    .then(url => {
                        if (url.startsWith("http")) {
                            window.location.href = url;
                        } else {
                            console.error("URL inválida:", url);
                        }
                    })
                    .catch(err => console.error("Erro:", err));
            } else {
                criarFormularioLogin();
            }

        });
    }


    //const actionButton = menu.querySelector('.premium-btn, .login-btn');
    if (actionButton) {
        actionButton.addEventListener('click', () => {
            if (usuario.isLoggedIn) {
                fetch("CriarSessaoCheckout", {
                    method: "POST"
                })
                    .then(response => response.text())
                    .then(url => {
                        if (url.startsWith("http")) {
                            window.location.href = url;
                        } else {
                            console.error("URL inválida:", url);
                        }
                    })
                    .catch(err => console.error("Erro:", err));
            } else {
                //window.location.href = contextPath + "/autenticacao/login.jsp";
            }

        });
    }
}

function criarFormularioLogin() {
    fetch(contextPath + "/autenticacao/loginFormFragment.jsp")
        .then(res => res.text())
        .then(html => {
            Swal.fire({
                title: 'Faça Login para continuar',
                theme: 'dark',
                html: `
          <form id="login-form" method="POST" action="${contextPath}/login">
            <div id="feedback" class="feedback"></div>
            ${html}
            <div class="form-options">
              <button type="submit" class="login-button" id="botaoSubmit">
                <span class="button-text">Entrar</span>
                <div class="button-shine"></div>
              </button>
            </div>
            <p class="signup-link" id="alternarMensagem">
              Ainda não tem conta? <a href="#" id="linkCadastro">Cadastre-se</a>
            </p>
          </form>
        `,

                showClass: {
                    popup: 'animate__animated animate__fadeIn' // já tem nossa animação via CSS
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOut' // ou use outra animação
                },
                showConfirmButton: false,
                showCloseButton: true,
                width: 420,
                didOpen: () => {
                    setupForm('login');
                    setupAutenticacaoListeners();
                    // Agora sim: só renderiza o botão depois que o DOM foi montado
                    const googleBtn = document.getElementById('google-signin-button');

                    if (window.google && googleBtn) {
                        google.accounts.id.initialize({
                            auto_select: true,
                            client_id: "38814715322-327dbngal89ptbne74bqmfnc8e2e2qtc.apps.googleusercontent.com",
                            callback: window.handleCredentialResponse,
                            ux_mode: 'popup'
                        });
                        google.accounts.id.renderButton(
                            document.getElementById('google-signin-button'),
                            {
                                theme: 'outline',
                                size: 'large',
                                shape: 'square',
                                text: 'Entrar com Google',
                                logo_alignment: 'left',
                                width: "350"
                            }
                        );
                    }

                }
            });
        });
}


function criarSessaoCheckout() {
    fetch("CriarSessaoCheckout", {
        method: "POST"
    })
        .then(response => response.text())
        .then(url => {
            if (url.startsWith("http")) {
                window.location.href = url;
            } else {
                console.error("URL inválida:", url);
            }
        })
        .catch(err => console.error("Erro:", err));
}

function irRevisao() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'revisao';
    document.body.appendChild(form);
    form.submit();
}

function irRetomarSimulado() {
    let materia = localStorage.getItem("materia");
    let qQntd = localStorage.getItem("qQntd");
    if (materia && qQntd) {
        Swal.fire({
            title: 'Retomar último simulado?',
            html: 'Matéria: <strong>' + materiaFront + '</strong><br>' +
                'Questões: <strong>' + qQntd + '</strong>',
            icon: 'question',
            theme: 'dark',
            showCancelButton: true,
            confirmButtonText: 'Retomar',
            cancelButtonText: 'Voltar',
            width: 350, // reforça o tamanho menor
            padding: '1em', // reforça o padding
            customClass: {
                title: 'my-sw-title',
                popup: 'my-swal',
                // confirmButton: 'my-sw-confirm',
                // cancelButton: 'my-sw-cancel',
                htmlContainer: 'my-sw-text'
            },
            // opcionalmente, controle animações de show/hide se precisar de classes especiais:
            showClass: {
                popup: '', // já tem nossa animação via CSS
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut', // ou use outra animação
            }
        }).then((result) => {
            if (result.isConfirmed) {
                retomarSimulado(materia, qQntd);
            }
        });

    }
}

function irReiniciarSimulado() {
    Swal.fire({
        title: 'Reiniciar simulado?',
        text: "Isso irá reiniciar todas as suas respostas",
        icon: 'warning',
        theme: 'dark',
        showCancelButton: true,
        confirmButtonText: 'Reiniciar',
        cancelButtonText: 'Voltar',
        width: 350, // reforça o tamanho menor
        padding: '1em', // reforça o padding
        customClass: {
            title: 'my-sw-title',
            popup: 'my-swal',
            // confirmButton: 'my-sw-confirm',
            // cancelButton: 'my-sw-cancel',
            htmlContainer: 'my-sw-text'
        },
        // opcionalmente, controle animações de show/hide se precisar de classes especiais:
        showClass: {
            popup: '' // já tem nossa animação via CSS
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut' // ou use outra animação
        }
    }).then((result) => {
        if (result.isConfirmed) {
            reiniciarSimulado();
        }
    });

}

function irAdminReview() {
    Swal.fire({
        title: '🔍 Analisar Questões',
        input: 'number',
        theme: 'dark',
        inputLabel: 'Insira o ID inicial da questão:',
        inputPlaceholder: 'Ex: 30',
        confirmButtonText: 'Analisar Questões',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value || isNaN(value) || value <= 0) {
                return 'Digite um ID válido (número maior que zero)';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const idInicial = parseInt(result.value);
            iniciarSimuladoAdmin(idInicial);
        }
    });
}

function iniciarSimuladoAdmin(idInicio) {
    resetarEstatisticas();

    fetch(`${contextPath}/getQuestoesPorIdInicial`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `idInicio=${encodeURIComponent(idInicio)}`
    })
        .then(res => res.json())
        .then(ids => {
            if (!ids || ids.length === 0) {
                alert("Nenhuma questão encontrada a partir do ID informado.");
                return;
            }

            const idsParam = ids.join(",");

            localStorage.setItem("idsQuestoes", idsParam);
            localStorage.setItem("qQntd", ids.length);
            localStorage.setItem("materia", "admin");
            localStorage.setItem("anoSimulado", "admin");

            window.location.href = `${contextPath}/iniciarSimulado?materia=admin&ids=${idsParam}&indice=0`;
        })
        .catch(err => {
            console.error("Erro ao buscar IDs por ID inicial:", err);
            alert("Erro ao iniciar simulado (modo admin).");
        });
}


async function fazerLogout() {
    Swal.fire({
        title: 'Deseja sair da sua conta?',
        text: "Você será desconectado",
        icon: 'warning',
        theme: 'dark',
        showCancelButton: true,
        confirmButtonText: 'Sair',
        cancelButtonText: 'Voltar',
        width: 350, // reforça o tamanho menor
        padding: '1em', // reforça o padding
        customClass: {
            title: 'my-sw-title',
            popup: 'my-swal',
            // confirmButton: 'my-sw-confirm',
            // cancelButton: 'my-sw-cancel',
            htmlContainer: 'my-sw-text'
        },
        // opcionalmente, controle animações de show/hide se precisar de classes especiais:
        showClass: {
            popup: '' // já tem nossa animação via CSS
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut' // ou use outra animação
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res2 = await fetch('logout', {
                    method: 'POST'
                });

                if (res2.ok) {
                    // 🔄 Limpa localStorage, atualiza UI sem recarregar
                    localStorage.clear();
                    updateMenuContent();
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
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
                        },
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Você foi desconectado"
                    });
                } else {
                    alert("Erro ao fazer logout.");
                }
            } catch (err) {
                console.error("Erro no logout:", err);
                alert("Falha de comunicação.");
            }
        }
    });
}

function goPremium() {
    Swal.fire({
        title: 'Área exclusiva para assinantes',
        html: `
    <p style="margin-bottom: 1em;">Assine para desbloquear recursos avançados:</p>
    <ul style="text-align: left; list-style: none; padding-left: 0; font-size: 1.1rem;>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Acesso a <strong>13456+ questões</strong> comentadas</li>
      <li style="margin-bottom: 0.5em; margin-top: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Revisão inteligente com gráficos de desempenho</li>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Criação de <strong>simulados personalizados</strong></li>
      <li style="margin-bottom: 0.5em;"><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Estatísticas detalhadas por matéria</li>
      <li><i class="fa-regular fa-circle-check" style="color: #10b981; margin-right: 0.2em;"></i> Suporte prioritário e novidades em primeira mão</li>
    </ul>
  `,
        icon: 'warning',
        footer: "Assine agora e estude com tudo que você merece.",
        theme: 'dark',
        showCancelButton: true,
        confirmButtonText: 'Liberar acesso Premium',
        cancelButtonText: 'Voltar',
        width: 350, // reforça o tamanho menor
        padding: '1em', // reforça o padding
        customClass: {
            title: 'my-sw-title',
            popup: 'my-swal',
            // confirmButton: 'my-sw-confirm',
            // cancelButton: 'my-sw-cancel',
            htmlContainer: 'my-sw-text'
        },
        // opcionalmente, controle animações de show/hide se precisar de classes especiais:
        showClass: {
            popup: 'animate__animated animate__fadeIn' // já tem nossa animação via CSS
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster' // ou use outra animação
        }
    }).then((result) => {
        if (result.isConfirmed) {
            criarSessaoCheckout();
        }
    });
}


// Handle menu item clicks
function handleMenuItemClick(e) {
    e.preventDefault();
    console.log("ispremium: " + isPremium);
    const action = e.currentTarget.getAttribute('data-action');
    switch (action) {
        case 'home':
            window.location.href = contextPath + "/index.jsp"; // <- sua função customizada
            break;
        case 'finalizarSimulado':
            finalizarSimulado(); // <- sua função customizada
            break;
        case 'reiniciarSimulado':
            irReiniciarSimulado();
            break;
        case 'fazerRevisao':
            if (isLoggedIn) {
                if (isPremium) {
                    window.location.href = contextPath + "/revisao";
                } else {
                    goPremium();
                }
            } else {
                criarFormularioLogin();
            }
            break;
        case 'irEstatisticas':
            if (isLoggedIn) {
                if (isPremium) {
                    window.location.href = contextPath + "/estatisticas";
                } else {
                    goPremium();
                }
            } else {
                criarFormularioLogin();
            }
            break;
        case 'toggleTheme':
            toggleTheme(); // <- sua função customizada
            break;
        case 'retomarSimulado':
            irRetomarSimulado();
            break;
        case 'criarSimulado':
            window.location.href = contextPath + "/criarSimulado/simuladoLivre.jsp"; // <- sua função customizada
            break;
        case 'logout':
            fazerLogout();
            break;
        case 'irAdminReview':
            irAdminReview();
            break;
        default:
            console.log('Ação não reconhecida:', action);
    }


}

function toggleTheme() {
    console.log("Clique detectado");
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    //setSVGIcon(newTheme === 'dark');
}


// Inicializa com o tema salvo
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
// setSVGIcon(savedTheme === "dark");

window.updateMenuContent = updateMenuContent;
