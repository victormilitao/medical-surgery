import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSignsBySurgeryType, usePhaseGuidelines } from '../useGuidance';

// Mock the service
jest.mock('../../services', () => ({
  guidanceService: {
    getSignsBySurgeryTypeId: jest.fn(),
    getPhaseGuidelinesBySurgeryTypeId: jest.fn(),
  },
}));

const { guidanceService } = require('../../services');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useGuidance hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useSignsBySurgeryType', () => {
    it('deve retornar sinais quando surgeryTypeId é fornecido', async () => {
      const mockSigns = [
        { id: '1', surgery_type_id: 'st1', category: 'alert', description: 'Febre', display_order: 1 },
      ];
      guidanceService.getSignsBySurgeryTypeId.mockResolvedValue(mockSigns);

      const { result } = renderHook(() => useSignsBySurgeryType('st1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSigns);
      expect(guidanceService.getSignsBySurgeryTypeId).toHaveBeenCalledWith('st1');
    });

    it('não deve executar query quando surgeryTypeId é undefined', () => {
      const { result } = renderHook(() => useSignsBySurgeryType(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(guidanceService.getSignsBySurgeryTypeId).not.toHaveBeenCalled();
    });

    it('não deve executar query quando surgeryTypeId é null', () => {
      const { result } = renderHook(() => useSignsBySurgeryType(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(guidanceService.getSignsBySurgeryTypeId).not.toHaveBeenCalled();
    });
  });

  describe('usePhaseGuidelines', () => {
    it('deve retornar guidelines quando surgeryTypeId é fornecido', async () => {
      const mockGuidelines = [
        {
          id: '1',
          surgery_type_id: 'st1',
          phase_start_day: 0,
          phase_end_day: 3,
          phase_title: 'Fase 1',
          phase_subtitle: null,
          items: ['Item 1'],
          highlight_text: null,
          display_order: 1,
        },
      ];
      guidanceService.getPhaseGuidelinesBySurgeryTypeId.mockResolvedValue(mockGuidelines);

      const { result } = renderHook(() => usePhaseGuidelines('st1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockGuidelines);
      expect(guidanceService.getPhaseGuidelinesBySurgeryTypeId).toHaveBeenCalledWith('st1');
    });

    it('não deve executar query quando surgeryTypeId é undefined', () => {
      const { result } = renderHook(() => usePhaseGuidelines(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
      expect(guidanceService.getPhaseGuidelinesBySurgeryTypeId).not.toHaveBeenCalled();
    });
  });
});
