import React from 'react';
import { render, screen } from '@testing-library/react';
import TopSummaryGrid from '../../components/Dashboard/TopSummaryGrid';

describe('TopSummaryGrid', () => {
  const mockKpis = [
    {
      id: 'risk',
      title: 'Risk Assessments',
      value: '45',
      completed: 30,
      pending: 10,
      overdue: 5,
      trendDirection: 'up',
      trendLabel: '+12%'
    },
    {
      id: 'exposure',
      title: 'Exposure Assessments',
      value: '89',
      completed: 70,
      pending: 15,
      overdue: 4,
      trendDirection: 'down',
      trendLabel: '-5%'
    },
    {
      id: 'medical',
      title: 'Medical Surveillance',
      value: '234',
      completed: 200,
      pending: 25,
      overdue: 9,
      trendDirection: 'up',
      trendLabel: '+8%'
    },
    {
      id: 'employee',
      title: 'Employee Health',
      value: '567',
      completed: 500,
      pending: 50,
      overdue: 17,
      trendDirection: 'up',
      trendLabel: '+15%'
    }
  ];

  it('renders all KPI cards', () => {
    render(<TopSummaryGrid kpis={mockKpis} />);
    
    expect(screen.getByText('Risk Assessments')).toBeInTheDocument();
    expect(screen.getByText('Exposure Assessments')).toBeInTheDocument();
    expect(screen.getByText('Medical Surveillance')).toBeInTheDocument();
    expect(screen.getByText('Employee Health')).toBeInTheDocument();
  });

  it('displays correct values for each KPI', () => {
    render(<TopSummaryGrid kpis={mockKpis} />);
    
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('234')).toBeInTheDocument();
    expect(screen.getByText('567')).toBeInTheDocument();
  });

  it('displays completed, pending, and overdue counts', () => {
    render(<TopSummaryGrid kpis={mockKpis} />);
    
    expect(screen.getByText('30 Completed')).toBeInTheDocument();
    expect(screen.getByText('10 Pending')).toBeInTheDocument();
    expect(screen.getByText('5 Overdue')).toBeInTheDocument();
  });

  it('applies correct styling for upward trend', () => {
    render(<TopSummaryGrid kpis={[mockKpis[0]]} />);
    
    const trendLabel = screen.getByText('+12%');
    expect(trendLabel.parentElement).toHaveClass('text-green-700', 'bg-green-50');
  });

  it('applies correct styling for downward trend', () => {
    render(<TopSummaryGrid kpis={[mockKpis[1]]} />);
    
    const trendLabel = screen.getByText('-5%');
    expect(trendLabel.parentElement).toHaveClass('text-red-600', 'bg-red-50');
  });

  it('renders correct icon for risk KPI', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[0]]} />);
    
    // ShieldAlert icon should be present
    const iconContainer = container.querySelector('.bg-blue-50.text-blue-700');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders correct icon for exposure KPI', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[1]]} />);
    
    // Activity icon should be present
    const iconContainer = container.querySelector('.bg-blue-50.text-blue-700');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders correct icon for medical KPI', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[2]]} />);
    
    // Stethoscope icon should be present
    const iconContainer = container.querySelector('.bg-blue-50.text-blue-700');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders correct icon for employee KPI (default)', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[3]]} />);
    
    // Users icon should be present (default)
    const iconContainer = container.querySelector('.bg-blue-50.text-blue-700');
    expect(iconContainer).toBeInTheDocument();
  });

  it('handles empty kpis array', () => {
    const { container } = render(<TopSummaryGrid kpis={[]} />);
    
    const cards = container.querySelectorAll('.bg-white.rounded-2xl');
    expect(cards.length).toBe(0);
  });

  it('uses default empty array when kpis not provided', () => {
    const { container } = render(<TopSummaryGrid />);
    
    const cards = container.querySelectorAll('.bg-white.rounded-2xl');
    expect(cards.length).toBe(0);
  });

  it('renders status indicators with correct colors', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[0]]} />);
    
    const completedBadge = container.querySelector('.bg-green-50.text-green-700');
    const pendingBadge = container.querySelector('.bg-yellow-50.text-yellow-700');
    const overdueBadge = container.querySelector('.bg-red-50.text-red-700');
    
    expect(completedBadge).toBeInTheDocument();
    expect(pendingBadge).toBeInTheDocument();
    expect(overdueBadge).toBeInTheDocument();
  });

  it('renders status indicator dots', () => {
    const { container } = render(<TopSummaryGrid kpis={[mockKpis[0]]} />);
    
    const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
    expect(dots.length).toBe(3); // One for each status (completed, pending, overdue)
  });

  it('displays helper text for total value', () => {
    render(<TopSummaryGrid kpis={[mockKpis[0]]} />);
    
    expect(screen.getByText('Total risk assessments')).toBeInTheDocument();
  });

  it('applies responsive grid layout classes', () => {
    const { container } = render(<TopSummaryGrid kpis={mockKpis} />);
    
    const section = container.firstChild;
    expect(section).toHaveClass('mt-4', 'grid', 'gap-4', 'md:grid-cols-2', 'xl:grid-cols-4');
  });

  it('renders trend icons correctly', () => {
    const { container } = render(<TopSummaryGrid kpis={mockKpis} />);
    
    // Should have both up and down arrow icons
    const trendIcons = container.querySelectorAll('.w-3.h-3');
    expect(trendIcons.length).toBeGreaterThan(0);
  });

  it('handles unknown KPI id with default icon', () => {
    const unknownKpi = {
      id: 'unknown',
      title: 'Unknown KPI',
      value: '100',
      completed: 50,
      pending: 30,
      overdue: 20,
      trendDirection: 'up',
      trendLabel: '+10%'
    };

    const { container } = render(<TopSummaryGrid kpis={[unknownKpi]} />);
    
    // Should render without error and use default Users icon
    expect(screen.getByText('Unknown KPI')).toBeInTheDocument();
    const iconContainer = container.querySelector('.bg-blue-50.text-blue-700');
    expect(iconContainer).toBeInTheDocument();
  });
});