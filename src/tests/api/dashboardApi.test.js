import { fetchDashboardSummary, MOCK_DASHBOARD_SUMMARY } from '../../api/dashboardApi';

global.fetch = jest.fn();

// Mock window.location.origin for URL construction
delete global.window;
global.window = { location: { origin: 'http://localhost:5000' } };

describe('dashboardApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchDashboardSummary', () => {
    it('should fetch dashboard summary successfully', async () => {
      const mockSummary = {
        kpis: [
          {
            id: 'risk',
            title: 'Risk Assessments',
            value: '45',
            completed: 30,
            pending: 10,
            overdue: 5
          }
        ],
        medicalTestStats: [
          {
            id: 'blood',
            label: 'Blood Tests',
            value: '234',
            change: '+5%'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary
      });

      const result = await fetchDashboardSummary();

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/dashboard/summary');
      expect(result).toEqual(mockSummary);
    });

    it('should handle empty dashboard data', async () => {
      const emptyData = {
        kpis: [],
        medicalTestStats: []
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => emptyData
      });

      const result = await fetchDashboardSummary();
      expect(result).toEqual(emptyData);
    });

    it('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal server error'
      });

      await expect(fetchDashboardSummary()).rejects.toThrow(
        'Internal server error'
      );
    });

    it('should throw error with status code when no text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => ''
      });

      await expect(fetchDashboardSummary()).rejects.toThrow(
        'Request failed with status 503'
      );
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(fetchDashboardSummary()).rejects.toThrow(
        'Network failure'
      );
    });

    it('should handle malformed JSON response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(fetchDashboardSummary()).rejects.toThrow('Invalid JSON');
    });

    it('should handle response with null data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const result = await fetchDashboardSummary();
      expect(result).toBeNull();
    });

    it('should handle response with undefined fields', async () => {
      const partialData = {
        kpis: [{ id: 'test', title: 'Test' }]
        // medicalTestStats is missing
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => partialData
      });

      const result = await fetchDashboardSummary();
      expect(result).toEqual(partialData);
      expect(result.kpis).toBeDefined();
      expect(result.medicalTestStats).toBeUndefined();
    });
  });

  describe('MOCK_DASHBOARD_SUMMARY', () => {
    it('should exist and be defined', () => {
      expect(MOCK_DASHBOARD_SUMMARY).toBeDefined();
      expect(MOCK_DASHBOARD_SUMMARY).not.toBeNull();
    });

    it('should have correct structure for KPIs', () => {
      expect(MOCK_DASHBOARD_SUMMARY.kpis).toBeDefined();
      expect(Array.isArray(MOCK_DASHBOARD_SUMMARY.kpis)).toBe(true);
      expect(MOCK_DASHBOARD_SUMMARY.kpis.length).toBeGreaterThan(0);

      const firstKpi = MOCK_DASHBOARD_SUMMARY.kpis[0];
      expect(firstKpi).toHaveProperty('id');
      expect(firstKpi).toHaveProperty('title');
      expect(firstKpi).toHaveProperty('value');
      expect(firstKpi).toHaveProperty('completed');
      expect(firstKpi).toHaveProperty('pending');
      expect(firstKpi).toHaveProperty('overdue');
      expect(firstKpi).toHaveProperty('trendDirection');
      expect(firstKpi).toHaveProperty('trendLabel');
    });

    it('should have correct structure for medical test stats', () => {
      expect(MOCK_DASHBOARD_SUMMARY.medicalTestStats).toBeDefined();
      expect(Array.isArray(MOCK_DASHBOARD_SUMMARY.medicalTestStats)).toBe(true);
      expect(MOCK_DASHBOARD_SUMMARY.medicalTestStats.length).toBeGreaterThan(0);

      const firstStat = MOCK_DASHBOARD_SUMMARY.medicalTestStats[0];
      expect(firstStat).toHaveProperty('id');
      expect(firstStat).toHaveProperty('label');
      expect(firstStat).toHaveProperty('value');
      expect(firstStat).toHaveProperty('change');
    });

    it('should have 4 KPIs', () => {
      expect(MOCK_DASHBOARD_SUMMARY.kpis).toHaveLength(4);
    });

    it('should have 6 medical test stats', () => {
      expect(MOCK_DASHBOARD_SUMMARY.medicalTestStats).toHaveLength(6);
    });

    it('should have valid trend directions', () => {
      MOCK_DASHBOARD_SUMMARY.kpis.forEach(kpi => {
        expect(['up', 'down']).toContain(kpi.trendDirection);
      });
    });

    it('should have numeric values for counts', () => {
      MOCK_DASHBOARD_SUMMARY.kpis.forEach(kpi => {
        expect(typeof kpi.completed).toBe('number');
        expect(typeof kpi.pending).toBe('number');
        expect(typeof kpi.overdue).toBe('number');
        expect(kpi.completed).toBeGreaterThanOrEqual(0);
        expect(kpi.pending).toBeGreaterThanOrEqual(0);
        expect(kpi.overdue).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have string values for display', () => {
      MOCK_DASHBOARD_SUMMARY.kpis.forEach(kpi => {
        expect(typeof kpi.id).toBe('string');
        expect(typeof kpi.title).toBe('string');
        expect(typeof kpi.value).toBe('string');
        expect(typeof kpi.trendLabel).toBe('string');
      });
    });

    it('should have unique KPI ids', () => {
      const ids = MOCK_DASHBOARD_SUMMARY.kpis.map(kpi => kpi.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have unique medical test stat ids', () => {
      const ids = MOCK_DASHBOARD_SUMMARY.medicalTestStats.map(stat => stat.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid change format in medical test stats', () => {
      MOCK_DASHBOARD_SUMMARY.medicalTestStats.forEach(stat => {
        expect(typeof stat.change).toBe('string');
        // Change should contain +, -, or be a percentage/number format
        expect(stat.change.length).toBeGreaterThan(0);
      });
    });
  });
});

