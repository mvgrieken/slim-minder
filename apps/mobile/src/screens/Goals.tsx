import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert
} from 'react-native';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
}

// Mock data for development
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Vakantie naar Italië',
    targetAmount: 2500,
    currentAmount: 1200,
    deadline: '2024-06-01',
    category: 'Vakantie'
  },
  {
    id: '2',
    title: 'Noodfonds opbouwen',
    targetAmount: 5000,
    currentAmount: 3200,
    category: 'Sparen'
  },
  {
    id: '3',
    title: 'Nieuwe laptop',
    targetAmount: 1500,
    currentAmount: 450,
    deadline: '2024-03-15',
    category: 'Technologie'
  }
];

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: ''
  });

  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.category) {
      Alert.alert('Fout', 'Vul alle verplichte velden in');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline || undefined,
      category: newGoal.category
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', targetAmount: '', deadline: '', category: '' });
    setShowAddModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-8 bg-white">
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-gray-900">Doelen</Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg"
            onPress={() => setShowAddModal(true)}
          >
            <Text className="text-white font-medium">+ Nieuw doel</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600 mt-1">Stel doelen en houd je voortgang bij</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {goals.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-gray-600 text-center text-lg mb-6">
              Je hebt nog geen doelen ingesteld
            </Text>
            <TouchableOpacity
              className="bg-primary-500 px-6 py-3 rounded-lg"
              onPress={() => setShowAddModal(true)}
            >
              <Text className="text-white font-medium">Stel je eerste doel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;
            const isCompleted = progress >= 100;

            return (
              <TouchableOpacity
                key={goal.id}
                className="bg-white rounded-2xl p-6 shadow-sm mb-4"
              >
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {goal.title}
                    </Text>
                    <Text className="text-sm text-gray-600">{goal.category}</Text>
                    {goal.deadline && (
                      <Text className="text-sm text-gray-500 mt-1">
                        Deadline: {new Date(goal.deadline).toLocaleDateString('nl-NL')}
                      </Text>
                    )}
                  </View>
                  {isCompleted && (
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-800 text-sm font-medium">✓ Gehaald!</Text>
                    </View>
                  )}
                </View>

                {/* Progress */}
                <View className="mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-2xl font-bold text-gray-900">
                      {formatCurrency(goal.currentAmount)}
                    </Text>
                    <Text className="text-gray-600">
                      van {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>

                  <View className="bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                    <View
                      className={`h-full rounded-full ${
                        isCompleted ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </View>

                  <View className="flex-row justify-between items-center">
                    <Text className={`text-sm font-medium ${
                      isCompleted ? 'text-green-600' : 'text-primary-600'
                    }`}>
                      {progress.toFixed(1)}% behaald
                    </Text>
                    {!isCompleted && (
                      <Text className="text-sm text-gray-500">
                        Nog {formatCurrency(remaining)} te gaan
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="px-6 py-8 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-gray-900">Nieuw doel</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="p-2"
              >
                <Text className="text-gray-600 text-lg">✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-2">
                Doel naam *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Bijv. Vakantie naar Italië"
                value={newGoal.title}
                onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              />
            </View>

            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-2">
                Streefbedrag *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="2500"
                keyboardType="numeric"
                value={newGoal.targetAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
              />
            </View>

            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-2">
                Categorie *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Bijv. Vakantie, Sparen, Technologie"
                value={newGoal.category}
                onChangeText={(text) => setNewGoal({ ...newGoal, category: text })}
              />
            </View>

            <View className="mb-6">
              <Text className="text-base font-medium text-gray-900 mb-2">
                Deadline (optioneel)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="DD-MM-YYYY"
                value={newGoal.deadline}
                onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
              />
            </View>

            <TouchableOpacity
              className="bg-primary-500 py-4 rounded-lg items-center mt-4"
              onPress={handleAddGoal}
            >
              <Text className="text-white font-semibold text-lg">Doel toevoegen</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}