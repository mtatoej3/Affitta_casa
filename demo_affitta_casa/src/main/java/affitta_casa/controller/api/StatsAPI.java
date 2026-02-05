package affitta_casa.controller.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.javalin.http.Context;
import affitta_casa.dao.StatsDAO;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Prenotazione;

public class StatsAPI {

    private static StatsDAO stastDAO = new StatsDAO();

    public static void getAbitazioniByHost(Context ctx) {
        String codice = ctx.queryParam("codiceHost"); // Recupera ?codiceHost=XYZ
        if (codice == null || codice.isEmpty()) {
            ctx.status(400).result("Codice Host mancante");
            return;
        }
        List<Abitazione> abitazioni = stastDAO.getAbitazioniByHost(codice);
        ctx.json(abitazioni);
    }

    public static void getUltimaPrenotazione(Context ctx) {
        try {
            int idUtente = Integer.parseInt(ctx.pathParam("idUtente"));
            Prenotazione p = stastDAO.getUltimaPrenotazione(idUtente);

            if (p == null) {
                ctx.status(404).json(Map.of("error", "Nessuna prenotazione trovata"));
                return;
            }

            // COSTRUIAMO LA RISPOSTA MANUALMENTE
            // Usiamo stringhe per le date così Jackson non crasha
            Map<String, Object> response = new HashMap<>();
            response.put("id", p.getId());
            response.put("id_guest", p.getId_guest());
            response.put("data_inizio", p.getData_inizio().toString()); // Diventa "2025-08-12"
            response.put("data_fine", p.getData_fine().toString()); // Diventa "2025-08-19"
            response.put("stato", p.getStato().toString());

            // Gestione oggetto abitazione (prendiamo solo l'id per ora)
            if (p.getId_abitazione() != null) {
                response.put("abitazione", Map.of("id", p.getId_abitazione().getId()));
            }

            ctx.json(response);

        } catch (NumberFormatException e) {
            ctx.status(400).result("ID Utente non valido");
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(500).result("Errore interno del server");
        }
    }

    public static void getTopMese(Context ctx) {
        Map<String, Object> top = stastDAO.getAbitazioneTopMese();
        if (top != null) {
            ctx.json(top);
        } else {
            // Se non ci sono dati, mandiamo un messaggio amichevole
            ctx.status(404).result("Nessun dato disponibile per l'ultimo mese");
        }
    }

    public static void getTopHosts(Context ctx) {
        List<Map<String, Object>> topHosts = stastDAO.getTopHostsMese();
        // Anche se la lista è vuota, restituiamo 200 con array vuoto []
        ctx.json(topHosts);
    }

    public static void getSuperHosts(Context ctx) {
        ctx.json(stastDAO.getSuperHosts());
    }

    public static void getTopGuests(Context ctx) {
        ctx.json(stastDAO.getTopGuestGiorniMese());
    }

    

}
