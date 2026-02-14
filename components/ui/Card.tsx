import { View, ViewProps } from 'react-native';

export function Card({ className, ...props }: ViewProps) {
    return (
        <View className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${className}`} {...props} />
    );
}
