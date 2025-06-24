package model;

public class AreaDesempenho {

    private final String area;
    private final int respondidas;
    private final int acertos;
    private final int erros;
    private final int taxa;

    public AreaDesempenho(String area, int acertos, int erros) {
        if("Linguagens, Códigos e Tecnologias".equals(area)) {
            area = "Linguagens e Códigos";
        }
        this.area = area;
        this.acertos = acertos;
        this.erros = erros;
        this.respondidas = acertos + erros;
        this.taxa = respondidas == 0 ? 0 : (int) Math.round((acertos * 100.0) / respondidas);
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
