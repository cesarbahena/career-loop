import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { expect, vi } from 'vitest';
import { ApiHealth } from './ApiHealth';

// Mock the fetch API
global.fetch = vi.fn();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  });

describe('ApiHealth', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fetch as Mock).mockClear();
  });

  it('renders loading state initially', () => {
    (fetch as Mock).mockImplementationOnce(() =>
      new Promise(() => {}) // Never resolve to keep it in loading state
    );

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ApiHealth />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders health data on successful fetch', async () => {
    const mockData = { status: 'ok' };
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ApiHealth />
      </QueryClientProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByText(JSON.stringify(mockData, null, 2))).toBeInTheDocument();
    });
  });

  it('renders error message on failed fetch', async () => {
    (fetch as Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    const queryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ApiHealth />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/Error: Network response was not ok/i)).toBeInTheDocument();
    });
  });
});
