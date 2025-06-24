package utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import model.RespostaUsuario;

public class SimuladoUtils {
    
    @SuppressWarnings("unchecked")
    public static Map<Integer, RespostaUsuario> getRespostas(HttpServletRequest request) {
        HttpSession sessao = request.getSession();
        Map<Integer, RespostaUsuario> respostas = (Map<Integer, RespostaUsuario>) sessao.getAttribute("respostas");
        if (respostas == null) {
            respostas = new HashMap<>();
            sessao.setAttribute("respostas", respostas);
        }
        return respostas;
    }

    // Atualiza a resposta para uma questão. 'status' indica o estado (1,2,3,4)
    public static void atualizarResposta(HttpServletRequest request, int idQuestao, String userAnswer, int status) {
    Map<Integer, RespostaUsuario> respostas = getRespostas(request);
    RespostaUsuario resposta = new RespostaUsuario(idQuestao, userAnswer, status);
    respostas.put(idQuestao, resposta); // usa o idQuestao como chave
}

    
    
    // Seta ou atualiza a questão atual
    public static void atualizarQuestaoAtual(HttpServletRequest request) {
        //HttpSession sessao = request.getSession();    
        int questaoAtual = getQuestaoAtual(request);
        questaoAtual++;
        setQuestao(request, questaoAtual);
    }

    // Seta ou atualiza a questão atual método Array
    public static void setIdQuestaoAtual(HttpServletRequest request, int indice) {
    int[] idsQuestoes = (int[]) request.getSession().getAttribute("idsQuestoes");
    if (idsQuestoes != null && indice >= 0 && indice < idsQuestoes.length) {
        int questaoAtual = idsQuestoes[indice];
        setQuestao(request, questaoAtual);
    }
}


    // Define uma questão específica
    public static void setQuestao(HttpServletRequest request, int numero) {
        request.getSession().setAttribute("questaoAtual", numero);
    }

    // Retorna a materia atual da sessão
    public static String getMateriaAtual(HttpServletRequest request) {
        String materia = (String) request.getSession().getAttribute("materia");
        return materia;
    }

    // Retorna a questão atual da sessão
    public static int getQuestaoAtual(HttpServletRequest request) {
        Integer questaoAtual = (Integer) request.getSession().getAttribute("questaoAtual");
        return questaoAtual != null ? questaoAtual : 1;
    }

    // Retorna ID do Banco de Dados da questão atual 
    public static int getIdQuestaoAtual(HttpServletRequest request) {
        Integer idQuestao = (Integer) request.getSession().getAttribute("questaoAtual");
        return idQuestao != null ? idQuestao : 1;
    }

    // Zera tudo (pode ser usado ao reiniciar o simulado)
    public static void resetarSimulado(HttpServletRequest request) {
        request.getSession().removeAttribute("questaoAtual");
        // você pode adicionar: erros, acertos, tempo, etc
    }
}
