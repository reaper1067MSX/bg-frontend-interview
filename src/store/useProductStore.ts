import { create } from 'zustand';
import { Product } from '@/types/inventory';
import { productRepository } from '@/repositories/productRepository';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingProduct: Product | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  updateStock: (providerId: string, newStock: number) => Promise<void>;
  openModal: (product?: Product) => void;
  closeModal: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingProduct: null,

  openModal: (product?: Product) => set({ isModalOpen: true, editingProduct: product || null }),
  closeModal: () => set({ isModalOpen: false, editingProduct: null }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productRepository.getAll();
      set({ products, isLoading: false });
    } catch (err: any) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  updateStock: async (providerId: string, newStock: number) => {
    try {
      await productRepository.updateStock(providerId, newStock);
      // Actualización optimista o refrescar
      await get().fetchProducts();
    } catch (err: any) {
      set({ error: 'Failed to update stock' });
    }
  }
}));
