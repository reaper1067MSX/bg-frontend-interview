export interface Supplier {
  id: string;
  name: string;
  contactInfo?: string;
}

export interface ProductSupplier {
  id: string;
  productId: string;
  supplierId: string;
  supplierName?: string; // Dato plano para la vista Pivot
  currentPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  suppliers: ProductSupplier[]; // Antes era providers
  totalStock: number;
  minStockThreshold: number;
}
