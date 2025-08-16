import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Bot, User, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Lightbulb, Target, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const CoachContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const ChatContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CoachAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const CoachInfo = styled.div``;

const CoachName = styled.div`
  font-weight: bold;
  color: #333;
`;

const CoachStatus = styled.div`
  font-size: 0.9rem;
  color: #28a745;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  max-width: 80%;
  align-self: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
`;

const MessageAvatar = styled.div<{ isUser: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${({ isUser }) => isUser ? '#007bff' : '#6c757d'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  background: ${({ isUser }) => isUser ? '#007bff' : '#f8f9fa'};
  color: ${({ isUser }) => isUser ? 'white' : '#333'};
  padding: 12px 16px;
  border-radius: 18px;
  border-bottom-right-radius: ${({ isUser }) => isUser ? '4px' : '18px'};
  border-bottom-left-radius: ${({ isUser }) => isUser ? '18px' : '4px'};
  word-wrap: break-word;
  line-height: 1.4;
`;

const MessageTime = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
  text-align: center;
`;

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const InputForm = styled.form`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuickActions = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const QuickActionsTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const QuickButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const QuickButton = styled.button`
  background: white;
  border: 2px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  color: #6c757d;
  font-style: italic;
  align-self: flex-start;
  max-width: 80%;
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  
  &::after {
    content: '';
    animation: typing 1.4s infinite;
  }
  
  @keyframes typing {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80%, 100% { content: '...'; }
  }
`;

const AnalysisCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
`;

const AnalysisTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AnalysisContent = styled.div`
  color: #666;
  line-height: 1.5;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 5px 0;
  padding: 5px 0;
`;

const InsightIcon = styled.div<{ type: 'positive' | 'warning' | 'info' }>`
  color: ${({ type }) => {
    switch (type) {
      case 'positive': return '#28a745';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
    }
  }};
`;

const InsightCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const InsightTitle = styled.div`
  font-weight: bold;
  color: #495057;
`;

const InsightContent = styled.div`
  color: #6c757d;
  line-height: 1.5;
`;

const NudgeCard = styled.div<{ type: 'positive' | 'warning' | 'info' }>`
  background: ${({ type }) => {
    switch (type) {
      case 'positive': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
    }
  }};
  border: 1px solid ${({ type }) => {
    switch (type) {
      case 'positive': return '#c3e6cb';
      case 'warning': return '#ffeaa7';
      case 'info': return '#bee5eb';
    }
  }};
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
`;

const NudgeTitle = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const NudgeContent = styled.div`
  font-size: 0.9rem;
`;

const QuickInsights = styled.div`
  margin-bottom: 20px;
`;

const QuickInsightsTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickQuestions = [
  "Hoe kan ik deze maand €50 extra besparen?",
  "Wat is een goed spaardoel voor mijn inkomen?",
  "Hoe kan ik mijn uitgaven beter categoriseren?",
  "Wat zijn tips voor budgetteren?",
  "Hoe bouw ik een noodfonds op?"
];

const mockAIResponses = {
  "Hoe kan ik deze maand €50 extra besparen?": "Gebaseerd op je uitgavenpatroon zie ik enkele mogelijkheden:\n\n• Je geeft gemiddeld €120 per maand uit aan uit eten. Probeer dit te verminderen naar €70 door vaker thuis te koken.\n• Je streamingdiensten kosten €25 per maand. Overweeg om er één te pauzeren.\n• Je boodschappen kunnen €15 goedkoper door huismerken te kopen.\n\nDit levert je €50 extra op! 💡",
  "Wat is een goed spaardoel voor mijn inkomen?": "Met jouw inkomen van €3200 per maand raad ik aan:\n\n• **Noodfonds**: €3000-5000 (3-6 maanden uitgaven)\n• **Korte termijn**: 10-15% van inkomen\n• **Lange termijn**: 20% voor pensioen/beleggen\n\nBegin met €200-300 per maand en bouw dit geleidelijk op. Wat is jouw prioriteit? 🎯",
  "Hoe kan ik mijn uitgaven beter categoriseren?": "Hier zijn tips voor betere categorisatie:\n\n• **Automatische categorisatie**: Slim Minder doet dit al voor je\n• **Handmatige aanpassingen**: Klik op transacties om categorie te wijzigen\n• **Eigen categorieën**: Maak categorieën die bij jouw leven passen\n• **Regelmatige controle**: Check wekelijks of alles klopt\n\nWil je dat ik je help met specifieke categorieën? 📊",
  "Wat zijn tips voor budgetteren?": "Mijn top budgetteringstips:\n\n• **50/30/20 regel**: 50% behoeften, 30% wensen, 20% sparen\n• **Begin klein**: Start met 2-3 categorieën\n• **Realistische doelen**: Zet jezelf niet te krap\n• **Flexibiliteit**: Pas budgetten aan waar nodig\n• **Automatisering**: Zet geld automatisch opzij\n\nWelke categorie vind je het moeilijkst? 💪",
  "Hoe bouw ik een noodfonds op?": "Stappenplan voor een noodfonds:\n\n• **Doel**: 3-6 maanden uitgaven (voor jou €5400-10800)\n• **Start klein**: €100-200 per maand\n• **Automatiseren**: Zet geld direct opzij bij salaris\n• **Prioriteit**: Voor andere spaardoelen\n• **Toegankelijk**: Houd het op een spaarrekening\n\nBegin met €200 per maand, dan heb je over 2 jaar €4800! 🛡️"
};

const AICoachPage: React.FC = () => {
  const { transactions, budgets, savingsGoals, loading } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hallo! Ik ben je persoonlijke financiële coach. Ik analyseer je uitgavenpatroon en geef je gepersonaliseerd advies. Wat wil je weten?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced financial insights with behavioral analysis
  const getFinancialInsights = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().slice(0, 7);
    
    const monthTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(currentMonth)
    );
    
    const lastMonthTransactions = transactions.filter(t => 
      t.transaction_date.startsWith(lastMonthStr)
    );

    const totalIncome = monthTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Category spending analysis
    const categorySpending = monthTransactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => {
        const categoryName = (t as any).categories?.name || t.category_id || 'Onbekend';
        acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    // Spending patterns analysis
    const spendingPatterns = monthTransactions
      .filter(t => t.amount < 0)
      .map(t => ({
        amount: Math.abs(t.amount),
        category: (t as any).categories?.name || t.category_id || 'Onbekend',
        date: new Date(t.transaction_date),
        dayOfWeek: new Date(t.transaction_date).getDay()
      }));

    // Budget analysis
    const budgetAlerts = budgets.map(budget => {
      const spent = categorySpending[(budget as any).categories?.name || budget.category_id || 'Onbekend'] || 0;
      const percentage = (spent / budget.amount) * 100;
      return { budget, spent, percentage };
    }).filter(alert => alert.percentage > 80);

    // Savings goals analysis
    const activeGoals = savingsGoals.filter(goal => {
      if (!goal.target_date) return true;
      const deadline = new Date(goal.target_date);
      const today = new Date();
      return deadline > today && goal.current_amount < goal.target_amount;
    });

    // Behavioral insights
    const averageTransactionSize = spendingPatterns.length > 0 
      ? spendingPatterns.reduce((sum, t) => sum + t.amount, 0) / spendingPatterns.length 
      : 0;

    const frequentCategories = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const weekendSpending = spendingPatterns
      .filter(t => t.dayOfWeek === 0 || t.dayOfWeek === 6)
      .reduce((sum, t) => sum + t.amount, 0);

    const weekdaySpending = spendingPatterns
      .filter(t => t.dayOfWeek !== 0 && t.dayOfWeek !== 6)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      categorySpending,
      budgetAlerts,
      activeGoals,
      spendingPatterns,
      averageTransactionSize,
      frequentCategories,
      weekendSpending,
      weekdaySpending,
      monthTransactions: monthTransactions.length,
      lastMonthTransactions: lastMonthTransactions.length
    };
  };

  const generateBehavioralNudges = (insights: any) => {
    const nudges = [];

    // Spending pattern nudges
    if (insights.weekendSpending > insights.weekdaySpending * 1.5) {
      nudges.push({
        type: 'warning' as const,
        title: 'Weekend Uitgaven',
        content: `Je geeft ${((insights.weekendSpending / insights.weekdaySpending) * 100).toFixed(0)}% meer uit in het weekend. Overweeg om weekend-activiteiten te plannen die minder kosten.`
      });
    }

    // Budget alerts
    if (insights.budgetAlerts.length > 0) {
      nudges.push({
        type: 'warning' as const,
        title: 'Budget Waarschuwing',
        content: `${insights.budgetAlerts.length} budget(ten) zijn bijna op. Controleer je uitgaven in deze categorieën.`
      });
    }

    // Savings rate nudges
    if (insights.savingsRate < 10) {
      nudges.push({
        type: 'info' as const,
        title: 'Spaarpercentage Laag',
        content: `Je spaart momenteel ${insights.savingsRate.toFixed(1)}% van je inkomen. Streef naar minimaal 20% voor financiële vrijheid.`
      });
    } else if (insights.savingsRate > 30) {
      nudges.push({
        type: 'positive' as const,
        title: 'Uitstekend Sparen!',
        content: `Fantastisch! Je spaart ${insights.savingsRate.toFixed(1)}% van je inkomen. Overweeg om te beleggen voor groei.`
      });
    }

    // Transaction frequency nudges
    if (insights.monthTransactions < 10) {
      nudges.push({
        type: 'info' as const,
        title: 'Weinig Transacties',
        content: 'Je hebt weinig transacties deze maand. Zorg ervoor dat je alle uitgaven bijhoudt voor een compleet beeld.'
      });
    }

    // Large transaction alerts
    const largeTransactions = insights.spendingPatterns.filter((t: any) => t.amount > 100);
    if (largeTransactions.length > 3) {
      nudges.push({
        type: 'warning' as const,
        title: 'Grote Uitgaven',
        content: `Je hebt ${largeTransactions.length} uitgaven van meer dan €100 deze maand. Overweeg of deze allemaal noodzakelijk zijn.`
      });
    }

    return nudges;
  };

  const generateSpendingInsights = (insights: any) => {
    let analysis = `**Uitgaven Analyse Deze Maand:**\n\n`;
    
    analysis += `📊 **Overzicht:**\n`;
    analysis += `• Totaal uitgaven: €${insights.totalExpenses.toFixed(2)}\n`;
    analysis += `• Gemiddelde transactie: €${insights.averageTransactionSize.toFixed(2)}\n`;
    analysis += `• Aantal transacties: ${insights.monthTransactions}\n\n`;

    analysis += `🏷️ **Top Categorieën:**\n`;
    insights.frequentCategories.forEach(([category, amount]: [string, number]) => {
      const percentage = (amount / insights.totalExpenses) * 100;
      analysis += `• ${category}: €${amount.toFixed(2)} (${percentage.toFixed(1)}%)\n`;
    });

    analysis += `\n📅 **Tijdsanalyse:**\n`;
    analysis += `• Weekend uitgaven: €${insights.weekendSpending.toFixed(2)}\n`;
    analysis += `• Doordeweeks: €${insights.weekdaySpending.toFixed(2)}\n`;

    if (insights.weekendSpending > insights.weekdaySpending) {
      analysis += `\n💡 **Inzicht:** Je geeft meer uit in het weekend. Overweeg om weekend-activiteiten te plannen die minder kosten.`;
    }

    return analysis;
  };

  const generateHabitAnalysis = (insights: any) => {
    let analysis = `**Gewoonten Analyse:**\n\n`;
    
    // Transaction frequency habit
    const avgTransactionsPerDay = insights.monthTransactions / 30;
    if (avgTransactionsPerDay < 0.5) {
      analysis += `📝 **Transactie Gewoonte:** Je voert weinig transacties in. Probeer dagelijks je uitgaven bij te houden voor betere inzichten.\n\n`;
    } else if (avgTransactionsPerDay > 2) {
      analysis += `📝 **Transactie Gewoonte:** Je bent zeer actief in het bijhouden van uitgaven. Uitstekend!\n\n`;
    }

    // Category consistency
    const categoryCount = Object.keys(insights.categorySpending).length;
    if (categoryCount < 3) {
      analysis += `🏷️ **Categorisatie:** Je gebruikt weinig categorieën. Meer categorieën geven betere inzichten.\n\n`;
    } else if (categoryCount > 8) {
      analysis += `🏷️ **Categorisatie:** Je gebruikt veel categorieën. Overweeg om vergelijkbare categorieën samen te voegen.\n\n`;
    }

    // Spending consistency
    const spendingVariance = insights.spendingPatterns.length > 1 
      ? Math.sqrt(insights.spendingPatterns.reduce((sum: number, t: any) => sum + Math.pow(t.amount - insights.averageTransactionSize, 2), 0) / insights.spendingPatterns.length)
      : 0;

    if (spendingVariance > insights.averageTransactionSize * 0.5) {
      analysis += `💰 **Uitgaven Patroon:** Je uitgaven variëren sterk. Dit kan duiden op impulsaankopen.\n\n`;
    } else {
      analysis += `💰 **Uitgaven Patroon:** Je uitgaven zijn consistent. Goed bezig!\n\n`;
    }

    return analysis;
  };

  const generatePersonalizedResponse = (userQuestion: string): string => {
    const insights = getFinancialInsights();
    const question = userQuestion.toLowerCase();

    if (question.includes('uitgaven') || question.includes('spending') || question.includes('patroon')) {
      return generateSpendingInsights(insights);
    } else if (question.includes('gewoonten') || question.includes('habits') || question.includes('gedrag')) {
      return generateHabitAnalysis(insights);
    } else if (question.includes('besparen') || question.includes('sparen')) {
      return generateSavingsAdvice(insights);
    } else if (question.includes('budget') || question.includes('limiet')) {
      return generateBudgetAdvice(insights);
    } else if (question.includes('spaardoel') || question.includes('doel')) {
      return generateSavingsGoalAdvice(insights);
    } else if (question.includes('inkomen') || question.includes('salaris')) {
      return generateIncomeAdvice(insights);
    } else if (question.includes('categorie') || question.includes('categoriseren')) {
      return generateCategorizationAdvice(insights);
    } else if (question.includes('advies') || question.includes('tips') || question.includes('suggesties')) {
      return generateGeneralAdvice(insights);
    } else {
      return generateGeneralAdvice(insights);
    }
  };

  const generateSavingsAdvice = (insights: any): string => {
    let advice = `Gebaseerd op je financiële situatie deze maand:\n\n`;
    
    if (insights.savingsRate < 10) {
      advice += `⚠️ **Je spaart momenteel ${insights.savingsRate.toFixed(1)}% van je inkomen.** Dit is onder de aanbevolen 20%.\n\n`;
      advice += `**Mogelijkheden om meer te sparen:**\n`;
      
      const topCategories = Object.entries(insights.categorySpending)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3);
      
      topCategories.forEach(([category, amount]) => {
        advice += `• ${category}: €${(amount as number).toFixed(2)} - probeer 20% te besparen\n`;
      });
      
      advice += `\n**Spaartip**: Begin met €50 extra per maand en bouw dit geleidelijk op.`;
    } else if (insights.savingsRate < 20) {
      advice += `✅ **Je spaart ${insights.savingsRate.toFixed(1)}% van je inkomen.** Goed bezig!\n\n`;
      advice += `**Om naar 20% te komen, probeer:**\n`;
      advice += `• €${((insights.totalIncome * 0.20) - insights.netSavings).toFixed(0)} extra per maand te sparen\n`;
      advice += `• Automatische spaaroverdrachten instellen\n`;
      advice += `• Eén categorie uitgaven met 10% te verminderen`;
    } else {
      advice += `🎉 **Fantastisch! Je spaart ${insights.savingsRate.toFixed(1)}% van je inkomen.**\n\n`;
      advice += `**Je bent op de goede weg voor financiële vrijheid!**\n`;
      advice += `• Overweeg om te beleggen voor lange termijn groei\n`;
      advice += `• Bouw je noodfonds verder uit\n`;
      advice += `• Vier je succes, maar blijf consistent`;
    }

    return advice;
  };

  const generateBudgetAdvice = (insights: any): string => {
    let advice = `**Je budget analyse voor deze maand:**\n\n`;
    
    if (insights.budgetAlerts.length > 0) {
      advice += `⚠️ **Waarschuwingen:**\n`;
      insights.budgetAlerts.forEach((alert: any) => {
        advice += `• ${alert.budget.name}: ${alert.percentage.toFixed(1)}% gebruikt (€${alert.spent.toFixed(2)} van €${alert.budget.budget.toFixed(2)})\n`;
      });
      advice += `\n**Actie nodig**: Overweeg om uitgaven in deze categorieën te verminderen.`;
    } else {
      advice += `✅ **Alle budgetten zijn onder controle!**\n`;
      advice += `Je houdt je goed aan je financiële plannen.`;
    }

    advice += `\n\n**Top uitgavencategorieën deze maand:**\n`;
    const topCategories = Object.entries(insights.categorySpending)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3);
    
    topCategories.forEach(([category, amount]) => {
      advice += `• ${category}: €${(amount as number).toFixed(2)}\n`;
    });

    return advice;
  };

  const generateSavingsGoalAdvice = (insights: any): string => {
    if (insights.activeGoals.length === 0) {
      return `Je hebt momenteel geen actieve spaardoelen. Dit is een perfect moment om er een te maken!\n\n**Suggesties:**\n• Noodfonds van €3000-5000\n• Vakantie spaardoel\n• Grote aankoop (laptop, auto)\n\nGa naar de Spaardoelen pagina om te beginnen!`;
    }

    let advice = `**Je spaardoelen overzicht:**\n\n`;
    
    insights.activeGoals.forEach((goal: any) => {
      const percentage = (goal.current_amount / goal.target_amount) * 100;
      const remaining = goal.target_amount - goal.current_amount;
      
      advice += `🎯 **${goal.name}**\n`;
      advice += `• Voortgang: ${percentage.toFixed(1)}% (€${goal.current_amount.toFixed(2)} van €${goal.target_amount.toFixed(2)})\n`;
      advice += `• Nog te sparen: €${remaining.toFixed(2)}\n`;
      
      if (goal.target_date) {
        const deadline = new Date(goal.target_date);
        const today = new Date();
        const monthsLeft = Math.max(1, (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
        const monthlyNeeded = remaining / monthsLeft;
        
        advice += `• Maandelijks nodig: €${monthlyNeeded.toFixed(2)}\n`;
      }
      advice += `\n`;
    });

    return advice;
  };

  const generateIncomeAdvice = (insights: any): string => {
    let advice = `**Je inkomen analyse:**\n\n`;
    advice += `💰 **Totaal inkomen deze maand: €${insights.totalIncome.toFixed(2)}**\n`;
    advice += `💸 **Totaal uitgaven: €${insights.totalExpenses.toFixed(2)}**\n`;
    advice += `💎 **Netto besparingen: €${insights.netSavings.toFixed(2)}**\n\n`;

    if (insights.savingsRate < 10) {
      advice += `**Aanbevelingen voor jouw inkomen:**\n`;
      advice += `• Streef naar 20% sparen (€${(insights.totalIncome * 0.20).toFixed(0)} per maand)\n`;
      advice += `• Bouw eerst een noodfonds op\n`;
      advice += `• Overweeg extra inkomstenbronnen\n`;
    } else {
      advice += `**Uitstekend! Je beheert je inkomen goed.**\n`;
      advice += `• Blijf consistent sparen\n`;
      advice += `• Overweeg beleggen voor groei\n`;
      advice += `• Vier je financiële discipline`;
    }

    return advice;
  };

  const generateCategorizationAdvice = (insights: any): string => {
    let advice = `**Uitgaven categorisatie tips:**\n\n`;
    
    advice += `**Je top categorieën deze maand:**\n`;
    Object.entries(insights.categorySpending)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .forEach(([category, amount]) => {
        advice += `• ${category}: €${(amount as number).toFixed(2)}\n`;
      });

    advice += `\n**Tips voor betere categorisatie:**\n`;
    advice += `• Controleer wekelijks je transacties\n`;
    advice += `• Gebruik consistente categorieën\n`;
    advice += `• Maak subcategorieën voor grote uitgaven\n`;
    advice += `• Stel automatische categorisatie in\n`;

    return advice;
  };

  const generateGeneralAdvice = (insights: any): string => {
    let advice = `**Je financiële gezondheid overzicht:**\n\n`;
    
    advice += `📊 **Deze maand:**\n`;
    advice += `• Inkomen: €${insights.totalIncome.toFixed(2)}\n`;
    advice += `• Uitgaven: €${insights.totalExpenses.toFixed(2)}\n`;
    advice += `• Besparingen: €${insights.netSavings.toFixed(2)} (${insights.savingsRate.toFixed(1)}%)\n`;
    advice += `• Actieve spaardoelen: ${insights.activeGoals.length}\n`;
    advice += `• Budget waarschuwingen: ${insights.budgetAlerts.length}\n\n`;

    if (insights.savingsRate < 10) {
      advice += `**Prioriteit**: Verhoog je spaarpercentage naar minimaal 10%.\n`;
    } else if (insights.budgetAlerts.length > 0) {
      advice += `**Prioriteit**: Controleer je budgetten die bijna op zijn.\n`;
    } else {
      advice += `**Uitstekend!** Je bent op de goede weg voor financiële vrijheid.\n`;
    }

    return advice;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate personalized AI response
    setTimeout(() => {
      setIsTyping(false);
      
      const aiResponse = generatePersonalizedResponse(inputValue);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (loading) {
    return (
      <CoachContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Financiële gegevens laden...
        </div>
      </CoachContainer>
    );
  }

  const insights = getFinancialInsights();
  const nudges = generateBehavioralNudges(insights);

  return (
    <CoachContainer>
      <PageHeader>
        <PageTitle>AI Financiële Coach</PageTitle>
        <PageSubtitle>Persoonlijk advies gebaseerd op jouw financiële gegevens</PageSubtitle>
      </PageHeader>

      <ChatContainer>
        <ChatHeader>
          <CoachAvatar>
            <Bot size={20} />
          </CoachAvatar>
          <CoachInfo>
            <CoachName>Slim Minder Coach</CoachName>
            <CoachStatus>Online • Persoonlijk advies</CoachStatus>
          </CoachInfo>
        </ChatHeader>

        {nudges.length > 0 && (
          <QuickInsights>
            <QuickInsightsTitle>
              <Lightbulb size={16} />
              Vandaag's Inzichten
            </QuickInsightsTitle>
            {nudges.map((nudge, index) => (
              <NudgeCard key={index} type={nudge.type}>
                <NudgeTitle>{nudge.title}</NudgeTitle>
                <NudgeContent>{nudge.content}</NudgeContent>
              </NudgeCard>
            ))}
          </QuickInsights>
        )}

        <QuickActions>
          <QuickActionsTitle>Snelle vragen:</QuickActionsTitle>
          <QuickButtons>
            {quickQuestions.map((question, index) => (
              <QuickButton
                key={index}
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </QuickButton>
            ))}
          </QuickButtons>
        </QuickActions>

        <MessagesContainer>
          {messages.map((message) => (
            <div key={message.id}>
              <Message isUser={message.isUser}>
                <MessageAvatar isUser={message.isUser}>
                  {message.isUser ? <User size={16} /> : <Bot size={16} />}
                </MessageAvatar>
                <MessageContent isUser={message.isUser}>
                  {message.text}
                </MessageContent>
              </Message>
              <MessageTime>
                {message.timestamp.toLocaleTimeString('nl-NL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </MessageTime>
            </div>
          ))}
          
          {isTyping && (
            <TypingIndicator>
              <Bot size={16} />
              <span>Coach analyseert je gegevens...</span>
              <TypingDots />
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <InputForm onSubmit={handleSendMessage}>
            <MessageInput
              type="text"
              placeholder="Stel je financiële vraag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <SendButton type="submit" disabled={isTyping || !inputValue.trim()}>
              <Send size={18} />
            </SendButton>
          </InputForm>
        </InputContainer>
      </ChatContainer>
    </CoachContainer>
  );
};

export default AICoachPage; 