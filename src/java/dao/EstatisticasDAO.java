package dao;

import config.DBConnection;
import model.Estatisticas;
import model.MateriaDesempenho;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import model.AreaDesempenho;
import model.DesempenhoDia;

public class EstatisticasDAO {

    public static Estatisticas getEstatisticas(int idUsuario) throws SQLException {
        Estatisticas estat = new Estatisticas();

        String sqlArea = """
    SELECT 
        ar.nome AS nome_area,
        SUM(CASE 
            WHEN r.status_resposta = '2' 
              OR (r.status_resposta = '3' AND r.resposta_marcada = q.resposta_correta)
            THEN 1 ELSE 0 END) AS acertos,
        SUM(CASE 
            WHEN r.status_resposta = '1' 
              OR (r.status_resposta = '3' AND r.resposta_marcada != q.resposta_correta)
            THEN 1 ELSE 0 END) AS erros
    FROM respostas_usuario r
    JOIN questoes q ON r.id_questao = q.id
    JOIN areas ar ON q.id_area = ar.id
    WHERE r.id_usuario = ?
    GROUP BY ar.nome
""";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sqlArea)) {
            st.setInt(1, idUsuario);
            ResultSet rs = st.executeQuery();
            List<AreaDesempenho> areas = new ArrayList<>();

            while (rs.next()) {
                String area = rs.getString("nome_area");
                int acertos = rs.getInt("acertos");
                int erros = rs.getInt("erros");
                areas.add(new AreaDesempenho(area, acertos, erros));
            }

            estat.setRankingPorArea(areas);
        }

        String sql = """
            SELECT 
                m.materia AS nome_materia, 
                ar.nome AS nome_area,
                SUM(CASE 
                    WHEN r.status_resposta = '2' 
                      OR (r.status_resposta = '3' AND r.resposta_marcada = q.resposta_correta)
                    THEN 1 ELSE 0 END) AS acertos,
                SUM(CASE 
                    WHEN r.status_resposta = '1' 
                      OR (r.status_resposta = '3' AND r.resposta_marcada != q.resposta_correta)
                    THEN 1 ELSE 0 END) AS erros
            FROM respostas_usuario r
            JOIN questoes q ON r.id_questao = q.id
            JOIN materias m ON q.id_materia = m.id
            JOIN areas ar ON q.id_area = ar.id        
            WHERE r.id_usuario = ?
            GROUP BY m.materia, ar.nome
        """;

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {

            st.setInt(1, idUsuario);

            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    String materia = rs.getString("nome_materia");
                    String area = rs.getString("nome_area");
                    int acertos = rs.getInt("acertos");
                    int erros = rs.getInt("erros");
                    int respondidas = acertos + erros;
                    int taxa = calcularTaxa(acertos, erros);

                    // Cria e adiciona objeto MateriaDesempenho
                    MateriaDesempenho md = new MateriaDesempenho(area, materia, respondidas, acertos, erros, taxa);

                    estat.getRankingPorMateria().add(md);

                    // Soma para estatísticas totais
                    estat.setAcertos(estat.getAcertos() + acertos);
                    estat.setErros(estat.getErros() + erros);
                }
            }
        }

        estat.setRespondidas(estat.getAcertos() + estat.getErros());
        estat.calcularTopEPiorMaterias(); // já ordena e define top/pior matéria
        estat.calcularTaxaGeral();
        estat.setAcertosPorDia(getAcertosPorDia(idUsuario));
        return estat;
    }

    private static int calcularTaxa(int acertos, int erros) {
        int total = acertos + erros;
        return total == 0 ? 0 : (int) Math.round((acertos * 100.0) / total);
    }

    public static Map<String, DesempenhoDia> getAcertosPorDia(int idUsuario) throws SQLException {
        Map<String, DesempenhoDia> desempenhoPorDia = new LinkedHashMap<>();

        String sql = "SELECT DATE(data_resposta) AS dia, "
                + "SUM(CASE WHEN status_resposta = 2 THEN 1 ELSE 0 END) AS acertos, "
                + "COUNT(*) AS total "
                + "FROM respostas_usuario "
                + "WHERE id_usuario = ? "
                + "GROUP BY DATE(data_resposta) "
                + "ORDER BY DATE(data_resposta)";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, idUsuario);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                String dia = rs.getString("dia");
                int acertos = rs.getInt("acertos");
                int total = rs.getInt("total");

                desempenhoPorDia.put(dia, new DesempenhoDia(acertos, total));
            }
        }

        return desempenhoPorDia;
    }

}
