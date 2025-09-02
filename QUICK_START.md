# 🚀 Slim Minder - Quick Start Guide

## ✅ Wat is er klaar?

- **Login/Authenticatie**: Supabase authenticatie geïmplementeerd
- **Dashboard**: Volledig functioneel dashboard met mock data
- **Budgetten**: Budget tracking en voortgang
- **Transacties**: Transactie overzicht
- **Doelen**: Spaar- en bespaardoelen
- **Profiel**: Account beheer en bank integratie
- **PSD2 Connect**: Bank koppeling component (mock mode)

## 🧪 Hoe te testen

### Stap 1: Start de services

```bash
# Terminal 1: Start de API server
npm run dev:api

# Terminal 2: Start de mobile app
npm run dev:mobile
```

### Stap 2: Test de functionaliteiten

1. **Gast Login**: Gebruik de "🧪 Gast Login (Development)" knop
2. **Dashboard**: Bekijk je financiële overzicht
3. **Budgetten**: Navigeer naar de budgetten tab
4. **Transacties**: Bekijk je transactie historie
5. **Doelen**: Stel spaar- en bespaardoelen in
6. **Profiel**: Beheer je account instellingen

## 🔧 Supabase Setup (Optioneel)

Voor echte authenticatie:

1. Maak een Supabase project aan op [supabase.com](https://supabase.com)
2. Kopieer je project URL en anon key
3. Update `apps/mobile/src/supabase.ts` met je credentials
4. Herstart de app

## 📱 Beschikbare Tabs

- **📊 Dashboard**: Overzicht van je financiën
- **💳 Transacties**: Alle uitgaven en inkomsten
- **💰 Budgetten**: Budget tracking per categorie
- **🎯 Doelen**: Spaar- en bespaardoelen
- **👤 Profiel**: Account beheer en instellingen

## 🎯 Test Scenarios

### Budget Overschrijding
1. Ga naar Budgetten tab
2. Bekijk de voortgangsbalken
3. Groen = op schema, Oranje = bijna op, Rood = overschreden

### PSD2 Connectie
1. Ga naar Profiel tab
2. Klik op "Bank Verbinden"
3. Test de mock flow

### Doelen Tracking
1. Ga naar Doelen tab
2. Bekijk de voortgang van je spaardoelen
3. Percentage en bedragen worden real-time bijgewerkt

## 🐛 Troubleshooting

- **App start niet**: Controleer of alle dependencies zijn geïnstalleerd
- **API errors**: Controleer of de API server draait op poort 4000
- **Supabase errors**: Controleer je credentials of gebruik gast login

## 🎉 Geniet van het testen!

De app is nu klaar voor testing met alle core functionaliteiten werkend!
