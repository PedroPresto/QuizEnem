package controller.autenticacao;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.*;
import java.net.URL;
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

        JsonObject json = GSON.fromJson(
                new InputStreamReader(request.getInputStream(), StandardCharsets.UTF_8),
                JsonObject.class
        );
        String idTokenString = json.has("idToken") ? json.get("idToken").getAsString() : null;

        if (idTokenString == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"success\":false,\"error\":\"Token ausente\"}");
            return;
        }

        try {
            SignedJWT signedJWT = SignedJWT.parse(idTokenString);

            ConfigurableJWTProcessor<com.nimbusds.jose.proc.SecurityContext> jwtProcessor
                    = new DefaultJWTProcessor<>();
            JWKSet jwkSet = JWKSet.load(new URL(JWK_URL));
            JWK matchedJWK = jwkSet.getKeyByKeyId(signedJWT.getHeader().getKeyID());
            RSASSAVerifier verifier = new RSASSAVerifier((RSAPublicKey) matchedJWK.toRSAKey().toPublicKey());

            if (!signedJWT.verify(verifier)) {
                throw new SecurityException("Assinatura inválida");
            }

            var claims = signedJWT.getJWTClaimsSet();

            if (!claims.getAudience().contains(CLIENT_ID)) {
                throw new SecurityException("Audience inválido");
            }
            if (!"https://accounts.google.com".equals(claims.getIssuer())) {
                throw new SecurityException("Issuer inválido");
            }
            if (new Date().after(claims.getExpirationTime())) {
                throw new SecurityException("Token expirado");
            }

            String googleId = claims.getSubject();
            String email = claims.getStringClaim("email");
            String nome = claims.getStringClaim("name");
            String foto = claims.getStringClaim("picture");

            UsuarioDAO dao = new UsuarioDAO();
            Usuario u = dao.findByGoogleId(googleId);

            if (u == null) {
                u = dao.findByEmail(email);

                if (u != null) {
                    // atualiza o GoogleID no usuário existente
                    u.setGoogleId(googleId);
                    dao.updateGoogle(u);
                } else {
                    // é um novo usuário de verdade
                    u = new Usuario();
                    u.setGoogleId(googleId);
                    u.setEmail(email);
                    u.setNome(nome);
                    u.setFoto(foto);
                    dao.insertGoogle(u);
                }
            } else {
                // já tinha google_id cadastrado, atualiza dados
                u.setEmail(email);
                u.setNome(nome);
                u.setFoto(foto);
                dao.updateGoogle(u);
            }

            AuthHelper.loginSessao(request, u);

            JsonObject resultado = new JsonObject();
            resultado.addProperty("status", "ok");
            resultado.addProperty("nome", u.getNome());
            resultado.addProperty("foto", u.getFoto());
            resultado.addProperty("isadmin", u.isAdmin());
            resultado.addProperty("ispremium", u.isPremium());

            response.setContentType("application/json");
            response.getWriter().print(resultado.toString());

        } catch (ParseException | SecurityException | SQLException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().printf("{\"success\":false,\"error\":\"%s\"}", e.getMessage());
        } catch (JOSEException ex) {
            Logger.getLogger(LoginGoogleServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
