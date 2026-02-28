import Slider from '@react-native-community/slider';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertCircle, AlertTriangle, ArrowLeft, CheckCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';
import { patientService, questionService, reportService } from '../../../services';
import { DailyReport, QuestionWithDetails } from '../../../services/types';

export default function ReportHistoryScreen() {
  const { reportId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [questions, setQuestions] = useState<QuestionWithDetails[]>([]);

  useEffect(() => {
    loadData();
  }, [reportId, session?.user.id]);

  const loadData = async () => {
    if (!session?.user.id || !reportId) return;

    try {
      setLoading(true);
      const reportData = await reportService.getReportById(reportId as string);

      if (!reportData) {
        Alert.alert('Erro', 'Relatório não encontrado.');
        router.back();
        return;
      }
      setReport(reportData);

      // Get questions to render the form structure
      // We need surgery type ID. We can get it from patient profile again.
      const dashboardData = await patientService.getPatientDashboardData(session.user.id);
      if (dashboardData?.currentSurgery?.surgery_type_id) {
        const typeId = dashboardData.currentSurgery.surgery_type_id;
        const fetchedQuestions = await questionService.getQuestionsBySurgeryTypeId(typeId);
        setQuestions(fetchedQuestions);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Erro', 'Falha ao carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  const shouldRenderQuestion = (question: QuestionWithDetails) => {
    if (!question.metadata || !report) return true;
    const meta = question.metadata as any;

    if (meta.depends_on_question_text && meta.depends_on_value) {
      const parentQuestion = questions.find(q => q.text === meta.depends_on_question_text);
      if (parentQuestion) {
        const parentAnswer = report.answers[parentQuestion.id];

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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.accent.teal} />
      </View>
    );
  }

  if (!report) return null;

  const hasCriticalAlert = report.alerts?.some(a => a.severity === 'critical');
  const hasWarningAlert = report.alerts?.some(a => a.severity === 'warning');

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-2 bg-white relative mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 z-10"
        >
          <ArrowLeft size={24} color={Colors.gray[700]} />
        </TouchableOpacity>

        <View className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center pointer-events-none">
          <Text className="text-lg font-semibold text-gray-800">Detalhes do Dia</Text>
          <Text className="text-xs text-gray-500">
            {report.date ? format(new Date(report.date), "d 'de' MMMM", { locale: ptBR }) : ''}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View className={`mb-6 p-4 rounded-xl border flex-row items-start ${hasCriticalAlert ? 'bg-red-50 border-red-200' :
          hasWarningAlert ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
          <View className={`mt-0.5 p-2 rounded-full mr-3 ${hasCriticalAlert ? 'bg-red-100' :
            hasWarningAlert ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
            {hasCriticalAlert ? <AlertCircle size={20} color={Colors.status.critical} /> :
              hasWarningAlert ? <AlertTriangle size={20} color={Colors.status.warning} /> :
                <CheckCircle size={20} color={Colors.status.success} />
            }
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-lg mb-1 ${hasCriticalAlert ? 'text-red-800' :
              hasWarningAlert ? 'text-yellow-800' :
                'text-green-800'
              }`}>
              {hasCriticalAlert ? 'Alerta Crítico' :
                hasWarningAlert ? 'Atenção Necessária' :
                  'Recuperação dentro do esperado'}
            </Text>

            {report.alerts && report.alerts.length > 0 ? (
              <View className="mt-2">
                <Text className="font-medium text-gray-700 mb-1">Pontos de atenção:</Text>
                {report.alerts.map((alert, idx) => (
                  <Text key={idx} className="text-gray-600 text-sm leading-5">
                    • {alert.message}
                  </Text>
                ))}
              </View>
            ) : (
              <Text className="text-gray-600 text-sm">
                Nenhum sinal de alerta reportado neste dia.
              </Text>
            )}
          </View>
        </View>

        <Text className="text-gray-900 font-bold text-lg mb-4">Respostas enviadas</Text>

        {questions.filter(shouldRenderQuestion).map((question) => (
          <View key={question.id} className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100 opacity-90">
            <Text className="text-base font-semibold text-gray-800 mb-3">{question.text}</Text>

            {/* Input Types (Read Only) */}

            {/* SCALE (0-10) */}
            {question.input_type === 'scale' && (
              <View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-gray-500">Nível relatado:</Text>
                  <Text className={`font-bold text-lg ${(report.answers[question.id] || 0) > 5 ? 'text-red-600' : 'text-gray-900'
                    }`}>{report.answers[question.id] || 0}</Text>
                </View>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  value={report.answers[question.id] ? parseInt(report.answers[question.id]) : 0}
                  disabled={true}
                  minimumTrackTintColor={(report.answers[question.id] || 0) > 5 ? Colors.status.danger : Colors.accent.teal}
                  thumbTintColor={(report.answers[question.id] || 0) > 5 ? Colors.status.danger : Colors.accent.teal}
                />
              </View>
            )}

            {/* BOOLEAN */}
            {question.input_type === 'boolean' && (
              <View className="flex-row gap-4">
                {question.options?.map((option) => {
                  const isSelected = report.answers[question.id] === option.value;
                  const isAbnormal = option.is_abnormal;
                  return (
                    <View
                      key={option.id}
                      className={`flex-1 py-3 px-4 rounded-lg flex-row justify-center items-center border ${isSelected
                        ? (isAbnormal ? 'bg-red-50 border-red-300' : 'bg-teal-50 border-teal-500')
                        : 'bg-gray-50 border-gray-100 opacity-50'
                        }`}
                    >
                      <Text className={`font-medium ${isSelected ? (isAbnormal ? 'text-red-700' : 'text-teal-700') : 'text-gray-400'}`}>
                        {option.label}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}

            {/* SELECT */}
            {question.input_type === 'select' && (
              <View className="gap-3">
                {question.options?.map((option) => {
                  const isSelected = report.answers[question.id] === option.value;
                  const isAbnormal = option.is_abnormal;
                  return (
                    <View
                      key={option.id}
                      className={`w-full py-3 px-4 rounded-lg flex-row items-center border ${isSelected
                        ? (isAbnormal ? 'bg-red-50 border-red-300' : 'bg-teal-50 border-teal-500')
                        : 'bg-white border-gray-100 hidden' // Hide unselected in history for cleaner view? Or show dimmed? Let's show selected only or all dimmed.
                        }`}
                      style={{ display: isSelected ? 'flex' : 'none' }} // Show only selected in history for cleaner view
                    >
                      <Text className={`font-medium ${isSelected ? (isAbnormal ? 'text-red-700' : 'text-teal-700') : 'text-gray-600'}`}>
                        {option.label}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}

            {/* TEXT */}
            {question.input_type === 'text' && (
              <Text className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 min-h-[60px]">
                {report.answers[question.id] || 'Sem resposta.'}
              </Text>
            )}

          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
