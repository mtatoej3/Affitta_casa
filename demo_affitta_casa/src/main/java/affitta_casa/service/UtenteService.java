package affitta_casa.service;

import java.util.List;

import affitta_casa.dao.UtenteDAO;
import affitta_casa.models.Utente;
import affitta_casa.models.Utente.ruolo;

public class UtenteService {
    private UtenteDAO dao = new UtenteDAO();

    // Racchiudiamo tutto in un metodo che potrai chiamare dal Main
    public void eseguiTestCompleto() {
        
        System.out.println("--- Inizio Test Service ---");

        // 1. Lettura iniziale
        List<Utente> lista = dao.leggiTutti();
        lista.forEach(u -> System.out.println(u.getNome() + " " + u.getEmail()));

        // 2. Ricerca per ID
        Utente trovato = dao.trovaPerId(7);
        if (trovato != null) {
            System.out.println("Trovato: " + trovato.getNome());
        }

        // 3. Preparazione dati aggiornati
        Utente datiAggiornati = new Utente(
                "matteoy",
                "yako",
                "matteo.ultimisso@gmail.com",
                "Via Roma 10",
                ruolo.SUPER_HOST,
                "host-premium-99",
                true);

        // 4. Modifica
        dao.modificaUtente(datiAggiornati, 6);

        // 5. Cancellazione
        dao.cancellaUtente(7);

        // 6. Verifica finale
        System.out.println("Lista finale:");
        dao.leggiTutti().forEach(u -> System.out.println(u.getNome()));
    }
}
