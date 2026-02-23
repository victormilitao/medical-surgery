import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    isLoading?: boolean;
    icon?: React.ReactNode;
    textClassName?: string;
}

export function Button({ title, variant = 'primary', isLoading, className, icon, textClassName, ...props }: ButtonProps) {
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
                <View className="flex-row items-center gap-2">
                    {icon}
                    <Text className={`font-semibold text-base ${textClass} ${textClassName ?? ''}`}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
