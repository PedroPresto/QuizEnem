package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestaConexao {
     public static void main(String[] args) {
        try {
            Connection conn = DBConnection.getConnection();
            if (conn != null) {
                System.out.println("✅ Conexão bem-sucedida!");
                conn.close(); // Fecha a conexão após o teste
            } else {
                System.out.println("❌ Falha na conexão!");
            }
        } catch (Exception e) {
            System.out.println("❌ Erro: " + e.getMessage());
        }
    }
}
