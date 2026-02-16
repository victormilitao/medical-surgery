import { Redirect, Stack, useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PatientListItem, PatientStatus } from '../../components/doctor/PatientListItem';
import { StatsGrid } from '../../components/doctor/StatsGrid';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useSurgeriesByDoctor } from '../../hooks/useSurgeries';

interface Patient {
    id: string;
    name: string;
    surgeryDate: string;
    day: number;
    status: PatientStatus;
    lastUpdate: string;
    alerts?: string[];
}

export default function DoctorDashboard() {
    const router = useRouter();
    const { session, isLoading: isAuthLoading, isDoctor, signOut, profile } = useAuth();

    // Use React Query hook for surgeries
    const { data: surgeriesData, isLoading: isSurgeriesLoading } = useSurgeriesByDoctor(profile?.id);

    if (isAuthLoading) return <View className="flex-1 justify-center items-center"><Text>Carregando...</Text></View>;
    if (!session || !isDoctor) return <Redirect href="/" />;

    // Transform surgery data for UI
    const patients = useMemo<Patient[]>(() => {
        if (!surgeriesData) return [];

        return surgeriesData.map((surgery) => {
            const surgeryDate = new Date(surgery.surgery_date);
            const today = new Date();
            const daysSinceSurgery = Math.floor((today.getTime() - surgeryDate.getTime()) / (1000 * 60 * 60 * 24));

            // Map surgery status to patient status
            const patientStatus: PatientStatus =
                surgery.status === 'completed' ? 'finished' :
                    surgery.status === 'cancelled' ? 'stable' :
                        daysSinceSurgery <= 3 ? 'critical' :
                            daysSinceSurgery <= 7 ? 'warning' : 'stable';

            return {
                id: surgery.patient_id,
                name: surgery.patient?.full_name || 'Sem nome',
                surgeryDate: surgeryDate.toLocaleDateString('pt-BR'),
                day: daysSinceSurgery + 1,
                surgeryType: surgery.surgery_type?.name || 'Não especificado',
                status: patientStatus,
                lastUpdate: new Date(surgery.updated_at || surgery.created_at || new Date()).toLocaleDateString('pt-BR'),
                alerts: patientStatus === 'critical' ? ['Requer atenção'] : patientStatus === 'warning' ? ['Monitorar'] : undefined
            };
        });
    }, [surgeriesData]);

    const handleLogout = async () => {
        await signOut();
    };

    const handlePatientClick = (name: string) => {
        console.log(`Open patient: ${name}`);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-white px-6 pt-12 pb-4 shadow-sm z-10">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-gray-500 text-sm">Bem-vindo, Doutor</Text>
                        <Text className="text-2xl font-bold text-gray-900">{profile?.full_name || 'Dr. Ricardo'}</Text>
                    </View>
                    <Button
                        title="Sair"
                        variant="ghost"
                        onPress={handleLogout}
                        className="h-8 px-2"
                    />
                </View>

                <View className="bg-gray-100 rounded-lg flex-row items-center px-3 h-10">
                    <Search size={20} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-900"
                        placeholder="Buscar paciente..."
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
                <Text className="text-lg font-bold text-gray-900 mb-2">Visão Geral</Text>
                <StatsGrid />

                <Text className="text-lg font-bold text-gray-900 mb-2 mt-2">Pacientes em Acompanhamento</Text>
                {isSurgeriesLoading ? (
                    <Text className="text-gray-500 text-center py-4">Carregando pacientes...</Text>
                ) : patients.length === 0 ? (
                    <Text className="text-gray-500 text-center py-4">Nenhum paciente encontrado</Text>
                ) : (
                    patients.map(patient => (
                        <PatientListItem
                            key={patient.id}
                            name={patient.name}
                            surgeryDate={patient.surgeryDate}
                            day={patient.day}
                            status={patient.status}
                            lastUpdate={patient.lastUpdate}
                            alerts={patient.alerts}
                            onPress={() => handlePatientClick(patient.name)}
                        />
                    ))
                )}
            </ScrollView>

            {/* FAB - Floating Action Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
                onPress={() => console.log('Add Patient')}
            >
                <Plus size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
}
