import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    subtitle?: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'light';
    isLoading?: boolean;
    icon?: React.ReactNode;
    textClassName?: string;
}

export function Button({ title, subtitle, variant = 'primary', isLoading, className, icon, textClassName, ...props }: ButtonProps) {
    let bgClass = 'bg-primary-700';
    let textClass = 'text-white';

    if (variant === 'outline') {
        bgClass = 'bg-transparent border border-primary-700';
        textClass = 'text-primary-700';
    } else if (variant === 'ghost') {
        bgClass = 'bg-transparent';
        textClass = 'text-primary-700';
    } else if (variant === 'danger') {
        bgClass = 'bg-red-500';
        textClass = 'text-white';
    } else if (variant === 'light') {
        bgClass = 'bg-white';
        textClass = 'text-primary-700';
    }

    const heightClass = subtitle ? 'py-4' : 'h-12';

    return (
        <TouchableOpacity
            className={`${heightClass} flex-row items-center justify-center rounded-lg px-6 ${bgClass} ${className} ${props.disabled ? 'opacity-50' : ''}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary.main : Colors.white} />
            ) : (
                <View className="items-center gap-1">
                    <View className="flex-row items-center gap-2">
                        {icon}
                        <Text className={`font-semibold text-base ${textClass} ${textClassName ?? ''}`}>{title}</Text>
                    </View>
                    {subtitle && (
                        <Text className={`text-sm ${textClass} ${textClassName ?? ''}`}>{subtitle}</Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}
