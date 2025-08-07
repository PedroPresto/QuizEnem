// Renderiza os ícones do Lucide
lucide.createIcons();

document.addEventListener('DOMContentLoaded', function () {
    // --- Seleção de Elementos ---
    const profilePicTrigger = document.getElementById('profilePicTrigger');
    const fileInput = document.getElementById('fileInput');
    const profilePicImg = document.getElementById('profilePicImg');
    const profileForm = document.getElementById('profileForm');
    const messageBox = document.getElementById('message-box');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const userNameDisplay = document.getElementById('userName');

    // Elementos do Modal de Edição
    const cropperModal = document.getElementById('cropperModalBackdrop');
    const imageToCrop = document.getElementById('imageToCrop');
    const confirmCropBtn = document.getElementById('confirmCrop');
    const cancelCropBtn = document.getElementById('cancelCrop');

    let cropper = null;

    // --- Lógica para Abrir o Editor de Foto ---
    profilePicTrigger.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            imageToCrop.src = e.target.result;
            cropperModal.style.display = 'flex';
            setupCropper(imageToCrop);
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    });

    function setupCropper(imageElement) {
        if (cropper) cropper.destroy();
        cropper = new Cropper(imageElement, {
            aspectRatio: 1, // Proporção 1:1 (quadrado)
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: false,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            modal: true,
            background: true,
            responsive: true,
            checkOrientation: false,
            minContainerWidth: 300,
            minContainerHeight: 300,
            minCropBoxWidth: 100,
            minCropBoxHeight: 100,
        });
    }

    cancelCropBtn.addEventListener('click', closeCropperModal);

    function closeCropperModal() {
        if (cropper) cropper.destroy();
        cropperModal.style.display = 'none';
    }

    // --- LÓGICA DE UPLOAD DA FOTO (MOVIDA PARA O BOTÃO DO MODAL) ---
    confirmCropBtn.addEventListener('click', () => {
        if (!cropper) return;

        // Desabilita o botão e mostra feedback de carregamento
        confirmCropBtn.disabled = true;
        confirmCropBtn.textContent = 'Enviando...';

        cropper.getCroppedCanvas({
            width: 300,
            height: 300,
            imageSmoothingQuality: 'high',
        }).toBlob(async (blob) => {

            const formData = new FormData();
            formData.append('foto', blob, 'avatar.png'); // Adiciona o arquivo cortado

            try {
                // Envia para o NOVO servlet dedicado
                const response = await fetch('atualizar-foto', {
                    method: 'POST',
                    body: formData
                });

                const json = await response.json();

                if (json.status === 'ok') {
                    showMessage(json.mensagem, 'success');

                    const contextPath = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
                    // Atualiza a imagem na página com a nova URL e um parâmetro para evitar cache
                    profilePicImg.src = contextPath + '/' + json.foto.replace(/\\/g, '/') + '?v=' + new Date().getTime();
                    closeCropperModal();
                } else {
                    showMessage(json.mensagem || 'Ocorreu um erro.', 'error');
                }
            } catch (error) {
                console.error('Erro no upload da foto:', error);
                showMessage('Erro de conexão ao enviar a imagem.', 'error');
            } finally {
                // Reabilita o botão após a operação
                confirmCropBtn.disabled = false;
                confirmCropBtn.textContent = 'Confirmar e Salvar';
            }
        }, 'image/png');
    });

    // --- Lógica de Submissão do Formulário (agora apenas para NOME e SENHA) ---
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageBox.className = '';
        messageBox.textContent = '';

        const formData = new FormData(profileForm);
        const nome = formData.get('nome').trim();
        const senhaAtual = formData.get('senhaAtual').trim();
        const senha = formData.get('senha').trim();
        const confirmarSenha = formData.get('confirmarSenha').trim();

        // Não precisa mais enviar a foto aqui

        try {
            const response = await fetch('atualizar-perfil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ nome, senhaAtual, senha, confirmarSenha })
            });

            const json = await response.json();

            if (json.status === 'ok') {
                showMessage(json.mensagem, 'success');
                userNameDisplay.textContent = json.nome;
            } else {
                showMessage(json.mensagem, 'error');
            }

            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';

        } catch (error) {
            console.error('Erro na requisição:', error);
            showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
        }
    });

    // --- Funções Auxiliares (Visibilidade da Senha e Mensagens) ---
    passwordToggles.forEach(button => {
        button.addEventListener('click', () => {
            const targetInputId = button.dataset.target;
            const targetInput = document.getElementById(targetInputId);
            const eyeIcon = button.querySelector('.eye-icon');
            const eyeOffIcon = button.querySelector('.eye-off-icon');
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                eyeIcon.style.display = 'none';
                eyeOffIcon.style.display = 'inline-block';
            } else {
                targetInput.type = 'password';
                eyeIcon.style.display = 'inline-block';
                eyeOffIcon.style.display = 'none';
            }
            lucide.createIcons();
        });
    });

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end', // Posição do toast na tela
        showConfirmButton: false,
        timer: 4000, // O mesmo tempo que você já usava
        timerProgressBar: true, // Mostra uma barra de progresso do tempo
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
            toast.onmouseenter = Swal.stopTimer; // Pausa o tempo ao passar o mouse
            toast.onmouseleave = Swal.resumeTimer; // Retoma o tempo ao tirar o mouse
        }
    });

    function showMessage(text, type) {
        Toast.fire({
            icon: type, // 'success', 'error', 'warning', 'info', 'question'
            title: text,

        });
    }
});