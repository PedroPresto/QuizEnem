package model;

/**
 * Representa uma matéria principal no sistema Quiz Enem.
 * Utilizada para armazenar informações como ID, nome e um ícone associado à matéria.
 */
public class Materia {
    private int id;
    private String nome;
    private String icon; // Opcional: pode ser usado para exibir um ícone na interface

    /**
     * Construtor padrão.
     */
    public Materia() {
    }

    /**
     * Construtor com todos os campos.
     * @param id O ID único da matéria.
     * @param nome O nome da matéria.
     * @param icon O ícone associado à matéria (caminho, classe CSS, etc.).
     */
    public Materia(int id, String nome, String icon) {
        this.id = id;
        this.nome = nome;
        this.icon = icon;
    }

    // --- Getters e Setters ---

    /**
     * Retorna o ID da matéria.
     * @return O ID da matéria.
     */
    public int getId() {
        return id;
    }

    /**
     * Define o ID da matéria.
     * @param id O ID da matéria a ser definido.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Retorna o nome da matéria.
     * @return O nome da matéria.
     */
    public String getNome() {
        return nome;
    }

    /**
     * Define o nome da matéria.
     * @param nome O nome da matéria a ser definido.
     */
    public void setNome(String nome) {
        this.nome = nome;
    }

    /**
     * Retorna o ícone associado à matéria.
     * @return O ícone da matéria.
     */
    public String getIcon() {
        return icon;
    }

    /**
     * Define o ícone associado à matéria.
     * @param icon O ícone da matéria a ser definido.
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }

    /**
     * Retorna uma representação em String da matéria.
     * @return Uma String contendo ID, nome e ícone da matéria.
     */
    @Override
    public String toString() {
        return "Materia{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", icon='" + icon + '\'' +
                '}';
    }
}
