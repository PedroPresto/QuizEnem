package model;

import java.io.Serializable;

public class SubMateria implements Serializable{
    private static final long serialVersionUID = 1L;
    private int id; // Corresponde a id_sub_materia na tabela
    private String nome; // Corresponde a Nome da Submatéria
    private int id_materia; // Corresponde a id_materia

    // Construtores
    public SubMateria() {}

    public SubMateria(int id, String nome, int id_materia) {
        this.id = id;
        this.nome = nome;
        this.id_materia = id_materia;
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

    public int getId_materia() {
        return id_materia;
    }

    public void setId_materia(int id_materia) {
        this.id_materia = id_materia;
    }
}

