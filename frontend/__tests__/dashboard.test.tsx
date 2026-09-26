import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';

describe('Dashboard Whitebox Tests', () => {
  it('renders the Security Command Center header', () => {
    render(<Dashboard />);
    const heading = screen.getByText(/Security Command Center/i);
    expect(heading).not.toBeNull();
  });

  it('contains the telemetry grid with 3 main metrics', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Total Forensics Run/i)).not.toBeNull();
    expect(screen.getByText(/High Risk Threats/i)).not.toBeNull();
    expect(screen.getByText(/Account Safety Score/i)).not.toBeNull();
  });

  it('renders the file upload zone', () => {
    render(<Dashboard />);
    const uploadText = screen.getByText(/Drag & Drop Intel/i);
    expect(uploadText).not.toBeNull();
    const button = screen.getByText(/Browse Files/i);
    expect(button).not.toBeNull();
  });

  it('renders historical scans table', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Historical Scans/i)).not.toBeNull();
    // Check for specific mock data rendering
    expect(screen.getByText(/scn_992a/i)).not.toBeNull();
  });
});
