package affitta_casa.controller.dto;

/**
 * DTO per ricevere i dati di creazione feedback dal frontend
 */
public class FeedbackDTO {
    private int id_prenotazione;
    private String nome;
    private String email;
    private String titolo;
    private String testo;
    private int punteggio;

    // Costruttore vuoto
    public FeedbackDTO() {}

    // Getters e Setters
    public int getId_prenotazione() {
        return id_prenotazione;
    }

    public void setId_prenotazione(int id_prenotazione) {
        this.id_prenotazione = id_prenotazione;
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

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getTesto() {
        return testo;
    }

    public void setTesto(String testo) {
        this.testo = testo;
    }

    public int getPunteggio() {
        return punteggio;
    }

    public void setPunteggio(int punteggio) {
        this.punteggio = punteggio;
    }
}
