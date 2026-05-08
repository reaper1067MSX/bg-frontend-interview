import api from './apiClient';
import { Product, ProductProvider } from '@/types/inventory';

export const productRepository = {
  getAll: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  
  updateStock: async (providerId: string, newStock: number) => {
    await api.patch(`/products/${providerId}/stock`, { newStock });
  },
  
  create: async (product: Omit<Product, 'id' | 'totalStock'>) => {
    const response = await api.post<string>('/products', product);
    return response.data;
  },
  
  update: async (id: string, product: Omit<Product, 'id' | 'totalStock'>) => {
    await api.put(`/products/${id}`, product);
  },
  
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  }
};
