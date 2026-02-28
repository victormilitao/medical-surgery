import { Colors } from '@/constants/Colors';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionMenuItemProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    onPress: () => void;
    iconColor?: string;
    iconBgColor?: string;
    actionLabel?: string;
}

export function ActionMenuItem({
    title,
    subtitle,
    icon: Icon,
    onPress,
    iconColor = Colors.accent.blue,
    iconBgColor = "bg-blue-100",
    actionLabel
}: ActionMenuItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100 mb-3 active:bg-gray-50"
        >
            <View className={`w-12 h-12 ${iconBgColor} rounded-lg items-center justify-center mr-4`}>
                <Icon size={24} color={iconColor} />
            </View>

            <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">{title}</Text>
                <Text className="text-gray-500 text-sm">{subtitle}</Text>
            </View>

            {actionLabel ? (
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 font-medium text-xs">{actionLabel}</Text>
                </View>
            ) : (
                <ChevronRight size={20} color={Colors.gray[400]} />
            )}
        </TouchableOpacity>
    );
}
