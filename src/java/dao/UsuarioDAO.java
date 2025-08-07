package dao; // ajuste o pacote conforme o nome do seu projeto, ex: br.com.quizenem.dao

import model.Usuario;
import config.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.ArrayList;

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
                usuario.setFoto(rs.getString("foto"));
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
        String sql = "INSERT INTO usuarios (nome, email, google_id) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            st.setString(1, usuario.getNome());
            st.setString(2, usuario.getEmail());
            st.setString(3, usuario.getGoogleId());
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
        String sql = "UPDATE usuarios SET nome = ?, google_id = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection(); PreparedStatement st = conn.prepareStatement(sql)) {
            st.setString(1, usuario.getNome());
            st.setString(2, usuario.getGoogleId());
            st.setInt(3, usuario.getId());
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

    public boolean atualizar(Usuario usuario) throws SQLException {
        boolean atualizarSenha = usuario.getSenha() != null && !usuario.getSenha().isEmpty();

        String sql;
        if (atualizarSenha) {
            sql = "UPDATE usuarios SET nome = ?, senha = ?, foto = ? WHERE id = ?";
        } else {
            sql = "UPDATE usuarios SET nome = ?, foto = ? WHERE id = ?";
        }

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(sql)) {

            st.setString(1, usuario.getNome());

            if (atualizarSenha) {
                st.setString(2, usuario.getSenha());
                st.setString(3, usuario.getFoto());
                st.setInt(4, usuario.getId());
            } else {
                st.setString(2, usuario.getFoto());
                st.setInt(3, usuario.getId());
            }

            int linhasAfetadas = st.executeUpdate();
            return linhasAfetadas > 0;
        }
    }

    public boolean atualizarFoto(int usuarioId, String caminhoFoto) throws SQLException {
        String sql = "UPDATE usuarios SET foto = ? WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(sql)) {

            st.setString(1, caminhoFoto);
            st.setInt(2, usuarioId);

            int linhasAfetadas = st.executeUpdate();
            return linhasAfetadas > 0;
        }
    }

    public List<Usuario> listarTodos() {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT id, nome, email, data_cadastro FROM usuarios ORDER BY id ASC";

        // Usamos try-with-resources para garantir que a conexão e outros recursos sejam fechados
        try (Connection connection = DBConnection.getConnection();
             PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            // Itera sobre cada linha do resultado da consulta
            while (rs.next()) {
                Usuario usuario = new Usuario();

                // Mapeia cada coluna para uma propriedade do objeto Usuario
                usuario.setId(rs.getInt("id"));
                usuario.setNome(rs.getString("nome"));
                usuario.setEmail(rs.getString("email"));

                // Pega o Timestamp do banco e converte para LocalDateTime
                usuario.setDataCadastro(rs.getString("data_cadastro"));

                // Adiciona o objeto preenchido à lista
                usuarios.add(usuario);
            }

        } catch (SQLException e) {
            System.err.println("Erro ao listar usuários: " + e.getMessage());
            e.printStackTrace();
        }

        return usuarios;
    }
}
