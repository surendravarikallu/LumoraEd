import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/AppSidebar';
import { MetricCard } from '@/components/MetricCard';
import { ProgressRing } from '@/components/ProgressRing';
import { Home } from 'lucide-react';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn()
  }
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('Components', () => {
  describe('AppSidebar', () => {
    it('renders navigation items', () => {
      const { getByText } = render(
        <TestWrapper>
          <AppSidebar />
        </TestWrapper>
      );
      
      expect(getByText('Dashboard')).toBeInTheDocument();
      expect(getByText('Challenges')).toBeInTheDocument();
      expect(getByText('Roadmaps')).toBeInTheDocument();
      expect(getByText('Certifications')).toBeInTheDocument();
    });
  });
  
  describe('MetricCard', () => {
    it('renders metric card with title and value', () => {
      const { getByText } = render(
        <TestWrapper>
          <MetricCard
            title="Test Metric"
            value="100"
            icon={Home}
            description="Test description"
          />
        </TestWrapper>
      );
      
      expect(getByText('Test Metric')).toBeInTheDocument();
      expect(getByText('100')).toBeInTheDocument();
    });
  });
  
  describe('ProgressRing', () => {
    it('renders progress ring with percentage', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProgressRing
            percentage={75}
            size={100}
            strokeWidth={8}
          />
        </TestWrapper>
      );
      
      expect(getByText('75%')).toBeInTheDocument();
    });
  });
});
