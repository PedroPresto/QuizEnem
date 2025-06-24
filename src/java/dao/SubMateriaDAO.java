package dao;

import config.DBConnection;
import model.SubMateria;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SubMateriaDAO {

    public List<SubMateria> getSubMateriasByMateriaId(int idMateria) throws SQLException {
        List<SubMateria> subMaterias = new ArrayList<>();

        String sql = "SELECT id, nome, id_materia FROM sub_materias WHERE id_materia = ? ORDER BY nome";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement st = conn.prepareStatement(sql)) {

            st.setInt(1, idMateria);

            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    SubMateria subMateria = new SubMateria();
                    subMateria.setId(rs.getInt("id")); // Assumindo 'id' é a PK da tabela submaterias
                    subMateria.setNome(rs.getString("nome"));
                    subMateria.setId_materia(rs.getInt("id_materia"));
                    subMaterias.add(subMateria);
                }
            }
        }
        return subMaterias;
    }
}