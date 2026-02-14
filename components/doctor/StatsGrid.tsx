import { Text, View } from 'react-native';
import { Card } from '../ui/Card';

interface StatCardProps {
    label: string;
    count: number;
    color: 'red' | 'yellow' | 'green' | 'blue';
}

function StatCard({ label, count, color }: StatCardProps) {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-900';
    let countColor = 'text-gray-900';

    if (color === 'red') {
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        countColor = 'text-red-600';
    } else if (color === 'yellow') {
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        countColor = 'text-yellow-600';
    } else if (color === 'green') {
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        countColor = 'text-green-600';
    } else if (color === 'blue') {
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        countColor = 'text-blue-600';
    }

    return (
        <Card className={`flex-1 mx-1 items-center justify-center py-4 ${bgColor} border-0`}>
            <Text className={`text-2xl font-bold ${countColor}`}>{count}</Text>
            <Text className={`text-xs font-medium ${textColor} text-center`}>{label}</Text>
        </Card>
    );
}

export function StatsGrid() {
    return (
        <View className="flex-row justify-between mb-6 px-1">
            <StatCard label="Crítico" count={1} color="red" />
            <StatCard label="Atenção" count={2} color="yellow" />
            <StatCard label="Esperado" count={5} color="green" />
            <StatCard label="Finalizado" count={3} color="blue" />
        </View>
    );
}
