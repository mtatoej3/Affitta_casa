package affitta_casa.controller.api;

import affitta_casa.dao.AbitazioneDAO;
import affitta_casa.models.Abitazione;
import io.javalin.http.Context;
import java.util.List;

public class AbitazioneAPI {

    private static AbitazioneDAO dao = new AbitazioneDAO();

    // GET /api/abitazioni
    public static void getAll(Context ctx) {
        try {
            List<Abitazione> lista = dao.getTutte();
            ctx.json(lista); // Trasforma la lista Java in JSON per React
        } catch (Exception e) {
            ctx.status(500).result("Errore nel recupero abitazioni: " + e.getMessage());
        }
    }

    // POST /api/abitazioni (Per quando l'Host aggiungerà una casa)
    public static void crea(Context ctx) {
        try {
            Abitazione nuova = ctx.bodyAsClass(Abitazione.class);
            dao.creaAbitazione(nuova);
            ctx.status(201).json(nuova);
        } catch (Exception e) {
            // Se il DAO fallisce, inviamo l'errore al frontend
            ctx.status(400).result("Errore creazione: " + e.getMessage());
        }
    }

    public static void cerca(Context ctx) {
        // 1. Recuperiamo i filtri testuali e numerici
        String nome = ctx.queryParam("nome");
        String indirizzo = ctx.queryParam("indirizzo");
        Integer nLocali = ctx.queryParamAsClass("nLocali", Integer.class).getOrDefault(null);
        Integer nPosti = ctx.queryParamAsClass("nPosti", Integer.class).getOrDefault(null);

        // 2. RECUPERIAMO LE DATE
        // Le prendiamo come String, il DAO si occuperà della conversione SQL
        String dataInizio = ctx.queryParam("dataInizio");
        String dataFine = ctx.queryParam("dataFine");

        // 3. Passiamo tutto al DAO (aggiornato con 6 parametri)
        List<Abitazione> risultati = dao.cercaAbitazioni(
                nome,
                indirizzo,
                nLocali,
                nPosti,
                dataInizio,
                dataFine);

        // 4. Rispondiamo al frontend
        ctx.json(risultati);
    }

    public static void getDettaglioId(Context ctx) {
        String idString = ctx.pathParam("id"); // Legge quello che c'è tra le graffe nell'URL
        int id = Integer.parseInt(idString);

        Abitazione ab = dao.getAbitazioneById(id);

        if (ab != null) {
            ctx.json(ab); // Invia l'oggetto al frontend
        } else {
            ctx.status(404);
        }

    }

}
