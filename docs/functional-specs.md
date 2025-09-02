# Slim Minder – Functionele Specificatie (Cursor.ai-ready)
**Versie:** 1.0 — 2025-08-31  
**Status:** MVP + Roadmap (compleet)  
**Leidend uitgangspunt:** marketing-tiering is bindend; techniek volgt (feature‑gating per tier).  
**Taal:** Nederlands (B1‑niveau), NL/EUR locale

---

## Inhoudsopgave
1. [Introductie](#introductie)  
2. [Productvisie](#productvisie)  
3. [Abonnementen & Feature‑tiering](#abonnementen--feature-tiering)  
4. [MVP‑functionaliteiten](#mvp-functionaliteiten)  
   - 4.1 PSD2‑bankkoppeling & automatische transacties  
   - 4.2 Automatische categorisatie  
   - 4.3 Budgetten & nudges  
   - 4.4 Dashboard & maandrapport (PDF)  
   - 4.5 Doelen & gamification (badges) + Challenges  
   - 4.6 AI‑coach (chat/spraak)  
   - 4.7 Toegankelijkheid (easy mode)  
   - 4.8 Privacy & controle  
5. [Gebruikerspersona’s & flows](#gebruikerspersonas--flows)  
6. [Niet‑functionele eisen (NFRs)](#niet-functionele-eisen-nfrs)  
7. [Technische architectuur](#technische-architectuur)  
8. [Datamodel (PostgreSQL / Supabase)](#datamodel-postgresql--supabase)  
9. [API‑contracten (REST, schets)](#api-contracten-rest-schets)  
10. [Notificatie‑triggers & throttlebeleid](#notificatie-triggers--throttlebeleid)  
11. [Acceptatiecriteria & KPI’s](#acceptatiecriteria--kpis)  
12. [Gherkin‑tests (MVP)](#gherkin-tests-mvp)  
13. [Roadmap (na MVP)](#roadmap-na-mvp)  
14. [Out‑of‑scope](#out-of-scope)  
15. [Begrippenlijst](#begrippenlijst)

---

## Introductie
**Doel document** — Deze specificatie is bedoeld voor ontwikkelaars, testers en stakeholders. Ze beschrijft volledig **wat** Slim Minder moet doen (functioneel) en **hoe** (kern van techniek en kwaliteitseisen), zodat implementatie en validatie eenduidig zijn.

**Doel app** — Slim Minder is een digitale, gedragsgerichte **budgetcoach** die realtime inzicht en begeleiding geeft om overspending te voorkomen, buffers op te bouwen en financiële stress te verlagen.

**Doelgroepen** — Jongeren/students, gezinnen/partners en senioren (easy mode), plus iedereen die grip wil.

**Kernproblemen** — Gebrek aan overzicht, impulsuitgaven, moeilijk sparen, weinig motivatie/kennis. Slim Minder koppelt bankdata (of handmatige invoer) aan nudging, doelen en een AI‑coach.

---

## Productvisie
- **Gedragsgericht**: realtime feedback, **nudges** op beslismomenten, simpele doelen en beloningen (badges).  
- **Bankonafhankelijk** (open‑banking/PSD2) en **NL‑context** (categorieën, taal, locale).  
- **Laagdrempelig** freemium: gratis instap, betaalbare upgrades; **inclusief** via easy mode.  
- **Maatschappelijke impact**: vroegtijdig voorkomen van schulden; schaalbaar coachings‑alternatief.

---

## Abonnementen & Feature‑tiering
Feature‑gating is technisch afdwingbaar (server‑side + client toggles). Prijsindicaties zijn ankers; functionaliteit per tier is leidend.

| Functie | **Free** | **Core (~€2,99/mnd)** | **Premium (~€4,99/mnd)** |
|---|---|---|---|
| PSD2 bankkoppeling (AIS) | **Nee** (wel handmatig) | **Ja: 1** rekening | **Ja: meerdere** rekeningen |
| Automatische categorisatie | Beperkt/handmatig | **ML‑auto** (1 rekening) | **ML‑auto** (multi‑rekening) |
| Budgetten | **Max 2** categorieën | **Onbeperkt** | **Onbeperkt (geconsolideerd)** |
| Grafieken week/maand | Basis | **Volledig** | **Volledig** |
| Nudges/waarschuwingen | In‑app | **Push + in‑app** | **Push + in‑app** (+ toekomst AI‑proactief) |
| Maandrapport | In‑app | **+ PDF‑export** | **+ PDF‑export** (+ toekomst Kwartaal/Jaar, Excel) |
| Doelen & badges | Basis | **Volledig** | **Volledig** |
| Challenges | Ja (basis) | Ja | Ja |
| AI‑coach (chat/spraak) | – | *(optioneel teaser 5 Q/maand)* | **Volledig (fair use)** |

**Leidend besluit:** marketing‑tiering is bindend: Free **zonder** PSD2; Core **1** rekening; Premium **meerdere** + AI.

---

## MVP‑functionaliteiten

### 4.1 PSD2‑bankkoppeling & automatische transacties
**Omschrijving** — OAuth2‑gebaseerde koppeling via aggregator (AIS). Transacties (datum, bedrag, omschrijving, tegenrekening) automatisch ingeladen; alternatief: **handmatige invoer** (alle tiers).  
**Tier** — Core=1 rekening; Premium=multi; Free=handmatig only.  
**AC (acceptatiecriteria)**  
- Eerste transacties zichtbaar **≤ 3 min** na succesvolle koppeling.  
- Heldere foutmeldingen bij SCA/consent‑issues; consent **intrekbaar** in app.  
- Handmatige flow volledig bruikbaar zonder PSD2 (Free).  
- Dubbele/tegenboekingen gedetecteerd; geen dubbeltelling in consolidatie.

### 4.2 Automatische categorisatie
**Omschrijving** — ML‑/regelgebaseerd; gebruiker kan overschrijven; leerhaken onthouden keuzes.  
**Tier** — Core/Premium vol; Free handmatig + suggesties.  
**AC** — **≥ 85%** juiste auto‑categorie; overschrijving blijft persistent; standaard NL‑set + custom labels.

### 4.3 Budgetten & nudges
**Omschrijving** — Budget per categorie (maand of week). Voortgang (groen/oranje/rood). **Nudges** bij 90% en overschrijding.  
**Tier** — Free max 2 budgetten; Core/Premium onbeperkt.  
**AC** — Realtime update na nieuwe transactie; drempel‑nudge zichtbaar; frequency‑capping actief (zie §10).

### 4.4 Dashboard & maandrapport (PDF)
**Omschrijving** — Dashboard met inkomsten vs. uitgaven, saldo (geconsolideerd bij Premium), top‑categorieën, budgetstatus, doelen. **Maandrapport** in‑app; **PDF‑export** voor Core/Premium.  
**AC** — Dashboard init **≤ 2 s** (p90). PDF‑generatie **≤ 10 s** (p95). Rapport bevat totalen, per‑categorie, (bijna)‑overschrijdingen + **plain‑language** samenvatting.

### 4.5 Doelen & gamification (badges) + Challenges
**Omschrijving** — **Spaardoelen** en **bespaardoelen** met voortgang; badges bij behalen. **Challenges**: min. 2 templates (bijv. no‑spend weekend; −20% bezorgmaaltijden).  
**Tier** — Doelen/badges/challenges in alle tiers (Free basis‑limiet).  
**AC** — Doel aanmaken ≤ 3 stappen; badge direct bij behalen; challenge‑status duidelijk; historiek zichtbaar.

### 4.6 AI‑coach (chat/spraak)
**Omschrijving** — NL‑taal AI‑chat die antwoorden geeft op persoonlijke financiële vragen (met samengevatte context). **Privacy‑toggle** bepaalt datatoegang.  
**Tier** — Premium volledig; Core optionele teaser; Free geen AI.  
**AC** — Antwoord **≤ 5 s** (p90); voorbeeldvragen correct beantwoord; veiligheidsfilters; geen ruwe persoonsgegevens in prompt; feedbackknop (👍/👎).

### 4.7 Toegankelijkheid (easy mode)
**Omschrijving** — Grote letters, hoog contrast, schermlezers‑labels; vereenvoudigde UI.  
**AC** — WCAG 2.1 **AA** contrast; screenreader leest kerncomponenten correct; easy‑mode schakelt direct.

### 4.8 Privacy & controle
**Omschrijving** — **Privacydashboard**: gekoppelde rekeningen, AI‑toegang, data‑delete. Consent intrekbaar.  
**AC** — Account‑delete wist data volledig; PSD2‑consent intrekbaar; transparantie over data‑gebruik.

---

## Gebruikerspersona’s & flows
**Student/Jongere** — onboarding met voorbeeldbudget; challenges; nudges bij impulsuitgaven; motivatie via badges.  
**Gezinshoofd/Partners** — meerdere rekeningen (Premium), gezamenlijke budgetten (toekomst), gedeelde notificaties; maandrapport review.  
**Senior** — easy mode; handmatige invoer mogelijk; herinneringen voor grote periodieke lasten; rust & overzicht.

---

## Niet‑functionele eisen (NFRs)
- **Performance**: nudge‑latency p95 **≤ 5 min**; dashboard init p90 **≤ 2 s**; respons API p90 **< 500 ms**.  
- **Stabiliteit**: crash‑free sessions **≥ 99,5% (30d)**.  
- **Privacy (AVG)**: dataminimalisatie; EU‑hosting; dataportabiliteit (export later), self‑service delete nu.  
- **Security**: MFA optioneel; TLS 1.2+; encryptie at‑rest; RLS (row‑level security); rate‑limits; audit trail.  
- **Toegankelijkheid**: WCAG 2.1 AA; screenreader; scalable text; duidelijke focus/labels.  
- **i18n**: NL primair; textelementen via i18n‑keys; locale NL/EUR.  
- **Ops**: Back‑ups (dagelijks), monitoring (SLA ≥ 99%), staged roll‑out; CI/CD.

---

## Technische architectuur
- **Frontend**: React Native (Expo) iOS/Android + React Web; TypeScript; RN for Web; eenvoudige state (Context/Zustand).  
- **Backend**: Node.js **NestJS** service(s) voor PSD2‑integratie, AI‑proxy, PDF, notificaties.  
- **BaaS/DB**: **Supabase (PostgreSQL)**; Auth; RLS; realtime; Edge Functions (optioneel).  
- **Integraties**:  
  - **PSD2 Aggregator** (AIS only; OAuth2; consent 90 dagen; webhooks/poll).  
  - **AI provider** (server‑side proxy; context=geaggregeerde samenvattingen).  
  - **Push**: Expo → FCM/APNS; WebPush later.  
- **Secrets**: server‑side env; geen API‑keys in client.  
- **Feature‑gating**: server claims (tier) + remote config flags in client.

---

## Datamodel (PostgreSQL / Supabase)
**Belangrijkste tabellen (vereenvoudigd)**

- `users` — id, email, naam, tier (`free|core|premium`), prefs (JSON: easy_mode, locale, ai_privacy), created_at.  
- `accounts` — id, user_id, type (`psd2|manual`), iban_mask, provider_id, consent_expires_at, active.  
- `transactions` — id, user_id, account_id, booked_at (timestamptz), description, amount (signed), counterparty, category_id (nullable), source (`psd2|manual`), is_internal_transfer (bool).  
- `categories` — id, user_id (nullable voor global), name, kind (`expense|income`), is_custom.  
- `budgets` — id, user_id, category_id, period (`month|week`), limit_amount, start_on (date).  
- `goals` — id, user_id, kind (`save|reduce`), title, target_amount, baseline_hint, start_on, end_on, status (`active|achieved|failed`), progress_amount.  
- `pots` (roadmap) — id, user_id, name, target_amount, balance, rule_json.  
- `recur_rules` (optioneel) — id, user_id, name, cadence, next_due_on, amount_hint, category_id.  
- `notifications` — id, user_id, type, title, body, created_at, sent_at, channel (`push|inapp`).  
- `ai_chats` — id, user_id, prompt, answer, created_at, rating, context_snapshot_json.  
- `rewards` — id, user_id, kind (`badge|points`), code, label, points_delta, earned_at.  
- `reports` — id, user_id, period_month, url (PDF), created_at, meta_json.

**Indexering**: `(user_id, booked_at)` op `transactions`; `(user_id, category_id)` op `budgets`; GIN op `description` (search).  
**RLS**: regels per tabel: `user_id = auth.uid()` (Supabase policies).

---

## API‑contracten (REST, schets)
**Auth** — via Supabase (JWT).  
**Headers** — `Authorization: Bearer <jwt>` voor alle endpoints.

```
POST /psd2/connect/initiate         # start consent; returns auth_url
GET  /psd2/connect/callback         # server‑side OAuth callback (redirect uri)
POST /psd2/accounts/:id/refresh     # force refresh transactions

GET  /transactions?from&to&cat      # list (paged); filters: date range, category
POST /transactions                   # create manual tx
PATCH /transactions/:id              # update (category, note)
DELETE /transactions/:id             # delete manual tx

GET  /budgets                        # list budgets
POST /budgets                        # create
PATCH /budgets/:id                   # update (limit, period)
DELETE /budgets/:id                  # delete

GET  /reports/month/:yyyy-mm         # json data for month
POST /reports/month/:yyyy-mm/pdf     # generate PDF -> returns report url

GET  /goals                          # list goals
POST /goals                          # create
PATCH /goals/:id                     # update status/progress
POST /challenges/:code/join          # join challenge
POST /challenges/:code/leave         # leave challenge

POST /ai/ask                         # body: {{ "question": "string" }}
POST /privacy/delete-account         # GDPR delete (async job)
GET  /privacy/status                 # linked accounts, ai toggle, consents
PATCH /privacy/settings              # ai toggle on/off, notif prefs
```

**Foutcodes** (globaal): `400` validation, `401` auth, `403` forbidden (tier/consent), `409` conflict, `429` rate‑limit, `5xx` server.

---

## Notificatie‑triggers & throttlebeleid
**Triggers (MVP)**  
- **Budget 90% bereikt** of **overschreden** (per categorie).  
- **Atypisch patroon** (simpel heuristiek: >X% boven eigen weekgemiddelde).  
- **Einde‑maand reminder** (genereer rapport, spaar overschot).  
- **Salaris binnen** (suggestie: pay‑yourself‑first naar pot — roadmap).  
- **Challenge update** (halverwege, voltooid/mislukt).

**Throttlebeleid**  
- Max **1** budget‑nudge per categorie per **24h**.  
- Max **3** pushmeldingen totaal per dag per gebruiker.  
- **Stille uren** standaard 22:00–07:00 (push uitgesteld, in‑app zichtbaar).  
- Respecteer user‑prefs (per type aan/uit).

---

## Acceptatiecriteria & KPI’s
- **PSD2**: eerste transacties **≤ 3 min**; koppeling success‑rate **≥ 95%**.  
- **Categorisatie**: **≥ 85%** correct (meetset/feedback).  
- **Nudges**: latency p95 **≤ 5 min**; cap actief; ≥ **75%** nuttig (in‑app rating).  
- **Dashboard**: init p90 **≤ 2 s**; navigatie snappy.  
- **PDF**: p95 **≤ 10 s**; compleet en juist.  
- **AI**: antwoord p90 **≤ 5 s**; ≥ **80%** 👍 feedback; privacy toggle afdwingbaar.  
- **Stabiliteit**: crash‑free **≥ 99,5%** (30d).  
- **Beveiliging**: 0 kritieke incidenten; pen‑test highs opgelost; MFA beschikbaar.  
- **AVG**: self‑service delete werkt; consent intrekbaar; EU‑hosting.

---

## Gherkin‑tests (MVP)
**PSD2 koppeling en import**
```
Feature: PSD2 koppeling
  Scenario: Transacties na succesvolle koppeling
    Given ik ben een Core gebruiker met lege transactiehistorie
    When ik mijn bankrekening koppel via PSD2
    Then zie ik binnen 3 minuten mijn laatste transacties in de app
    And de transacties zijn automatisch gecategoriseerd waar mogelijk
```

**Budget drempel‑nudge**
```
Feature: Budget nudges
  Scenario: 90% drempel bereikt
    Given ik heb een maandbudget van €300 voor Boodschappen
    And mijn besteding is €270
    When er een nieuwe transactie van €10 in Boodschappen binnenkomt
    Then ontvang ik een nudge binnen 5 minuten dat het budget bijna op is
    And ik ontvang maximaal 1 dergelijke nudge per dag
```

**PDF‑rapport**
```
Feature: Maandrapport PDF
  Scenario: Exporteren als Core gebruiker
    Given ik ben een Core gebruiker met transacties in april 2025
    When ik het april-rapport als PDF exporteer
    Then wordt de PDF binnen 10 seconden gegenereerd
    And bevat het rapport totalen, per-categorie uitgaven en overschrijdingen
```

**AI‑coach context**
```
Feature: AI-coach antwoorden
  Scenario: Boodschappen uitgaven deze week
    Given ik ben Premium en AI-toegang tot data staat aan
    And ik heb deze week €85 aan Boodschappen uitgegeven
    When ik vraag "Hoeveel heb ik deze week aan boodschappen uitgegeven?"
    Then antwoordt de AI "ongeveer €85" binnen 5 seconden
```

**Privacy delete**
```
Feature: Account verwijderen
  Scenario: Self-service data delete
    Given ik ben ingelogd
    When ik in Privacy "Account verwijderen" bevestig
    Then wordt mijn account gedeactiveerd
    And zijn al mijn persoonlijke gegevens gewist
```

---

## Roadmap (na MVP)
**R1 (kort na MVP)** — **Spaarpotten & pay‑yourself‑first**, Excel‑export (Premium), kwartaal/jaaroverzichten, pilot **toeslagen/regeling‑check** (signalen + uitleg, geen advies).  
**R2** — **Proactieve AI‑coaching** (coach initieert tips), menselijk coach‑kanaal (Premium+), **gezinsprofielen** met gedeelde budgetten/rollen.  
**R3** — **Scenario‑planning** (what‑ifs, voorspellingen), **Gamification 2.0** (punten + partnerbeloningen).

---

## Out‑of‑scope
- PIS (betalingsinitiaties), kredietadvies of verkoop financiële producten.  
- Advertentie‑tracking/profiling; dataverkoop.  
- Community‑leaderboards (privacy) in MVP.  
- Volledige fiscale ondersteuning/aangiftes.

---

## Begrippenlijst
**PSD2/AIS** — Toegang tot rekeninginformatie (read‑only).  
**Nudge** — Vriendelijk duwtje op beslismoment.  
**Badges/Challenges** — Spelelementen voor motivatie.  
**WCAG 2.1 AA** — Toegankelijkheidsnorm.  
**RLS** — Row‑Level Security (datatoegang per user).  
**MFA** — Multi‑factor authenticatie.
