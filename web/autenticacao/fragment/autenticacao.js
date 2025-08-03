// autenticacao.js

let modoAtual = 'login'; // login ou cadastro
// CORREÇÃO: Removido o "/Quiz-Enem" do caminho para corresponder ao deploy como ROOT.war
import { getUserState, updateMenuContent } from '/menu/userState.js';

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
    const botaoSubmit = document.getElementById('botaoSubmit'); // Corrigido para usar o ID do botão

    mensagem.className = `feedback ${tipo}`;
    mensagem.innerText = texto;
    mensagem.style.display = 'block';
    setTimeout(() => {
        mensagem.style.opacity = 1;
    }, 10);
    if (tipo === "error") {
        botaoSubmit.classList.add('shake');
        setTimeout(() => {
            botaoSubmit.classList.remove('shake');
        }, 500);

        setTimeout(() => {
            mensagem.style.opacity = 0;
            setTimeout(() => {
                mensagem.style.display = 'none';
            }, 500);
        }, 4000);
    }
}

// Função principal que configura os "escutadores de eventos"
function setupAutenticacaoListeners() {
    // Escutador para validar a senha
    document.body.addEventListener('input', function(event) {
        if (event.target.id === 'confirmarSenha') {
            const senhaInput = document.getElementById("senha");
            const confirmarSenhaInput = event.target;
            const senha = senhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;

            if (confirmarSenha.length === 0) {
                confirmarSenhaInput.classList.remove('input-error', 'input-success');
            } else if (senha === confirmarSenha) {
                confirmarSenhaInput.classList.remove('input-error');
                confirmarSenhaInput.classList.add('input-success');
            } else {
                confirmarSenhaInput.classList.remove('input-success');
                confirmarSenhaInput.classList.add('input-error');
            }
        }
    });

    // =================================================================
    // MUDANÇA PRINCIPAL AQUI: Event Delegation para o formulário
    // =================================================================
    // Anexa o "escutador" ao corpo do documento para garantir que ele sempre funcione,
    // mesmo que o formulário seja carregado dinamicamente.
    document.body.addEventListener('submit', async function (event) {
        // Verifica se o evento de submit veio do nosso formulário de login
        if (event.target.id !== 'login-form') {
            return; // Se não for, ignora.
        }

        event.preventDefault(); // Previne o envio padrão da página

        const senhaInput = document.getElementById("senha");
        const confirmarSenhaInput = document.getElementById("confirmarSenha");

        if (modoAtual === 'cadastro') {
            if (senhaInput.value !== confirmarSenhaInput.value) {
                mostrarMensagem('error', 'As senhas não coincidem.');
                return;
            }
        }

        const formData = new URLSearchParams(new FormData(event.target));
        const formAction = event.target.action;

        try {
            const response = await fetch(formAction, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
                        timerProgressBar: true
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Logado com sucesso!"
                    });

                    localStorage.setItem("nome", resultado.nome);
                    localStorage.setItem("isadmin", resultado.isadmin);
                    localStorage.setItem("ispremium", resultado.ispremium);

                    const usuario = await getUserState();
                    updateMenuContent(usuario);

                    // =================================================================
                    // SUGESTÃO: Fechar o modal de login após o sucesso
                    // =================================================================
                    // Encontre o seu modal pelo ID e use o método para escondê-lo.
                    // Exemplo (se usar Bootstrap):
                    // const modalElement = document.getElementById('seuModalDeLogin');
                    // const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    // if (modalInstance) modalInstance.hide();
                    // Ou, sem framework:
                    // document.getElementById('seuModalDeLogin').style.display = 'none';

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

// Expõe as funções globalmente para que possam ser chamadas de outros scripts
window.setupForm = setupForm;
window.setupAutenticacaoListeners = setupAutenticacaoListeners;
