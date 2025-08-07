package controller.autenticacao; // Verifique se o nome do pacote está correto

import com.google.gson.JsonObject;
import dao.UsuarioDAO;
import model.Usuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@MultipartConfig
@WebServlet("/atualizar-foto") // Novo endpoint dedicado para a foto
public class AtualizarFotoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonObject resultado = new JsonObject();

        HttpSession sessao = request.getSession(false);
        if (sessao == null || sessao.getAttribute("usuarioLogado") == null) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Usuário não autenticado.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print(resultado.toString());
            return;
        }

        Usuario usuarioLogado = (Usuario) sessao.getAttribute("usuarioLogado");
        Part filePart = request.getPart("foto");
        String fileName = getFileName(filePart);

        if (fileName == null || fileName.isEmpty()) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Nenhum arquivo de imagem foi enviado.");
            response.getWriter().print(resultado.toString());
            return;
        }

        String novoCaminhoDaFoto = "";

        try {
            String uploadPath = "uploads" + File.separator + "avatars";
            String applicationPath = request.getServletContext().getRealPath("");
            String absoluteUploadPath = applicationPath + File.separator + uploadPath;

            File uploadDir = new File(absoluteUploadPath);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            String extension = fileName.substring(fileName.lastIndexOf("."));
            String uniqueFileName = usuarioLogado.getId() + "_" + System.currentTimeMillis() + extension;

            try (InputStream fileContent = filePart.getInputStream()) {
                Files.copy(fileContent, Paths.get(absoluteUploadPath + File.separator + uniqueFileName), StandardCopyOption.REPLACE_EXISTING);
            }

            novoCaminhoDaFoto = uploadPath + File.separator + uniqueFileName;

        } catch (Exception e) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Ocorreu um erro ao salvar o arquivo no servidor.");
            response.getWriter().print(resultado.toString());
            return;
        }

        try {
            UsuarioDAO usuarioDAO = new UsuarioDAO();
            // Usando o novo método para atualizar apenas a foto
            boolean atualizado = usuarioDAO.atualizarFoto(usuarioLogado.getId(), novoCaminhoDaFoto);

            if (atualizado) {
                // Atualiza o objeto do usuário na sessão com a nova foto
                usuarioLogado.setFoto(novoCaminhoDaFoto);
                sessao.setAttribute("usuarioLogado", usuarioLogado);

                resultado.addProperty("status", "ok");
                resultado.addProperty("mensagem", "Foto de perfil atualizada com sucesso!");
                resultado.addProperty("foto", novoCaminhoDaFoto); // Retorna o novo caminho
            } else {
                resultado.addProperty("status", "erro");
                resultado.addProperty("mensagem", "Não foi possível salvar o caminho da foto no banco de dados.");
            }

        } catch (Exception e) {
            resultado.addProperty("status", "erro");
            resultado.addProperty("mensagem", "Erro de banco de dados: " + e.getMessage());
        }

        response.getWriter().print(resultado.toString());
    }

    private String getFileName(Part part) {
        for (String content : part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }
}