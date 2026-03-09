import { LinearGradient } from 'expo-linear-gradient';
import { Href, Stack, useRouter } from 'expo-router';
import { FileText, Lock, Stethoscope, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { AppColors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';



export default function LoginScreen() {
  const router = useRouter();
  const { session, profile, isLoading: isAuthLoading } = useAuth();
  const [role, setRole] = useState<'none' | 'patient' | 'doctor'>('none');

  // Form states
  const [patientCpf, setPatientCpf] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if logged in
  useEffect(() => {
    if (!isAuthLoading && session && profile) {
      if (profile.role === 'doctor') {
        router.replace('/doctor/dashboard' as Href);
      } else {
        router.replace('/patient/dashboard');
      }
    }
  }, [session, profile, isAuthLoading]);

  const formatCPF = (value: string): string => {
    const digits: string = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handlePatientLogin = async () => {
    const cleanCpf: string = patientCpf.replace(/\D/g, '');
    if (!cleanCpf || cleanCpf.length !== 11) {
      Alert.alert('Erro', 'CPF inválido. Deve ter 11 dígitos.');
      return;
    }
    setIsLoading(true);
    try {
      // Find email by CPF
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('cpf', cleanCpf)
        .single();

      if (profileError || !profileData?.email) {
        Alert.alert('Erro', 'CPF não encontrado. Verifique com seu médico.');
        setIsLoading(false);
        return;
      }

      // Sign in with the email associated with the CPF
      const { error: devLoginError } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password: 'Password123!'
      });

      if (devLoginError) {
        Alert.alert('Erro', devLoginError.message);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorLogin = async () => {
    const cleanCpf: string = cpf.replace(/\D/g, '');
    if (!cleanCpf || !password) return;
    setIsLoading(true);
    try {
      // 1. Find email by CPF
      // Note: In a real app, this should be a secure RPC or Edge Function to avoid exposing emails.
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('cpf', cleanCpf)
        .single();

      if (profileError || !profiles?.email) {
        Alert.alert('Erro', 'CPF não encontrado ou incorreto.');
        setIsLoading(false);
        return;
      }

      // 2. Sign in with Email/Password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: profiles.email,
        password
      });

      if (authError) {
        Alert.alert('Erro', 'Senha incorreta.');
      }
      // Auto-redirect handles the rest
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar fazer login.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <LinearGradient
      colors={[AppColors.primary[900], AppColors.primary[800], AppColors.primary[700]]}
      style={styles.gradientContainer}
    >
      <View className="flex-1 justify-center items-center px-6 gap-10">
        {/* Logo */}
        <View className="items-center mb-8">
          <View style={styles.iconContainer}>
            <Stethoscope size={64} color="#FFFFFF" strokeWidth={1.5} />
          </View>
          <Text style={styles.titleText}>
            Pós-Operatório Digital
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full gap-4">
          <Button
            title="Sou Paciente"
            subtitle="Acompanhar minha recuperação"
            icon={<User size={22} color={AppColors.primary[700]} />}
            onPress={() => setRole('patient')}
            variant="light"
          />

          <Button
            title="Sou Médico"
            subtitle="Gerenciar meus pacientes"
            icon={<Stethoscope size={22} color={AppColors.primary[700]} />}
            onPress={() => setRole('doctor')}
            variant="light"
          />
        </View>
      </View>
    </LinearGradient>
  );

  const renderPatientLogin = () => (
    <LinearGradient
      colors={[AppColors.primary[900], AppColors.primary[800], AppColors.primary[700]]}
      style={styles.gradientContainer}
    >
      <View className="flex-1 justify-center px-6">
        <Button
          title="Voltar"
          variant="ghost"
          className="self-start mb-6 pl-0"
          textClassName="text-white"
          onPress={() => setRole('none')}
        />

        <View className="mb-8">
          <Text style={{ color: AppColors.white, fontSize: 24, fontWeight: 'bold' }}>Acesso Paciente</Text>
          <Text style={{ color: `${AppColors.white}99`, marginTop: 8 }}>
            Digite seu CPF para acessar.
          </Text>
        </View>

        <View className="space-y-4">
          <View style={styles.inputContainer}>
            <FileText size={20} color={AppColors.gray[400]} />
            <TextInput
              className="flex-1 ml-3"
              style={{ color: AppColors.white, fontSize: 16, paddingVertical: 0, height: '100%', textAlignVertical: 'center' }}
              placeholder="CPF"
              placeholderTextColor={AppColors.gray[400]}
              value={patientCpf}
              onChangeText={(v) => setPatientCpf(formatCPF(v))}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <Button
            title="Entrar"
            onPress={handlePatientLogin}
            isLoading={isLoading}
            disabled={patientCpf.replace(/\D/g, '').length !== 11}
            variant="light"
            className="mt-4"
          />
        </View>
      </View>
    </LinearGradient>
  );

  const renderDoctorLogin = () => (
    <LinearGradient
      colors={[AppColors.primary[900], AppColors.primary[800], AppColors.primary[700]]}
      style={styles.gradientContainer}
    >
      <View className="flex-1 justify-center px-6">
        <Button
          title="Voltar"
          variant="ghost"
          className="self-start mb-6 pl-0"
          textClassName="text-white"
          onPress={() => setRole('none')}
        />

        <View className="mb-8">
          <Text style={{ color: AppColors.white, fontSize: 24, fontWeight: 'bold' }}>Acesso Médico</Text>
          <Text style={{ color: `${AppColors.white}99`, marginTop: 8 }}>
            Entre com seu CPF e senha.
          </Text>
        </View>

        <View className="space-y-4">
          <View style={[styles.inputContainer, { marginBottom: 12 }]}>
            <FileText size={20} color={AppColors.gray[400]} />
            <TextInput
              className="flex-1 ml-3"
              style={{ color: AppColors.white, fontSize: 16, paddingVertical: 0, height: '100%', textAlignVertical: 'center' }}
              placeholder="CPF"
              placeholderTextColor={AppColors.gray[400]}
              value={cpf}
              onChangeText={(v) => setCpf(formatCPF(v))}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={AppColors.gray[400]} />
            <TextInput
              className="flex-1 ml-3"
              style={{ color: AppColors.white, fontSize: 16, paddingVertical: 0, height: '100%', textAlignVertical: 'center' }}
              placeholder="Senha"
              placeholderTextColor={AppColors.gray[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title="Entrar"
            onPress={handleDoctorLogin}
            isLoading={isLoading}
            disabled={!cpf || !password}
            variant="light"
            className="mt-4"
          />
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {role === 'none' && renderRoleSelection()}
        {role === 'patient' && renderPatientLogin()}
        {role === 'doctor' && renderDoctorLogin()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: `${AppColors.white}33`,

    backgroundColor: `${AppColors.white}14`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '600',
    color: AppColors.white,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: `${AppColors.white}14`,
    borderWidth: 1,
    borderColor: `${AppColors.white}33`,
    borderRadius: 8,
    height: 48,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
  },
});
