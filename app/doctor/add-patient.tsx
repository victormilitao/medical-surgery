import { useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { patientService, surgeryTypeService } from '../../services';

interface SurgeryType {
  id: string;
  name: string;
  expected_recovery_days: number | null;
}

export default function AddPatientScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [surgeryTypeId, setSurgeryTypeId] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [followUpDays, setFollowUpDays] = useState('');
  const [surgeryTypes, setSurgeryTypes] = useState<SurgeryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    loadSurgeryTypes();
  }, []);

  const loadSurgeryTypes = async () => {
    try {
      const data = await surgeryTypeService.getActiveSurgeryTypes();
      const mapped: SurgeryType[] = (data || []).map((t) => ({
        id: t.id,
        name: t.name,
        expected_recovery_days: t.expected_recovery_days,
      }));
      setSurgeryTypes(mapped);
      if (mapped.length > 0) {
        setSurgeryTypeId(mapped[0].id);
        setFollowUpDays(String(mapped[0].expected_recovery_days ?? 14));
      }
    } catch (e) {
      console.error('Error loading surgery types:', e);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleSurgeryTypeChange = (typeId: string) => {
    setSurgeryTypeId(typeId);
    const selectedType = surgeryTypes.find((t) => t.id === typeId);
    if (selectedType) {
      setFollowUpDays(String(selectedType.expected_recovery_days ?? 14));
    }
  };

  const formatCPF = (value: string): string => {
    const digits: string = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const formatPhone = (value: string): string => {
    const digits: string = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatDate = (value: string): string => {
    const digits: string = value.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const handleSubmit = async () => {
    const cleanCpf: string = cpf.replace(/\D/g, '');
    if (!cleanCpf || cleanCpf.length !== 11) {
      showToast({ type: 'error', title: 'Erro', message: 'CPF inválido. Deve ter 11 dígitos.' });
      return;
    }
    if (!name.trim()) {
      showToast({ type: 'error', title: 'Erro', message: 'Nome é obrigatório.' });
      return;
    }
    if (!age.trim()) {
      showToast({ type: 'error', title: 'Erro', message: 'Idade é obrigatória.' });
      return;
    }

    const parsedFollowUpDays = parseInt(followUpDays, 10);
    if (!followUpDays.trim() || isNaN(parsedFollowUpDays) || parsedFollowUpDays < 1) {
      showToast({ type: 'error', title: 'Erro', message: 'Tempo de acompanhamento deve ser pelo menos 1 dia.' });
      return;
    }

    // Parse date from DD/MM/YYYY to YYYY-MM-DD
    const dateDigits: string = surgeryDate.replace(/\D/g, '');
    if (!surgeryDate.trim() || dateDigits.length !== 8) {
      showToast({ type: 'error', title: 'Erro', message: 'Data do procedimento inválida (DD/MM/AAAA).' });
      return;
    }

    const day: number = parseInt(dateDigits.slice(0, 2), 10);
    const month: number = parseInt(dateDigits.slice(2, 4), 10);
    const year: number = parseInt(dateDigits.slice(4, 8), 10);

    // Validate date ranges and real calendar date
    const parsedDate: Date = new Date(year, month - 1, day);
    const isValidDate: boolean =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    if (!isValidDate) {
      showToast({ type: 'error', title: 'Erro', message: 'Data inválida. Verifique o dia, mês e ano informados.' });
      return;
    }

    if (!profile?.id) {
      showToast({ type: 'error', title: 'Erro', message: 'Sessão expirada.' });
      return;
    }

    const isoDate = `${String(year)}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    setLoading(true);
    try {
      await patientService.createPatient({
        name: name.trim(),
        cpf: cleanCpf,
        sex,
        age: age.trim(),
        phone: phone.replace(/\D/g, ''),
        surgeryTypeId,
        surgeryDate: isoDate,
        doctorId: profile.id,
        followUpDays: parsedFollowUpDays,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['surgeries', 'doctor', profile.id] });
      queryClient.invalidateQueries({ queryKey: ['patients', 'doctor', profile.id] });

      showToast({ type: 'success', title: 'Sucesso', message: 'Paciente cadastrado com sucesso!' });
      setTimeout(() => router.back(), 1500);
    } catch (error: any) {
      console.error('Error creating patient:', error);
      showToast({ type: 'error', title: 'Erro', message: error?.message || 'Falha ao cadastrar paciente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Header */}
      <View className="bg-primary-700" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center px-4 py-3 relative">
          <TouchableOpacity onPress={() => router.back()} className="p-2 z-10">
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 top-0 bottom-0 justify-center items-center pointer-events-none">
            <Text className="text-lg font-semibold text-white">Novo Paciente</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Nome completo *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="Nome do paciente"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* CPF */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">CPF *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={(v) => setCpf(formatCPF(v))}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          {/* Sex */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Sexo *</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${sex === 'M' ? 'bg-primary-100 border-primary-700' : 'bg-white border-gray-300'
                  }`}
                onPress={() => setSex('M')}
              >
                <Text
                  className={`font-medium ${sex === 'M' ? 'text-primary-700' : 'text-gray-500'
                    }`}
                >
                  Masculino
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${sex === 'F' ? 'bg-primary-100 border-primary-700' : 'bg-white border-gray-300'
                  }`}
                onPress={() => setSex('F')}
              >
                <Text
                  className={`font-medium ${sex === 'F' ? 'text-primary-700' : 'text-gray-500'
                    }`}
                >
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Age */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Idade *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="Ex: 45"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Telefone</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="(00) 00000-0000"
              value={phone}
              onChangeText={(v) => setPhone(formatPhone(v))}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Surgery Type */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Procedimento *</Text>
            {loadingTypes ? (
              <ActivityIndicator size="small" color="#1B3A5C" />
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {surgeryTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className={`py-2 px-4 rounded-xl border ${surgeryTypeId === type.id
                      ? 'bg-primary-700 border-primary-700'
                      : 'bg-white border-gray-300'
                      }`}
                    onPress={() => handleSurgeryTypeChange(type.id)}
                  >
                    <Text
                      className={`font-medium ${surgeryTypeId === type.id ? 'text-white' : 'text-gray-600'
                        }`}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Follow-up Days */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Tempo de acompanhamento (dias) *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="Ex: 14"
              value={followUpDays}
              onChangeText={(v) => setFollowUpDays(v.replace(/\D/g, ''))}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text className="text-gray-400 text-xs mt-1">
              Preenchido automaticamente pelo procedimento. Altere se necessário.
            </Text>
          </View>

          {/* Surgery Date */}
          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-2">Data do Procedimento *</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 text-gray-800"
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
              placeholder="DD/MM/AAAA"
              value={surgeryDate}
              onChangeText={(v) => setSurgeryDate(formatDate(v))}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Submit */}
          <Button
            title={loading ? 'Cadastrando...' : 'Cadastrar Paciente'}
            onPress={handleSubmit}
            disabled={loading}
            className="bg-primary-700 mb-10"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
