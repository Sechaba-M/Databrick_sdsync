import {
  fetchChemicalSurveillance,
  fetchBusinessUnitSurveillance,
  MOCK_CHEM_SURV,
  MOCK_BUSINESS_SURV
} from '../../api/medicalSurvApi';

global.fetch = jest.fn();

describe('medicalSurvApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchChemicalSurveillance', () => {
    it('should fetch chemical surveillance data successfully', async () => {
      const mockData = [
        {
          chemical: 'Benzene',
          cas: '71-43-2',
          risk: 'High Risk',
          monitoringType: 'Biological',
          exams: ['Complete blood count'],
          frequency: 'Every 6 months'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await fetchChemicalSurveillance();

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/surveillance/chemicals');
      expect(result).toEqual(mockData);
    });

    it('should handle empty surveillance data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const result = await fetchChemicalSurveillance();
      expect(result).toEqual([]);
    });

    it('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Unable to fetch surveillance data'
      });

      await expect(fetchChemicalSurveillance()).rejects.toThrow(
        'Unable to fetch surveillance data'
      );
    });

    it('should throw default error when no text provided', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => ''
      });

      await expect(fetchChemicalSurveillance()).rejects.toThrow(
        'API request failed'
      );
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(fetchChemicalSurveillance()).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should handle malformed JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token');
        }
      });

      await expect(fetchChemicalSurveillance()).rejects.toThrow(
        'Unexpected token'
      );
    });

    it('should handle null response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const result = await fetchChemicalSurveillance();
      expect(result).toBeNull();
    });
  });

  describe('fetchBusinessUnitSurveillance', () => {
    it('should fetch business unit surveillance data successfully', async () => {
      const mockData = [
        {
          unit: 'Manufacturing',
          employees: 25,
          monitoring: 'Biological / Air Monitoring',
          exams: ['Complete physical exam', 'Chest X-ray'],
          frequency: 'Quarterly'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await fetchBusinessUnitSurveillance();

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/surveillance/business-units');
      expect(result).toEqual(mockData);
    });

    it('should handle empty business unit data', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const result = await fetchBusinessUnitSurveillance();
      expect(result).toEqual([]);
    });

    it('should throw error on failed request', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => 'Service unavailable'
      });

      await expect(fetchBusinessUnitSurveillance()).rejects.toThrow(
        'Service unavailable'
      );
    });

    it('should throw default error message when no text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        text: async () => ''
      });

      await expect(fetchBusinessUnitSurveillance()).rejects.toThrow(
        'API request failed'
      );
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(fetchBusinessUnitSurveillance()).rejects.toThrow(
        'Connection refused'
      );
    });

    it('should handle null response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const result = await fetchBusinessUnitSurveillance();
      expect(result).toBeNull();
    });
  });

  describe('MOCK_CHEM_SURV', () => {
    it('should exist and be an array', () => {
      expect(MOCK_CHEM_SURV).toBeDefined();
      expect(Array.isArray(MOCK_CHEM_SURV)).toBe(true);
      expect(MOCK_CHEM_SURV.length).toBeGreaterThan(0);
    });

    it('should have correct structure', () => {
      const firstItem = MOCK_CHEM_SURV[0];
      expect(firstItem).toHaveProperty('chemical');
      expect(firstItem).toHaveProperty('cas');
      expect(firstItem).toHaveProperty('info');
      expect(firstItem).toHaveProperty('risk');
      expect(firstItem).toHaveProperty('monitoringType');
      expect(firstItem).toHaveProperty('units');
      expect(firstItem).toHaveProperty('category');
      expect(firstItem).toHaveProperty('exams');
      expect(firstItem).toHaveProperty('bioTests');
      expect(firstItem).toHaveProperty('frequency');
      expect(firstItem).toHaveProperty('limits');
    });

    it('should have valid arrays for multi-value fields', () => {
      MOCK_CHEM_SURV.forEach(item => {
        expect(Array.isArray(item.units)).toBe(true);
        expect(Array.isArray(item.exams)).toBe(true);
        expect(Array.isArray(item.bioTests)).toBe(true);
        expect(Array.isArray(item.limits)).toBe(true);
      });
    });

    it('should have valid CAS numbers', () => {
      MOCK_CHEM_SURV.forEach(item => {
        expect(item.cas).toMatch(/^\d+-\d+-\d+$/);
      });
    });

    it('should have valid risk levels', () => {
      const validRisks = ['High Risk', 'Medium Risk', 'Low Risk'];
      MOCK_CHEM_SURV.forEach(item => {
        expect(validRisks).toContain(item.risk);
      });
    });

    it('should have string values for required fields', () => {
      MOCK_CHEM_SURV.forEach(item => {
        expect(typeof item.chemical).toBe('string');
        expect(typeof item.cas).toBe('string');
        expect(typeof item.risk).toBe('string');
        expect(typeof item.monitoringType).toBe('string');
        expect(typeof item.frequency).toBe('string');
      });
    });

    it('should have non-empty exam arrays', () => {
      MOCK_CHEM_SURV.forEach(item => {
        expect(item.exams.length).toBeGreaterThan(0);
      });
    });
  });

  describe('MOCK_BUSINESS_SURV', () => {
    it('should exist and be an array', () => {
      expect(MOCK_BUSINESS_SURV).toBeDefined();
      expect(Array.isArray(MOCK_BUSINESS_SURV)).toBe(true);
      expect(MOCK_BUSINESS_SURV.length).toBeGreaterThan(0);
    });

    it('should have correct structure', () => {
      const firstItem = MOCK_BUSINESS_SURV[0];
      expect(firstItem).toHaveProperty('unit');
      expect(firstItem).toHaveProperty('employees');
      expect(firstItem).toHaveProperty('monitoring');
      expect(firstItem).toHaveProperty('biomonitoring');
      expect(firstItem).toHaveProperty('category');
      expect(firstItem).toHaveProperty('exams');
      expect(firstItem).toHaveProperty('tests');
      expect(firstItem).toHaveProperty('frequency');
      expect(firstItem).toHaveProperty('limits');
    });

    it('should have valid employee counts', () => {
      MOCK_BUSINESS_SURV.forEach(item => {
        expect(typeof item.employees).toBe('number');
        expect(item.employees).toBeGreaterThan(0);
      });
    });

    it('should have valid arrays for multi-value fields', () => {
      MOCK_BUSINESS_SURV.forEach(item => {
        expect(Array.isArray(item.exams)).toBe(true);
        expect(Array.isArray(item.tests)).toBe(true);
        expect(Array.isArray(item.limits)).toBe(true);
        expect(item.exams.length).toBeGreaterThan(0);
      });
    });

    it('should have valid biomonitoring flags', () => {
      MOCK_BUSINESS_SURV.forEach(item => {
        expect(['Yes', 'No']).toContain(item.biomonitoring);
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['Legislative', 'Internal', 'Voluntary'];
      MOCK_BUSINESS_SURV.forEach(item => {
        expect(validCategories).toContain(item.category);
      });
    });

    it('should have string values for required fields', () => {
      MOCK_BUSINESS_SURV.forEach(item => {
        expect(typeof item.unit).toBe('string');
        expect(typeof item.monitoring).toBe('string');
        expect(typeof item.frequency).toBe('string');
      });
    });

    it('should have unique unit names', () => {
      const units = MOCK_BUSINESS_SURV.map(item => item.unit);
      const uniqueUnits = new Set(units);
      expect(uniqueUnits.size).toBe(units.length);
    });
  });
});