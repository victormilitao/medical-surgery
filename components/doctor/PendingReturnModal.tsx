import { AlertTriangle } from 'lucide-react-native';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { AppColors } from '../../constants/colors';

interface PendingReturnModalProps {
    visible: boolean;
    patientName: string;
    onConfirm: () => void;
    onClose: () => void;
    isLoading?: boolean;
}

export function PendingReturnModal({ visible, patientName, onConfirm, onClose, isLoading }: PendingReturnModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="bg-white rounded-2xl mx-6 p-6 w-11/12 max-w-md shadow-xl">
                    <View className="items-center mb-4">
                        <View className="w-14 h-14 rounded-full items-center justify-center mb-3" style={{ backgroundColor: AppColors.warning.light }}>
                            <AlertTriangle size={28} color={AppColors.warning.DEFAULT} />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 text-center">Confirmar Retorno</Text>
                    </View>

                    <Text className="text-gray-600 text-base text-center mb-6">
                        Confirmar que o paciente <Text className="font-semibold">{patientName}</Text> realizou o retorno médico?
                    </Text>

                    <Text className="text-gray-400 text-sm text-center mb-6">
                        Essa ação não pode ser desfeita. O acompanhamento será finalizado.
                    </Text>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 py-3 rounded-xl border border-gray-300 items-center"
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text className="text-gray-700 font-medium">Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 py-3 rounded-xl items-center"
                            style={{ backgroundColor: AppColors.primary[700] }}
                            onPress={onConfirm}
                            disabled={isLoading}
                        >
                            <Text className="text-white font-medium">
                                {isLoading ? 'Confirmando...' : 'Confirmar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
