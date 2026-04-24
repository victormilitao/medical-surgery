import { renderHook, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockGetSurgeriesByDoctorId = jest.fn();
const mockGetSurgeryById = jest.fn();
const mockCreateSurgery = jest.fn();
const mockFinalizeSurgeriesPastRecovery = jest.fn();
const mockDismissPendingReturn = jest.fn();

jest.mock('../../services', () => ({
  surgeryService: {
    getSurgeriesByDoctorId: (...args: any[]) => mockGetSurgeriesByDoctorId(...args),
    getSurgeryById: (...args: any[]) => mockGetSurgeryById(...args),
    createSurgery: (...args: any[]) => mockCreateSurgery(...args),
    finalizeSurgeriesPastRecovery: (...args: any[]) => mockFinalizeSurgeriesPastRecovery(...args),
    dismissPendingReturn: (...args: any[]) => mockDismissPendingReturn(...args),
  },
}));

import { useSurgeriesByDoctor, useSurgery, useCreateSurgery, useAutoFinalizeSurgeries, useDismissPendingReturn } from '../useSurgeries';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useSurgeries hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSurgeriesByDoctor', () => {
    it('deve estar desabilitado sem doctorId', () => {
      const { result } = renderHook(() => useSurgeriesByDoctor(undefined), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('deve buscar cirurgias com doctorId', async () => {
      const mockSurgeries = [{ id: 's1' }];
      mockGetSurgeriesByDoctorId.mockResolvedValue(mockSurgeries);

      const { result } = renderHook(() => useSurgeriesByDoctor('d1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSurgeries);
    });
  });

  describe('useSurgery', () => {
    it('deve estar desabilitado sem surgeryId', () => {
      const { result } = renderHook(() => useSurgery(undefined), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchStatus).toBe('idle');
    });

    it('deve buscar cirurgia com surgeryId', async () => {
      const mockSurgery = { id: 's1' };
      mockGetSurgeryById.mockResolvedValue(mockSurgery);

      const { result } = renderHook(() => useSurgery('s1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSurgery);
    });
  });

  describe('useCreateSurgery', () => {
    it('deve chamar mutationFn ao fazer mutate', async () => {
      const newSurgery = { id: 's-new' };
      mockCreateSurgery.mockResolvedValue(newSurgery);

      const { result } = renderHook(() => useCreateSurgery(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate({
          doctorId: 'd1',
          patientId: 'p1',
          surgeryTypeId: 'st1',
          surgeryDate: '2026-03-20',
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockCreateSurgery).toHaveBeenCalled();
    });
  });

  describe('useAutoFinalizeSurgeries', () => {
    it('não deve chamar finalize sem doctorId', () => {
      renderHook(() => useAutoFinalizeSurgeries(undefined), {
        wrapper: createWrapper(),
      });

      expect(mockFinalizeSurgeriesPastRecovery).not.toHaveBeenCalled();
    });

    it('deve chamar finalize com doctorId', async () => {
      mockFinalizeSurgeriesPastRecovery.mockResolvedValue(2);

      renderHook(() => useAutoFinalizeSurgeries('d1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockFinalizeSurgeriesPastRecovery).toHaveBeenCalledWith('d1');
      });
    });
  });

  describe('useDismissPendingReturn', () => {
    it('deve chamar dismissPendingReturn ao fazer mutate', async () => {
      mockDismissPendingReturn.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDismissPendingReturn(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('s1');
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockDismissPendingReturn).toHaveBeenCalledWith('s1');
    });

    it('deve tratar erro ao falhar', async () => {
      mockDismissPendingReturn.mockRejectedValue(new Error('fail'));

      const { result } = renderHook(() => useDismissPendingReturn(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate('s1');
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('fail');
    });
  });
});

