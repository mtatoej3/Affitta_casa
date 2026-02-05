import { useEffect, useState } from 'react';
import { statsService } from '../services/statsServices';
import type { Abitazione } from '../services/abitazioneService';

function Stats() {
    const [codiceInput, setCodiceInput] = useState("");
    const [caseHost, setCaseHost] = useState<Abitazione[]>([]);
    const [topMese, setTopMese] = useState<{ nome: string, conteggio: number } | null>(null);
    const [loadingTop, setLoadingTop] = useState(false);
    // --- STATI PER ULTIMA PRENOTAZIONE ---
    const [idUtenteBusca, setIdUtenteBusca] = useState("");
    const [ultimaP, setUltimaP] = useState<any>(null);
    const [loadingP, setLoadingP] = useState(false);

    const [topHosts, setTopHosts] = useState<any[]>([]);
    const [loadingHosts, setLoadingHosts] = useState(false);

    const [superHosts, setSuperHosts] = useState<any[]>([]);
    const [loadingSH, setLoadingSH] = useState(false);

    const [topGuests, setTopGuests] = useState<any[]>([]);
    const [loadingGuests, setLoadingGuests] = useState(false);

    const caricaCase = () => {
        statsService.getAbitazioniByHost(codiceInput)
            .then(dati => setCaseHost(dati))
            .catch(err => console.error(err));
    };


    // --- FUNZIONE PER CERCARE L'ULTIMA PRENOTAZIONE ---
    const cercaUltima = () => {
        if (!idUtenteBusca) return;
        setLoadingP(true);
        setUltimaP(null);

        statsService.getUltimaPrenotazione(Number(idUtenteBusca))
            .then(res => {
                setUltimaP(res);
                setLoadingP(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingP(false);
            });
    };

    const caricaTopMese = () => {
        setLoadingTop(true);
        setTopMese(null); // Reset per pulire i dati vecchi durante il caricamento

        statsService.getTopMese()
            .then(res => {
                setTopMese(res);
                setLoadingTop(false);
            })
            .catch(err => {
                console.error("Errore caricamento top mese:", err);
                setLoadingTop(false);
            });
    };

    const caricaTopHosts = () => {
        setLoadingHosts(true);
        statsService.getTopHosts()
            .then(res => {
                setTopHosts(res);
                setLoadingHosts(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingHosts(false);
            });
    };

    const caricaSuperHosts = () => {
        setLoadingSH(true);
        statsService.getSuperHosts()
            .then(res => {
                setSuperHosts(res);
                setLoadingSH(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingSH(false);
            });
    };

    const caricaTopGuests = () => {
        setLoadingGuests(true);
        statsService.getTopGuestsGiorni()
            .then(res => {
                setTopGuests(res);
                setLoadingGuests(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingGuests(false);
            });
    };

    useEffect(() => {

        caricaTopMese();
        caricaTopHosts();
        caricaSuperHosts();
        caricaTopGuests();


        if (codiceInput) {
            caricaCase();
        }


    }, []);

    return (
        <div style={{ padding: '20px' }}>

            {/* --- SEZIONE ABITAZIONE PER HOST  --- */}
            <h2>Cerca Abitazioni per Host</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Inserisci Codice Host..."
                    value={codiceInput}
                    onChange={(e) => setCodiceInput(e.target.value)}
                />
                <button onClick={caricaCase}>Cerca</button>
            </div>

            <table width="100%" border={1} style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Indirizzo</th>
                        <th>Posti Letto</th>
                    </tr>
                </thead>
                <tbody>
                    {caseHost.map(ab => (
                        <tr key={ab.id}>
                            <td>{ab.nome}</td>
                            <td>{ab.indirizzo}</td>
                            <td>{ab.n_posti_letto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- SEZIONE ULTIMA PRENOTAZIONE --- */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #444' }}>
                <h2 style={{ color: 'white' }}>🕒 Ottieni l'ultima prenotazione</h2>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="number"
                        placeholder="Inserisci ID Utente..."
                        value={idUtenteBusca}
                        onChange={(e) => setIdUtenteBusca(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #666', marginRight: '10px', backgroundColor: '#333', color: 'white' }}
                    />
                    <button onClick={cercaUltima} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Trova Prenotazione
                    </button>
                </div>

                {loadingP && <p style={{ color: 'white' }}>Caricamento in corso...</p>}

                {ultimaP ? (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#2d2d2d', // Grigio scuro
                        color: 'white',             // Scritte bianche
                        borderRadius: '8px',
                        border: '2px solid #000000', // Un bordo colorato (come quello nell'immagine) lo rende più moderno
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                        <p style={{ margin: '8px 0' }}><strong>ID Prenotazione:</strong> {ultimaP.id}</p>
                        <p style={{ margin: '8px 0' }}><strong>ID Abitazione:</strong> {ultimaP.abitazione?.id || ultimaP.id_abitazione || 'N/D'}</p>
                        <p style={{ margin: '8px 0' }}><strong>Periodo:</strong> dal {ultimaP.data_inizio} al {ultimaP.data_fine}</p>
                        <p style={{ margin: '8px 0' }}>
                            <strong>Stato:</strong>
                            <span style={{
                                backgroundColor: '#444',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                marginLeft: '5px',

                            }}>
                                {ultimaP.stato}
                            </span>
                        </p>
                    </div>
                ) : (
                    !loadingP && idUtenteBusca && <p style={{ color: '#bbb' }}>Nessun dato trovato per questo ID.</p>
                )}
            </div>


            {/* --- SEZIONE TOP ABITAZIONE MESE --- */}

            <div className="stats-box">
                <h3>🔥 Abitazione Top del Mese</h3>
                {loadingTop && <p>Calcolando le statistiche...</p>}

                {!loadingTop && topMese && (
                    <div>
                        <p><strong>{topMese.nome}</strong></p>
                        <span>{topMese.conteggio} prenotazioni ricevute</span>
                    </div>
                )}

                {!loadingTop && !topMese && (
                    <p style={{ color: '#888' }}>Nessun dato per l'ultimo mese.</p>
                )}
            </div>

            {/* --- SEZIONE TOP HOSTS MESE --- */}

            <div className="stats-box">
                <h3>Classifica Host del Mese</h3>
                {loadingHosts ? <p>Caricamento...</p> : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {topHosts.map((h, index) => (
                            <li key={index} style={{ marginBottom: '8px' }}>
                                <strong>{index + 1}. {h.nome}</strong>: {h.conteggio} prenotazioni
                            </li>
                        ))}
                        {topHosts.length === 0 && <li>Nessun host attivo questo mese</li>}
                    </ul>
                )}
            </div>

            {/* --- SEZIONE SUPER HOSTS  --- */}

            <div className="stats-box">
                <h3>Super-host</h3>
                {loadingSH ? <p>Caricamento...</p> : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {superHosts.map((sh, index) => (
                            <div key={index} style={{
                                padding: '10px',
                                border: '1px solid #ffd700',
                                borderRadius: '8px',
                                backgroundColor: '#fffdf0'
                            }}>
                                <strong>{sh.nome}</strong><br />
                                <small>{sh.email}</small>
                            </div>
                        ))}
                        {superHosts.length === 0 && <p>Nessun super-host trovato.</p>}
                    </div>
                )}
            </div>


            {/* --- SEZIONE TOP 5 GUEST  --- */}

            <div className="stats-box">
                <h3>Top Viaggiatori (Giorni totali/mese)</h3>
                {loadingGuests ? <p>Caricamento...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th align="left">Nome</th>
                                <th align="right">Giorni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topGuests.map((g, i) => (
                                <tr key={i}>
                                    <td>{g.nome}</td>
                                    <td align="right">{g.giorni} gg</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {topGuests.length === 0 && !loadingGuests && <p>Nessun dato disponibile.</p>}
            </div>

        </div>
    );
}

export default Stats;