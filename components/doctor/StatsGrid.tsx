import { Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../ui/Card';

export type StatStatus = 'critical' | 'warning' | 'stable' | 'finished';

interface StatCardProps {
    label: string;
    count: number;
    color: 'red' | 'yellow' | 'green' | 'blue';
    isSelected: boolean;
    onPress: () => void;
}

function StatCard({ label, count, color, isSelected, onPress }: StatCardProps) {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-900';
    let countColor = 'text-gray-900';

    if (color === 'red') {
        bgColor = 'bg-red-200';
        textColor = 'text-red-700';
        countColor = 'text-red-600';
    } else if (color === 'yellow') {
        bgColor = 'bg-yellow-50';
        textColor = 'text-yellow-700';
        countColor = 'text-yellow-600';
    } else if (color === 'green') {
        bgColor = 'bg-green-200';
        textColor = 'text-green-700';
        countColor = 'text-green-600';
    } else if (color === 'blue') {
        bgColor = 'bg-blue-200';
        textColor = 'text-blue-700';
        countColor = 'text-blue-600';
    }

    return (
        <TouchableOpacity onPress={onPress} className="flex-1 mx-1" activeOpacity={0.7}>
            <Card
                className={`items-center justify-center ${isSelected ? 'border-1' : 'border-0'}`}
                style={isSelected ? { borderColor: textColor.replace('text-', '').replace('-700', '') } : {}} // Simple hack, ideally calculate color code
            >
                <Text className={`text-2xl font-bold ${countColor}`}>{count}</Text>
                <Text className={`text-xs font-medium ${textColor} text-center`}>{label}</Text>
            </Card>
        </TouchableOpacity>
    );
}

interface StatsGridProps {
    counts?: {
        critical: number;
        warning: number;
        stable: number;
        finished: number;
    };
    selectedStatus?: StatStatus;
    onSelectStatus?: (status: StatStatus) => void;
}

export function StatsGrid({ counts, selectedStatus, onSelectStatus }: StatsGridProps) {
    const handleSelect = (status: StatStatus) => {
        if (onSelectStatus) onSelectStatus(status);
    };

    return (
        <View className="flex-row justify-between mb-6">
            <StatCard
                label="Crítico"
                count={counts?.critical || 0}
                color="red"
                isSelected={selectedStatus === 'critical'}
                onPress={() => handleSelect('critical')}
            />
            <StatCard
                label="Atenção"
                count={counts?.warning || 0}
                color="yellow"
                isSelected={selectedStatus === 'warning'}
                onPress={() => handleSelect('warning')}
            />
            <StatCard
                label="Esperado"
                count={counts?.stable || 0}
                color="green"
                isSelected={selectedStatus === 'stable'}
                onPress={() => handleSelect('stable')}
            />
            <StatCard
                label="Finalizado"
                count={counts?.finished || 0}
                color="blue"
                isSelected={selectedStatus === 'finished'}
                onPress={() => handleSelect('finished')}
            />
        </View>
    );
}
