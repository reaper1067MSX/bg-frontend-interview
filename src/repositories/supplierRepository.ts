import api from './apiClient';
import { Supplier } from '@/types/inventory';

export const supplierRepository = {
  getAll: async () => {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  },
  
  create: async (supplier: Omit<Supplier, 'id'>) => {
    const response = await api.post<string>('/suppliers', supplier);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/suppliers/${id}`);
  }
};
