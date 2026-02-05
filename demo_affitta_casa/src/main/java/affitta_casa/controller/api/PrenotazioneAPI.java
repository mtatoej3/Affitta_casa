package affitta_casa.controller.api;

import io.javalin.http.Context;
import affitta_casa.controller.dto.PrenotazioneDTO;
import affitta_casa.dao.PrenotazioneDAO;
import affitta_casa.models.Prenotazione;


public class PrenotazioneAPI {

    private static PrenotazioneDAO dao = new PrenotazioneDAO();

    public static void prenota(Context ctx) {
        // 1. Prendi il JSON inviato da React e trasformalo nella "Scatola" (Request)
        PrenotazioneDTO req = ctx.bodyAsClass(PrenotazioneDTO.class);

        // 2. Chiama il metodo del DAO che abbiamo creato al passaggio 1
        // Gli passiamo nome, cognome ed email che l'utente ha scritto nel form
        int idTrovato = dao.getGuestIdByEmail(req.guest_nome, req.guest_cognome, req.guest_email);

        // 3. Se l'id è -1 significa che l'utente non esiste nel DB
        if (idTrovato == -1) {
            ctx.status(401).result("Utente non riconosciuto. Controlla i dati.");
            return; // Ci fermiamo qui
        }

        // 4. Se arriviamo qui l'ID è valido! Creiamo l'oggetto Prenotazione da salvare
        Prenotazione p = new Prenotazione();
        p.setId_abitazione(req.id_abitazione);
        p.setId_guest(idTrovato); 
        p.setData_inizio(req.data_inizio);
        p.setData_fine(req.data_fine);

        // 5. Salviamo definitivamente
        dao.effettuaPrenotazione(p);
        ctx.status(201).result("Prenotazione registrata con successo!");

    }

}
