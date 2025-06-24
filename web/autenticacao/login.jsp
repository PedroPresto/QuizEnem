<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>Login | Quiz Enem</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/login.css">
        <script> const contextPath = "${pageContext.request.contextPath}";</script>
        <script src="js/autenticacao.js"></script>
        <script src="https://accounts.google.com/gsi/client" async defer></script>

    </head>
    <body>
       


        <div class="login-container">
            <div class="visual-section">

                <div class="illustration">
                    <img src="img/quiz-enem-login.webp" alt="Estudante fazendo quiz no celular" class="student-image" loading="lazy">
                    <div class="floating-elements">
                        <!-- Add any floating icons or effects here -->
                    </div>
                </div>
            </div>
            <div class="form-section">
                <div class="form-container">
                    <div class="form-header">
                        <h2 id="tituloForm">Bora conquistar sua vaga?</h2>
                        <p id="subtituloForm">Faça login e continue sua jornada para o ENEM</p>
                    </div>

                    <form class="login-form" id="login-form" method="POST" action="${pageContext.request.contextPath}/login">

                        <div id="feedback" class="feedback"></div>

                        
                            <div id="google-signin-button" ></div>
                       

                        <div class="divider">
                            <span>ou</span>
                        </div>

                        <!-- Campo Nome (oculto inicialmente) -->
                        <div class="form-group" id="campoNome" style="display: none;">
                            <label for="nome">Nome e Sobrenome</label>
                            <input type="text" id="nome" name="nome" pattern="[A-Za-zÀ-ÿ\s]{5,}" placeholder="Seu nome e sobrenome">
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Seu email" required>
                        </div>

                        <div class="form-group">
                            <label for="senha">Senha</label>
                            <input type="password" id="senha" name="senha" placeholder="Sua senha" required>
                        </div>

                        <!-- Campo Confirmar Senha (oculto inicialmente) -->
                        <div class="form-group" id="campoConfirmarSenha" style="display: none;">
                            <label for="confirmarSenha">Confirmar Senha</label>
                            <input type="password" id="confirmarSenha" name="confirmarSenha" placeholder="Confirme sua senha">
                        </div>

                        <div class="form-options" id="opcoesLogin">
                            <label class="remember-me">
                                <input type="checkbox" id="remember">
                                <span>Lembrar-me</span>
                            </label>
                            <a href="#" class="forgot-password">Esqueceu a senha?</a>
                        </div>

                        <div class="form-options">
                            <button type="submit" class="login-button" id="botaoSubmit">
                                <span class="button-text">Entrar</span>
                                <div class="button-shine"></div>
                            </button>
                        </div>



                        <p class="signup-link" id="alternarMensagem">
                            Ainda não tem conta? <a href="#" onclick="configurarFormulario('cadastro')">Cadastre-se</a>
                        </p>
                    </form>
                </div>
            </div>

        </div>

        <script src="js/googleOAuth.js"></script>

    </body>
</html>
