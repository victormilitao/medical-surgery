import { Text, View } from 'react-native';

interface ProgressBarProps {
    currentDay: number;
    totalDays: number;
}

export function ProgressBar({ currentDay, totalDays }: ProgressBarProps) {
    const progress = Math.min(Math.max(currentDay / totalDays, 0), 1) * 100;

    return (
        <View className="w-full">
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-900 font-semibold text-lg">Seu acompanhamento</Text>
                <Text className="text-blue-600 font-medium">Dia {currentDay} de {totalDays}</Text>
            </View>
            <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </View>
            <Text className="text-gray-500 text-sm mt-2">
                Continue respondendo diariamente para melhor acompanhamento.
            </Text>
        </View>
    );
}
