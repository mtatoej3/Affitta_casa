package affitta_casa.controller.dto;

import java.time.LocalDate;

import affitta_casa.models.Abitazione;
import affitta_casa.models.Disponibilita;

public class RicercaAbitazioneDTO {

    private int id;
    private String nome;
    private String indirizzo;
    private int n_locali;
    private int n_posti_letto;
    private LocalDate data_inizio;
    private LocalDate data_fine;
    private double prezzo_periodo;

    public RicercaAbitazioneDTO() {
    }

    public RicercaAbitazioneDTO(Abitazione a, Disponibilita d) {

        this.id = a.getId();
        this.nome = a.getNome();
        this.indirizzo = a.getIndirizzo();
        this.n_locali = a.getN_locali();
        this.n_posti_letto = a.getN_posti_letto();
        this.data_inizio = d.getData_inizio();
        this.data_fine = d.getData_fine();
        this.prezzo_periodo = d.getPrezzo_periodo();
    }

    public int getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public int getN_locali() {
        return n_locali;
    }

    public int getN_posti_letto() {
        return n_posti_letto;
    }

    public LocalDate getData_inizio() {
        return data_inizio;
    }

    public LocalDate getData_fine() {
        return data_fine;
    }

    public double getPrezzo_periodo() {
        return prezzo_periodo;
    }

}
