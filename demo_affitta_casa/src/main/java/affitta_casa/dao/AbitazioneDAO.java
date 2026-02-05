package affitta_casa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import affitta_casa.db.dbManager;
import affitta_casa.models.Abitazione;
import affitta_casa.models.Utente;

public class AbitazioneDAO {

    public void creaAbitazione(Abitazione abitazione) {
        String sql = "INSERT INTO Abitazione (id_host, nome, indirizzo, n_locali, n_posti_letto, piano) VALUES (?, ?, ?, ?, ?, ?)";

        // AGGIUNTA 1: Diciamo a Statement che vogliamo indietro le chiavi generate
        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql, java.sql.Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, abitazione.getId_host().getCodice_host());
            pstmt.setString(2, abitazione.getNome());
            pstmt.setString(3, abitazione.getIndirizzo());
            pstmt.setInt(4, abitazione.getN_locali());
            pstmt.setInt(5, abitazione.getN_posti_letto());
            pstmt.setInt(6, abitazione.getPiano());

            pstmt.executeUpdate();

            // AGGIUNTA 2: Recuperiamo l'ID generato dal database
            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    int idAssegnatoDalDB = rs.getInt(1);
                    // AGGIUNTA 3: Sincronizziamo l'oggetto Java!
                    abitazione.setId(idAssegnatoDalDB);
                    System.out.println("Abitazione '" + abitazione.getNome() + "' creata con ID: " + idAssegnatoDalDB);
                }
            }

        } catch (SQLException e) {
            System.err.println("Errore nella creazione dell'abitazione: " + e.getMessage());
        }
    }

    // Aggiunti i parametri String dataInizio e String dataFine
    public List<Abitazione> cercaAbitazioni(String nome, String indirizzo, Integer nLocali, Integer nPosti,
            String dataInizio, String dataFine) {
        List<Abitazione> risultati = new ArrayList<>();

        StringBuilder sql = new StringBuilder(
                "SELECT a.*, u.id as host_id, u.nome as host_nome, u.email as host_email, " +
                        "(SELECT MIN(d.data_inizio) FROM disponibilita d WHERE d.id_abitazione = a.id) as disp_dal, " +
                        "(SELECT MAX(d.data_fine) FROM disponibilita d WHERE d.id_abitazione = a.id) as disp_al " +
                        "FROM abitazione a " +
                        "JOIN utente u ON a.id_host = u.codice_host " +
                        "WHERE 1=1");

        List<Object> parametri = new ArrayList<>();

        // --- FILTRI NORMALI ---
        if (nome != null && !nome.trim().isEmpty()) {
            sql.append(" AND a.nome ILIKE ?");
            parametri.add("%" + nome + "%");
        }
        if (indirizzo != null && !indirizzo.trim().isEmpty()) {
            sql.append(" AND a.indirizzo ILIKE ?");
            parametri.add("%" + indirizzo + "%");
        }
        if (nLocali != null && nLocali > 0) {
            sql.append(" AND a.n_locali >= ?");
            parametri.add(nLocali);
        }
        if (nPosti != null && nPosti > 0) {
            sql.append(" AND a.n_posti_letto >= ?");
            parametri.add(nPosti);
        }

        // --- FILTRO DISPONIBILITÀ (UNICA RIGA) ---
        if (dataInizio != null && !dataInizio.isEmpty() && dataFine != null && !dataFine.isEmpty()) {

            // CORREZIONE CRITICA: Usiamo un UNICO EXISTS per garantire la continuità
            sql.append(" AND EXISTS (");
            sql.append("    SELECT 1 FROM disponibilita d ");
            sql.append("    WHERE d.id_abitazione = a.id ");
            sql.append("    AND d.data_inizio <= CAST(? AS DATE) "); // Deve iniziare prima o il giorno stesso
            sql.append("    AND d.data_fine >= CAST(? AS DATE) "); // Deve finire dopo o il giorno stesso
            sql.append(" )");

            parametri.add(dataInizio);
            parametri.add(dataFine);

            // --- FILTRO PRENOTAZIONI ---
            sql.append(" AND NOT EXISTS (");
            sql.append("    SELECT 1 FROM prenotazione p ");
            sql.append("    WHERE p.id_abitazione = a.id ");
            sql.append("    AND p.data_inizio < CAST(? AS DATE) AND p.data_fine > CAST(? AS DATE) ");
            sql.append("    AND p.stato::text = 'CONFERMATA' ");
            sql.append(" )");

            parametri.add(dataFine);
            parametri.add(dataInizio);
        }

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < parametri.size(); i++) {
                pstmt.setObject(i + 1, parametri.get(i));
            }

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Utente host = new Utente(rs.getString("host_nome"), null, rs.getString("host_email"), null, null,
                            null, false);
                    host.setId(rs.getInt("host_id"));

                    Abitazione ab = new Abitazione(host, rs.getString("nome"), rs.getString("indirizzo"),
                            rs.getInt("n_locali"), rs.getInt("n_posti_letto"), rs.getInt("piano"));
                    ab.setId(rs.getInt("id"));

                    // Popoliamo le date per React (fondamentale!)
                    ab.setDisponibilitaDal(dataInizio);
                    ab.setDisponibilitaAl(dataFine);

                    risultati.add(ab);
                }
            }
        } catch (SQLException e) {
            System.err.println("Errore SQL: " + e.getMessage());
            e.printStackTrace();
        }
        return risultati;
    }

    public List<Abitazione> getTutte() {
        List<Abitazione> lista = new ArrayList<>();
        String query = "SELECT * FROM abitazione";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(query);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Abitazione ab = new Abitazione();
                ab.setId(rs.getInt("id"));
                ab.setNome(rs.getString("nome"));
                ab.setIndirizzo(rs.getString("indirizzo"));
                ab.setN_locali(rs.getInt("n_locali"));
                ab.setN_posti_letto(rs.getInt("n_posti_letto"));
                ab.setPiano(rs.getInt("piano"));

                // Se nel modello Java hai 'private Utente id_host',
                // creiamo un oggetto Utente "finto" che contiene solo l'ID
                Utente host = new Utente();
                host.setId(rs.getInt("id_host"));
                ab.setId_host(host);

                lista.add(ab);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    public Abitazione getAbitazioneById(int id) {
        String query = "SELECT a.*, u.nome as host_nome, u.email as host_email, u.codice_host " +
                "FROM abitazione a " +
                "JOIN utente u ON a.id_host = u.codice_host " +
                "WHERE a.id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // Creiamo l'host
                    Utente host = new Utente();
                    host.setCodice_host(rs.getString("codice_host"));
                    host.setNome(rs.getString("host_nome"));
                    host.setEmail(rs.getString("host_email"));

                    // Creiamo l'abitazione
                    Abitazione ab = new Abitazione();
                    ab.setId(rs.getInt("id"));
                    ab.setNome(rs.getString("nome"));
                    ab.setIndirizzo(rs.getString("indirizzo"));
                    ab.setN_locali(rs.getInt("n_locali"));
                    ab.setN_posti_letto(rs.getInt("n_posti_letto"));
                    ab.setPiano(rs.getInt("piano"));
                    ab.setId_host(host);

                    return ab;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // Se non trova nulla
    }

    public void aggiornaDatiAbitazione(int idAbitazione, String nuovoNome, int nuoviLocali, int nuoviPosti) {
        String sql = "UPDATE Abitazione SET nome = ?, n_locali = ?, n_posti_letto = ? WHERE id = ?";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, nuovoNome);
            pstmt.setInt(2, nuoviLocali);
            pstmt.setInt(3, nuoviPosti);
            pstmt.setInt(4, idAbitazione);

            int rowsAffected = pstmt.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Ristrutturazione registrata! Abitazione aggiornata.");
            }
        } catch (SQLException e) {
            System.err.println("Errore durante l'aggiornamento: " + e.getMessage());
        }
    }

    public void cancellaAbitazione(int id) {
        String sql = "DELETE FROM Abitazione WHERE id = ? ";

        try (Connection conn = dbManager.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            int righeCancellate = pstmt.executeUpdate();

            if (righeCancellate > 0) {
                System.out.println("Abitazione con ID " + id + " eliminato definitvamente,");
            } else {
                System.out.println("nessuna abitazione trovata con id " + id + "nulla da cancellare.");
            }
        } catch (SQLException e) {
            System.out.println("Errore durante la cancellazione: " + e.getMessage());
        }
    }

}
