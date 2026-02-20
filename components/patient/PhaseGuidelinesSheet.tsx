import { X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, ScrollView, Text, View } from 'react-native';

interface PhaseGuidelinesSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Phase = '0-3' | '4-7' | '8-14';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.87;

export function PhaseGuidelinesSheet({ visible, onClose }: PhaseGuidelinesSheetProps) {
  const [activePhase, setActivePhase] = useState<Phase>('0-3');
  const [mounted, setMounted] = useState(false);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  const phases: { id: Phase; label: string }[] = [
    { id: '0-3', label: 'Dias 0-3' },
    { id: '4-7', label: 'Dias 4-7' },
    { id: '8-14', label: 'Dias 8-14' },
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: backdropOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: SHEET_HEIGHT,
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 8,
          paddingBottom: 32,
          transform: [{ translateY }],
        }}
      >
        {/* Header Handle */}
        <View className="items-center mb-4">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>

        {/* Header Content */}
        <View className="flex-row justify-between items-start px-6 mb-6">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Orientações por Fase
            </Text>
            <Text className="text-base text-gray-500">
              O que esperar em cada período
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            className="p-2 -mr-2 -mt-2 bg-gray-100 rounded-full"
          >
            <X size={20} color="#6b7280" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View className="px-6 mb-6">
          <View className="flex-row bg-gray-100 p-1 rounded-2xl">
            {phases.map((phase) => (
              <Pressable
                key={phase.id}
                onPress={() => setActivePhase(phase.id)}
                style={[
                  { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
                  activePhase === phase.id ? { backgroundColor: 'white' } : {},
                ]}
              >
                <Text
                  style={[
                    { fontWeight: '600' },
                    activePhase === phase.id ? { color: '#111827' } : { color: '#6b7280' },
                  ]}
                >
                  {phase.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <View style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 24, padding: 24, overflow: 'hidden' }}>
              {/* Left Accent Border */}
              <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: '#2563eb', borderTopLeftRadius: 24, borderBottomLeftRadius: 24 }} />

              {activePhase === '0-3' && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 pl-2">
                    Dias 0 a 3 – Adaptação Inicial
                  </Text>
                  <Text className="text-lg italic text-gray-700 mb-8 pl-2">
                    &quot;Seu corpo está se ajustando à cirurgia.&quot;
                  </Text>
                  <View className="pl-2 mb-8">
                    {[
                      'Descanse, mas não fique o tempo todo deitado.',
                      'Caminhe pequenas distâncias várias vezes ao dia.',
                      'Dor nos ombros pode ocorrer (gás da cirurgia).',
                      'Náuseas leves podem acontecer.',
                    ].map((item) => (
                      <View key={item} className="flex-row items-start mb-3">
                        <Text className="text-gray-400 mr-3 text-lg mt-0.5">•</Text>
                        <Text className="flex-1 text-gray-800 text-base leading-relaxed">{item}</Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex-row items-start mt-4 bg-blue-50 p-4 rounded-xl">
                    <Text className="text-xl mr-2">👉</Text>
                    <Text className="flex-1 text-gray-800 text-base leading-relaxed">
                      O mais importante agora é{' '}
                      <Text className="font-bold underline">descanso</Text> ativo e{' '}
                      <Text className="font-bold underline">observação.</Text>
                    </Text>
                  </View>
                </View>
              )}

              {activePhase === '4-7' && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 pl-2">
                    Dias 4 a 7 – Recuperação Progressiva
                  </Text>
                  <Text className="text-lg italic text-gray-700 mb-8 pl-2">
                    &quot;A cada dia, você deve se sentir um pouco melhor.&quot;
                  </Text>
                  <View className="pl-2 mb-8">
                    {[
                      'A dor tende a diminuir.',
                      'A alimentação fica mais fácil.',
                      'A mobilidade melhora.',
                    ].map((item) => (
                      <View key={item} className="flex-row items-start mb-3">
                        <Text className="text-gray-400 mr-3 text-lg mt-0.5">•</Text>
                        <Text className="flex-1 text-gray-800 text-base leading-relaxed">{item}</Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex-row items-start mt-4 bg-orange-50 p-4 rounded-xl">
                    <Text className="text-xl mr-2">👉</Text>
                    <Text className="flex-1 text-gray-800 text-base leading-relaxed">
                      Se algo estiver piorando, não ignore — avise pelo aplicativo.
                    </Text>
                  </View>
                </View>
              )}

              {activePhase === '8-14' && (
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-6 pl-2">
                    Dias 8 a 14 – Consolidação da Recuperação
                  </Text>
                  <Text className="text-lg italic text-gray-700 mb-8 pl-2">
                    &quot;Você está entrando na fase final da recuperação inicial.&quot;
                  </Text>
                  <View className="pl-2 mb-8">
                    {[
                      'Retorno gradual às atividades habituais.',
                      'Menor necessidade de analgésicos.',
                      'Feridas em processo de cicatrização.',
                    ].map((item) => (
                      <View key={item} className="flex-row items-start mb-3">
                        <Text className="text-gray-400 mr-3 text-lg mt-0.5">•</Text>
                        <Text className="flex-1 text-gray-800 text-base leading-relaxed">{item}</Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex-row items-start bg-green-50 p-4 rounded-xl mb-4">
                    <Text className="text-xl mr-2">👉</Text>
                    <Text className="flex-1 text-gray-800 text-base leading-relaxed">
                      Este período prepara você para o retorno presencial.
                    </Text>
                  </View>
                  <View className="flex-row items-start bg-blue-50 p-4 rounded-xl">
                    <Text className="flex-1 text-blue-900 font-bold text-base leading-relaxed uppercase tracking-wider">
                      &gt;&gt; Anote suas dúvidas para tirá-las no retorno ao seu médico
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
