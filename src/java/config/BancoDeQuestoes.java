package config;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BancoDeQuestoes{

    public static String getGabarito(int idQuestao) {
        String sql = "SELECT resposta_correta FROM questoes WHERE id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, idQuestao);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("resposta_correta");
            }
        } catch (SQLException e) {
            // ou log
            
        }
        return null;
    }
}
