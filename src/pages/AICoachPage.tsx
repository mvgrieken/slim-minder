import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Send, Bot, User } from 'lucide-react';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hallo! Ik ben je persoonlijke financiële coach. Ik kan je helpen met budgetteren, sparen, en al je geldvragen. Wat wil je weten?',
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

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponse = "Bedankt voor je vraag! Ik ben nog in ontwikkeling, maar ik kan je helpen met basis financiële adviezen. Probeer een van de snelle vragen hierboven of stel een specifieke vraag over budgetteren of sparen.";
      
      // Check if we have a predefined response
      for (const [question, response] of Object.entries(mockAIResponses)) {
        if (inputValue.toLowerCase().includes(question.toLowerCase().split(' ').slice(0, 3).join(' '))) {
          aiResponse = response;
          break;
        }
      }

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

  return (
    <CoachContainer>
      <PageHeader>
        <PageTitle>AI Financiële Coach</PageTitle>
        <PageSubtitle>Stel je vragen en krijg persoonlijk advies</PageSubtitle>
      </PageHeader>

      <ChatContainer>
        <ChatHeader>
          <CoachAvatar>
            <Bot size={20} />
          </CoachAvatar>
          <CoachInfo>
            <CoachName>Slim Minder Coach</CoachName>
            <CoachStatus>Online • Beschikbaar</CoachStatus>
          </CoachInfo>
        </ChatHeader>

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
              <span>Coach is aan het typen</span>
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