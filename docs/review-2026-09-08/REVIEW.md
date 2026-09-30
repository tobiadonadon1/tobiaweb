> Proposta esplorativa precedente al feedback. La versione approvata conserva le carte, ripristina testi identitari e altre modifiche precedenti, amplia il claim e corregge loader e blocchi neri. Questo documento non descrive integralmente la versione da pubblicare.

# Review del sito personale · 8 settembre 2026

La base visiva ha carattere. Il problema principale era capire cosa unisse tutti i progetti e quale passo fare dopo. Foto personali, Host Grotesk, blu profondo, carta e annotazioni sono elementi da conservare: sono più riconoscibili di una nuova collezione di effetti.

Questa è una review con una proposta implementata in locale, basata sul codice e sulla navigazione nel browser. Non è una misurazione del sito in produzione né un audit esaustivo di sicurezza o accessibilità.

## Cosa ho cambiato

- **Storia:** tre passaggi concreti: prima agenzia a 15 anni; digital brain e digital twin oggi; le domande sulla coscienza che portano al libro. Il testo precedente ripeteva idee come “purpose”, “growth” e “innovation” senza raccontare molto di te.
- **Ingresso:** claim più chiaro e accesso ai materiali gratuiti subito sotto la presentazione. Il sito resta in inglese, come l’originale.
- **Progetti:** sostituita la lunga attesa davanti a “What I’m building” con una breve introduzione e tre pannelli che si sovrappongono durante lo scroll. Construct mantiene la stella disegnata; Myynd ha una figura di conoscenza connessa; il libro una domanda tipografica. Carta, verde tenue e azzurro distinguono le tre aree sopra lo stesso cielo blu.
- **Gerarchia:** Construct è il punto da cui iniziare; Myynd è il prodotto in sviluppo; il libro è una ricerca sulla coscienza umana. Everwave e i digital twin sono citati come lavori in corso, senza inventare caratteristiche, risultati o una data di uscita.
- **Navbar:** etichette leggibili anche su mobile, aree di 44 px, semantica di navigazione e stato corrente accessibile. Scrollspy coerente anche risalendo nelle sezioni intermedie. Corretto il click su un hash già presente e il reload verso una sezione. Durante l’intro la navbar nascosta non riceve focus.
- **Cursore:** conserva il rosso e il cerchio sui link, ma segue il punto reale senza ritardo elastico. Mantiene il cursore nativo sui campi e nelle regioni con feedback proprio; si aggiorna anche quando il contenuto scorre sotto il mouse. Nessun cursore custom con puntatore touch primario o preferenza di movimento ridotto.
- **Thoughts:** nascosti i link placeholder di Instagram e X. Finestra articolo trasformata in dialogo nativo: sopra la navbar, focus interno, Escape, ritorno all’articolo selezionato, sfondo non interattivo. Controlli di chiusura e apertura completa più grandi.
- **Libro:** descrizione SEO coerente con coscienza, attenzione e mondo interiore. “Pre-order” diventa “When it’s ready”: oggi si lascia un indirizzo per essere avvisati, non si compra. Migliorato anche il contrasto del pulsante.

## Cosa farei dopo, in ordine

1. **Rendere comprabile l’esperienza.** In Construct manca ancora un’offerta facile da valutare: a chi serve, quale problema risolvi, cosa consegni e come iniziare. Proposta da definire: una sessione pratica per trasformare un’idea in un primo sistema funzionante. Durata, prezzo e risultato promesso devono venire dalla tua offerta reale.
2. **Mostrare una prova.** Un caso concreto con problema iniziale, decisioni prese e risultato osservabile vale più di “got good at most of it”. Può essere il tuo digital brain: mostra un compito reale e come lo affronta. Numeri solo se misurati.
3. **Dare voce al libro.** La pagina contiene ancora un’immagine nello spazio della lettura, senza una sorgente video. Un tuo video breve o una pagina del manoscritto aiuterebbe a capire perché il libro esiste. La grafica non può sostituire quel contenuto.
4. **Verificare la lista prima di promuoverla.** L’API usa WAITLIST_WEBHOOK_URL se configurato; altrimenti registra localmente e restituisce durable:false. Il codice lo comunica, ma non ho verificato la configurazione di produzione né l’effettiva consegna a un provider. Occorre provare salvataggio duraturo e notifica con un indirizzo di test autorizzato.
5. **Riscrivere i blog con una funzione.** Tre filoni: costruire con AI, digital brain/twin, coscienza. Per ogni articolo: domanda concreta, esperienza personale, esempio, conclusione e un solo prossimo passo pertinente. Conservare URL e data originaria; aggiungere una data di aggiornamento quando la revisione è sostanziale. Evitare affermazioni assolute come “no algorithm can ever replicate” senza argomentazione.
6. **Ridurre il tono difensivo.** “And what I am not” è onesto, ma chiude la prova di competenza elencando limiti. Lo sostituirei con un esempio circoscritto di cosa sai fare, quando hai materiale reale da mostrare. Non ho inventato clienti o credenziali per riempire il vuoto.
7. **Misurare e alleggerire.** Misurare accesso ai materiali, contatti e iscrizioni effettivamente salvate prima di dichiarare un aumento di conversioni. Poi profilare foto iniziali, canvas e animazioni su telefono reale. L’intro resta una scelta estetica forte e introduce diversi secondi di attesa nella prima visita.

## Verifiche

- TypeScript senza errori; build di produzione riuscita (56 pagine generate).
- ESLint: nessun errore. Warning preesistenti su immagini, una direttiva inutilizzata e dipendenze di un effetto in glsl-hills.
- HTTP 200 per home, Construct, materiali, Myynd, libro, un articolo, sitemap e robots.
- API waitlist: input email invalido respinto con 400. Nessun indirizzo inviato alla lista.
- Browser desktop 1280×720: osservati arrivo dei progetti, Construct, sovrapposizione Myynd e libro, navigazione con hash già presente.
- Browser 390×844: nessun overflow orizzontale rilevato su home e libro; pannelli statici larghi 342 px; navbar con target di 44 px; cursore testuale effettivo nel campo email.
- Dialogo articolo a 390 px: larghezza 358 px; focus iniziale su Close; Escape chiude, ripristina il focus sul file e sblocca lo scroll; navbar e pagina non interattive sotto il dialogo.
- Movimento ridotto: fallback previsto nel codice; non emulato a runtime in questa sessione. Non testati un telefono fisico, VoiceOver completo, tutti i download, tutte le pagine articolo o i Core Web Vitals in produzione.

## MotionSites e direzione

MCP `motionsites` aggiunto alla configurazione globale Codex, autenticazione completata, libreria interrogata. Consultato un prompt gratuito, [Personal Showcase](https://motionsites.ai/?prompt=personal-showcase); la ricerca ha restituito anche [Layered Depth](https://motionsites.ai/?prompt=layered-depth). Il primo è utile per ragionare sulla profondità di una composizione fotografica. Non ho copiato il ritratto, i testi, i font esterni o i link fittizi del template. È stato usato 1 accesso gratuito; il server ne ha indicati 2 rimanenti.

La skill scrollcraft è stata applicata come guida alla revisione di un sito esistente, adattandola alla libertà di sperimentare che hai dato. Il brief è auto-redatto dal tuo messaggio, senza una nuova intervista. Non è una nuova build completa dell’engine scrollcraft e non è stato eseguito il suo harness dedicato ai video scrub.

Le modifiche preesistenti a HeroSequence e SiteNav sono state conservate. Nessun deploy, commit o pubblicazione. Anteprima: http://localhost:3000/#projects.
