package affitta_casa.controller;

import affitta_casa.controller.api.UtenteAPI;
import io.javalin.Javalin;

public class ControllerManager {

    public void testUtente() {
        Javalin app = Javalin.create(config -> {
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> it.anyHost()); // Permette a React di parlare con Javalin
            });
        }).start(7000);

        // Colleghiamo i tuoi metodi alle URL
        app.post("/api/utenti", UtenteAPI::registra); // Per creare (POST)
        app.get("/api/utenti/{id}", UtenteAPI::getProfilo); // Per leggere (GET)
    }
}
