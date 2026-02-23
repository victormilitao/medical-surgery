import { Text, View } from 'react-native';

interface WelcomeHeaderProps {
    surgeryType: string;
    surgeryDate: string;
}

export function WelcomeHeader({ surgeryType, surgeryDate }: WelcomeHeaderProps) {
    return (
        <View className="pb-2">
            <View className="rounded-xl">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-blue-100 font-medium">Cirurgia:</Text>
                    <Text className="text-white font-semibold flex-1 text-right ml-2">{surgeryType}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-blue-100 font-medium">Data:</Text>
                    <Text className="text-white font-semibold">{surgeryDate}</Text>
                </View>
            </View>
        </View>
    );
}
