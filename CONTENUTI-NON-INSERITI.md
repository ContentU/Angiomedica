# Testi del Master editoriale V2 senza uno spazio nel layout approvato

Il sito riproduce esattamente il layout della demo. I testi del Master sono stati inseriti in Sanity dove la demo ha uno spazio corrispondente; quelli qui sotto **non hanno un posto nel layout** e non sono stati aggiunti, per non inventare nuovi blocchi grafici. Da decidere con il responsabile: aggiungere un blocco al layout oppure rinunciare al testo.

| Pagina | Testo del Master | Nota |
|---|---|---|
| Homepage · hero | Eyebrow «Angiomedica · Palermo» | La hero della demo non ha sopratitolo |
| Homepage · visite ed esami | Descrizione breve di ogni prestazione in evidenza | Le tile della demo mostrano solo il nome |
| Homepage · contatti | «Ci trovi in Via Ruggero Settimo 55. Per informazioni e appuntamenti puoi contattare la segreteria.» | La demo mostra solo indirizzo, orari, telefono |
| Hub `/specialita/` | H1, testo introduttivo, CTA card | La demo non ha questa pagina: il menu «Specialità» porta a `/#specialita` |
| Il Centro | Sezione «Le nostre specialità» (5 card) | Non presente nella pagina della demo |
| Il Centro | CTA finale «Scopri le prestazioni» | La chiusura della demo ha un solo pulsante |
| Cardiologia / Angiologia | CTA «Scopri tutte le prestazioni» nella chiusura | Come sopra |
| Visite a domicilio | «La possibilità di ricevere assistenza fuori dal centro» (testo) | Nessun paragrafo libero nella demo |
| Visite a domicilio | Testo di «Disponibilità e informazioni pratiche» | Usato solo in parte nella chiusura; la sezione della demo è un elenco |
| Contatti | Altri recapiti 091 331731 e 091 320229 | Le card della demo sono tre (telefono, email, WhatsApp) |
| Contatti | «Informazioni per il S.S.N.» (testo e CTA) | Resta la nota S.S.N. dentro il modulo |
| Professionisti | Filtro per specialità | La demo non ha filtro |
| Profilo professionista | Sezioni «Competenze e attività» e «Prestazioni» del template | Il Master non fornisce i testi per i tre medici; le prestazioni si collegano solo dopo la verifica |
| Footer | «Angiomedica — Diagnostica e terapia cardiologica e vascolare», link S.S.N., «Altre informazioni obbligatorie» | Il footer della demo ha una struttura diversa |
| SEO | Meta description | Il Master le fornisce solo per Il Centro; i SEO title sono stati inseriti tutti |

## Scelte fatte durante lo sviluppo (da confermare)

- **Professionisti ↔ prestazioni**: il Master chiede di collegarli solo dopo la verifica, quindi le sezioni «Chi la esegue» delle schede e «Prestazioni che segue» dei profili restano nascoste finché non si collegano nello Studio.
- **Specialità «consulenza»** (cardiochirurgia, chirurgia vascolare, dietologia): URL canonico `/specialita/<nome>/`; le schede `/prestazioni/visita-…/` reindirizzano lì. Il testo della pagina unisce le sezioni del Master della specialità («La consulenza…», «Ambiti di consulenza») e della visita («Come si svolge», «Prima della visita»).
- **Blog**: il Master non fornisce articoli; sono caricati i titoli segnaposto della demo, tutti marcati «da confermare». Da non pubblicare finché il blog non è confermato.
- **Mobile**: nel modulo della homepage il selettore della visita resta a pulsanti anche su mobile (il riferimento mobile usa un menu a tendina); la paginazione del blog della demo è omessa (pochi articoli).
- **Header/menu mobile**: implementato (nella demo non lo era).
