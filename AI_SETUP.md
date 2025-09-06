# AI Coach Setup Guide

Deze guide helpt je bij het opzetten van de AI coach functionaliteit in Slim Minder.

## 🚀 Quick Start

### 1. AI Providers Configureren

```bash
# Gebruik de setup script
npm run setup:ai

# Of handmatig je API keys toevoegen aan apps/api/.env
```

### 2. Environment Variables

Voeg je API keys toe aan `apps/api/.env`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4

# Anthropic Configuration (optioneel)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### 3. Test de Integratie

```bash
# Build de API
npm run build:api

# Test de AI integratie
npm run test:ai
```

## 🤖 Ondersteunde AI Providers

### OpenAI (Aanbevolen)
- **Modellen**: GPT-5, GPT-4o, GPT-4-turbo, GPT-4, GPT-3.5-turbo
- **Voordelen**: Uitstekende Nederlandse taalondersteuning, snelle responses
- **Kosten**: 
  - GPT-5: ~$0.05 per 1K tokens (nieuwste, meest geavanceerd)
  - GPT-4o: ~$0.03 per 1K tokens (multimodaal)
  - GPT-4: ~$0.03 per 1K tokens
  - GPT-3.5-turbo: ~$0.002 per 1K tokens (goedkoopst)

### Anthropic Claude
- **Modellen**: Claude-3-5-Sonnet-20241022, Claude-3-5-Haiku-20241022, Claude-3-Opus, Claude-3-Sonnet
- **Voordelen**: Goede redeneervaardigheden, lange context, uitstekende code generatie
- **Kosten**:
  - Claude-3-5-Sonnet-20241022: ~$0.015 per 1K tokens (nieuwste, beste prestaties)
  - Claude-3-Opus: ~$0.075 per 1K tokens (meest geavanceerd)
  - Claude-3-Sonnet: ~$0.015 per 1K tokens
  - Claude-3-Haiku: ~$0.0025 per 1K tokens (snelst)

## 🔧 API Endpoints

### POST /api/ai/chat
Verstuur een bericht naar de AI coach.

**Request:**
```json
{
  "message": "Hoe kan ik geld besparen op boodschappen?",
  "context": {
    "userId": "user-123",
    "currentBudget": {...},
    "recentTransactions": [...]
  }
}
```

**Response:**
```json
{
  "id": "chat-interaction-id",
  "message": "Hier zijn enkele tips om geld te besparen...",
  "suggestions": [
    "Maak een boodschappenlijstje",
    "Koop seizoensproducten"
  ],
  "metadata": {
    "tokensUsed": 150,
    "model": "gpt-4",
    "provider": "openai"
  }
}
```

### GET /api/ai/status
Controleer de status van AI providers.

**Response:**
```json
{
  "status": "ok",
  "provider": "openai",
  "available": true,
  "hasApiKey": true
}
```

## 📱 Mobile App Integratie

De AI coach is volledig geïntegreerd in de mobile app:

- **Chat Interface**: Moderne chat UI met berichten en suggesties
- **Chat History**: Opslaan en ophalen van chat geschiedenis
- **Context Awareness**: AI krijgt toegang tot budgetten, transacties en doelen
- **Error Handling**: Graceful fallbacks bij API fouten

## 🧪 Testing

### Unit Tests
```bash
npm run test:api
```

### Integration Tests
```bash
npm run test:ai
```

### Model Comparison Tests
```bash
npm run test:models
```

### Manual Testing
1. Start de API: `npm run dev:api`
2. Open de mobile app: `npm run dev:mobile`
3. Navigeer naar de AI Coach screen
4. Stel een vraag en test de response

## 🔒 Security & Privacy

### Data Protection
- **Geen API Keys in Client**: Alle AI calls gaan via de backend
- **Context Filtering**: Alleen relevante financiële data wordt gedeeld
- **Token Limits**: Beperkte token usage per request
- **Audit Logging**: Alle AI interacties worden gelogd

### Privacy Considerations
- Gebruiker context wordt alleen gebruikt voor relevante adviezen
- Geen persoonlijke data wordt opgeslagen bij AI providers
- Chat geschiedenis wordt lokaal opgeslagen in de database

## 💰 Kosten Monitoring

### Token Usage Tracking
- Elke AI response logt token usage
- Kosten worden bijgehouden per gebruiker
- Rate limiting voorkomt overmatig gebruik

### Cost Optimization
- **Efficient Prompts**: Geoptimaliseerde prompts voor minder tokens
- **Context Compression**: Alleen relevante context wordt meegestuurd
- **Fallback Responses**: Mock responses bij API fouten

## 🚨 Troubleshooting

### Veelvoorkomende Problemen

#### 1. "No AI provider available"
**Oorzaak**: Geen API keys geconfigureerd
**Oplossing**: Voeg API keys toe aan `.env` bestand

#### 2. "AI response generation failed"
**Oorzaak**: API key ongeldig of quota overschreden
**Oplossing**: Controleer API key en billing

#### 3. "Rate limit exceeded"
**Oorzaak**: Te veel requests naar AI provider
**Oplossing**: Wacht even of upgrade API plan

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev:api
```

## 📊 Monitoring

### Logs
AI interacties worden gelogd in:
- `apps/api/logs/combined.log`
- `apps/api/logs/error.log`

### Metrics
- Token usage per gebruiker
- Response times
- Error rates
- Provider availability

## 🔄 Updates & Maintenance

### Model Updates
Om AI modellen te updaten:
1. Update `OPENAI_MODEL` of `ANTHROPIC_MODEL` in `.env`
2. Herstart de API server
3. Test de nieuwe model

### Provider Switching
De app kiest automatisch de beste beschikbare provider:
1. OpenAI (als beschikbaar)
2. Anthropic (als OpenAI niet beschikbaar)
3. Mock responses (als geen providers beschikbaar)

## 📚 Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Slim Minder AI Service Code](apps/api/src/services/ai.ts)
- [AI Routes Implementation](apps/api/src/routes/ai.ts)

## 🆘 Support

Voor vragen over de AI integratie:
1. Check de logs in `apps/api/logs/`
2. Test met `npm run test:ai`
3. Controleer API provider status met `/api/ai/status`
4. Raadpleeg deze documentatie
