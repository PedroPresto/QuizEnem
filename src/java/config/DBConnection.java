// Conteúdo para java/config/DBConnection.java
package config;

import java.sql.Connection;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class DBConnection {

    private static final DataSource dataSource;

    // Bloco estático que inicializa o Spring e pega o dataSource.
    // Ele roda apenas uma vez.
    static {
        try {
            ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
            dataSource = (DataSource) context.getBean("dataSource");
        } catch (Exception e) {
            System.err.println("ERRO GRAVE: Falha ao inicializar o Spring e o DataSource.");
            e.printStackTrace();
            throw new RuntimeException("Não foi possível configurar a conexão com o banco de dados via Spring", e);
        }
    }

    /**
     * Retorna uma conexão com o banco de dados gerenciada pelo Spring.
     * O nome do método é o mesmo de antes, então nenhuma outra classe precisa ser alterada.
     * @return uma conexão SQL.
     */
    public static Connection getConnection() {
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            System.err.println("ERRO: Não foi possível obter uma conexão do DataSource.");
            e.printStackTrace();
            throw new RuntimeException("Erro ao obter conexão com o banco de dados", e);
        }
    }
}