package affitta_casa.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import affitta_casa.db.dbManager;
import affitta_casa.models.Prenotazione;

public class PrenotazioneDAO {

// 1. Metodo CREATE
    public boolean effettuaPrenotazione(Prenotazione p) {
        String sql = "INSERT INTO prenotazione (id_abitazione, id_guest, data_inizio, data_fine, data_creazione_record, stato) VALUES (?, ?, ?, ?, ?, ?::stato_prenotazione)";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, p.getId_abitazione());
            pstmt.setInt(2, p.getId_guest());
            
            // Conversione LocalDate -> sql.Date
            pstmt.setDate(3, java.sql.Date.valueOf(p.getData_inizio()));
            pstmt.setDate(4, java.sql.Date.valueOf(p.getData_fine()));
            
            // Conversione LocalDateTime -> sql.Timestamp
            pstmt.setTimestamp(5, java.sql.Timestamp.valueOf(p.getData_creazione()));
            
            // Salviamo l'enum come stringa nel DB
            pstmt.setString(6, p.getStato().name());
            
            return pstmt.executeUpdate() > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // 2. Metodo READ (Esempio: tutte le prenotazioni di un Guest)
    public List<Prenotazione> getPrenotazioniPerGuest(int idGuest) {
        List<Prenotazione> lista = new ArrayList<>();
        String sql = "SELECT * FROM prenotazione WHERE id_guest = ?";
        
        try (Connection conn = dbManager.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, idGuest);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                // Leggiamo e riconvertiamo i tipi
                LocalDate inizio = rs.getDate("data_inizio").toLocalDate();
                LocalDate fine = rs.getDate("data_fine").toLocalDate();
                LocalDateTime creazione = rs.getTimestamp("data_creazione_record").toLocalDateTime();
                
                // Conversione Stringa -> Enum
                Prenotazione.stato statoEnum = Prenotazione.stato.valueOf(rs.getString("stato"));
                
                Prenotazione p = new Prenotazione(
                    rs.getInt("id_abitazione"),
                    rs.getInt("id_guest"),
                    inizio,
                    fine,
                    creazione,
                    statoEnum
                );
                p.setId(rs.getInt("id")); // Non dimenticare di settare l'ID autoincrement
                lista.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }


}
