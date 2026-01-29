package affitta_casa.models;

public class Abitazione {
    // nome indirizzo

    private int id;
    private Utente id_host;
    private String nome;
    private String indirizzo;
    private int n_locali;
    private int n_posti_letto;
    private int piano;

    public Abitazione(Utente id_host, String nome, String indirizzo, int n_locali, int n_posti_letto, int piano) {
        this.id_host = id_host;
        this.nome = nome;
        this.indirizzo = indirizzo;
        this.n_locali = n_locali;
        this.n_posti_letto = n_posti_letto;
        this.piano = piano;
    }

    public Abitazione() {
        // Costruttore vuoto per il DAO
    }

    public Utente getId_host() {
        return id_host;
    }

    public void setId_host(Utente id_host) {
        this.id_host = id_host;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public int getN_locali() {
        return n_locali;
    }

    public void setN_locali(int n_locali) {
        this.n_locali = n_locali;
    }

    public int getN_posti_letto() {
        return n_posti_letto;
    }

    public void setN_posti_letto(int n_posti_letto) {
        this.n_posti_letto = n_posti_letto;
    }

    public int getPiano() {
        return piano;
    }

    public void setPiano(int piano) {
        this.piano = piano;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}
