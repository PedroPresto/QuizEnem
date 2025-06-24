package controller.checkout;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Usuario;

@WebServlet("/CriarSessaoCheckout")
public class CriarSessaoCheckout extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Stripe.apiKey = "sk_test_51RPD4FR2agjw5zPPTcJYW41Gsdwyf62orbjhm7jb4WZRsB3wCI6ZbzoNeV5fTopejVmdZcGW1At1DwUzc8IWpswG003TPcQhHr"; // sua chave secreta da Stripe

        Usuario user = (Usuario) request.getSession().getAttribute("usuarioLogado");
        
        String baseUrl = request.getRequestURL()
                        .toString()
                        .replace(request.getRequestURI(), request.getContextPath());

        
        String email = user.getEmail();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(baseUrl + "/attstatus?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:8080/Enem-Questoes1/revisao")
                .setCustomerEmail(email)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice("price_1RPD8pR2agjw5zPParpXTIuH") // Id do produto
                                .setQuantity(1L)
                                .build()
                )
                .build();

        try {
            Session session = Session.create(params); // <- É assim mesmo, e funciona na v29
            System.out.println("Sessoa criada com sucesso");
            response.setContentType("text/plain");
            response.getWriter().write(session.getUrl());
            
        } catch (StripeException e) {
            System.out.println("❌ StripeException: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao criar sessão de pagamento.");
        }
    }
}
