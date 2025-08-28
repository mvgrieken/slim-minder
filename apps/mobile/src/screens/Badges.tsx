import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  category: 'budget' | 'goal' | 'streak' | 'special';
}

// Mock badges for development
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Budget Bewaker',
    description: 'Een hele maand binnen je budget gebleven',
    icon: '🏆',
    earned: true,
    earnedAt: '2024-01-15',
    category: 'budget'
  },
  {
    id: '2',
    name: 'Spaar Starter',
    description: 'Je eerste spaardoel behaald',
    icon: '💰',
    earned: true,
    earnedAt: '2024-01-20',
    category: 'goal'
  },
  {
    id: '3',
    name: 'Streak Master',
    description: '7 dagen op rij uitgaven bijgehouden',
    icon: '🔥',
    earned: true,
    earnedAt: '2024-01-25',
    category: 'streak'
  },
  {
    id: '4',
    name: 'Categorie Koning',
    description: '50 transacties correct gecategoriseerd',
    icon: '👑',
    earned: false,
    category: 'special'
  },
  {
    id: '5',
    name: 'Budget Expert',
    description: '3 maanden achter elkaar binnen budget',
    icon: '🎯',
    earned: false,
    category: 'budget'
  },
  {
    id: '6',
    name: 'Spaarheld',
    description: '€1000 gespaard',
    icon: '💎',
    earned: false,
    category: 'goal'
  },
  {
    id: '7',
    name: 'Maand Meester',
    description: '30 dagen streak volgehouden',
    icon: '🌟',
    earned: false,
    category: 'streak'
  },
  {
    id: '8',
    name: 'AI Assistent',
    description: '10 gesprekken gevoerd met de AI coach',
    icon: '🤖',
    earned: false,
    category: 'special'
  }
];

export default function BadgesScreen() {
  const earnedBadges = mockBadges.filter(badge => badge.earned);
  const unEarnedBadges = mockBadges.filter(badge => !badge.earned);

  const getCategoryColor = (category: Badge['category']) => {
    switch (category) {
      case 'budget': return 'bg-blue-100 border-blue-200';
      case 'goal': return 'bg-green-100 border-green-200';
      case 'streak': return 'bg-orange-100 border-orange-200';
      case 'special': return 'bg-purple-100 border-purple-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getCategoryTextColor = (category: Badge['category']) => {
    switch (category) {
      case 'budget': return 'text-blue-800';
      case 'goal': return 'text-green-800';
      case 'streak': return 'text-orange-800';
      case 'special': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  const BadgeCard = ({ badge, earned }: { badge: Badge; earned: boolean }) => (
    <TouchableOpacity
      className={`p-4 rounded-2xl border-2 mb-4 ${
        earned 
          ? `${getCategoryColor(badge.category)} shadow-sm` 
          : 'bg-gray-50 border-gray-200'
      }`}
      style={{ opacity: earned ? 1 : 0.6 }}
    >
      <View className="items-center">
        <Text className="text-4xl mb-3">{badge.icon}</Text>
        <Text className={`text-lg font-bold mb-2 text-center ${
          earned ? getCategoryTextColor(badge.category) : 'text-gray-600'
        }`}>
          {badge.name}
        </Text>
        <Text className={`text-sm text-center mb-3 ${
          earned ? 'text-gray-700' : 'text-gray-500'
        }`}>
          {badge.description}
        </Text>
        {earned && badge.earnedAt && (
          <View className="bg-white bg-opacity-80 px-3 py-1 rounded-full">
            <Text className="text-xs text-gray-600">
              Behaald op {new Date(badge.earnedAt).toLocaleDateString('nl-NL')}
            </Text>
          </View>
        )}
        {!earned && (
          <View className="bg-gray-200 px-3 py-1 rounded-full">
            <Text className="text-xs text-gray-600">Nog niet behaald</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-8 bg-white">
        <Text className="text-3xl font-bold text-gray-900">Badges</Text>
        <Text className="text-gray-600 mt-1">
          Je hebt {earnedBadges.length} van {mockBadges.length} badges behaald
        </Text>
      </View>

      {/* Progress Summary */}
      <View className="px-6 py-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Voortgang</Text>
            <Text className="text-2xl font-bold text-primary-600">
              {earnedBadges.length}/{mockBadges.length}
            </Text>
          </View>
          
          <View className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${(earnedBadges.length / mockBadges.length) * 100}%` }}
            />
          </View>
          
          <Text className="text-sm text-gray-600 mt-2">
            {((earnedBadges.length / mockBadges.length) * 100).toFixed(1)}% voltooid
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Behaalde badges ({earnedBadges.length})
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {earnedBadges.map((badge) => (
                <View key={badge.id} className="w-[48%]">
                  <BadgeCard badge={badge} earned={true} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Unearned Badges */}
        {unEarnedBadges.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Te behalen badges ({unEarnedBadges.length})
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {unEarnedBadges.map((badge) => (
                <View key={badge.id} className="w-[48%]">
                  <BadgeCard badge={badge} earned={false} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        <View className="bg-blue-50 rounded-2xl p-6 mb-6">
          <Text className="text-lg font-semibold text-blue-900 mb-3">💡 Tips voor badges</Text>
          <Text className="text-blue-800 leading-6">
            • Houd je uitgaven dagelijks bij voor streak badges{'\n'}
            • Stel realistische budgetten om budget badges te verdienen{'\n'}
            • Gebruik de AI coach om nieuwe badges te ontdekken{'\n'}
            • Categoriseer je transacties correct voor bonus punten
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}