
package model;

public class DesempenhoDia {
    private final int acertos;
    private final int total;

    public DesempenhoDia(int acertos, int total) {
        this.acertos = acertos;
        this.total = total;
    }

    public int getAcertos() {
        return acertos;
    }

    public int getTotal() {
        return total;
    }
}
