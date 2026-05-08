export const productMother = {
  standard: (): {
      id: string;
      sku: string;
      name: string;
      description: string;
      totalStock: number;
      suppliers: ({
          id: string;
          supplierName: string;
          currentPrice: number;
          stock: number
      })[]
  } => ({
    id: 'prod-1',
    sku: 'MON-50-4K',
    name: 'Monitor 50 pulgadas 4K',
    description: 'Monitor de prueba',
    totalStock: 15,
    suppliers: [
      { id: 'prov-1', supplierName: 'Proveedor A', currentPrice: 250, stock: 10 },
      { id: 'prov-2', supplierName: 'Proveedor B', currentPrice: 300, stock: 5 },
    ],
  }),
  
  withNoStock: (): {
      id: string;
      sku: string;
      name: string;
      description: string;
      totalStock: number;
      suppliers: { id: string; supplierName: string; currentPrice: number; stock: number }[]
  } => ({
    ...productMother.standard(),
    totalStock: 0,
    suppliers: productMother.standard().suppliers.map(p => ({ ...p, stock: 0 })),
  })
};
