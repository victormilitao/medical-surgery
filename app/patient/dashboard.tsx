import { Redirect, Stack, useRouter } from 'expo-router';
import { Calendar, FileText, Info } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { ActionMenuItem } from '../../components/patient/ActionMenuItem';
import { ProgressBar } from '../../components/patient/ProgressBar';
import { WelcomeHeader } from '../../components/patient/WelcomeHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { usePatientDashboard } from '../../hooks/usePatientDashboard';

export default function PatientDashboard() {
    const router = useRouter();
    const { session, isLoading: isAuthLoading, isPatient, signOut, profile } = useAuth();

    // Fetch patient dashboard data
    const { data: dashboardData, isLoading: isDashboardLoading } = usePatientDashboard(profile?.id);

    if (isAuthLoading || isDashboardLoading) {
        return <View className="flex-1 justify-center items-center"><Text>Carregando...</Text></View>;
    }

    if (!session || !isPatient) return <Redirect href="/" />;

    const handleLogout = async () => {
        await signOut();
    };

    // Use real data or defaults
    const patientName = dashboardData?.profile.full_name || 'Paciente';
    const surgeryType = (dashboardData?.currentSurgery as any)?.surgery_type?.name || 'Nenhuma cirurgia registrada';
    const surgeryDate = dashboardData?.currentSurgery?.surgery_date
        ? new Date(dashboardData.currentSurgery.surgery_date).toLocaleDateString('pt-BR')
        : 'N/A';
    const currentDay = dashboardData?.daysSinceSurgery || 0;
    const totalDays = (dashboardData?.currentSurgery as any)?.surgery_type?.expected_recovery_days || dashboardData?.totalRecoveryDays || 14;

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Section */}
                <View className="bg-white px-6 pt-12 pb-6 rounded-b-3xl shadow-sm mb-6">
                    <View className="items-end mb-2">
                        <Button
                            title="Sair"
                            variant="ghost"
                            onPress={handleLogout}
                            className="h-8 px-2"
                        />
                    </View>
                    <WelcomeHeader
                        patientName={patientName}
                        surgeryType={surgeryType}
                        surgeryDate={surgeryDate}
                    />
                </View>

                {/* Progress Section */}
                {dashboardData?.currentSurgery && (
                    <View className="px-6 mb-8">
                        <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <ProgressBar currentDay={currentDay} totalDays={totalDays} />
                        </View>
                    </View>
                )}

                {/* No Surgery Message */}
                {!dashboardData?.currentSurgery && (
                    <View className="px-6 mb-8">
                        <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <Text className="text-yellow-800 text-center">
                                Você ainda não tem uma cirurgia registrada. Entre em contato com seu médico.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Menu Section */}
                <View className="px-6">
                    <ActionMenuItem
                        title="Linha do Tempo"
                        subtitle="Veja sua evolução diária"
                        // @ts-ignore
                        icon={Calendar}
                        onPress={() => router.push('/patient/timeline')}
                        actionLabel={dashboardData?.currentSurgery ? `Dia ${currentDay + 1}` : undefined}
                    />
                    <ActionMenuItem
                        title="Questionário de Hoje"
                        subtitle="Responda suas perguntas diárias"
                        // @ts-ignore
                        icon={FileText}
                        iconColor="#166534"
                        iconBgColor="bg-green-100"
                        onPress={() => router.push('/patient/daily-report')}
                        actionLabel="Responder"
                    />
                    <ActionMenuItem
                        title="Orientações por Fase"
                        subtitle="O que esperar em cada período"
                        // @ts-ignore
                        icon={Info}
                        iconColor="#9333ea"
                        iconBgColor="bg-purple-100"
                        onPress={() => console.log('Guidelines')}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
