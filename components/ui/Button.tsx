import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    isLoading?: boolean;
}

export function Button({ title, variant = 'primary', isLoading, className, ...props }: ButtonProps) {
    let bgClass = 'bg-blue-600';
    let textClass = 'text-white';

    if (variant === 'outline') {
        bgClass = 'bg-transparent border border-blue-600';
        textClass = 'text-blue-600';
    } else if (variant === 'ghost') {
        bgClass = 'bg-transparent';
        textClass = 'text-blue-600';
    } else if (variant === 'danger') {
        bgClass = 'bg-red-500';
        textClass = 'text-white';
    }

    return (
        <TouchableOpacity
            className={`h-12 flex-row items-center justify-center rounded-lg px-6 ${bgClass} ${className} ${props.disabled ? 'opacity-50' : ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#2563eb' : 'white'} />
            ) : (
                <Text className={`font-semibold text-base ${textClass}`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
