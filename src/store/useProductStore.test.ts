import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProductStore } from './useProductStore';
import { productRepository } from '@/repositories/productRepository';
import { productMother } from '@/test/mothers/productMother';

// Mock del repositorio
vi.mock('@/repositories/productRepository', () => ({
  productRepository: {
    getAll: vi.fn(),
  },
}));

describe('ProductStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch products successfully', async () => {
    const mockProducts = [productMother.standard()];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    vi.mocked(productRepository.getAll).mockResolvedValue(mockProducts);

    const store = useProductStore.getState();
    await store.fetchProducts();

    expect(useProductStore.getState().products).toEqual(mockProducts);
    expect(useProductStore.getState().isLoading).toBe(false);
  });

  it('should handle fetch errors', async () => {
    vi.mocked(productRepository.getAll).mockRejectedValue(new Error('Network error'));

    const store = useProductStore.getState();
    await store.fetchProducts();

    expect(useProductStore.getState().error).toBe('Failed to fetch products');
    expect(useProductStore.getState().isLoading).toBe(false);
  });
});
