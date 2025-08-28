import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Mock AI responses for development
const mockResponses = [
  "Hallo! Ik ben je persoonlijke budgetcoach. Hoe kan ik je helpen met je financiën?",
  "Dat is een goede vraag! Op basis van je uitgavenpatroon zou ik aanraden om...",
  "Ik zie dat je deze maand al 80% van je budget hebt gebruikt. Wil je dat we kijken naar mogelijke besparingen?",
  "Goed bezig! Je bent deze maand binnen budget gebleven. Misschien kunnen we een deel reserveren voor je spaardoel?",
  "Laat me je helpen met het maken van een realistisch budget voor volgende maand.",
  "Ik kan je tips geven over verschillende spaarstrategieën. Waar ben je het meest geïnteresseerd in?",
];

// Conversation starters
const conversationStarters = [
  "Hoe kan ik besparen op mijn maandelijkse uitgaven?",
  "Help me met het opstellen van een budget",
  "Waarom ga ik steeds over mijn budget?",
  "Tips voor het bereiken van mijn spaardoel",
];

export default function AIChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hallo! Ik ben je persoonlijke AI budgetcoach. Ik help je graag met vragen over je financiën, budgettering en spaardoelen. Waar kan ik je mee helpen?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      // Get random response for demo
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickResponse = (text: string) => {
    sendMessage(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="px-6 py-8 bg-white border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-900">AI Coach</Text>
        <Text className="text-gray-600 mt-1">Je persoonlijke budgetassistent</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-4 ${message.type === 'user' ? 'items-end' : 'items-start'}`}
          >
            <View
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-primary-500 rounded-br-md'
                  : 'bg-white border border-gray-200 rounded-bl-md shadow-sm'
              }`}
            >
              <Text
                className={`text-base leading-6 ${
                  message.type === 'user' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {message.content}
              </Text>
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View className="items-start mb-4">
            <View className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <Text className="text-gray-500">AI coach typt...</Text>
            </View>
          </View>
        )}

        {/* Conversation starters (only show when no messages from user) */}
        {messages.filter(m => m.type === 'user').length === 0 && (
          <View className="mt-4">
            <Text className="text-sm font-medium text-gray-700 mb-3 px-2">
              Populaire vragen:
            </Text>
            {conversationStarters.map((starter, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 mb-2 shadow-sm"
                onPress={() => handleQuickResponse(starter)}
              >
                <Text className="text-gray-800 text-base">{starter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <View className="flex-row items-end space-x-3">
          <View className="flex-1">
            <TextInput
              className="border border-gray-300 rounded-2xl px-4 py-3 text-base max-h-32"
              placeholder="Typ je vraag over budgettering..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={() => sendMessage(inputText)}
              blurOnSubmit={false}
            />
          </View>
          
          <TouchableOpacity
            className={`w-12 h-12 rounded-full items-center justify-center ${
              inputText.trim() ? 'bg-primary-500' : 'bg-gray-300'
            }`}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
          >
            <Text className="text-white text-xl">→</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
          <TouchableOpacity
            className="bg-blue-100 px-4 py-2 rounded-full mr-3"
            onPress={() => handleQuickResponse("Hoe sta ik ervoor deze maand?")}
          >
            <Text className="text-blue-800 text-sm">📊 Maandoverzicht</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-green-100 px-4 py-2 rounded-full mr-3"
            onPress={() => handleQuickResponse("Bespaartips voor deze week")}
          >
            <Text className="text-green-800 text-sm">💡 Bespaartips</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-purple-100 px-4 py-2 rounded-full mr-3"
            onPress={() => handleQuickResponse("Help me met een nieuw budget")}
          >
            <Text className="text-purple-800 text-sm">📝 Nieuw budget</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Beta Notice */}
      <View className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
        <Text className="text-xs text-yellow-800 text-center">
          🧪 AI Coach is in ontwikkeling. Antwoorden zijn ter demonstratie.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}