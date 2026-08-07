import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import { fetchDashboardSummary, MOCK_DASHBOARD_SUMMARY } from '../../api/dashboardApi';

jest.mock('../../api/dashboardApi');
jest.mock('../../components/Navbar/NavBar', () => {
  return function MockNavBar({ onLogout, isAdmin }) {
    return <div data-testid="navbar">NavBar - Admin: {isAdmin.toString()}</div>;
  };
});

describe('DashboardPage', () => {
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    fetchDashboardSummary.mockImplementation(() => new Promise(() => {}));
    
    render(<DashboardPage onLogout={mockOnLogout} isAdmin={true} />);
    
    expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
  });

  it('renders dashboard with API data successfully', async () => {
    const mockData = {
      kpis: [
        {
          id: 'risk',
          title: 'Risk Assessments',
          value: '45',
          completed: 30,
          pending: 10,
          overdue: 5,
          trendDirection: 'up',
          trendLabel: '+12%'
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

    fetchDashboardSummary.mockResolvedValue(mockData);

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={false} />);

    // Wait for the KPI section to appear and verify it contains Risk Assessments
    await waitFor(() => {
      const kpiSection = screen.getAllByText('Risk Assessments')[0];
      expect(kpiSection).toBeInTheDocument();
    });

    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Blood Tests')).toBeInTheDocument();
    expect(screen.getByText('234')).toBeInTheDocument();
  });

  it('falls back to mock data when API fails', async () => {
    fetchDashboardSummary.mockRejectedValue(new Error('API Error'));

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={true} />);

    await waitFor(() => {
      expect(screen.queryByText(/loading dashboard/i)).not.toBeInTheDocument();
    });

    // Should render with MOCK_DASHBOARD_SUMMARY data
    expect(screen.getByText('Medical Test Statistics')).toBeInTheDocument();
  });

  it('renders navbar with correct props', async () => {
    fetchDashboardSummary.mockResolvedValue({
      kpis: [],
      medicalTestStats: []
    });

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={true} />);

    await waitFor(() => {
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    expect(screen.getByText(/Admin: true/)).toBeInTheDocument();
  });

  it('renders Risk Assessments table with mock data', async () => {
    fetchDashboardSummary.mockResolvedValue({
      kpis: [],
      medicalTestStats: []
    });

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={false} />);

    await waitFor(() => {
      expect(screen.getByText('Manufacturing - Q4 Assessment')).toBeInTheDocument();
    });

    expect(screen.getByText('Manufacturing - Q4 Assessment')).toBeInTheDocument();
    expect(screen.getByText('R&D Lab - Chemical Review')).toBeInTheDocument();
    expect(screen.getByText('Acetone, Toluene, MEK')).toBeInTheDocument();
  });

  it('renders search input for risk assessments', async () => {
    fetchDashboardSummary.mockResolvedValue({
      kpis: [],
      medicalTestStats: []
    });

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={false} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search business unit, assessor')).toBeInTheDocument();
    });
  });

  it('displays multiple Risk Assessment sections correctly', async () => {
    const mockData = {
      kpis: [
        {
          id: 'risk',
          title: 'Risk Assessments',
          value: '45',
          completed: 30,
          pending: 10,
          overdue: 5,
          trendDirection: 'up',
          trendLabel: '+12%'
        }
      ],
      medicalTestStats: []
    };

    fetchDashboardSummary.mockResolvedValue(mockData);

    render(<DashboardPage onLogout={mockOnLogout} isAdmin={false} />);

    await waitFor(() => {
      // Should have "Risk Assessments" in both the KPI card and the table section
      const riskAssessmentElements = screen.getAllByText('Risk Assessments');
      expect(riskAssessmentElements.length).toBeGreaterThan(1);
    });
  });
});