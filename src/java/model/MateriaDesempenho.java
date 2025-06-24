package model;

public class MateriaDesempenho {
    private final String nome;
    private final String area;
    private final int respondidas;
    private final int acertos;
    private final int erros;
    private final int taxa;
    
    public MateriaDesempenho(String area, String nome, int respondidas, int acertos, int erros, int taxa) {
        this.nome = nome;
        this.area = area;
        this. respondidas = respondidas;
        this.acertos = acertos;
        this.erros = erros;
        this.taxa = taxa;
    }

    // Getters
    public String getNome() {
        return nome;
    }

    public int getAcertos() {
        return acertos;
    }

    public int getErros() {
        return erros;
    }

    public int getTotal() {
        return acertos + erros;
    }

    public int getTaxa() {
        return taxa;
    }
}
