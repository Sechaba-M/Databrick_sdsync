import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChemicalSurvTable from '../../components/MedicalData/ChemicalSurvTable';

describe('ChemicalSurvTable', () => {
  const mockData = [
    {
      chemical: 'Benzene',
      cas: '71-43-2',
      info: 'Carcinogenic compound',
      risk: 'High Risk',
      monitoringType: 'Biological',
      units: ['Manufacturing', 'Lab'],
      category: 'Legislative',
      exams: ['Physical Exam', 'Chest X-ray'],
      bioTests: ['CBC', 'Liver Function'],
      frequency: 'Quarterly',
      limits: ['TWA: 1 ppm', 'STEL: 5 ppm']
    },
    {
      chemical: 'Toluene',
      cas: '108-88-3',
      info: 'Solvent',
      risk: 'Moderate Risk',
      monitoringType: 'Air Monitoring',
      units: ['Warehouse'],
      category: 'Best Practice',
      exams: ['Basic Physical'],
      bioTests: ['Hippuric Acid'],
      frequency: 'Annually',
      limits: ['TWA: 50 ppm']
    }
  ];

  describe('Desktop/Tablet View', () => {
    test('renders table with correct headers', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      // Headers appear in both desktop and mobile views, use getAllByText
      expect(screen.getAllByText('Chemical Information')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Risk Assessment')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Monitoring Type')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Business Units')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Surveillance Category')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Physical Examinations')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Biological Tests')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Frequency')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Regulatory Limits')[0]).toBeInTheDocument();
    });

    test('renders chemical name and CAS number', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Benzene')[0]).toBeInTheDocument();
      expect(screen.getAllByText('CAS: 71-43-2')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Toluene')[0]).toBeInTheDocument();
      expect(screen.getAllByText('CAS: 108-88-3')[0]).toBeInTheDocument();
    });

    test('displays chemical information', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Carcinogenic compound')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Solvent')[0]).toBeInTheDocument();
    });

    test('applies correct styling for High Risk', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const highRiskBadges = screen.getAllByText('High Risk');
      expect(highRiskBadges[0]).toHaveClass('bg-red-50', 'text-red-600');
    });

    test('applies correct styling for Moderate Risk', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const moderateRiskBadges = screen.getAllByText('Moderate Risk');
      expect(moderateRiskBadges[0]).toHaveClass('bg-yellow-50', 'text-yellow-700');
    });

    test('displays monitoring types', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Biological')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Air Monitoring')[0]).toBeInTheDocument();
    });

    test('renders business units as badges', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const manufacturingBadges = screen.getAllByText('Manufacturing');
      const labBadges = screen.getAllByText('Lab');
      const warehouseBadges = screen.getAllByText('Warehouse');
      
      expect(manufacturingBadges.length).toBeGreaterThan(0);
      expect(labBadges.length).toBeGreaterThan(0);
      expect(warehouseBadges.length).toBeGreaterThan(0);
    });

    test('applies correct styling for Legislative category', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const legislativeBadge = screen.getAllByText('Legislative')[0];
      expect(legislativeBadge).toHaveClass('bg-red-50', 'text-red-600');
    });

    test('applies correct styling for Best Practice category', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const bestPracticeBadges = screen.getAllByText('Best Practice');
      expect(bestPracticeBadges[0]).toHaveClass('bg-blue-50', 'text-blue-700');
    });

    test('renders physical examinations as list', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Physical Exam')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Chest X-ray')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Basic Physical')[0]).toBeInTheDocument();
    });

    test('renders biological tests as list', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('CBC')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Liver Function')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Hippuric Acid')[0]).toBeInTheDocument();
    });

    test('displays frequency values', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('Quarterly')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Annually')[0]).toBeInTheDocument();
    });

    test('displays regulatory limits', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      expect(screen.getAllByText('TWA: 1 ppm')[0]).toBeInTheDocument();
      expect(screen.getAllByText('STEL: 5 ppm')[0]).toBeInTheDocument();
      expect(screen.getAllByText('TWA: 50 ppm')[0]).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    test('renders mobile card layout with all fields', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const monitoringLabels = screen.getAllByText('Monitoring Type');
      const unitsLabels = screen.getAllByText('Business Units');
      const categoryLabels = screen.getAllByText('Surveillance Category');
      
      expect(monitoringLabels.length).toBeGreaterThan(0);
      expect(unitsLabels.length).toBeGreaterThan(0);
      expect(categoryLabels.length).toBeGreaterThan(0);
    });

    test('displays chemical info in mobile cards', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      // CAS numbers appear multiple times in mobile and desktop
      const casNumbers = screen.getAllByText(/CAS: /);
      expect(casNumbers.length).toBeGreaterThan(0);
    });

    test('displays risk badges in mobile view', () => {
      render(<ChemicalSurvTable data={mockData} />);
      
      const highRiskBadges = screen.getAllByText('High Risk');
      const moderateRiskBadges = screen.getAllByText('Moderate Risk');
      
      expect(highRiskBadges.length).toBeGreaterThan(0);
      expect(moderateRiskBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('renders empty table when no data provided', () => {
      render(<ChemicalSurvTable data={[]} />);
      
      expect(screen.getByText('Chemical Information')).toBeInTheDocument();
    });

    test('handles single business unit', () => {
      const singleUnitData = [{
        chemical: 'Test Chemical',
        cas: '123-45-6',
        info: 'Test info',
        risk: 'High Risk',
        monitoringType: 'Biological',
        units: ['Single Unit'],
        category: 'Legislative',
        exams: ['Exam'],
        bioTests: ['Test'],
        frequency: 'Monthly',
        limits: ['Limit']
      }];

      render(<ChemicalSurvTable data={singleUnitData} />);
      
      expect(screen.getAllByText('Single Unit').length).toBeGreaterThan(0);
    });

    test('handles multiple business units', () => {
      const multiUnitData = [{
        chemical: 'Multi Chemical',
        cas: '789-01-2',
        info: 'Multi info',
        risk: 'Moderate Risk',
        monitoringType: 'Air Monitoring',
        units: ['Unit A', 'Unit B', 'Unit C', 'Unit D'],
        category: 'Best Practice',
        exams: ['Exam'],
        bioTests: ['Test'],
        frequency: 'Quarterly',
        limits: ['Limit']
      }];

      render(<ChemicalSurvTable data={multiUnitData} />);
      
      expect(screen.getAllByText('Unit A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Unit B').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Unit C').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Unit D').length).toBeGreaterThan(0);
    });

    test('handles empty arrays gracefully', () => {
      const emptyArraysData = [{
        chemical: 'Empty Chemical',
        cas: '000-00-0',
        info: '',
        risk: 'High Risk',
        monitoringType: 'None',
        units: [],
        category: 'Legislative',
        exams: [],
        bioTests: [],
        frequency: 'N/A',
        limits: []
      }];

      render(<ChemicalSurvTable data={emptyArraysData} />);
      
      // Both desktop and mobile views render, so use getAllByText
      expect(screen.getAllByText('Empty Chemical')[0]).toBeInTheDocument();
      expect(screen.getAllByText('CAS: 000-00-0')[0]).toBeInTheDocument();
    });

    test('handles multiple regulatory limits', () => {
      const multiLimitData = [{
        chemical: 'Complex Chemical',
        cas: '111-22-3',
        info: 'Complex',
        risk: 'High Risk',
        monitoringType: 'Both',
        units: ['Lab'],
        category: 'Legislative',
        exams: ['Exam'],
        bioTests: ['Test'],
        frequency: 'Monthly',
        limits: ['TWA: 1 ppm', 'STEL: 5 ppm', 'Ceiling: 10 ppm', 'Action: 0.5 ppm']
      }];

      render(<ChemicalSurvTable data={multiLimitData} />);
      
      // Both desktop and mobile views render these limits
      expect(screen.getAllByText('TWA: 1 ppm')[0]).toBeInTheDocument();
      expect(screen.getAllByText('STEL: 5 ppm')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Ceiling: 10 ppm')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Action: 0.5 ppm')[0]).toBeInTheDocument();
    });
  });

  describe('Styling and Layout', () => {
    test('applies hover effect to table rows', () => {
      const { container } = render(<ChemicalSurvTable data={mockData} />);
      
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        expect(row).toHaveClass('hover:bg-gray-50', 'transition-colors');
      });
    });

    test('table has proper responsive classes', () => {
      const { container } = render(<ChemicalSurvTable data={mockData} />);
      
      const desktopTable = container.querySelector('.hidden.md\\:block');
      expect(desktopTable).toBeInTheDocument();
      
      const mobileCards = container.querySelector('.md\\:hidden');
      expect(mobileCards).toBeInTheDocument();
    });

    test('applies correct header background color', () => {
      const { container } = render(<ChemicalSurvTable data={mockData} />);
      
      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('bg-[#0B5794]', 'text-white');
    });

    test('business unit badges have correct styling', () => {
      const { container } = render(<ChemicalSurvTable data={mockData} />);
      
      const unitBadges = container.querySelectorAll('.bg-blue-50.text-blue-700');
      expect(unitBadges.length).toBeGreaterThan(0);
    });
  });
});