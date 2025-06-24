package model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Estatisticas {

    private int acertos;
    private int erros;
    private int respondidas;
    private int taxaTotal;

    private String topMateria;
    private String piorMateria;

    private final List<MateriaDesempenho> rankingPorMateria = new ArrayList<>();
    private List<AreaDesempenho> rankingPorArea = new ArrayList<>();
    private Map<String, DesempenhoDia> acertosPorDia;

    // Getters e Setters
    public void setAcertosPorDia(Map<String, DesempenhoDia> acertosPorDia) {
        this.acertosPorDia = acertosPorDia;
    }

    public int getAcertos() {
        return acertos;
    }

    public void setAcertos(int acertos) {
        this.acertos = acertos;
    }

    public int getErros() {
        return erros;
    }

    public void setErros(int erros) {
        this.erros = erros;
    }

    public int getRespondidas() {
        return respondidas;
    }

    public void setRespondidas(int total) {
        this.respondidas = total;
    }

    public void calcularTaxaGeral() {
        int total = acertos + erros;
        this.taxaTotal = total == 0 ? 0 : (int) Math.round((acertos * 100.0) / (double) total);
    }

    public List<MateriaDesempenho> getRankingPorMateria() {
        return rankingPorMateria;
    }

    public List<AreaDesempenho> getRankingPorArea() {
        return rankingPorArea;
    }

    public void setRankingPorArea(List<AreaDesempenho> rankingPorArea) {
        this.rankingPorArea = rankingPorArea;
    }

    public String getTopMateria() {
        return topMateria;
    }

    public String getPiorMateria() {
        return piorMateria;
    }

    public double getTaxaAcerto() {
        if (respondidas == 0) {
            return 0.0;
        }
        return (acertos * 100.0) / respondidas;
    }

    public void calcularTopEPiorMaterias() {
        MateriaDesempenho melhor = null;
        MateriaDesempenho pior = null;
        double melhorScore = -1;
        double piorScore = Double.MAX_VALUE;

        for (MateriaDesempenho md : rankingPorMateria) {
            int taxa = md.getTaxa();
            int total = md.getTotal();

            // Fórmula avançada: taxa ponderada pelo volume
            double score = taxa * Math.sqrt(total);

            // Melhor matéria = maior score
            if (score > melhorScore) {
                melhorScore = score;
                melhor = md;
            }

            // Pior matéria = menor score, com mínimo de dados
            if (total >= 5 && score < piorScore) {
                piorScore = score;
                pior = md;
            }
        }

        this.topMateria = (melhor != null) ? melhor.getNome() : "Nenhuma";
        this.piorMateria = (pior != null) ? pior.getNome() : "Nenhuma";

        // Ordena o ranking por taxa, apenas para visualização
        rankingPorMateria.sort((a, b) -> Integer.compare(b.getTaxa(), a.getTaxa()));
    }

}
