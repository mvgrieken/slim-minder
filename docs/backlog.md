# Slim Minder – Backlog (MVP + Next)

Status: draft • Owner: product/engineering • Last updated: today

## Milestones
- M1: Basis zonder PSD2 (handmatige transacties, categorieën, budgetten, dashboard, drempelbanner)
- M2: PSD2 integratie (linking, sync, categorisatie)
- M3: Nudges & Push + Doelen/Badges
- M4: AI Coach (basic intents)

## Epics
- E1 Onboarding & Profiel
- E2 Transacties & Categorieën (handmatig)
- E3 Budgetten & Dashboard
- E4 PSD2 Koppeling & Sync
- E5 Categorisatie
- E6 Nudges & Notificaties
- E7 Doelen & Badges
- E8 AI Coach
- E9 Instellingen & Privacy

## Stories (geprioriteerd)

### M1 — Basis zonder PSD2
- SM-001 (E2, P0): Handmatige transactie toevoegen
  - Als gebruiker wil ik handmatig een uitgave/inkomst kunnen toevoegen (bedrag, datum, categorie, notitie) zodat ik mijn bestedingen kan volgen.
  - Acceptance:
    - Validatie: positief bedrag, verplichte velden; datum default vandaag.
    - CRUD: aanmaken, bewerken, verwijderen.
    - Opslag via API; UI lijst toont nieuwste bovenaan met dagtotaal.
- SM-002 (E2, P0): Categorieën beheren
  - Als gebruiker wil ik categorieën kunnen aanmaken/hernoemen/archiveren zodat ze aansluiten op mijn uitgaven.
  - Acceptance: CRUD, icoon optioneel, archief verbergt uit selectie, migratie van transacties bij verwijderen/hernoemen.
- SM-003 (E3, P0): Budget per categorie
  - Als gebruiker wil ik per categorie een maandbudget instellen zodat ik grenzen heb.
  - Acceptance: limiet, valuta, periode-start; activeren/deactiveren; één budget per categorie per periode.
- SM-004 (E3, P0): Dashboard voortgang
  - Als gebruiker wil ik een overzicht van besteding vs. limiet zodat ik zie wat resteert.
  - Acceptance: progress bars; groen/oranje/rood bij <80/≥80/≥100%; resterend bedrag getoond.
- SM-005 (E6, P0): Drempelbanner (in-app)
  - Als gebruiker wil ik een waarschuwing zien bij 80%/100% van een budget zodat ik kan bijsturen.
  - Acceptance: banner/snackbar; éénmaal per dag per categorie; uit te zetten per categorie.
- SM-006 (E1, P1): Onboarding basis / Gast-profiel
  - Als gebruiker wil ik zonder complex account de app kunnen gebruiken (gast-profiel) zodat ik snel kan starten.
  - Acceptance: lokaal user-id; later migreerbaar naar volwaardig account.
- SM-007 (E9, P1): Data export & account verwijderen (basic)
  - Als gebruiker wil ik mijn data kunnen exporteren/verwijderen zodat ik controle heb.
  - Acceptance: JSON-export; hard delete in dev; bevestiging vóór verwijderen.

### M2 — PSD2 integratie
- SM-101 (E4, P0): Providerkeuze & mock
  - Acceptance: feature-flag; mock accounts/transactions; togglebaar per omgeving.
- SM-102 (E4, P0): Account linking flow
  - Acceptance: consent-start, redirect terug, status zichtbaar (linked/expired/pending).
- SM-103 (E4, P0): Transactie-import + dedupe
  - Acceptance: initial sync (90 dagen), incremental sync; idempotent; kloktijden gelogd.
- SM-104 (E5, P0): Auto-categorisatie baseline
  - Acceptance: simpele rules/merchant-map; “onthoud mijn keuze” bij override.
- SM-105 (E4, P1): Webhooks/polling jobs
  - Acceptance: worker job met retry/backoff; observability (metrics/logs PII-schoon).

### M3 — Nudges, Push, Doelen/Badges
- SM-201 (E6, P0): Push notificaties
  - Acceptance: Expo push tokens; per user opslaan; testmeldingen; opt-in scherm.
- SM-202 (E6, P0): Nudge-engine budgetdrempels
  - Acceptance: worker berekent drempels; throttle; inbox in app; mark-as-read.
- SM-203 (E7, P0): Doelen CRUD + voortgang
  - Acceptance: target bedrag, deadline; voortgangsbalk; status gehaald/te laat.
- SM-204 (E7, P1): Badges basis
  - Acceptance: regels voor mijlpalen (1 maand binnen budget; 3 transacties hercategoriseerd, etc.).

### M4 — AI Coach
- SM-301 (E8, P0): Chat met basic intents
  - Acceptance: intents: besteding per categorie/periode, near-limit waarschuwing; bronvermelding.
- SM-302 (E8, P1): Feedback op antwoord
  - Acceptance: thumbs up/down; logging voor verbetering; rate limiting.

## Non-functional
- NFR-01: Privacy by design (dataminimalisatie, encryptie at-rest/in-transit, geen PII in logs)
- NFR-02: Observability (structured logging, error tracking), minimal metrics.
- NFR-03: Performance (snelle lijstscroll, lazy loading, offline-tolerant voor M1 handmatig).

## Dependencies/Assumpties
- DB: PostgreSQL + Prisma (schema in docs/data-model.md en apps/api/prisma/schema.prisma)
- Auth: gast-profiel in M1; volwaardige auth later (Clerk/Auth0/Supabase)
- PSD2: Tink/GoCardless; start met mock in M2

