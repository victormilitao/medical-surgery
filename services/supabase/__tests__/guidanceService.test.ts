import { SupabaseGuidanceService } from '../guidanceService';

// Mock supabase
const mockFrom = jest.fn();
jest.mock('../../../lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

function createChainMock(finalData: unknown[], finalError: unknown = null) {
  const result = { data: finalData, error: finalError };
  const chain: Record<string, jest.Mock> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.order = jest.fn().mockReturnValue({ ...chain, then: undefined, ...result });

  // Make the chain thenable so await works
  const lastOrder = jest.fn().mockResolvedValue(result);
  // Override: second .order() call resolves
  let orderCallCount = 0;
  chain.order = jest.fn().mockImplementation(() => {
    orderCallCount++;
    // For signs query: has 2 .order() calls
    // For guidelines query: has 1 .order() call
    // Return chain for intermediate calls, resolve for the last
    return chain;
  });

  // Make the chain itself awaitable
  (chain as any).then = (resolve: (v: unknown) => void) => resolve(result);

  return chain;
}

describe('SupabaseGuidanceService', () => {
  let service: SupabaseGuidanceService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SupabaseGuidanceService();
  });

  describe('getSignsBySurgeryTypeId', () => {
    it('deve retornar sinais ordenados por categoria e display_order', async () => {
      const mockSigns = [
        { id: '1', surgery_type_id: 'st1', category: 'alert', description: 'Febre', display_order: 1 },
        { id: '2', surgery_type_id: 'st1', category: 'normal', description: 'Dor leve', display_order: 1 },
      ];

      const chain = createChainMock(mockSigns);
      mockFrom.mockReturnValue(chain);

      const result = await service.getSignsBySurgeryTypeId('st1');

      expect(mockFrom).toHaveBeenCalledWith('surgery_type_signs');
      expect(chain.eq).toHaveBeenCalledWith('surgery_type_id', 'st1');
      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('alert');
      expect(result[1].category).toBe('normal');
    });

    it('deve retornar array vazio quando não há sinais', async () => {
      const chain = createChainMock([]);
      mockFrom.mockReturnValue(chain);

      const result = await service.getSignsBySurgeryTypeId('st-empty');

      expect(result).toHaveLength(0);
    });

    it('deve lançar erro quando supabase retorna erro', async () => {
      const chain = createChainMock([], { message: 'DB error' });
      mockFrom.mockReturnValue(chain);

      await expect(service.getSignsBySurgeryTypeId('st1')).rejects.toEqual({ message: 'DB error' });
    });
  });

  describe('getPhaseGuidelinesBySurgeryTypeId', () => {
    it('deve retornar guidelines com items parseados como array', async () => {
      const mockGuidelines = [
        {
          id: '1',
          surgery_type_id: 'st1',
          phase_start_day: 0,
          phase_end_day: 3,
          phase_title: 'Fase 1',
          phase_subtitle: 'Adaptação',
          items: ['Item 1', 'Item 2'],
          highlight_text: 'Destaque',
          display_order: 1,
        },
      ];

      const chain = createChainMock(mockGuidelines);
      mockFrom.mockReturnValue(chain);

      const result = await service.getPhaseGuidelinesBySurgeryTypeId('st1');

      expect(mockFrom).toHaveBeenCalledWith('surgery_type_phase_guidelines');
      expect(result).toHaveLength(1);
      expect(result[0].items).toEqual(['Item 1', 'Item 2']);
      expect(result[0].phase_title).toBe('Fase 1');
    });

    it('deve retornar array vazio para items quando items não é array', async () => {
      const mockGuidelines = [
        {
          id: '1',
          surgery_type_id: 'st1',
          phase_start_day: 0,
          phase_end_day: 3,
          phase_title: 'Fase 1',
          phase_subtitle: null,
          items: 'not-an-array',
          highlight_text: null,
          display_order: 1,
        },
      ];

      const chain = createChainMock(mockGuidelines);
      mockFrom.mockReturnValue(chain);

      const result = await service.getPhaseGuidelinesBySurgeryTypeId('st1');

      expect(result[0].items).toEqual([]);
    });

    it('deve lançar erro quando supabase retorna erro', async () => {
      const chain = createChainMock([], { message: 'DB error' });
      mockFrom.mockReturnValue(chain);

      await expect(service.getPhaseGuidelinesBySurgeryTypeId('st1')).rejects.toEqual({ message: 'DB error' });
    });
  });
});
