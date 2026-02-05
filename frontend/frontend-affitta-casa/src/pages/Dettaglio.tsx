import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { abitazioneService, type Abitazione } from '../services/abitazioneService';
import { disponibilitaService } from '../services/disponibilitaService';
import { prenotazioneService } from '../services/prenotazioneService';
import { useNavigate } from 'react-router-dom';
import { feedbackService } from '../services/feedbackService';

function Dettaglio() {
    const { id } = useParams();
    const [casa, setCasa] = useState<Abitazione | null>(null);
    const [codiceHostVerifica, setCodiceHostVerifica] = useState('');
    const [isHostAutenticato, setIsHostAutenticato] = useState(false);
    const [loading, setLoading] = useState(true);

    const [nuovoPrezzo, setNuovoPrezzo] = useState(0);
    const [nuovoInizio, setNuovoInizio] = useState('');
    const [nuovoFine, setNuovoFine] = useState('');
    const [disponibilita, setDisponibilita] = useState<any[]>([]);

    const [dataI, setDataI] = useState('');
    const [dataF, setDataF] = useState('');


    const [guestNome, setGuestNome] = useState('');
    const [guestCognome, setGuestCognome] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

    const [prenotazioni, setPrenotazioni] = useState<any[]>([]);

    const navigate = useNavigate();

    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [mediaVoti, setMediaVoti] = useState<number | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [newFeedback, setNewFeedback] = useState({
        id_prenotazione: '',
        nome: '',
        email: '',
        titolo: '',
        testo: '',
        punteggio: 5
    });





    console.log("DEBUG: Il componente Dettaglio è stato caricato. ID recuperato:", id);

    useEffect(() => {
        if (id) {
            setLoading(true);
            // Eseguiamo entrambe le chiamate
            Promise.all([
                abitazioneService.getById(id),
                disponibilitaService.getByAbitazione(id),
                prenotazioneService.getByAbitazione(id).then(data => setPrenotazioni(data || [])),
                // Carica feedback
                feedbackService.getByAbitazione(id).then(data => setFeedbacks(data)).catch(err => console.error(err)),
                // Carica media
                feedbackService.getMedia(id).then(res => setMediaVoti(res.media)).catch(err => console.error(err))

            ])
                .then(([datiCasa, datiDisp]) => {
                    setCasa(datiCasa);
                    // NOTA LA MODIFICA QUI SOTTO: datiDisp.disponibilita
                    setDisponibilita(datiDisp.disponibilita || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Errore nel caricamento dati", err);
                    setLoading(false);
                });
        }
    }, [id]);



    useEffect(() => {
        console.log("DEBUG: Entrato nello useEffect. Valore di id:", id);

        if (id) {
            console.log("DEBUG: ID presente, faccio la chiamata al service...");
            setLoading(true);
            abitazioneService.getById(id)
                .then(dati => {
                    console.log("DEBUG: Il server ha risposto! Dati:", dati);
                    setCasa(dati);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("DEBUG: Il server ha dato ERRORE:", err);
                    setLoading(false);
                });
        } else {
            console.log("DEBUG: Lo useEffect è partito ma ID è vuoto/undefined.");
        }
    }, [id]);



    const gestisciAggiungiSlot = async () => {
        if (!nuovoInizio || !nuovoFine || nuovoPrezzo <= 0) {
            alert("Inserisci date valide e un prezzo maggiore di 0");
            return;
        }

        if (!casa) {
            alert("Errore: dati della casa non caricati.");
            return;
        }

        const payload = {
            id_abitazione: casa.id,
            data_inizio: nuovoInizio,
            data_fine: nuovoFine,
            prezzo_periodo: nuovoPrezzo
        };

        try {
            const response = await fetch('http://localhost:7000/api/disponibilita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Disponibilità inserita!");
                window.location.reload(); // Ricarica per vedere il nuovo slot in tabella
            } else {
                const errorMsg = await response.text();
                alert("Errore: " + errorMsg);
            }
        } catch (error) {
            console.error("Errore fetch:", error);
        }
    };

    const handleEliminaSlot = async (id: number) => {
        if (window.confirm("Sei sicuro di voler eliminare questa disponibilità?")) {
            try {
                await disponibilitaService.delete(id);
                alert("Eliminata!");
                // Ricarica le disponibilità per aggiornare la tabella senza refresh totale se possibile, 
                // o usa window.location.reload() come già fatto in gestisciAggiungiSlot
                window.location.reload();
            } catch (err) {
                alert("Errore durante l'eliminazione");
            }
        }
    };


    const handlePrenota = async () => {
        // Validazione semplice
        if (!guestNome || !guestCognome || !guestEmail || !dataI || !dataF) {
            alert("Completa tutti i campi prima di prenotare");
            return;
        }

        if (!casa) {
            alert("Errore: dati della casa non caricati.");
            return;
        }

        const payload = {
            id_abitazione: casa.id,
            data_inizio: dataI,
            data_fine: dataF,
            guest_nome: guestNome,      // Deve corrispondere al nome nel DTO Java
            guest_cognome: guestCognome,
            guest_email: guestEmail
        };

        try {
            await prenotazioneService.invia(payload);
            alert("Prenotazione effettuata!");
        } catch (err) {
            alert("Errore durante la prenotazione: " + err);
        }
    };

    const gestisciStatoPrenotazione = async (id: number, nuovoStato: 'confermata' | 'cancellata') => {
        try {
            await prenotazioneService.aggiornaStato(id, nuovoStato);
            alert(`Prenotazione ${nuovoStato.toLowerCase()}!`);
            window.location.reload();
        } catch (err) {
            alert("Errore nell'aggiornamento: " + err);
        }
    };

    const handleEliminaCasa = async () => {
        if (!casa) return;

        // Popup di conferma nativo del browser
        if (window.confirm(`Sei sicuro di voler ELIMINARE DEFINITIVAMENTE "${casa.nome}"? L'operazione è irreversibile.`)) {
            try {
                await abitazioneService.delete(casa.id);
                alert("Abitazione eliminata con successo.");
                navigate('/'); // Torna alla home page
            } catch (err) {
                console.error(err);
                alert("Errore durante l'eliminazione dell'abitazione.");
            }
        }
    };

    const handleSaveFeedback = async () => {
        try {
            await feedbackService.crea({
                ...newFeedback,
                id_prenotazione: Number(newFeedback.id_prenotazione),
                punteggio: Number(newFeedback.punteggio)
            });
            alert("Grazie per il tuo feedback!");
            setShowFeedbackModal(false);
            window.location.reload();
        } catch (err: any) {
            alert(err.response?.data || "Errore nella creazione del feedback");
        }
    };

    const handleDeleteFeedback = async (idF: number) => {
        if (window.confirm("Eliminare questo feedback?")) {
            try {
                await feedbackService.delete(idF);
                window.location.reload();
            } catch (err) {
                alert("Errore nell'eliminazione");
            }
        }
    };



    if (loading) return <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>Caricamento dati in corso...</div>;
    if (!casa) return <div style={{ padding: '20px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>Abitazione non trovata.</div>;
    console.log("Stato disponibilita attuale:", disponibilita);
    return (
        <div style={{
            backgroundColor: '#1a1a1a',
            minHeight: '100vh',
            padding: '20px',
            color: 'white'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* INTESTAZIONE E MEDIA VOTI */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ color: 'white' }}>{casa.nome}</h1>
                    <div style={{ fontSize: '20px', color: '#f39c12' }}>
                        ⭐ {mediaVoti ? mediaVoti.toFixed(1) : 'N/D'}
                        <span style={{ color: '#999', fontSize: '14px' }}>
                            ({feedbacks.length} recensioni)
                        </span>
                    </div>

                </div>
                <p style={{ color: '#999' }}>📍 {casa.indirizzo}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    {/* COLONNA SINISTRA: INFO E DISPONIBILITÀ */}
                    <div>
                        <h3 style={{ color: 'white' }}>Caratteristiche</h3>
                        <ul style={{ color: 'white' }}>
                            <li>Locali: {casa.n_locali}</li>
                            <li>Posti Letto: {casa.n_posti_letto}</li>
                            <li>Piano: {casa.piano}</li>
                        </ul>

                        <hr />

                        {/* SEZIONE GESTIONE HOST (Verifica Codice) */}
                        <div style={{ backgroundColor: '#2d2d2d', padding: '15px', borderRadius: '8px', border: '1px solid #444', color: 'white' }}>
                            <h4 style={{ marginTop: 0 }}>Gestione Disponibilità (Area Host)</h4>

                            {!isHostAutenticato ? (
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Inserisci Codice Host"
                                        value={codiceHostVerifica}
                                        onChange={(e) => setCodiceHostVerifica(e.target.value)}
                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                                    />
                                    <button
                                        onClick={() => {
                                            if (codiceHostVerifica === casa.id_host.codice_host) setIsHostAutenticato(true);
                                            else alert("Codice errato!");
                                        }}
                                        style={{ marginLeft: '10px', padding: '8px 16px', cursor: 'pointer' }}
                                    >
                                        Verifica
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ color: '#00ffcc', fontWeight: 'bold' }}>✅ Accesso autorizzato</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <input
                                            type="date"
                                            value={nuovoInizio}
                                            onChange={(e) => setNuovoInizio(e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                        />
                                        <span> a </span>
                                        <input
                                            type="date"
                                            value={nuovoFine}
                                            onChange={(e) => setNuovoFine(e.target.value)}
                                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Prezzo (€)"
                                            value={nuovoPrezzo}
                                            onChange={(e) => setNuovoPrezzo(Number(e.target.value))}
                                            style={{ width: '90px', padding: '5px', borderRadius: '4px', border: '1px solid #666' }}
                                        />
                                        <button
                                            onClick={gestisciAggiungiSlot}
                                            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Aggiungi Slot
                                        </button>
                                    </div>

                                    <hr style={{ borderColor: '#555', margin: '30px 0 20px 0' }} />

                                    {/* Zona Pericolo - Elimina Casa */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(220, 53, 69, 0.1)', // Sfondo rossastro leggero
                                        padding: '15px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(220, 53, 69, 0.2)'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ color: '#ff4d4d', fontWeight: 'bold', fontSize: '14px' }}>Zona Pericolo</span>
                                            <span style={{ color: '#aaa', fontSize: '12px' }}>L'azione è irreversibile e cancellerà tutti i dati della casa.</span>
                                        </div>
                                        <button
                                            onClick={handleEliminaCasa}
                                            style={{
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                transition: '0.3s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#a71d2a'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                                        >
                                            🗑️ Elimina Intera Casa
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <h4 style={{ color: 'white', marginTop: '30px' }}>Calendario Disponibilità</h4>
                        <table width="100%" style={{ borderCollapse: 'collapse', color: 'white', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #444', textAlign: 'left', backgroundColor: '#333' }}>
                                    <th style={{ padding: '12px' }}>Inizio</th>
                                    <th style={{ padding: '12px' }}>Fine</th>
                                    <th style={{ padding: '12px' }}>Prezzo (€)</th>
                                    {isHostAutenticato && <th style={{ padding: '12px' }}>Azioni</th>}

                                </tr>
                            </thead>
                            <tbody>
                                {disponibilita && disponibilita.length > 0 ? (
                                    disponibilita.map((disp: any, index: number) => (
                                        <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                                            <td style={{ padding: '12px' }}>{disp.data_inizio}</td>
                                            <td style={{ padding: '12px' }}>{disp.data_fine}</td>
                                            <td style={{ padding: '12px' }}>{disp.prezzo_periodo}€</td>
                                            {isHostAutenticato && (
                                                <td style={{ padding: '12px' }}>
                                                    <button
                                                        onClick={() => handleEliminaSlot(disp.id)}
                                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        🗑️ Elimina
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                            Nessuno slot trovato per questa casa.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <h4 style={{ color: 'white', marginTop: '30px' }}>Proposte di Prenotazione</h4>
                        <table width="100%" style={{ borderCollapse: 'collapse', color: 'white', backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #444', textAlign: 'left', backgroundColor: '#333' }}>
                                    <th style={{ padding: '12px' }}>Guest</th>
                                    <th style={{ padding: '12px' }}>Periodo</th>
                                    <th style={{ padding: '12px' }}>Stato</th>
                                    {isHostAutenticato && <th style={{ padding: '12px' }}>Azioni</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {prenotazioni.map((p: any, index: number) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '12px' }}>
                                            {p.guest_nome} {p.guest_cognome}<br />
                                            <small style={{ color: '#aaa' }}>{p.guest_email}</small>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            {p.data_inizio} <br /> {p.data_fine}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                                                backgroundColor: p.stato === 'CONFERMATA' ? '#28a745' :
                                                    p.stato === 'RIFIUTATA' ? '#dc3545' : '#ffc107',
                                                color: 'black'
                                            }}>
                                                {p.stato}
                                            </span>
                                        </td>

                                        {/* Visualizza i bottoni solo se HOST VERIFICATO e stato è IN_ATTESA */}
                                        {isHostAutenticato && p.stato === 'in_attesa' && (
                                            <td style={{ padding: '12px', display: 'flex', gap: '5px' }}>
                                                <button
                                                    onClick={() => gestisciStatoPrenotazione(p.id, 'confermata')}

                                                    style={{ backgroundColor: '#28a745', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                                                >✅</button>
                                                <button
                                                    onClick={() => gestisciStatoPrenotazione(p.id, 'cancellata')}
                                                    style={{ backgroundColor: '#dc3545', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                                                >❌</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                    {/* COLONNA DESTRA: FORM PRENOTAZIONE GUEST */}
                    <div style={{
                        padding: '20px',
                        borderRadius: '12px',
                        backgroundColor: '#2d2d2d',
                        border: '1px solid #444',
                        height: 'fit-content',
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <h3 style={{ marginTop: 0, color: 'white' }}>Prenota Soggiorno</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                            {/* INPUT NOME */}
                            <input
                                type="text"
                                placeholder="Nome"
                                value={guestNome}
                                onChange={(e) => setGuestNome(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />

                            {/* INPUT COGNOME */}
                            <input
                                type="text"
                                placeholder="Cognome"
                                value={guestCognome}
                                onChange={(e) => setGuestCognome(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />

                            {/* INPUT EMAIL */}
                            <input
                                type="email"
                                placeholder="Email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />

                            <label style={{ color: 'white' }}>Check-in</label>
                            <input
                                type="date"
                                value={dataI}
                                onChange={(e) => setDataI(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />

                            <label style={{ color: 'white' }}>Check-out</label>
                            <input
                                type="date"
                                value={dataF}
                                onChange={(e) => setDataF(e.target.value)}
                                style={{
                                    padding: '10px',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    backgroundColor: '#1a1a1a',
                                    color: 'white'
                                }}
                            />

                            <button
                                onClick={handlePrenota}
                                style={{
                                    backgroundColor: '#ff385c',
                                    color: 'white',
                                    padding: '12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                CONFERMA PRENOTAZIONE
                            </button>
                        </div>
                    </div>
                </div>

                <hr style={{ margin: '40px 0' }} />

                {/* SEZIONE FEEDBACK */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: 'white' }}>Recensioni degli ospiti ({feedbacks.length})</h3>
                        <button
                            onClick={() => setShowFeedbackModal(true)}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#007bff',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        >
                            ✍️ Scrivi Recensione
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {feedbacks.map((f, i) => (
                            <div key={i} style={{
                                padding: '20px',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                backgroundColor: '#2f2e2e',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => handleDeleteFeedback(f.id)}
                                    title="Elimina recensione"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        border: 'none',
                                        background: 'rgba(255, 255, 255, 0.1)', // Un leggero cerchio di sfondo
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#ff4d4d', // Rosso per richiamare l'eliminazione
                                        transition: '0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                >
                                    ✕
                                </button>

                                <div style={{ marginBottom: '10px' }}>
                                    <strong style={{ fontSize: '16px' }}>{f.titolo}</strong>
                                    <div style={{ color: '#f39c12', fontSize: '14px', marginTop: '5px' }}>
                                        {'⭐'.repeat(f.punteggio)}
                                    </div>
                                </div>

                                <p style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.5' }}>{f.testo}</p>

                                <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                                    — {f.guest_nome}
                                </div>
                            </div>
                        ))}

                        {feedbacks.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#999' }}>
                                Nessuna recensione ancora. Sii il primo a lasciarne una!
                            </div>
                        )}
                    </div>
                </div>
                {showFeedbackModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: '#2d2d2d',
                            color: 'white',
                            padding: '30px',
                            borderRadius: '12px',
                            width: '500px',
                            border: '2px solid #444'
                        }}>
                            <h3 style={{ marginTop: 0 }}>✍️ Lascia una Recensione</h3>

                            <input
                                type="number"
                                placeholder="ID Prenotazione"
                                value={newFeedback.id_prenotazione}
                                onChange={e => setNewFeedback({ ...newFeedback, id_prenotazione: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                            />

                            <input
                                type="text"
                                placeholder="Nome"
                                value={newFeedback.nome}
                                onChange={e => setNewFeedback({ ...newFeedback, nome: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={newFeedback.email}
                                onChange={e => setNewFeedback({ ...newFeedback, email: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                            />

                            <input
                                placeholder="Titolo recensione"
                                value={newFeedback.titolo}
                                onChange={e => setNewFeedback({ ...newFeedback, titolo: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                            />

                            <textarea
                                placeholder="Racconta la tua esperienza..."
                                value={newFeedback.testo}
                                onChange={e => setNewFeedback({ ...newFeedback, testo: e.target.value })}
                                style={{ width: '100%', height: '120px', marginBottom: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white', resize: 'vertical' }}
                            />

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ marginRight: '10px' }}>Voto: </label>
                                <select
                                    value={newFeedback.punteggio}
                                    onChange={e => setNewFeedback({ ...newFeedback, punteggio: Number(e.target.value) })}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#333', color: 'white' }}
                                >
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowFeedbackModal(false)}
                                    style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #666', backgroundColor: '#444', color: 'white' }}
                                >
                                    Annulla
                                </button>
                                <button
                                    onClick={handleSaveFeedback}
                                    style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold' }}
                                >
                                    Invia Recensione
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Dettaglio;


