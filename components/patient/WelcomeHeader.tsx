import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

interface WelcomeHeaderProps {
    patientName: string;
    surgeryType: string;
    surgeryDate: string;
}

export function WelcomeHeader({ patientName, surgeryType, surgeryDate }: WelcomeHeaderProps) {
    return (
        <View className="mb-6 items-center">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                <Text className="text-3xl">💙</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">Olá, {patientName}!</Text>
            <Text className="text-gray-500 text-center px-4 mb-4">
                Estamos felizes em acompanhar sua recuperação. Você está em boas mãos.
            </Text>

            <Card className="w-full bg-blue-50 border-blue-100">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500 font-medium">Cirurgia:</Text>
                    <Text className="text-gray-900 font-semibold">{surgeryType}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-500 font-medium">Data:</Text>
                    <Text className="text-gray-900 font-semibold">{surgeryDate}</Text>
                </View>
            </Card>
        </View>
    );
}
