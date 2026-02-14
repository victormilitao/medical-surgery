import { Redirect, Stack, useRouter } from 'expo-router';
import { Calendar, FileText, Info } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { ActionMenuItem } from '../../components/patient/ActionMenuItem';
import { ProgressBar } from '../../components/patient/ProgressBar';
import { WelcomeHeader } from '../../components/patient/WelcomeHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function PatientDashboard() {
    const router = useRouter();
    const { session, isLoading, isPatient, signOut } = useAuth();

    if (isLoading) return <View className="flex-1 justify-center items-center"><Text>Carregando...</Text></View>;
    if (!session || !isPatient) return <Redirect href="/" />;

    // Mock data
    const patientData = {
        name: "Ana Maria",
        surgery: "Colecistectomia Videolaparoscópica",
        date: "06/01/2026",
        currentDay: 1,
        totalDays: 14
    };

    const handleLogout = async () => {
        await signOut();
    };

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
                        patientName={patientData.name}
                        surgeryType={patientData.surgery}
                        surgeryDate={patientData.date}
                    />
                </View>

                {/* Progress Section */}
                <View className="px-6 mb-8">
                    <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <ProgressBar currentDay={patientData.currentDay} totalDays={patientData.totalDays} />
                    </View>
                </View>

                {/* Menu Section */}
                <View className="px-6">
                    <ActionMenuItem
                        title="Linha do Tempo"
                        subtitle="Veja sua evolução diária"
                        // @ts-ignore
                        icon={Calendar}
                        onPress={() => console.log('Timeline')}
                        actionLabel={`Dia ${patientData.currentDay}`}
                    />
                    <ActionMenuItem
                        title="Questionário de Hoje"
                        subtitle="Responda suas perguntas diárias"
                        // @ts-ignore
                        icon={FileText}
                        iconColor="#166534"
                        iconBgColor="bg-green-100"
                        onPress={() => console.log('Questionnaire')}
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
