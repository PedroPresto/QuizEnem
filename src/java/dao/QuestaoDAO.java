package dao;

import config.DBConnection;
import model.QuestaoGabarito;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;

public class QuestaoDAO {

    /**
     * Busca todos os dados de uma questão no banco de dados, formatando-os para o gabarito.
     * @param idQuestao O ID da questão a ser buscada.
     * @return um objeto QuestaoGabarito preenchido, ou null se não for encontrada.
     * @throws SQLException
     */
    public QuestaoGabarito findQuestaoCompletaById(int idQuestao) throws SQLException {
        String sql = "SELECT enunciado, anexo_texto, escolha_a, escolha_b, escolha_c, escolha_d, escolha_e, resposta_correta, comentario FROM questoes WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(sql)) {

            st.setInt(1, idQuestao);

            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    QuestaoGabarito qg = new QuestaoGabarito();
                    qg.setId(idQuestao);
                    qg.setEnunciado(rs.getString("enunciado"));
                    qg.setAnexoTexto(rs.getString("anexo_texto"));
                    qg.setRespostaCorreta(rs.getString("resposta_correta"));
                    qg.setComentario(rs.getString("comentario"));

                    // Usamos LinkedHashMap para manter a ordem das alternativas (A, B, C, D, E)
                    Map<String, String> alternativas = new LinkedHashMap<>();
                    alternativas.put("A", rs.getString("escolha_a"));
                    alternativas.put("B", rs.getString("escolha_b"));
                    alternativas.put("C", rs.getString("escolha_c"));
                    alternativas.put("D", rs.getString("escolha_d"));
                    alternativas.put("E", rs.getString("escolha_e"));
                    qg.setAlternativas(alternativas);

                    return qg;
                }
            }
        }
        return null;
    }
}