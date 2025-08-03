let modoAtual = 'login'; // login ou cadastro
import {getUserState, toggleLoginState} from '/Quiz-Enem/menu/userState.js';

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
        campoNome.style.display = 'none';
        campoConfirmarSenha.style.display = 'none';
        botaoSubmit.querySelector('.button-text').textContent = 'Entrar';
        formLogin.action = contextPath + '/login';
        alternarMensagem.innerHTML = 'Ainda n\u00E3o tem conta? <a href="#" id="linkCadastro">Cadastre-se</a>';
    } else if (modo === 'cadastro') {
        campoNome.style.display = 'block';
        campoConfirmarSenha.style.display = 'block';
        botaoSubmit.querySelector('.button-text').textContent = 'Criar minha conta';
        formLogin.action = contextPath + '/cadastro';
        alternarMensagem.innerHTML = 'J\u00E1 tem uma conta? <a href="#" id="linkLogin">Entrar</a>';
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
    if (tipo === "error") {
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
function setupAutenticacaoListeners() {

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
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        backdrop: false,
                        showClass: {
                            popup: 'animate__animated animate__fadeInRight animate__faster'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutRight animate__faster'
                        },
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });

                    if (modoAtual === 'login') {
                        Toast.fire({
                            icon: "success",
                            title: "Logado com sucesso!"
                        });
                    } else if (modoAtual === 'cadastro') {
                        mostrarMensagem('success', 'Cadastro efetuado! Seja bem-vindo!');
                        Toast.fire({
                            icon: "success",
                            title: "Logado com sucesso!"
                        });
                    }

                    //salvar usuario na sessao.
                    localStorage.setItem("nome", resultado.nome);
                    localStorage.setItem("isadmin", resultado.isadmin);
                    localStorage.setItem("ispremium", resultado.ispremium);


                    const usuario = await getUserState();
                    updateMenuContent(usuario);


                } else {
                    mostrarMensagem('error', resultado.mensagem);
                }
            }
    else
        {
            mostrarMensagem('error', 'Erro no servidor. Código: ' + response.status);
        }

    }
catch
    (erro)
    {
        console.error("Erro de rede:", erro);
        mostrarMensagem('error', 'Erro de rede ou servidor.');
    }
});
}


window.setupForm = setupForm;
window.setupAutenticacaoListeners = setupAutenticacaoListeners;
