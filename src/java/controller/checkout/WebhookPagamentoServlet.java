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
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/webhookPagamento")
public class WebhookPagamentoServlet extends HttpServlet {

    private static final String ENDPOINT_SECRET = "whsec_n2SyMzjqFSk5I44vKgTZ4cqy8y4vigci";
    private static final Logger LOGGER = Logger.getLogger(WebhookPagamentoServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LOGGER.info("🚨 Recebido webhook do Stripe");

        String sigHeader = request.getHeader("Stripe-Signature");
        if (sigHeader == null) {
            LOGGER.warning("⚠️ Requisição sem assinatura Stripe");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Lê o payload bruto
        byte[] payloadBytes = request.getInputStream().readAllBytes();
        String payload = new String(payloadBytes, StandardCharsets.UTF_8);

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, ENDPOINT_SECRET);
        } catch (SignatureVerificationException e) {
            LOGGER.log(Level.WARNING, "⚠️ Webhook com assinatura inválida!", e);
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "💥 Erro ao processar webhook", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        LOGGER.info("✅ Webhook validado com sucesso");

        // Trata apenas eventos de checkout.completed
        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

            if (deserializer.getObject().isPresent()) {
                Session session = (Session) deserializer.getObject().get();
                String email = session.getCustomerEmail();
                LOGGER.info("📧 Cliente: " + email);

                // Atualiza o status do usuário para Premium
                try (Connection conn = DBConnection.getConnection()) {
                    PreparedStatement st = conn.prepareStatement(
                            "UPDATE usuarios SET ispremium = TRUE WHERE email = ?"
                    );
                    st.setString(1, email);
                    int linhas = st.executeUpdate();

                    if (linhas > 0) {
                        LOGGER.info("🔥 Usuário " + email + " promovido a Premium!");
                    } else {
                        LOGGER.warning("⚠️ Nenhum usuário encontrado com o e-mail: " + email);
                    }

                } catch (SQLException e) {
                    LOGGER.log(Level.SEVERE, "💥 Erro ao atualizar o banco de dados", e);
                }
            }
        } else {
            LOGGER.info("ℹ️ Evento ignorado: " + event.getType());
        }

        response.setStatus(HttpServletResponse.SC_OK);
    }
}
