import { fetchSdsById } from '../../api/sdsApi';

global.fetch = jest.fn();

// Mock the apiBase module to provide the base URL
jest.mock('../../api/apiBase', () => ({
  apiUrl: (path) => `http://localhost:5000${path}`
}));

describe('sdsApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchSdsById', () => {
    it('should fetch SDS data for a valid chemical ID', async () => {
      const mockSds = {
        id: 1,
        chemicalId: 'chem-123',
        productName: 'Benzene',
        manufacturer: 'Test Chemical Co',
        sections: {
          identification: {
            productName: 'Benzene',
            casNumber: '71-43-2'
          },
          hazards: {
            classification: 'Flammable liquid',
            signalWord: 'Danger'
          }
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSds
      });

      const result = await fetchSdsById('chem-123');

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/sds');
      expect(calledUrl).toContain('id=chem-123');
      expect(result).toEqual(mockSds);
    });

    it('should handle numeric chemical IDs', async () => {
      const mockSds = {
        id: 1,
        chemicalId: 42,
        productName: 'Toluene'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSds
      });

      const result = await fetchSdsById(42);

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('id=42');
      expect(result).toEqual(mockSds);
    });

    it('should handle string IDs with special characters', async () => {
      const mockSds = {
        id: 1,
        chemicalId: 'chem-123-abc',
        productName: 'Test Chemical'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSds
      });

      const result = await fetchSdsById('chem-123-abc');

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('id=chem-123-abc');
      expect(result).toEqual(mockSds);
    });

    it('should throw error when SDS not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'SDS not found'
      });

      await expect(fetchSdsById('nonexistent-id')).rejects.toThrow(
        'SDS not found'
      );
    });

    it('should throw error with status code when no text', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => ''
      });

      await expect(fetchSdsById('chem-123')).rejects.toThrow(
        'Request failed with status 500'
      );
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchSdsById('chem-123')).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(fetchSdsById('chem-123')).rejects.toThrow('Invalid JSON');
    });

    it('should construct correct URL with query parameter', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 })
      });

      await fetchSdsById('test-123');

      const calledUrl = fetch.mock.calls[0][0];
      expect(calledUrl).toContain('/api/sds');
      expect(calledUrl).toContain('?id=test-123');
    });

    it('should handle empty SDS response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      const result = await fetchSdsById('empty-123');
      expect(result).toEqual({});
    });

    it('should handle SDS with minimal data', async () => {
      const minimalSds = {
        id: 1,
        chemicalId: 'chem-123'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => minimalSds
      });

      const result = await fetchSdsById('chem-123');
      expect(result).toEqual(minimalSds);
    });

    it('should handle SDS with complete sections', async () => {
      const completeSds = {
        id: 1,
        chemicalId: 'chem-456',
        productName: 'Test Product',
        manufacturer: 'Test Corp',
        sections: {
          identification: { productName: 'Test', casNumber: '123-45-6' },
          hazards: { classification: 'Toxic', signalWord: 'Danger' },
          composition: { ingredients: [] },
          firstAid: { measures: 'Seek medical attention' },
          firefighting: { media: 'Water, foam' },
          accidentalRelease: { procedures: 'Contain spill' },
          handling: { precautions: 'Wear PPE' },
          exposureControls: { measures: 'Ventilation' },
          physicalProperties: { appearance: 'Clear liquid' },
          stability: { conditions: 'Stable' },
          toxicology: { effects: 'May cause irritation' },
          ecological: { effects: 'Harmful to aquatic life' },
          disposal: { methods: 'Incinerate' },
          transport: { classification: 'UN1234' },
          regulatory: { status: 'TSCA listed' },
          other: { notes: 'Additional info' }
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => completeSds
      });

      const result = await fetchSdsById('chem-456');
      expect(result).toEqual(completeSds);
      expect(result.sections).toBeDefined();
      expect(Object.keys(result.sections).length).toBeGreaterThan(0);
    });

    it('should handle unauthorized access', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized'
      });

      await expect(fetchSdsById('chem-123')).rejects.toThrow('Unauthorized');
    });

    it('should handle server errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: async () => 'Service temporarily unavailable'
      });

      await expect(fetchSdsById('chem-123')).rejects.toThrow(
        'Service temporarily unavailable'
      );
    });

    it('should handle null response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      });

      const result = await fetchSdsById('chem-123');
      expect(result).toBeNull();
    });

    it('should properly encode special characters in ID', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 })
      });

      await fetchSdsById('chem/123?special');

      const calledUrl = fetch.mock.calls[0][0];
      // URL should properly encode special characters
      expect(calledUrl).toContain('id=chem%2F123%3Fspecial');
    });

    it('should handle rate limit errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => 'Too many requests'
      });

      await expect(fetchSdsById('chem-123')).rejects.toThrow(
        'Too many requests'
      );
    });
  });
});