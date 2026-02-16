import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { patientService, reportService } from '../../services';

interface TimelineDay {
  day: number;
  date: Date;
  status: 'pending' | 'completed' | 'missed' | 'future';
  reportId?: string;
  alertSeverity?: 'critical' | 'warning';
}

export default function TimelineScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [surgeryDate, setSurgeryDate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, [session?.user.id]);

  const loadData = async () => {
    if (!session?.user.id) return;

    try {
      setLoading(true);
      const dashboardData = await patientService.getPatientDashboardData(session.user.id);
      const reports = await reportService.getPatientReports(session.user.id);

      if (dashboardData?.currentSurgery) {
        const sDate = new Date(dashboardData.currentSurgery.surgery_date);
        setSurgeryDate(sDate);
        const recoveryDays = dashboardData.currentSurgery.surgery_type.expected_recovery_days || 14;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today

        const days: TimelineDay[] = [];

        for (let i = 1; i <= recoveryDays; i++) {
          const currentDayDate = new Date(sDate);
          currentDayDate.setDate(sDate.getDate() + i); // Day 1 is the day after surgery
          // Wait, if 09/02 is Day 1. 14/02 is Day 6?
          // 14/02 - 09/02 = 5 days.
          // So Day 1 is 09/02.
          // Day 6 is 14/02.

          // Let's refine:
          // Surgery Date = Day 0 or Day 1?
          // Usually Post-Op app starts counting "Day 1" as the day OF surgery or day AFTER.
          // If dashboard says "Dia 5 de 14", let's assume standard linear mapping:
          // Day 1 = Surgery Date.

          const reportForDay = reports.find(r => {
            const rDate = new Date(r.date);
            return rDate.getDate() === currentDayDate.getDate() &&
              rDate.getMonth() === currentDayDate.getMonth() &&
              rDate.getFullYear() === currentDayDate.getFullYear();
          });

          let status: TimelineDay['status'] = 'future';
          if (currentDayDate < today) {
            status = reportForDay ? 'completed' : 'missed';
          } else if (currentDayDate.getTime() === today.getTime()) {
            status = reportForDay ? 'completed' : 'pending';
          }

          // Check alerts
          let severity: 'critical' | 'warning' | undefined = undefined;
          if (reportForDay?.alerts && reportForDay.alerts.length > 0) {
            if (reportForDay.alerts.some(a => a.severity === 'critical')) severity = 'critical';
            else if (reportForDay.alerts.some(a => a.severity === 'warning')) severity = 'warning';
          }
          // Also check logic from report attributes if alerts are missing but implied
          // (But we trust reportService logic which now saves alerts)

          days.push({
            day: i,
            date: currentDayDate,
            status,
            reportId: reportForDay?.id,
            alertSeverity: severity
          });
        }
        setTimeline(days);
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
      Alert.alert('Erro', 'Não foi possível carregar a linha do tempo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDayPress = (day: TimelineDay) => {
    if (day.status === 'pending') {
      router.push('/patient/daily-report');
    } else if (day.status === 'completed' && day.reportId) {
      router.push({ pathname: '/patient/report-history/[id]', params: { id: day.reportId } });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#00BFA5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 pt-12 shadow-sm flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Linha do Tempo</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-gray-500 text-base">
            Acompanhe sua evolução diária.
          </Text>
        </View>

        {timeline.map((item) => (
          <TouchableOpacity
            key={item.day}
            disabled={item.status === 'future' || item.status === 'missed'}
            onPress={() => handleDayPress(item)}
            className={`mb-4 p-4 rounded-xl border flex-row items-center justify-between ${item.status === 'future' ? 'bg-gray-50 border-gray-100 opacity-60' :
              item.status === 'pending' ? 'bg-white border-teal-500 shadow-sm' :
                item.status === 'missed' ? 'bg-gray-100 border-gray-200' :
                  item.alertSeverity === 'critical' ? 'bg-red-50 border-red-200' :
                    item.alertSeverity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
              }`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-10 h-10 rounded-full justify-center items-center mr-4 ${item.status === 'pending' ? 'bg-teal-100' :
                item.status === 'future' ? 'bg-gray-200' :
                  item.status === 'missed' ? 'bg-gray-300' :
                    item.alertSeverity === 'critical' ? 'bg-red-100' :
                      item.alertSeverity === 'warning' ? 'bg-yellow-100' :
                        'bg-green-100'
                }`}>
                <Text className={`font-bold ${item.status === 'pending' ? 'text-teal-700' :
                  item.status === 'future' ? 'text-gray-500' :
                    item.status === 'missed' ? 'text-gray-500' :
                      item.alertSeverity === 'critical' ? 'text-red-700' :
                        item.alertSeverity === 'warning' ? 'text-yellow-700' :
                          'text-green-700'
                  }`}>{item.day}</Text>
              </View>

              <View>
                <Text className="font-semibold text-gray-800 text-lg">
                  Dia {item.day}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {format(item.date, "d 'de' MMMM", { locale: ptBR })}
                </Text>
              </View>
            </View>

            <View>
              {item.status === 'pending' && (
                <View className="bg-teal-500 px-3 py-1.5 rounded-full">
                  <Text className="text-white font-medium text-xs">Responder</Text>
                </View>
              )}
              {item.status === 'completed' && (
                <View className="flex-row items-center">
                  {item.alertSeverity === 'critical' ? (
                    <Text className="text-red-600 font-medium mr-2">Crítico</Text>
                  ) : item.alertSeverity === 'warning' ? (
                    <Text className="text-yellow-600 font-medium mr-2">Atenção</Text>
                  ) : (
                    <Text className="text-green-600 font-medium mr-2">Finalizado</Text>
                  )}
                  <ChevronRight size={20} color={
                    item.alertSeverity === 'critical' ? '#DC2626' :
                      item.alertSeverity === 'warning' ? '#D97706' :
                        '#16A34A'
                  } />
                </View>
              )}
              {item.status === 'missed' && (
                <Text className="text-gray-400 text-xs">Não respondido</Text>
              )}
              {item.status === 'future' && (
                <Text className="text-gray-300 text-xs">Pendente</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
