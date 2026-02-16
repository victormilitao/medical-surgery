import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    bordered?: boolean;
}

export function Card({ className, bordered = true, ...props }: CardProps) {
    return (
        <View className={`bg-white rounded-xl p-4 shadow-sm ${bordered ? 'border border-gray-100' : 'shadow-none'} ${className}`} {...props} />
    );
}
