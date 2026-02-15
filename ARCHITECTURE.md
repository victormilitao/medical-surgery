# Arquitetura de Backend - Camadas de Abstração

## 🎯 Princípio Fundamental

**NUNCA** importe `supabase` diretamente em hooks ou componentes. Sempre use a camada de serviços.

## 📐 Estrutura em Camadas

```
┌─────────────────────────────────────┐
│   Componentes / Telas               │  ← UI Layer
│   (app/, components/)               │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   React Query Hooks                 │  ← Data Fetching Layer
│   (hooks/)                          │  - usePatients
│                                     │  - useSurgeries
│   ✅ Usa: services                  │  - usePatientDashboard
│   ❌ NÃO usa: supabase diretamente  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Service Layer                     │  ← Business Logic Layer
│   (services/)                       │
│                                     │
│   - types.ts (interfaces)           │
│   - index.ts (exports ativos)       │
│   - supabase/ (implementação atual) │
│   - rest/ (implementação futura)    │
│                                     │
│   ✅ Implementa: IPatientService    │
│   ✅ Implementa: ISurgeryService    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   Backend (Supabase / REST API)     │  ← Data Source
└─────────────────────────────────────┘
```

## ✅ Exemplo CORRETO

### Hook (hooks/usePatients.ts)
```typescript
import { patientService } from '../services';

export const usePatientsByDoctor = (doctorId: string | undefined) => {
    return useQuery({
        queryKey: ['patients', 'doctor', doctorId],
        queryFn: () => {
            if (!doctorId) throw new Error('Doctor ID is required');
            return patientService.getPatientsByDoctorId(doctorId);
        },
        enabled: !!doctorId,
    });
};
```

### Serviço (services/supabase/patientService.ts)
```typescript
import { supabase } from '../../lib/supabase';
import { IPatientService } from '../types';

export class SupabasePatientService implements IPatientService {
    async getPatientsByDoctorId(doctorId: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('doctor_id', doctorId);
        
        if (error) throw error;
        return data;
    }
}
```

## ❌ Exemplo ERRADO

```typescript
// ❌ NUNCA faça isso em um hook!
import { supabase } from '../lib/supabase';

export const usePatients = (doctorId: string) => {
    return useQuery({
        queryFn: async () => {
            const { data } = await supabase  // ❌ Acesso direto!
                .from('patients')
                .select('*');
            return data;
        }
    });
};
```

## 🔄 Como Trocar de Backend

Para migrar de Supabase para REST API:

1. Implemente a interface em `services/rest/patientService.ts`:
```typescript
export class RestPatientService implements IPatientService {
    private baseUrl = process.env.EXPO_PUBLIC_API_URL;

    async getPatientsByDoctorId(doctorId: string) {
        const response = await fetch(`${this.baseUrl}/doctors/${doctorId}/patients`);
        return response.json();
    }
}
```

2. Atualize `services/index.ts`:
```typescript
// De:
export { patientService } from './supabase/patientService';

// Para:
export { patientService } from './rest/patientService';
```

3. **Pronto!** Nenhum hook ou componente precisa ser alterado! 🎉

## 📋 Checklist de Revisão

Ao criar um novo hook:

- [ ] O hook importa de `../services` e não de `../lib/supabase`?
- [ ] O hook usa métodos do serviço (ex: `patientService.getX()`)?
- [ ] O hook NÃO faz queries Supabase diretamente?
- [ ] O serviço implementa a interface definida em `services/types.ts`?
- [ ] A lógica de negócio está no serviço, não no hook?

## 🎯 Benefícios

✅ **Portabilidade**: Troca de backend sem reescrever hooks  
✅ **Testabilidade**: Fácil mockar serviços em testes  
✅ **Manutenibilidade**: Lógica centralizada nos serviços  
✅ **Type Safety**: Interfaces TypeScript garantem contratos  
✅ **Separação de Responsabilidades**: Cada camada tem seu papel
