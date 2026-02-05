import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { abitazioneService } from '../services/abitazioneService';

function CreaAbitazione() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: '',
        indirizzo: '',
        n_locali: 1,
        n_posti_letto: 1,
        piano: 0,
        id_host: '' // Inizializzato come stringa vuota per l'input
    });

    const gestisciSalvataggio = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Piccola validazione per sicurezza
        if (!form.id_host) {
            alert("Per favore, inserisci un Codice Host valido.");
            return;
        }

        try {
            await abitazioneService.salva(form);
            alert("Abitazione creata con successo!");
            navigate('/ricerca'); 
        } catch (err) {
            console.error("Errore durante il salvataggio", err);
            alert("Errore durante la creazione: controlla che il Codice Host esista nel database.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ color: '#333', textAlign: 'center' }}>Aggiungi Nuova Abitazione</h2>
            
            <form onSubmit={gestisciSalvataggio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* NUOVO CAMPO: CODICE HOST */}
                <label style={{ fontWeight: 'bold' }}>Codice Identificativo Host:</label>
                <input 
                    required
                    type="text" 
                    placeholder="Inserisci il tuo codice host (es. 101)" 
                    value={form.id_host} 
                    onChange={(e) => setForm({...form, id_host: e.target.value})}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <label style={{ fontWeight: 'bold' }}>Nome Abitazione:</label>
                <input 
                    required
                    type="text" 
                    value={form.nome} 
                    onChange={(e) => setForm({...form, nome: e.target.value})}
                    placeholder="Esempio: Villa Sole"
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <label style={{ fontWeight: 'bold' }}>Indirizzo:</label>
                <input 
                    required
                    type="text" 
                    value={form.indirizzo} 
                    onChange={(e) => setForm({...form, indirizzo: e.target.value})}
                    placeholder="Via Roma 10, Milano"
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Locali:</label>
                        <input 
                            type="number" 
                            min="1"
                            value={form.n_locali} 
                            onChange={(e) => setForm({...form, n_locali: Number(e.target.value)})}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Posti Letto:</label>
                        <input 
                            type="number" 
                            min="1"
                            value={form.n_posti_letto} 
                            onChange={(e) => setForm({...form, n_posti_letto: Number(e.target.value)})}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontWeight: 'bold' }}>Piano:</label>
                        <input 
                            type="number" 
                            value={form.piano} 
                            onChange={(e) => setForm({...form, piano: Number(e.target.value)})}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    style={{ 
                        padding: '12px', 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginTop: '10px',
                        fontSize: '16px'
                    }}
                >
                    SALVA ABITAZIONE
                </button>
            </form>
        </div>
    );
}

export default CreaAbitazione;