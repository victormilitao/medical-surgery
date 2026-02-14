import { Redirect, Stack, useRouter } from 'expo-router';
import { Plus, Search } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PatientListItem, PatientStatus } from '../../components/doctor/PatientListItem';
import { StatsGrid } from '../../components/doctor/StatsGrid';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function DoctorDashboard() {
    const router = useRouter();
    const { session, isLoading, isDoctor, signOut } = useAuth();

    if (isLoading) return <View className="flex-1 justify-center items-center"><Text>Carregando...</Text></View>;
    if (!session || !isDoctor) return <Redirect href="/" />;

    const handleLogout = async () => {
        await signOut();
    };

    const handlePatientClick = (name: string) => {
        console.log(`Open patient: ${name}`);
    };

    // Mock data
    const patients = [
        {
            id: '1',
            name: 'Maria Silva Santos',
            surgeryDate: '05/01/2026',
            day: 3,
            status: 'critical' as PatientStatus,
            lastUpdate: 'Hoje às 08:30',
            alerts: ['Inspeção do sítio cirúrgico (suspeita)', 'Febre > 38°C']
        },
        {
            id: '2',
            name: 'João Pereira',
            surgeryDate: '04/01/2026',
            day: 4,
            status: 'warning' as PatientStatus,
            lastUpdate: 'Ontem às 18:00',
            alerts: ['Dor intensa']
        },
        {
            id: '3',
            name: 'Ana Costa',
            surgeryDate: '02/01/2026',
            day: 6,
            status: 'stable' as PatientStatus,
            lastUpdate: 'Hoje às 09:15',
        },
        {
            id: '4',
            name: 'Carlos Oliveira',
            surgeryDate: '28/12/2025',
            day: 11,
            status: 'stable' as PatientStatus,
            lastUpdate: 'Hoje às 10:00',
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-white px-6 pt-12 pb-4 shadow-sm z-10">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-gray-500 text-sm">Bem-vindo, Doutor</Text>
                        <Text className="text-2xl font-bold text-gray-900">Dr. Ricardo</Text>
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
                {patients.map(patient => (
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
                ))}
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
