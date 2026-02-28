import { Href, Stack, useRouter } from 'expo-router';
import { FileText, Lock, Stethoscope, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Colors } from '../constants/Colors';
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
        if (!cpf || !password) return;
        setIsLoading(true);
        try {
            // 1. Find email by CPF
            // Note: In a real app, this should be a secure RPC or Edge Function to avoid exposing emails.
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('cpf', cpf)
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
        <View className="flex-1 justify-center px-6 space-y-5 gap-10">
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                    <Stethoscope size={40} color={Colors.white} />
                </View>
                <Text className="text-2xl font-bold text-white text-center">
                    Pós-Operatório Digital
                </Text>
                <Text className="text-white/70 text-center mt-2">
                    Acompanhamento seguro para sua recuperação
                </Text>
            </View>

            <Button
                title="Sou Paciente"
                subtitle="Acompanhar minha recuperação"
                icon={<User size={22} color={Colors.primary.main} />}
                onPress={() => setRole('patient')}
                variant="light"
            />

            <Button
                title="Sou Médico"
                subtitle="Gerenciar meus pacientes"
                icon={<Stethoscope size={22} color={Colors.primary.main} />}
                onPress={() => setRole('doctor')}
                variant="light"
            />
        </View>
    );

    const renderPatientLogin = () => (
        <View className="flex-1 justify-center px-6">
            <Button
                title="Voltar"
                variant="ghost"
                className="self-start mb-6 pl-0"
                onPress={() => setRole('none')}
            />

            <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900">Acesso Paciente</Text>
                <Text className="text-gray-500 mt-2">
                    Digite seu CPF para acessar.
                </Text>
            </View>

            <View className="space-y-4">
                <View className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center px-4">
                    <FileText size={20} color={Colors.gray[400]} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="000.000.000-00"
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
                    className="mt-4"
                />
            </View>
        </View>
    );

    const renderDoctorLogin = () => (
        <View className="flex-1 justify-center px-6">
            <Button
                title="Voltar"
                variant="ghost"
                className="self-start mb-6 pl-0"
                onPress={() => setRole('none')}
            />

            <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900">Acesso Médico</Text>
                <Text className="text-gray-500 mt-2">
                    Entre com seu CPF e senha.
                </Text>
            </View>

            <View className="space-y-4">
                <View className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center px-4 mb-3">
                    <FileText size={20} color={Colors.gray[400]} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="CPF"
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                    />
                </View>

                <View className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center px-4">
                    <Lock size={20} color={Colors.gray[400]} />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="Senha"
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
                    className="mt-4"
                />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className={`flex-1 ${role === 'none' ? 'bg-primary-700' : 'bg-gray-50'}`}
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
