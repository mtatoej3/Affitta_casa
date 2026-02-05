import { useState, useEffect } from 'react'; // Aggiunto useEffect
import { abitazioneService, type Abitazione } from '../services/abitazioneService';
import { useNavigate } from 'react-router-dom';

function Ricerca() {
    const [statoFiltro, setStatoFiltro] = useState({
        nome: '',
        indirizzo: '',
        nLocali: 0,
        nPosti: 0,
        dataInizio: '',
        dataFine: '',
    });

    const [risultati, setRisultati] = useState<Abitazione[]>([]);
    const navigate = useNavigate();
    // FUNZIONE DI RICERCA
    const eseguiRicerca = async () => {
        try {
            // Se i numeri sono 0, passiamo undefined così il DAO li ignora
            const dati = await abitazioneService.cerca(
                statoFiltro.nome || undefined,
                statoFiltro.indirizzo || undefined,
                statoFiltro.nLocali > 0 ? statoFiltro.nLocali : undefined,
                statoFiltro.nPosti > 0 ? statoFiltro.nPosti : undefined,
                statoFiltro.dataInizio || undefined,
                statoFiltro.dataFine || undefined,
            );
            setRisultati(dati);
        } catch (err) {
            console.error("Errore durante la ricerca", err);
        }
    };

    // Questo fa sì che la tabella si popoli appena apri la pagina
    useEffect(() => {
        eseguiRicerca();
    }, []);

    return (
        <div style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            padding: '20px',
            color: 'white'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ color: 'white', marginBottom: '30px' }}>Trova la tua Abitazione</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <input
                        type='text'
                        placeholder="Nome abitazione..."
                        value={statoFiltro.nome}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, nome: e.target.value })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                    <input
                        type='text'
                        placeholder="Indirizzo..."
                        value={statoFiltro.indirizzo}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, indirizzo: e.target.value })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Min. locali..."
                        value={statoFiltro.nLocali === 0 ? '' : statoFiltro.nLocali}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, nLocali: Number(e.target.value) })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Min posti letto..."
                        value={statoFiltro.nPosti === 0 ? '' : statoFiltro.nPosti}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, nPosti: Number(e.target.value) })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />

                    <input
                        type="date"
                        placeholder="Data Inizio"
                        value={statoFiltro.dataInizio}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, dataInizio: e.target.value })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                    <input
                        type="date"
                        placeholder="Data Fine"
                        value={statoFiltro.dataFine}
                        onChange={(e) => setStatoFiltro({ ...statoFiltro, dataFine: e.target.value })}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#1a1a1a',
                            color: 'white'
                        }}
                    />
                </div>

                <button
                    onClick={eseguiRicerca}
                    style={{
                        width: '100%',
                        padding: '12px',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        marginBottom: '30px'
                    }}
                >
                    FILTRA RISULTATI
                </button>

                <table width="100%" style={{
                    borderCollapse: 'collapse',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', textAlign: 'left', color: 'white' }}>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Nome</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Indirizzo</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Locali</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Posti Letto</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Host</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {risultati.length > 0 ? (
                            risultati.map((ab, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.nome}</td>
                                    <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.indirizzo}</td>
                                    <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.n_locali}</td>
                                    <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.n_posti_letto}</td>
                                    <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>
                                        {ab.id_host ? ab.id_host.nome : 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px', border: '1px solid #444' }}>
                                        <button
                                            onClick={() => navigate(`/abitazione/${ab.id}`)}
                                            style={{
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            🔍 Dettaglio
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                    Nessun'abitazione trovata con questi criteri.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ricerca;