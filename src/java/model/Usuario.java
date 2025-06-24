package model; // (ajuste o pacote para o seu projeto Quiz Enem depois)

import java.io.Serializable;

public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;
    private int id;
    private String googleId;
    private String nome;
    private String email;
    private String senha;
    private String dataCadastro; // Pode ser String ou Timestamp, dependendo do que preferir
    private boolean isAdmin;
    private boolean isPremium;
    private String foto;

    // Construtor vazio (importante para frameworks e padrões JavaBeans)
    public Usuario() {
    }

    // Construtor completo
    public Usuario(int id, String nome, String email, String senha, String dataCadastro) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataCadastro = dataCadastro;
    }

    //construtor cadastro
    public Usuario(String nome, String email, String senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    // Getters e Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(String dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public boolean isAdmin() {
        return this.isAdmin;
    }

    public void setIsAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public boolean isPremium() {
        return this.isPremium;
    }

    public void setIsPremium(boolean isPremium) {
        this.isPremium = isPremium;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

}
