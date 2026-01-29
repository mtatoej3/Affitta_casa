package affitta_casa.controller.api;

import io.javalin.http.Context;
import affitta_casa.dao.UtenteDAO;
import affitta_casa.models.Utente;

public class UtenteAPI {
    // Istanza del DAO per parlare con il DB
    private static UtenteDAO utenteDAO = new UtenteDAO();

    // Metodo per gestire la registrazione (POST)
    public static void registra(Context ctx) {
        // 1. Riceve i parametri da React (trasformando il JSON in oggetto Utente)
        Utente nuovoUtente = ctx.bodyAsClass(Utente.class);

        // 2. Chiama il DAO (il metodo che abbiamo corretto insieme)
        utenteDAO.inserisciUtente(nuovoUtente);

        // 3. Risponde al Frontend con l'oggetto salvato (che ora ha l'ID corretto)
        ctx.status(201).json(nuovoUtente);
    }

    // Metodo per recuperare un profilo (GET)
    public static void getProfilo(Context ctx) {
        // 1. Prendiamo l'ID dall'URL (es. /api/utenti/5)
        int id = Integer.parseInt(ctx.pathParam("id"));

        // 2. Chiediamo al DAO di andare a pescare nel DB
        Utente u = utenteDAO.trovaPerId(id);

        // 3. Rispondiamo a React
        if (u != null) {
            // .json(u) trasforma automaticamente l'oggetto Java in JSON
            ctx.status(200).json(u);
        } else {
            ctx.status(404).result("Utente non trovato");
        }
    }
}
