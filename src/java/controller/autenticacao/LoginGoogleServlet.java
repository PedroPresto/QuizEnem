package controller.autenticacao;

// --- NOVOS IMPORTS NECESSÁRIOS ---
import java.io.File;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.InputStream;
// --- FIM DOS NOVOS IMPORTS ---

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.SignedJWT;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.util.Date;
import dao.UsuarioDAO;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import model.Usuario;
import utils.AuthHelper;

@WebServlet("/loginGoogleJs")
public class LoginGoogleServlet extends HttpServlet {

    private static final String CLIENT_ID = "38814715322-327dbngal89ptbne74bqmfnc8e2e2qtc.apps.googleusercontent.com";
    private static final Gson GSON = new Gson();
    private static final String JWK_URL = "https://www.googleapis.com/oauth2/v3/certs";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ... (A parte inicial de validação do token permanece a mesma) ...
        JsonObject json = GSON.fromJson(
                new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8),
                JsonObject.class
        );
        String idTokenString = json.has("idToken") ? json.get("idToken").getAsString() : null;

        if (idTokenString == null) { /* ...código de erro... */ return; }

        try {
            SignedJWT signedJWT = SignedJWT.parse(idTokenString);
            JWKSet jwkSet = JWKSet.load(new URL(JWK_URL));
            JWK matchedJWK = jwkSet.getKeyByKeyId(signedJWT.getHeader().getKeyID());
            RSASSAVerifier verifier = new RSASSAVerifier((RSAPublicKey) matchedJWK.toRSAKey().toPublicKey());
            if (!signedJWT.verify(verifier)) { throw new SecurityException("Assinatura inválida"); }
            var claims = signedJWT.getJWTClaimsSet();
            if (!claims.getAudience().contains(CLIENT_ID)) { throw new SecurityException("Audience inválido"); }
            if (!"https://accounts.google.com".equals(claims.getIssuer())) { throw new SecurityException("Issuer inválido"); }
            if (new Date().after(claims.getExpirationTime())) { throw new SecurityException("Token expirado"); }

            String googleId = claims.getSubject();
            String email = claims.getStringClaim("email");
            String nome = claims.getStringClaim("name");
            String fotoUrl = claims.getStringClaim("picture"); // URL da foto do Google

            UsuarioDAO dao = new UsuarioDAO();
            Usuario usuario = dao.findByGoogleId(googleId);

            // --- LÓGICA DE LOGIN/CADASTRO REESCRITA ---
            if (usuario != null) {
                // CENÁRIO 1: Usuário já conhecido pelo Google ID (está retornando)
                // Apenas atualizamos o nome, mas NUNCA a foto.
                usuario.setNome(nome);
                dao.updateGoogle(usuario); // Lembre-se que este método não mexe mais na foto

            } else {
                // Usuário não foi encontrado pelo Google ID, pode ser novo ou ter uma conta local
                usuario = dao.findByEmail(email);

                if (usuario != null) {
                    // CENÁRIO 2: Usuário já tem uma conta local (com email e senha)
                    // Apenas vinculamos o Google ID a essa conta existente. Não tocamos na foto.
                    usuario.setGoogleId(googleId);
                    dao.updateGoogle(usuario); // Atualiza o google_id no registro existente

                } else {
                    // CENÁRIO 3: Usuário é completamente novo no sistema
                    usuario = new Usuario();
                    usuario.setGoogleId(googleId);
                    usuario.setEmail(email);
                    usuario.setNome(nome);

                    // 1. Insere o usuário no banco para obter o ID gerado
                    dao.insertGoogle(usuario);

                    // 2. Com o ID em mãos, baixa a imagem e a salva com um nome único
                    try {
                        String caminhoLocalFoto = baixarESalvarImagem(fotoUrl, usuario.getId(), request);
                        usuario.setFoto(caminhoLocalFoto); // Define o caminho LOCAL no objeto

                        // 3. Atualiza o registro do usuário com o caminho da foto baixada
                        if (caminhoLocalFoto != null) {
                            dao.atualizarFoto(usuario.getId(), caminhoLocalFoto);
                        }
                    } catch (IOException e) {
                        System.err.println("AVISO: Falha ao baixar a foto do perfil do Google para o usuário ID " + usuario.getId() + ". " + e.getMessage());
                        // O login continua, mas o usuário ficará sem foto.
                    }
                }
            }

            // Após toda a lógica, o objeto 'usuario' está pronto para ser salvo na sessão
            AuthHelper.loginSessao(request, usuario);

            JsonObject resultado = new JsonObject();
            resultado.addProperty("status", "ok");
            resultado.addProperty("nome", usuario.getNome());
            resultado.addProperty("foto", usuario.getFoto()); // Agora enviará o caminho local
            resultado.addProperty("isadmin", usuario.isAdmin());
            resultado.addProperty("ispremium", usuario.isPremium());

            response.setContentType("application/json");
            response.getWriter().print(resultado.toString());

        } catch (ParseException | SecurityException | SQLException | JOSEException e) {
            // ... (bloco catch permanece o mesmo) ...
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().printf("{\"success\":false,\"error\":\"%s\"}", e.getMessage());
            Logger.getLogger(LoginGoogleServlet.class.getName()).log(Level.SEVERE, "Erro no login com Google", e);
        }
    }

    // --- MÉTODO AUXILIAR PARA BAIXAR A IMAGEM ---
    private String baixarESalvarImagem(String urlDaImagem, int usuarioId, HttpServletRequest request) throws IOException {
        if (urlDaImagem == null || urlDaImagem.isEmpty()) {
            return null;
        }

        URL url = new URL(urlDaImagem);

        String uploadPath = "uploads" + File.separator + "avatars";
        String applicationPath = request.getServletContext().getRealPath("");
        String absoluteUploadPath = applicationPath + File.separator + uploadPath;

        File uploadDir = new File(absoluteUploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String uniqueFileName = usuarioId + "_google_" + System.currentTimeMillis() + ".jpg";

        try (InputStream in = url.openStream()) {
            Files.copy(in, Paths.get(absoluteUploadPath + File.separator + uniqueFileName), StandardCopyOption.REPLACE_EXISTING);
        }

        return uploadPath + File.separator + uniqueFileName;
    }
}