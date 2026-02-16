import Slider from '@react-native-community/slider';
import { Stack, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { patientService, questionService, reportService } from '../../services';
import { QuestionWithDetails } from '../../services/types';

export default function DailyReportScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithDetails[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentSurgeryTypeId, setCurrentSurgeryTypeId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [session?.user.id]);

  const loadData = async () => {
    if (!session?.user.id) return;

    try {
      setLoading(true);
      // Get patient data to find surgery type
      const profile = await patientService.getPatientById(session.user.id);

      // We need to fetch the surgery details to get the surgery_type_id
      // Since getPatientById doesn't return surgery_type_id directly, we rely on the implementation detail 
      // where we should probably fetch the dashboard data or modify the service. 
      // For now, let's use getPatientDashboardData which gets the current surgery.
      const dashboardData = await patientService.getPatientDashboardData(session.user.id);

      if (dashboardData?.currentSurgery?.surgery_type_id) {
        const typeId = dashboardData.currentSurgery.surgery_type_id;
        setCurrentSurgeryTypeId(typeId);

        const fetchedQuestions = await questionService.getQuestionsBySurgeryTypeId(typeId);
        setQuestions(fetchedQuestions);
      } else {
        Alert.alert('Erro', 'Cirurgia não encontrada.');
        router.back();
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Erro', 'Falha ao carregar as perguntas.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const shouldRenderQuestion = (question: QuestionWithDetails) => {
    if (!question.metadata) return true;
    const meta = question.metadata as any;

    if (meta.depends_on_question_text && meta.depends_on_value) {
      const parentQuestion = questions.find(q => q.text === meta.depends_on_question_text);

      if (parentQuestion) {
        const parentAnswer = answers[parentQuestion.id];

        // If parent hasn't been answered yet, don't show child
        if (parentAnswer === undefined || parentAnswer === null) return false;

        const condition = meta.depends_on_condition || 'eq';

        switch (condition) {
          case 'gt':
            return Number(parentAnswer) > Number(meta.depends_on_value);
          case 'gte':
            return Number(parentAnswer) >= Number(meta.depends_on_value);
          case 'lt':
            return Number(parentAnswer) < Number(meta.depends_on_value);
          case 'lte':
            return Number(parentAnswer) <= Number(meta.depends_on_value);
          case 'neq':
            return String(parentAnswer) !== String(meta.depends_on_value);
          default: // 'eq'
            return String(parentAnswer) === String(meta.depends_on_value);
        }
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!session?.user.id) return;

    // Validate required questions (assuming all visible questions are required)
    // You might want to filter out optional ones if any
    const missingAnswers = questions.filter(q => shouldRenderQuestion(q) && (answers[q.id] === undefined || answers[q.id] === null));

    if (missingAnswers.length > 0) {
      Alert.alert('Atenção', 'Por favor, responda todas as perguntas obrigatórias.');
      return;
    }

    try {
      setSubmitting(true);
      await reportService.submitDailyReport(session.user.id, answers, questions);
      Alert.alert('Sucesso', 'Relatório enviado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Erro', 'Falha ao enviar o relatório. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: 'Relatório Diário',
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#374151',
        }}
      />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-500 mb-6 text-base">
          Responda as perguntas abaixo sobre como você está se sentindo hoje.
        </Text>

        {questions.filter(shouldRenderQuestion).map((question) => (
          <View key={question.id} className="mb-6 p-5 rounded-xl border border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-4">{question.text}</Text>

            {/* Input Types */}

            {/* SCALE (0-10) */}
            {question.input_type === 'scale' && (
              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-500">Sem dor (0)</Text>
                  <Text className="text-gray-900 font-bold text-lg">{answers[question.id] || 0}</Text>
                  <Text className="text-gray-500">Intensa (10)</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={answers[question.id] ? parseInt(answers[question.id]) : 0}
                  onValueChange={(val) => handleAnswerChange(question.id, val.toString())}
                  minimumTrackTintColor="#2563EB"
                  maximumTrackTintColor="#d1d5db"
                  thumbTintColor="#2563EB"
                />
              </View>
            )}

            {/* BOOLEAN */}
            {question.input_type === 'boolean' && (
              <View className="flex-row gap-4">
                {question.options?.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleAnswerChange(question.id, option.value)}
                    className={`flex-1 py-3 px-4 rounded-lg flex-row justify-center items-center border ${answers[question.id] === option.value
                      ? 'bg-blue-50 border-blue-600'
                      : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <Text className={`font-medium ${answers[question.id] === option.value ? 'text-blue-700' : 'text-gray-600'}`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* SELECT */}
            {question.input_type === 'select' && (
              <View className="gap-3">
                {question.options?.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleAnswerChange(question.id, option.value)}
                    className={`w-full py-3 px-4 rounded-lg flex-row items-center ${answers[question.id] === option.value
                      ? 'bg-blue-50'
                      : 'bg-white'
                      }`}
                  >
                    <View className={`w-5 h-5 rounded-full border mr-3 justify-center items-center ${answers[question.id] === option.value ? 'border-blue-600' : 'border-gray-300'
                      }`}>
                      {answers[question.id] === option.value && <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </View>
                    <Text className={`font-medium ${answers[question.id] === option.value ? 'text-blue-700' : 'text-gray-600'}`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* TEXT */}
            {question.input_type === 'text' && (
              <View>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 min-h-[100px]"
                  multiline
                  textAlignVertical="top"
                  placeholder="Digite aqui..."
                  value={answers[question.id] || ''}
                  onChangeText={(text) => handleAnswerChange(question.id, text)}
                  maxLength={(question.metadata as any)?.max_length ? Number((question.metadata as any).max_length) : undefined}
                />
                {(question.metadata as any)?.max_length && (
                  <Text className="text-right text-xs text-gray-400 mt-1">
                    {(answers[question.id] || '').length}/{(question.metadata as any).max_length}
                  </Text>
                )}
              </View>
            )}

          </View>
        ))
        }

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 rounded-xl items-center mb-12 ${submitting ? 'bg-gray-400' : 'bg-blue-600'
            }`}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Enviar Respostas</Text>
          )}
        </TouchableOpacity>
      </ScrollView >
    </View >
  );
}
