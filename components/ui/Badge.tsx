import { Text, View } from 'react-native';

interface BadgeProps {
    label: string;
    variant?: 'default' | 'critical' | 'warning' | 'success';
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
    let bgClass = 'bg-gray-100';
    let textClass = 'text-gray-800';

    if (variant === 'critical') {
        bgClass = 'bg-red-100';
        textClass = 'text-red-800';
    } else if (variant === 'warning') {
        bgClass = 'bg-yellow-100';
        textClass = 'text-yellow-800';
    } else if (variant === 'success') {
        bgClass = 'bg-green-100';
        textClass = 'text-green-800';
    }

    return (
        <View className={`px-2 py-1 rounded-full self-start ${bgClass}`}>
            <Text className={`text-xs font-medium ${textClass}`}>{label}</Text>
        </View>
    );
}
