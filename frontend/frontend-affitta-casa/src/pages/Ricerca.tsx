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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333' }}>Trova la tua Abitazione</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#f4f4f4',
                borderRadius: '8px'
            }}>
                <input
                    type='text'
                    placeholder="Nome abitazione..."
                    value={statoFiltro.nome}
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, nome: e.target.value })}
                />
                <input
                    type='text'
                    placeholder="Indirizzo..."
                    value={statoFiltro.indirizzo}
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, indirizzo: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Min. locali..."
                    value={statoFiltro.nLocali === 0 ? '' : statoFiltro.nLocali} // Trucco per non vedere sempre lo 0
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, nLocali: Number(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Min posti letto..."
                    value={statoFiltro.nPosti === 0 ? '' : statoFiltro.nPosti}
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, nPosti: Number(e.target.value) })}
                />

                <input
                    type="date"
                    placeholder="Data Inizio"
                    value={statoFiltro.dataInizio}
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, dataInizio: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Data Fine"
                    value={statoFiltro.dataFine}
                    onChange={(e) => setStatoFiltro({ ...statoFiltro, dataFine: e.target.value })}
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
                    fontWeight: 'bold'
                }}
            >
                FILTRA RISULTATI
            </button>

            <hr style={{ margin: '30px 0' }} />

            <table width="100%" style={{ borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#7e2828', textAlign: 'left', color: 'white' }}>
                        <th style={{ padding: '12px', border: '1px solid #6d3a3a' }}>Nome</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Indirizzo</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Locali</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Posti Letto</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Host</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {risultati.length > 0 ? (
                        risultati.map((ab, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{ab.nome}</td>
                                <td style={{ padding: '12px' }}>{ab.indirizzo}</td>
                                <td style={{ padding: '12px' }}>{ab.n_locali}</td>
                                <td style={{ padding: '12px' }}>{ab.n_posti_letto}</td>
                                <td style={{ padding: '12px', color: '#555' }}>
                                    {ab.id_host ? ab.id_host.nome : 'N/A'}
                                </td>
                                <td style={{ padding: '12px' }}>
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
    );
}

export default Ricerca;