package controller;

import utils.SimuladoUtils;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;

@WebServlet("/iniciarSimulado")
public class IniciarSimuladoServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession sessao = request.getSession();
       
        //limpar simulado anterior
        String[] limpar = {
            "opcaoCorreta", "idsQuestoes", "opcaoB", "opcaoC", "opcaoA", "anexoTexto",
            "questaoAtualFront", "opcaoD", "enunciado", "opcaoE", "materiaFront",
            "idQuestao", "questaoAtual", "indiceAtual", "respostas", "comentarioQuestao"
        };

        for (String attr : limpar) {
            sessao.removeAttribute(attr);
        }
        
        if (sessao != null) {
            Enumeration<String> nomes = sessao.getAttributeNames();
            while (nomes.hasMoreElements()) {
                String nome = nomes.nextElement();
                System.out.println("Atributo na sessão: " + nome);
            }
        }

        

        // Recupera o parâmetro "ids" da URL (por exemplo: "1,2,3,4,5,6,7,8,9,10")
        String idsString = request.getParameter("ids");
        if (idsString != null && !idsString.isEmpty()) {
            String[] idsArray = idsString.split(",");
            int[] idsQuestoes = new int[idsArray.length];
            for (int i = 0; i < idsArray.length; i++) {
                // Faz o trim caso haja espaços extras
                idsQuestoes[i] = Integer.parseInt(idsArray[i].trim());
            }
            sessao.setAttribute("idsQuestoes", idsQuestoes);
        }

        // Define o índice inicial (0) para navegar no array dos IDs
        sessao.setAttribute("indiceAtual", 0);
        sessao.setAttribute("questaoAtual", 1);

        // Utiliza o método do SimuladoUtils para definir a questão atual com base no índice
        SimuladoUtils.setIdQuestaoAtual(request, 0);

        // Recupera o ID da questão obtido a partir do array
        int questaoAtual = SimuladoUtils.getIdQuestaoAtual(request);

        // Recupera a matéria a partir do parâmetro da URL e coloca na sessão
        sessao.setAttribute("idQuestao", 0);
        sessao.setAttribute("questaoAtual", questaoAtual); // opcional, para exibição

        // Encaminha para o servlet ProximaQuestao para carregar a questão
        RequestDispatcher rd = request.getRequestDispatcher("/WEB-INF/jsp/simulado.jsp");
        rd.forward(request, response);
    }
}
