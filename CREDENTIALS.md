# Credenciais de Teste - RecoveryTrack

## 👨‍⚕️ Médico

**CPF**: `12345678900`  
**Senha**: `password123`

---

## 👥 Pacientes

### 1. Test Setup User (sem cirurgia)
**Email**: `testuser_1771076992902@gmail.com`  
**Senha**: `password123`  
**Status**: Sem cirurgia registrada

### 2. Maria Silva Santos
**Email**: `maria.silva@test.com`  
**Senha**: `password123`  
**Cirurgia**: Colecistectomia Videolaparoscópica  
**Data**: 11/02/2026  
**Status**: Ativa

### 3. João Pereira
**Email**: `joao.pereira@test.com`  
**Senha**: `password123`  
**Cirurgia**: Colecistectomia Videolaparoscópica  
**Data**: 10/02/2026  
**Status**: Ativa

---

## 🔐 Notas

- Todos os emails estão confirmados
- Pacientes com email contendo "test" fazem login direto (bypass do OTP)
- O dashboard do paciente mostra dados reais do Supabase
- Paciente sem cirurgia vê mensagem informativa
