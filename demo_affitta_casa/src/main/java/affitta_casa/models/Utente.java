package affitta_casa.models;

public class Utente {
    
    private String nome;
    private String cognome;
    private String email;
    private String indirizzo;
    private ruolo ruolo;
    private String codice_host;
    private boolean is_superhost;
    
    

    public Utente(String nome, String cognome, String email, String indirizzo, affitta_casa.models.Utente.ruolo ruolo,
            String codice_host, boolean is_superhost) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.indirizzo = indirizzo;
        this.ruolo = ruolo;
        this.codice_host = codice_host;
        this.is_superhost = is_superhost;
    }



    public enum ruolo{

        GUEST,
        HOST,
        SUPER_HOST,
    }



    public String getNome() {
        return nome;
    }



    public void setNome(String nome) {
        this.nome = nome;
    }



    public String getCognome() {
        return cognome;
    }



    public void setCognome(String cognome) {
        this.cognome = cognome;
    }



    public String getEmail() {
        return email;
    }



    public void setEmail(String email) {
        this.email = email;
    }



    public String getIndirizzo() {
        return indirizzo;
    }



    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }



    public ruolo getRuolo() {
        return ruolo;
    }



    public void setRuolo(ruolo ruolo) {
        this.ruolo = ruolo;
    }



    public String getCodice_host() {
        return codice_host;
    }



    public void setCodice_host(String codice_host) {
        this.codice_host = codice_host;
    }



    public boolean isIs_superhost() {
        return is_superhost;
    }



    public void setIs_superhost(boolean is_superhost) {
        this.is_superhost = is_superhost;
    }


    
}
