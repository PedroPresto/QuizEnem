package dao; // ajuste o pacote conforme o nome do seu projeto, ex: br.com.quizenem.dao

import model.Usuario;
import config.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class UsuarioDAO {

    public boolean existeEmail(String email) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE email = ?";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, email);
            ResultSet rs = st.executeQuery();

            if (rs.next()) {
                return true;
            }

        } catch (SQLException e) {
        }
        return false;
    }

    // Método para inserir um novo usuário no banco
    // Método para inserir um novo usuário no banco
    public boolean cadastrar(Usuario usuario) {
        String sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {

            st.setString(1, usuario.getNome());
            st.setString(2, usuario.getEmail());
            st.setString(3, usuario.getSenha());

            int linhasAfetadas = st.executeUpdate();
            return linhasAfetadas > 0;

        } catch (SQLException e) {
            return false;
        }
    }

    // Método para autenticar login do usuário
    public Usuario autenticar(String email, String senha) {
        String sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {

            st.setString(1, email);
            st.setString(2, senha);

            ResultSet rs = st.executeQuery();

            if (rs.next()) {
                Usuario usuario = new Usuario();
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));
                //usuario.setSenha(rs.getString("senha"));
                usuario.setIsAdmin(rs.getBoolean("isadmin"));
                usuario.setIsPremium(rs.getBoolean("ispremium"));
                usuario.setDataCadastro(rs.getString("data_cadastro"));
                return usuario;
            }

        } catch (SQLException e) {
        }

        return null; // usuário não encontrado ou erro
    }

    public Usuario findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE email = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, email);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapToUsuario(rs);
                }
            }
        }
        return null;
    }

    //Busca usuário pelo googleId (autenticação via Google)    
    public Usuario findByGoogleId(String googleId) throws SQLException {
        String sql = "SELECT * FROM usuarios WHERE google_id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, googleId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return mapToUsuario(rs);
                }
            }
        }
        return null;
    }

    //Insere usuário vindo do login via Google
    public void insertGoogle(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (nome, email, google_id, foto) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            st.setString(1, usuario.getNome());
            st.setString(2, usuario.getEmail());
            st.setString(3, usuario.getGoogleId());
            st.setString(4, usuario.getFoto());
            st.executeUpdate();
            try (ResultSet keys = st.getGeneratedKeys()) {
                if (keys.next()) {
                    usuario.setId(keys.getInt(1));
                }
            }
        }
    }

    //Atualiza usuário existente com dados do Google
    public void updateGoogle(Usuario usuario) throws SQLException {
        String sql = "UPDATE usuarios SET nome = ?, email = ?, foto = ?, google_id = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, usuario.getNome());
            st.setString(2, usuario.getEmail());
            st.setString(3, usuario.getFoto());
            st.setString(4, usuario.getGoogleId());
            st.setInt(5, usuario.getId());
            st.executeUpdate();
        }
    }

    //Mapeia um ResultSet para um objeto Usuario
    private Usuario mapToUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getInt("id"));
        usuario.setNome(rs.getString("nome"));
        usuario.setEmail(rs.getString("email"));
        usuario.setFoto(rs.getString("foto"));
        usuario.setIsAdmin(rs.getBoolean("isadmin"));
        usuario.setIsPremium(rs.getBoolean("ispremium"));
        usuario.setDataCadastro(rs.getString("data_cadastro"));
        usuario.setGoogleId(rs.getString("google_id"));
        return usuario;
    }
}
