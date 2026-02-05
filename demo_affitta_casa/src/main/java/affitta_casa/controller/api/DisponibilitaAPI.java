package affitta_casa.controller.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import io.javalin.http.Context;
import affitta_casa.dao.AbitazioneDAO;
import affitta_casa.dao.DisponibilitaDAO;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Disponibilita;
import com.fasterxml.jackson.core.type.TypeReference;

public class DisponibilitaAPI {
    private static DisponibilitaDAO disponibilitaDAO = new DisponibilitaDAO();
    private static AbitazioneDAO abitazioneDAO = new AbitazioneDAO();

    public static void aggiungiDisponibilita(Context ctx) {
        // Riceviamo un oggetto semplice dal frontend
        Map<String, Object> body = ctx.bodyAsClass(new TypeReference<Map<String, Object>>() {
        }.getType());

        try {
            Disponibilita d = new Disponibilita();

            // Impostiamo l'abitazione (usiamo un "guscio" con l'ID)
            Abitazione ab = new Abitazione();
            ab.setId((Integer) body.get("id_abitazione"));
            d.setId_abitazione(ab);

            // Convertiamo le stringhe in LocalDate
            d.setData_inizio(LocalDate.parse((String) body.get("data_inizio")));
            d.setData_fine(LocalDate.parse((String) body.get("data_fine")));

            // Gestiamo il prezzo (che potrebbe arrivare come Integer o Double)
            d.setPrezzo_periodo(Double.parseDouble(body.get("prezzo_periodo").toString()));

            disponibilitaDAO.inserisciDisponibilita(d);
            ctx.status(201).result("Disponibilità aggiunta con successo");

        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(400).result("Errore nel formato dei dati: " + e.getMessage());
        }
    }

    // Nel file dove gestisci GET /api/abitazioni/{id}
    public static void getAbitazione(Context ctx) {
        // 1. Prendi l'ID dall'URL
        int id = Integer.parseInt(ctx.pathParam("idAbitazione"));

        // 2. Carica i dati base dell'abitazione
        Abitazione casa = abitazioneDAO.getAbitazioneById(id);

        if (casa != null) {
            // 3. Carica le disponibilità dal DB
            DisponibilitaDAO dDao = new DisponibilitaDAO();
            List<Map<String, Object>> disps = dDao.getDisponibilitaAbitazione(id);

            // 4. COSTRUISCI LA RISPOSTA MANUALE (per essere sicuri che Jackson non salti
            // campi)
            Map<String, Object> risposta = new HashMap<>();
            risposta.put("id", casa.getId());
            risposta.put("nome", casa.getNome());
            risposta.put("indirizzo", casa.getIndirizzo());
            risposta.put("n_locali", casa.getN_locali());
            risposta.put("n_posti_letto", casa.getN_posti_letto());
            risposta.put("piano", casa.getPiano());
            risposta.put("id_host", casa.getId_host()); // Questo lo vediamo nel tuo JSON

            // FONDAMENTALE: Se la lista è vuota, mettiamo un array vuoto invece di null
            risposta.put("disponibilita", disps != null ? disps : new ArrayList<>());

            // DEBUG: Stampa in console per vedere se Java le ha trovate
            System.out.println("Disponibilità trovate per casa " + id + ": " + disps.size());

            ctx.json(risposta);
        } else {
            ctx.status(404).result("Abitazione non trovata");
        }
    }

    public static void eliminaDisponibilita(Context ctx) {
        try {
            int id = Integer.parseInt(ctx.pathParam("id"));
            disponibilitaDAO.cancellaDisponibilita(id);
            ctx.status(200).result("Disponibilità eliminata con successo");
        } catch (Exception e) {
            ctx.status(400).result("Errore nella cancellazione: " + e.getMessage());
        }
    }

}
