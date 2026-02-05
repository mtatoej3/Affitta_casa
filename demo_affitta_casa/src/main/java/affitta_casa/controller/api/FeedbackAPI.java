package affitta_casa.controller.api;

import affitta_casa.controller.dto.FeedbackDTO;
import affitta_casa.dao.FeedbackDAO;
import affitta_casa.models.Feedback;
import io.javalin.http.Context;
import java.util.Map;

public class FeedbackAPI {
    private static FeedbackDAO dao = new FeedbackDAO();

    /**
     * POST /api/feedback
     * Body: { id_prenotazione, nome, email, titolo, testo, punteggio }
     */
    public static void crea(Context ctx) {
        try {
            // ✅ Type-safe: usa il DTO invece di Map
            FeedbackDTO req = ctx.bodyAsClass(FeedbackDTO.class);
            
            // VALIDAZIONE: Verifica prenotazione confermata
            if (!dao.verificaPrenotazione(req.getId_prenotazione(), req.getNome(), req.getEmail())) {
                ctx.status(403).result("Prenotazione non valida o non confermata");
                return;
            }
            
            // Crea e inserisci feedback
            Feedback f = new Feedback(
                req.getId_prenotazione(), 
                req.getTitolo(), 
                req.getTesto(), 
                req.getPunteggio()
            );
            dao.inserisci(f);
            
            ctx.status(201).result("Feedback creato con successo");
            
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(400).result("Errore nella creazione del feedback: " + e.getMessage());
        }
    }

    /**
     * GET /api/feedback/abitazione/{idAbitazione}
     */
    public static void getByAbitazione(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("idAbitazione"));
        ctx.json(dao.getFeedbackPerAbitazione(id));
    }

    /**
     * GET /api/feedback/media/{idAbitazione}
     */
    public static void getMedia(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("idAbitazione"));
        double media = dao.getMediaPunteggio(id);
        ctx.json(Map.of("media", media));
    }

    /**
     * DELETE /api/feedback/{id}
     */
    public static void cancella(Context ctx) {
        int id = Integer.parseInt(ctx.pathParam("id"));
        dao.cancella(id);
        ctx.status(204);
    }
}
