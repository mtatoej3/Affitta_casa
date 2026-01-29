package affitta_casa.test;

import java.time.LocalDate;
import java.util.List;

import affitta_casa.dao.AbitazioneDAO;
import affitta_casa.dao.DisponibilitaDAO;
import affitta_casa.dao.UtenteDAO;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Disponibilita;
import affitta_casa.models.Utente;

public class testDisp {
  
    public void a() {
        // 1. Inizializzazione DAO
    UtenteDAO uDao = new UtenteDAO();
    AbitazioneDAO aDao = new AbitazioneDAO();
    DisponibilitaDAO dDao = new DisponibilitaDAO();

    System.out.println("--- INIZIO TEST DISPONIBILITÀ ---");

    try {
        // 2. CREAZIONE HOST
        Utente host = new Utente("Mario", "Rossi", "mario@host.it", "Via Roma 1", Utente.ruolo.HOST, "HOST_MARIO_01", true);
        uDao.inserisciUtente(host); 
        // Nota: Assicurati che inserisciUtente recuperi l'ID o usa il codice_host per i tuoi collegamenti

        // 3. CREAZIONE ABITAZIONE
        Abitazione casa = new Abitazione(host, "Appartamento Mare", "Via delle Alghe 10", 3, 4, 1);
        aDao.creaAbitazione(casa); 
        // IMPORTANTE: casa.getId() ora deve essere valorizzato (es. 1, 2, 3...)

        // 4. INSERIMENTO DISPONIBILITÀ
        // Creiamo una disponibilità per tutto Agosto
        LocalDate inizio = LocalDate.of(2024, 8, 1);
        LocalDate fine = LocalDate.of(2024, 8, 31);
        double prezzo = 85.50;

        Disponibilita disp = new Disponibilita(casa, inizio, fine, prezzo);
        dDao.inserisciDisponibilita(disp);

        // 5. TEST RICERCA (READ)
        System.out.println("\n--- Risultati Ricerca ---");
        // Cerchiamo una settimana a Ferragosto con budget 100€
        LocalDate cercaInizio = LocalDate.of(2024, 8, 10);
        LocalDate cercaFine = LocalDate.of(2024, 8, 17);
        Double budget = 100.0;

        List<Disponibilita> trovate = dDao.cercaDisponibilita(cercaInizio, cercaFine, budget);

        if (trovate.isEmpty()) {
            System.out.println("Nessuna casa trovata per questi criteri.");
        } else {
            for (Disponibilita d : trovate) {
                System.out.println("Trovata: " + d.getId_abitazione().getNome() + 
                                   " | Prezzo: " + d.getPrezzo_periodo() + "€" +
                                   " | Periodo: " + d.getData_inizio() + " / " + d.getData_fine());
            }
        }

    } catch (Exception e) {
        System.err.println("Errore durante il test: " + e.getMessage());
        e.printStackTrace();
    }

    System.out.println("--- FINE TEST DISPONIBILITÀ ---");  
    }
}
