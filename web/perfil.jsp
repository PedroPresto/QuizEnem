<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <%@ include file="/includes/head.jsp"%>
    <title>Perfil de Usuário</title>
    <!-- Importação da fonte Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/perfil.css">


    <!-- Importação dos ícones Lucide -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css" integrity="sha512-UtLOu9C7NuThQhuXXrGwx9Jb/z9zPQJctuAgNUBK3Z6kkSYT9wJ+2+dh6klS+TDBCV9kNPBbAxbVD+vCcfGPaA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>
<body>
<div class="background-container">
    <!-- Elementos de fundo com gradiente -->
    <div class="background-gradient gradient-1"></div>
    <div class="background-gradient gradient-2"></div>
</div>

<div class="page-wrapper">
    <main class="profile-card">

        <!-- Coluna da Esquerda: Perfil -->
        <div class="profile-info">
            <div class="profile-pic-container" id="profilePicTrigger">
                <img
                        src="${usuarioLogado.foto}"
                        alt="Foto de Perfil"
                        class="profile-pic"
                        id="profilePicImg"
                        onerror="this.onerror=null;this.src='https://placehold.co/160x160/333333/FFFFFF?text=${usuarioLogado.iniciais}&font=lato';"
                >
                <div class="pulsing-border"></div>
                <div class="camera-overlay">
                    <i data-lucide="camera" style="width: 28px; height: 28px;"></i>
                </div>
                <input type="file" id="fileInput" accept="image/*" style="display: none;">
            </div>
            <h1 id="userName">${usuarioLogado.nome}</h1>
            <p class="email" id="userEmail">${usuarioLogado.email}</p>
            <p class="description">
                Mantenha suas informações atualizadas para garantir a segurança da sua conta.
            </p>
        </div>

        <!-- Coluna da Direita: Formulário -->
        <div class="profile-form-container">
            <form id="profileForm" class="profile-form" novalidate>

                <!-- Dados Pessoais -->
                <div class="form-section">
                    <h3 class="personal-data-title">Dados Pessoais</h3>
                    <div class="fields-group">
                        <div class="input-field">
                            <i data-lucide="user" class="icon"></i>
                            <input type="text" id="nameInput" placeholder="Seu nome completo" value="${usuarioLogado.nome}">
                        </div>
                        <div class="input-field">
                            <i data-lucide="mail" class="icon"></i>
                            <input type="email" placeholder="Seu e-mail" value="${usuarioLogado.email}" disabled>
                        </div>
                    </div>
                </div>

                <!-- Alterar Senha -->
                <div class="form-section">
                    <h3 class="change-password-title">Alterar Senha</h3>
                    <div class="fields-group">
                        <div class="input-field password-field">
                            <i data-lucide="lock" class="icon"></i>
                            <input type="password" id="currentPassword" placeholder="Senha Atual">
                            <button type="button" class="password-toggle" data-target="currentPassword">
                                <i data-lucide="eye" class="eye-icon"></i>
                                <i data-lucide="eye-off" class="eye-off-icon" style="display: none;"></i>
                            </button>
                        </div>
                        <div class="input-field password-field">
                            <i data-lucide="lock" class="icon"></i>
                            <input type="password" id="newPassword" placeholder="Nova Senha">
                            <button type="button" class="password-toggle" data-target="newPassword">
                                <i data-lucide="eye" class="eye-icon"></i>
                                <i data-lucide="eye-off" class="eye-off-icon" style="display: none;"></i>
                            </button>
                        </div>
                        <div class="input-field password-field">
                            <i data-lucide="lock" class="icon"></i>
                            <input type="password" id="confirmPassword" placeholder="Confirmar Nova Senha">
                            <button type="button" class="password-toggle" data-target="confirmPassword">
                                <i data-lucide="eye" class="eye-icon"></i>
                                <i data-lucide="eye-off" class="eye-off-icon" style="display: none;"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mensagem de Feedback -->
                <div id="message-box"></div>

                <!-- Botão de Salvar -->
                <button type="submit" class="submit-btn">
                    Salvar Alterações
                </button>
            </form>
        </div>
    </main>
</div>

<script src="perfil.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js" integrity="sha512-JyCZjCOZoyeQZSd5+YEAcFgz2fowJ1F1hyJOXgtKu4llIa0KneLcidn5bwfutiehUTiOuK87A986BZJMko0eWQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<div class="modal-backdrop" id="cropperModalBackdrop" style="display: none;">
    <div class="modal-content">
        <h2>Ajuste sua Foto de Perfil</h2>
        <div class="modal-body">
            <div class="img-container">
                <img id="imageToCrop" src="" alt="Imagem para cortar">
            </div>
        </div>
        <div class="modal-footer">
            <button id="cancelCrop" class="modal-btn cancel-btn">Cancelar</button>
            <button id="confirmCrop" class="modal-btn confirm-btn">Confirmar e Salvar</button>
        </div>
    </div>
</div>

</body>
</html>
