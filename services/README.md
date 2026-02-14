# Arquitetura de Serviços

Este projeto usa uma arquitetura em camadas para isolar o acesso a dados:

## Estrutura

```
services/
├── types.ts                    # Interfaces e tipos compartilhados
├── index.ts                    # Exporta a implementação ativa
├── supabase/
│   └── patientService.ts      # Implementação Supabase (atual)
└── rest/
    └── patientService.ts      # Template para API REST (futuro)
```

## Como Usar

### No componente:
```tsx
import { usePatientsByDoctor } from '../../hooks/usePatients';

const { data, isLoading } = usePatientsByDoctor(doctorId);
```

### Para trocar de Supabase para REST API:

1. Implemente a interface `IPatientService` em `services/rest/patientService.ts`
2. Atualize `services/index.ts`:
   ```ts
   // Troque de:
   export { patientService } from './supabase/patientService';
   
   // Para:
   export { patientService } from './rest/patientService';
   ```

Pronto! Todos os componentes continuarão funcionando sem modificação.

## Benefícios

- ✅ Separação de responsabilidades
- ✅ Fácil troca de backend
- ✅ Testabilidade
- ✅ Type-safety com TypeScript
- ✅ Cache e otimizações com React Query
