package affitta_casa.controller;

import affitta_casa.controller.api.*;
import io.javalin.Javalin;

public class ControllerManager {

    public void testUtente() {

        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost());
            });
        }).start(7000);

        // --- ROTTE UTENTI ---
        app.post("/api/utenti", UtenteAPI::registra);
        app.get("/api/utenti/{id}", UtenteAPI::getProfilo);

        // --- ROTTE ABITAZIONI ---
        // Questa serve per la ricerca con i filtri che abbiamo appena creato
        app.get("/api/abitazioni/cerca", AbitazioneAPI::cerca);

        app.get("/api/abitazioni/{id}", AbitazioneAPI::getDettaglioId);

        // Questa serve per far creare una casa all'Host
        app.post("/api/abitazioni", AbitazioneAPI::crea);

        // ROTTE STATISTICHE//
        app.get("/api/stats/abitazioni-host", StatsAPI::getAbitazioniByHost);

        app.get("/api/stats/ultima-prenotazione/{idUtente}", StatsAPI::getUltimaPrenotazione);

        app.get("/api/stats/top-mese", StatsAPI::getTopMese);

        app.get("/api/stats/top-hosts", StatsAPI::getTopHosts);

        app.get("/api/stats/super-hosts", StatsAPI::getSuperHosts);

        app.get("/api/stats/top-guests-giorni", StatsAPI::getTopGuests);
        

        // ROTTE DISPONIBILITA //

        // Rotta per inserire nuove disponibilità
        app.post("/api/disponibilita", DisponibilitaAPI::aggiungiDisponibilita);

        app.get("/api/disponibilita/{idAbitazione}", DisponibilitaAPI::getAbitazione);

        // ROTTA PRENOTAZIONE // 

        app.post("/api/prenotazioni", PrenotazioneAPI::prenota);

    }
}
