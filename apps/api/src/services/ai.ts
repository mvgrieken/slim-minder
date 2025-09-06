import OpenAI from 'openai';
import { logger } from '../utils/logger';

// AI Provider Configuration
interface AIProviderConfig {
  openai?: {
    apiKey: string;
    model: string;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
}

// AI Response Interface
export interface AIResponse {
  message: string;
  suggestions: string[];
  tokensUsed: number;
  model: string;
  provider: 'openai' | 'anthropic' | 'mock';
}

// AI Service Class
class AIService {
  private openai: OpenAI | null = null;
  private config: AIProviderConfig;
  private defaultProvider: 'openai' | 'anthropic' | 'mock';

  constructor() {
    this.config = {
      openai: process.env.OPENAI_API_KEY ? {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-4'
      } : undefined,
      anthropic: process.env.ANTHROPIC_API_KEY ? {
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
      } : undefined
    };

    // Determine default provider based on available keys
    if (this.config.openai?.apiKey) {
      this.defaultProvider = 'openai';
      this.openai = new OpenAI({
        apiKey: this.config.openai.apiKey,
      });
    } else if (this.config.anthropic?.apiKey) {
      this.defaultProvider = 'anthropic';
    } else {
      this.defaultProvider = 'mock';
      logger.warn('No AI provider API keys found, using mock responses');
    }

    logger.info('AI Service initialized', {
      provider: this.defaultProvider,
      hasOpenAI: !!this.config.openai?.apiKey,
      hasAnthropic: !!this.config.anthropic?.apiKey
    });
  }

  /**
   * Generate AI response using the configured provider
   */
  async generateResponse(message: string, context: any): Promise<AIResponse> {
    try {
      switch (this.defaultProvider) {
        case 'openai':
          return await this.generateOpenAIResponse(message, context);
        case 'anthropic':
          return await this.generateAnthropicResponse(message, context);
        case 'mock':
        default:
          return this.generateMockResponse(message, context);
      }
    } catch (error) {
      logger.error('AI response generation failed', {
        error: error instanceof Error ? error.message : String(error),
        provider: this.defaultProvider
      });

      // Fallback to mock response on error
      return this.generateMockResponse(message, context);
    }
  }

  /**
   * Generate response using OpenAI
   */
  private async generateOpenAIResponse(message: string, context: any): Promise<AIResponse> {
    if (!this.openai || !this.config.openai) {
      throw new Error('OpenAI not configured');
    }

    const prompt = this.buildPrompt(message, context);
    
    const completion = await this.openai.chat.completions.create({
      model: this.config.openai.model,
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, ik kon geen antwoord genereren.';
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Extract suggestions from response (look for numbered lists or bullet points)
    const suggestions = this.extractSuggestions(response);

    logger.info('OpenAI response generated', {
      tokensUsed,
      model: this.config.openai.model,
      responseLength: response.length
    });

    return {
      message: response,
      suggestions,
      tokensUsed,
      model: this.config.openai.model,
      provider: 'openai'
    };
  }

  /**
   * Generate response using Anthropic Claude
   */
  private async generateAnthropicResponse(message: string, context: any): Promise<AIResponse> {
    if (!this.config.anthropic) {
      throw new Error('Anthropic not configured');
    }

    // Note: Anthropic SDK would need to be installed separately
    // For now, we'll use a fetch-based approach
    const prompt = this.buildPrompt(message, context);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.anthropic.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.anthropic.model,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\nGebruiker vraag: ${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const aiResponse = data.content[0]?.text || 'Sorry, ik kon geen antwoord genereren.';
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    const suggestions = this.extractSuggestions(aiResponse);

    logger.info('Anthropic response generated', {
      tokensUsed,
      model: this.config.anthropic.model,
      responseLength: aiResponse.length
    });

    return {
      message: aiResponse,
      suggestions,
      tokensUsed,
      model: this.config.anthropic.model,
      provider: 'anthropic'
    };
  }

  /**
   * Generate mock response for development/testing
   */
  private generateMockResponse(message: string, context: any): AIResponse {
    const responses = [
      `Ik zie dat je vraagt: "${message}". Gebaseerd op je financiële situatie kan ik je helpen met budgettering en besparingstips.`,
      `Goede vraag! Laat me je helpen met "${message}". Hier zijn enkele praktische tips voor je financiële situatie.`,
      `Interessant! Voor "${message}" kan ik je enkele concrete stappen geven om je financiële doelen te bereiken.`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const suggestions = [
      'Wil je een overzicht van je huidige budgetten?',
      'Zal ik je helpen met het instellen van nieuwe doelen?',
      'Kan ik je adviseren over besparingsmogelijkheden?',
      'Hoe kan ik je helpen met je uitgaven te verminderen?'
    ];

    logger.info('Mock AI response generated', {
      messageLength: message.length,
      responseLength: randomResponse.length
    });

    return {
      message: randomResponse,
      suggestions: suggestions.slice(0, 3), // Return 3 random suggestions
      tokensUsed: 150,
      model: 'mock-model',
      provider: 'mock'
    };
  }

  /**
   * Build the system prompt for AI providers
   */
  private buildPrompt(message: string, context: any): string {
    return `
Je bent Slim Minder, een persoonlijke financiële coach die gebruikers helpt met budgettering en besparing. Je bent vriendelijk, behulpzaam en geeft praktische adviezen in het Nederlands.

Gebruiker context:
- Budgetten: ${JSON.stringify(context.budgetSummary || [])}
- Recente transacties: ${JSON.stringify(context.recentTransactions || [])}
- Doelen: ${JSON.stringify(context.goals || [])}
- Uitgaven per categorie: ${JSON.stringify(context.spendingByCategory || [])}

Instructies:
1. Geef behulpzame, persoonlijke antwoorden in het Nederlands
2. Focus op praktische adviezen en concrete stappen
3. Gebruik de gebruiker context om relevante suggesties te geven
4. Wees positief en motiverend
5. Geef korte, duidelijke antwoorden (max 200 woorden)
6. Eindig met 2-3 concrete suggesties voor vervolgacties

Gebruiker vraag: ${message}
`.trim();
  }

  /**
   * Extract suggestions from AI response
   */
  private extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // Look for numbered lists (1., 2., 3., etc.)
    const numberedMatches = response.match(/\d+\.\s*([^\n]+)/g);
    if (numberedMatches) {
      suggestions.push(...numberedMatches.map(match => match.replace(/^\d+\.\s*/, '').trim()));
    }
    
    // Look for bullet points (-, *, •)
    const bulletMatches = response.match(/[-*•]\s*([^\n]+)/g);
    if (bulletMatches) {
      suggestions.push(...bulletMatches.map(match => match.replace(/^[-*•]\s*/, '').trim()));
    }
    
    // If no structured suggestions found, generate some based on common financial topics
    if (suggestions.length === 0) {
      const commonSuggestions = [
        'Wil je een overzicht van je huidige budgetten?',
        'Zal ik je helpen met het instellen van nieuwe doelen?',
        'Kan ik je adviseren over besparingsmogelijkheden?'
      ];
      suggestions.push(...commonSuggestions.slice(0, 2));
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  /**
   * Get current provider status
   */
  getProviderStatus(): { provider: string; available: boolean; hasApiKey: boolean } {
    return {
      provider: this.defaultProvider,
      available: this.defaultProvider !== 'mock',
      hasApiKey: !!(this.config.openai?.apiKey || this.config.anthropic?.apiKey)
    };
  }
}

// Create singleton instance
export const aiService = new AIService();
export default aiService;
