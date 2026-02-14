import { Stack, useRouter } from 'expo-router';
import { FileText, Lock, Mail, Stethoscope, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const { session, profile, isLoading: isAuthLoading } = useAuth();
    const [role, setRole] = useState<'none' | 'patient' | 'doctor'>('none');

    // Form states
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Auto-redirect if logged in
    useEffect(() => {
        if (!isAuthLoading && session && profile) {
            if (profile.role === 'doctor') {
                router.replace('/medico/dashboard');
            } else {
                router.replace('/paciente/dashboard');
            }
        }
    }, [session, profile, isAuthLoading]);

    const handlePatientLogin = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            // DEV: Allow password login for test users to bypass email rate limits
            if (email.includes('test')) {
                const { error: devLoginError } = await supabase.auth.signInWithPassword({
                    email,
                    password: 'password123'
                });
                if (!devLoginError) return; // Success, auto-redirect triggers
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true, // Allow signups
                    data: { role: 'patient' }
                }
            });

            if (error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Sucesso', 'Verifique seu e-mail para o código de acesso!');
                setRole('none');
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
        <View className="flex-1 justify-center px-6 space-y-5 gap-5">
            <View className="items-center mb-8">
                <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
                    <Stethoscope size={40} color="#2563eb" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 text-center">
                    Pós-Operatório Digital
                </Text>
                <Text className="text-gray-500 text-center mt-2">
                    Acompanhamento seguro para sua recuperação
                </Text>
            </View>

            <View>
                <Card className="active:opacity-80">
                    <Button
                        title="Sou Paciente"
                        variant="outline"
                        className="mb-0 border-0 bg-blue-50"
                        onPress={() => setRole('patient')}
                        // @ts-ignore
                        icon={<User size={24} color="#2563eb" className="mr-2" />}
                    />
                </Card>
            </View>

            <View>
                <Card>
                    <Button
                        title="Sou Médico"
                        variant="outline"
                        className="mb-0 border-0 bg-blue-50"
                        onPress={() => setRole('doctor')}
                        // @ts-ignore
                        icon={<Stethoscope size={24} color="#2563eb" className="mr-2" />}
                    />
                </Card>
            </View>
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
                    Digite seu e-mail para receber o código de acesso.
                </Text>
            </View>

            <View className="space-y-4">
                <View className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center px-4">
                    <Mail size={20} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="Seu e-mail cadastrado"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <Button
                    title="Enviar Código de Acesso"
                    onPress={handlePatientLogin}
                    isLoading={isLoading}
                    disabled={!email}
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
                    <FileText size={20} color="#9ca3af" />
                    <TextInput
                        className="flex-1 ml-3 text-base text-gray-900"
                        placeholder="CPF"
                        value={cpf}
                        onChangeText={setCpf}
                        keyboardType="numeric"
                    />
                </View>

                <View className="bg-white border border-gray-200 rounded-lg h-12 flex-row items-center px-4">
                    <Lock size={20} color="#9ca3af" />
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
            className="flex-1 bg-gray-50"
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
