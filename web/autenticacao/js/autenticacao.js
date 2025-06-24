let modoAtual = 'login'; // login ou cadastro
console.log("autenticacao.js carregado")

// Configura o formulário para login ou cadastro
function setupForm(modo) {
    const titulo = document.getElementById('tituloForm');
    const subtitulo = document.getElementById('subtituloForm');
    const formLogin = document.getElementById('login-form');
    const campoNome = document.getElementById('campoNome');
    const campoConfirmarSenha = document.getElementById('campoConfirmarSenha');
    const botaoSubmit = document.getElementById('botaoSubmit');
    const alternarMensagem = document.getElementById('alternarMensagem');
    

    modoAtual = modo; // Atualiza o modo atual

    if (modo === 'login') {
        titulo.textContent = 'Bora conquistar sua vaga?';
        subtitulo.textContent = 'Faça login e continue sua jornada para o ENEM';
        campoNome.style.display = 'none';
        campoConfirmarSenha.style.display = 'none';
        botaoSubmit.querySelector('.button-text').textContent = 'Entrar';
        formLogin.action = contextPath + '/login';
        alternarMensagem.innerHTML = 'Ainda não tem conta? <a href="#" id="linkCadastro">Cadastre-se</a>';
    } else if (modo === 'cadastro') {
        titulo.textContent = 'Crie sua conta para entrar no ritmo do ENEM';
        subtitulo.textContent = 'Todo sonho começa com um primeiro passo';
        campoNome.style.display = 'block';
        campoConfirmarSenha.style.display = 'block';
        botaoSubmit.querySelector('.button-text').textContent = 'Criar minha conta';
        formLogin.action = contextPath + '/cadastro';
        alternarMensagem.innerHTML = 'Já tem uma conta? <a href="#" id="linkLogin">Entrar</a>';
    }

    // Atualiza os eventos dos novos links
    bindEvents();
}

// Conecta os eventos dos links (Entrar e Cadastre-se)
function bindEvents() {
    const linkCadastro = document.getElementById('linkCadastro');
    const linkLogin = document.getElementById('linkLogin');

    if (linkCadastro) {
        linkCadastro.addEventListener('click', function (e) {
            e.preventDefault();
            setupForm('cadastro');
        });
    }

    if (linkLogin) {
        linkLogin.addEventListener('click', function (e) {
            e.preventDefault();
            setupForm('login');
        });
    }
}

// Exibe mensagens de erro ou sucesso
function mostrarMensagem(tipo, texto) {
    const mensagem = document.getElementById('feedback');
    const formLogin = document.getElementById('botaoSubmit');

    mensagem.className = `feedback ${tipo}`;
    mensagem.innerText = texto;
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.opacity = 1;
    }, 10);
    if (tipo === "error"){
    // Faz o formulário tremer
    formLogin.classList.add('shake');
    setTimeout(() => {
        formLogin.classList.remove('shake');
    }, 500);

    // Some após alguns segundos
    setTimeout(() => {
        mensagem.style.opacity = 0;
        setTimeout(() => {
            mensagem.style.display = 'none';
        }, 500);
    }, 4000);
    }
}

// Quando a página terminar de carregar
document.addEventListener('DOMContentLoaded', function () {
    setupForm('login'); // Começa no modo login

    const formLogin = document.getElementById('login-form');
    const senhaInput = document.getElementById("senha");
    const confirmarSenhaInput = document.getElementById("confirmarSenha");

    confirmarSenhaInput.addEventListener('input', function () {
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;

        if (confirmarSenha.length === 0) {
            // Se ainda não digitou nada, limpa tudo
            confirmarSenhaInput.classList.remove('input-error', 'input-success');
        } else if (senha === confirmarSenha) {
            // Se baterem certinho
            confirmarSenhaInput.classList.remove('input-error');
            confirmarSenhaInput.classList.add('input-success');
        } else {
            // Se estiverem diferentes
            confirmarSenhaInput.classList.remove('input-success');
            confirmarSenhaInput.classList.add('input-error');
        }
    });

    formLogin.addEventListener('submit', async function (event) {
        //window.history.replaceState({}, document.title, contextPath + "/autenticacao/login.jsp");
        event.preventDefault();

        if (modoAtual === 'cadastro') {
            const senha = senhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;

            if (senha !== confirmarSenha) {
                mostrarMensagem('error', 'As senhas não coincidem.');
                confirmarSenhaInput.classList.add('input-error');
                confirmarSenhaInput.classList.remove('input-success');
                return; // Para o envio
            } else {
                confirmarSenhaInput.classList.remove('input-error');
                confirmarSenhaInput.classList.add('input-success');
            }
        }

        // Se passou da validação, então agora monta o formData:
        const formData = new URLSearchParams();
        if (modoAtual === 'cadastro') {
            formData.append("nome", document.getElementById("nome").value);
            formData.append("email", document.getElementById("email").value);
            formData.append("senha", document.getElementById("senha").value);
            formData.append("confirmarSenha", document.getElementById("confirmarSenha").value);
        } else {
            formData.append("email", document.getElementById("email").value);
            formData.append("senha", document.getElementById("senha").value);
        }

        try {
            const response = await fetch(formLogin.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
            if (response.ok) {
                const resultado = await response.json();
                
                if (resultado.status === "ok") {
                    if (modoAtual === 'login') {
                        mostrarMensagem('success', 'Login realizado com sucesso! Redirecionando...');
                    } else if (modoAtual === 'cadastro') {
                        mostrarMensagem('success', 'Cadastro efetuado! Seja bem-vindo!');
                    }
                    //salvar usuario na sessao.
                    localStorage.setItem("nome", resultado.nome);
                    localStorage.setItem("isadmin", resultado.isadmin);
                    localStorage.setItem("ispremium", resultado.ispremium);
                    
                    window.history.replaceState(null, "", contextPath + "/");
                                      
                    setTimeout(() => {             
                        window.location.href = contextPath + "/index.jsp";
                    }, 500);

                } else {
                    mostrarMensagem('error', resultado.mensagem);
                }
            } else {
                mostrarMensagem('error', 'Erro no servidor. Código: ' + response.status);
            }

        } catch (erro) {
            console.error("Erro de rede:", erro);
            mostrarMensagem('error', 'Erro de rede ou servidor.');
        }
    });
}
);

