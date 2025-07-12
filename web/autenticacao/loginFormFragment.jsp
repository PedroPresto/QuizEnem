<!-- loginFormFragment.jsp -->

<div class="google-button-wrapper">

    <div id="google-signin-button"></div>

</div>


<div class="divider">
    <span>ou</span>
</div>

<div class="form-group" id="campoNome" style="display: none;">
    <label for="nome">Nome e Sobrenome</label>
    <input type="text" id="nome" name="nome" pattern="[A-Za-z-\\s]{5,}" placeholder="Seu nome e sobrenome">
</div>

<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="Seu email" required>
</div>

<div class="form-group">
    <label for="senha">Senha</label>
    <input type="password" id="senha" name="senha" placeholder="Sua senha" required>
</div>

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
