package controller.checkout;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.model.EventDataObjectDeserializer;
import config.DBConnection;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import model.Usuario;

@WebServlet("/webhookPagamento")
public class WebhookPagamentoServlet extends HttpServlet {

    private static final String ENDPOINT_SECRET = "whsec_152MPtrOp8Bo7FgJanAiowfhjLNTtuK6";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("🚨 Entrou no WebhookPagamentoServlet");

        String sigHeader = request.getHeader("Stripe-Signature");

        if (sigHeader == null) {
            System.out.println("⚠️ Requisição sem assinatura Stripe!");
            response.setStatus(400);
            return;
        }

        // Lê o payload bruto corretamente
        byte[] payloadBytes = request.getInputStream().readAllBytes();
        String payload = new String(payloadBytes, StandardCharsets.UTF_8);

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, ENDPOINT_SECRET);
        } catch (SignatureVerificationException e) {
            System.out.println("⚠️ Webhook com assinatura inválida!");
            response.setStatus(400);
            return;
        }

        // Sucesso na validação da assinatura
        System.out.println("✅ Webhook validado com sucesso!");

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
         
            HttpSession sessao = request.getSession(true);
            Usuario usuario = (Usuario) sessao.getAttribute("usuarioLogado");

            if (usuario != null) {
                usuario.setIsPremium(true); // Atualiza o status no próprio objeto
                sessao.setAttribute("usuarioLogado", usuario); // Regrava na sessão (opcional se for o mesmo objeto)
            }

            if (deserializer.getObject().isPresent()) {
                Session session = (Session) deserializer.getObject().get();
                String email = session.getCustomerEmail();

                System.out.println("📧 Cliente: " + email);

                try (Connection conn = DBConnection.getConnection()) {
                    PreparedStatement st = conn.prepareStatement(
                            "UPDATE usuarios SET ispremium = TRUE WHERE email = ?"
                    );
                    st.setString(1, email);
                    int linhas = st.executeUpdate();

                    if (linhas > 0) {
                        System.out.println("🔥 Usuário " + email + " promovido a Premium!");
                    } else {
                        System.out.println("⚠️ Nenhum usuário encontrado com o e-mail: " + email);
                    }

                } catch (SQLException e) {
                    System.out.println("💥 Erro ao atualizar o banco: " + e.getMessage());
                    e.printStackTrace();
                }

            }
        }

        response.setStatus(200); // Confirma que o webhook foi processado com sucesso
    }
}
