import { create } from 'zustand';
import { Supplier } from '@/types/inventory';
import { supplierRepository } from '@/repositories/supplierRepository';

interface SupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  
  fetchSuppliers: () => Promise<void>;
  createSupplier: (name: string, contactInfo: string) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  openModal: () => void;
  closeModal: () => void;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  isLoading: false,
  error: null,
  isModalOpen: false,

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, error: null }),

  fetchSuppliers: async () => {
    set({ isLoading: true, error: null });
    try {
      const suppliers = await supplierRepository.getAll();
      set({ suppliers, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch suppliers', isLoading: false });
    }
  },

  createSupplier: async (name: string, contactInfo: string) => {
    try {
      await supplierRepository.create({ name, contactInfo });
      await get().fetchSuppliers();
      set({ error: null });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { description?: string } } };
      const message = error.response?.data?.description || 'Error al crear el proveedor';
      set({ error: message });
      throw err;
    }
  },

  deleteSupplier: async (id: string) => {
    try {
      await supplierRepository.delete(id);
      await get().fetchSuppliers();
      set({ error: null });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { description?: string } } };
      const message = error.response?.data?.description || 'Error al eliminar el proveedor';
      set({ error: message });
      throw err;
    }
  }
}));
