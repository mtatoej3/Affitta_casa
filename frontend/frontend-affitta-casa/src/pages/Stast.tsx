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

    const [mediaPosti, setMediaPosti] = useState<number | null>(null);
    const [loadingMedia, setLoadingMedia] = useState(false);

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

    const caricaMediaPosti = () => {
        setLoadingMedia(true);
        statsService.getMediaPostiLetto()
            .then(res => {
                setMediaPosti(res.media_posti_letto);
                setLoadingMedia(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingMedia(false);
            });
    };

    useEffect(() => {

        caricaTopMese();
        caricaTopHosts();
        caricaSuperHosts();
        caricaTopGuests();
        caricaMediaPosti();


        if (codiceInput) {
            caricaCase();
        }


    }, []);

    return (
        <div style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            padding: '20px',
            color: 'white'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* --- SEZIONE ABITAZIONE PER HOST  --- */}
                <h2 style={{ color: 'white' }}>Cerca Abitazioni per Host</h2>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Inserisci Codice Host..."
                        value={codiceInput}
                        onChange={(e) => setCodiceInput(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid #555',
                            borderRadius: '4px',
                            backgroundColor: '#2d2d2d',
                            color: 'white',
                            flex: 1
                        }}
                    />
                    <button onClick={caricaCase} style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>Cerca</button>
                </div>

                <table width="100%" style={{
                    borderCollapse: 'collapse',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '40px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Nome</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Indirizzo</th>
                            <th style={{ padding: '12px', border: '1px solid #444' }}>Posti Letto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {caseHost.map(ab => (
                            <tr key={ab.id} style={{ borderBottom: '1px solid #444' }}>
                                <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.nome}</td>
                                <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.indirizzo}</td>
                                <td style={{ padding: '12px', border: '1px solid #444', color: 'white' }}>{ab.n_posti_letto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- SEZIONE ULTIMA PRENOTAZIONE --- */}
                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #444' }}>
                    <h2 style={{ color: 'white' }}>🕒 Ottieni l'ultima prenotazione</h2>
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            placeholder="Inserisci ID Utente..."
                            value={idUtenteBusca}
                            onChange={(e) => setIdUtenteBusca(e.target.value)}
                            style={{
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#2d2d2d',
                                color: 'white',
                                flex: 1
                            }}
                        />
                        <button onClick={cercaUltima} style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}>
                            Trova Prenotazione
                        </button>
                    </div>

                    {loadingP && <p style={{ color: 'white' }}>Caricamento in corso...</p>}

                    {ultimaP ? (
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#2d2d2d',
                            color: 'white',
                            borderRadius: '8px',
                            border: '2px solid #007bff',
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

                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3 style={{ color: 'white' }}>🔥 Abitazione Top del Mese</h3>
                    {loadingTop && <p style={{ color: 'white' }}>Calcolando le statistiche...</p>}

                    {!loadingTop && topMese && (
                        <div>
                            <p style={{ color: 'white' }}><strong>{topMese.nome}</strong></p>
                            <span style={{ color: '#bbb' }}>{topMese.conteggio} prenotazioni ricevute</span>
                        </div>
                    )}

                    {!loadingTop && !topMese && (
                        <p style={{ color: '#888' }}>Nessun dato per l'ultimo mese.</p>
                    )}
                </div>

                {/* --- SEZIONE TOP HOSTS MESE --- */}

                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3 style={{ color: 'white' }}>Classifica Host del Mese</h3>
                    {loadingHosts ? <p style={{ color: 'white' }}>Caricamento...</p> : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {topHosts.map((h, index) => (
                                <li key={index} style={{ marginBottom: '8px', color: 'white' }}>
                                    <strong>{index + 1}. {h.nome}</strong>: {h.conteggio} prenotazioni
                                </li>
                            ))}
                            {topHosts.length === 0 && <li style={{ color: '#bbb' }}>Nessun host attivo questo mese</li>}
                        </ul>
                    )}
                </div>

                {/* --- SEZIONE SUPER HOSTS  --- */}

                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3 style={{ color: 'white' }}>Super-host</h3>
                    {loadingSH ? <p style={{ color: 'white' }}>Caricamento...</p> : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {superHosts.map((sh, index) => (
                                <div key={index} style={{
                                    padding: '10px',
                                    border: '1px solid #ffd700',
                                    borderRadius: '8px',
                                    backgroundColor: '#3d3d1f'
                                }}>
                                    <strong style={{ color: 'white' }}>{sh.nome}</strong><br />
                                    <small style={{ color: '#bbb' }}>{sh.email}</small>
                                </div>
                            ))}
                            {superHosts.length === 0 && <p style={{ color: '#bbb' }}>Nessun super-host trovato.</p>}
                        </div>
                    )}
                </div>


                {/* --- SEZIONE TOP 5 GUEST  --- */}

                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3 style={{ color: 'white' }}>Top Viaggiatori (Giorni totali/mese)</h3>
                    {loadingGuests ? <p style={{ color: 'white' }}>Caricamento...</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #555' }}>
                                    <th align="left" style={{ color: 'white', padding: '10px' }}>Nome</th>
                                    <th align="right" style={{ color: 'white', padding: '10px' }}>Giorni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topGuests.map((g, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #444' }}>
                                        <td style={{ color: 'white', padding: '10px' }}>{g.nome}</td>
                                        <td align="right" style={{ color: 'white', padding: '10px' }}>{g.giorni} gg</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {topGuests.length === 0 && !loadingGuests && <p style={{ color: '#bbb' }}>Nessun dato disponibile.</p>}
                </div>

                {/* --- SEZIONE MEDIA POSTI LETTO --- */}
                <div style={{
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    border: '1px solid #444'
                }}>
                    <h3 style={{ color: 'white' }}>🛏️ Media Posti Letto</h3>
                    {loadingMedia ? <p style={{ color: 'white' }}>Calcolo in corso...</p> : (
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                            {mediaPosti !== null ? mediaPosti.toFixed(1) : 'N/D'}
                            <span style={{ fontSize: '16px', color: '#666', fontWeight: 'normal' }}> posti per casa</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Stats;