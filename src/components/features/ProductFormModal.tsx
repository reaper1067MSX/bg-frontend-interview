'use client';
import React, {useEffect, useState, useCallback} from 'react';
import {useProductStore} from '@/store/useProductStore';
import {useSupplierStore} from '@/store/useSupplierStore';
import {Trash2, X} from 'lucide-react';
import {productRepository} from '@/repositories/productRepository';
import { Product } from '@/types/inventory';

interface ProductPayload {
  sku: string;
  name: string;
  description: string;
  minStockThreshold: number;
  suppliers: {
    id?: string;
    supplierId: string;
    currentPrice: number;
    stock: number;
  }[];
}

export const ProductFormModal = () => {
  const { isModalOpen, closeModal, editingProduct, fetchProducts } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productSuppliers, setProductSuppliers] = useState<{ id?: string; supplierId: string; currentPrice: number | string; stock: number | string; }[]>([{ supplierId: '', currentPrice: 0, stock: 0 }]);
  const [minStockThreshold, setMinStockThreshold] = useState<number | string>(10);

  // Usamos useCallback para que la función sea estable y no dispare efectos innecesarios
  const resetForm = useCallback(() => {
    if (editingProduct) {
      setSku(editingProduct.sku);
      setName(editingProduct.name);
      setDescription(editingProduct.description || '');
      setProductSuppliers(editingProduct.suppliers.map(p => ({
        id: p.id,
        supplierId: p.supplierId,
        currentPrice: p.currentPrice,
        stock: p.stock
      })));
      setMinStockThreshold(editingProduct.minStockThreshold || 10);
    } else {
      setSku('');
      setName('');
      setDescription('');
      setProductSuppliers([{ supplierId: '', currentPrice: 0, stock: 0 }]);
      setMinStockThreshold(10);
    }
  }, [editingProduct]);

  useEffect(() => {
    if (!isModalOpen) return;

    // Ejecutamos las actualizaciones de estado fuera del flujo síncrono inicial
    // para evitar el error de "cascading renders" de ESLint
    const timer = setTimeout(() => {
      fetchSuppliers();
      resetForm();
    }, 0);

    return () => clearTimeout(timer);
  }, [isModalOpen, fetchSuppliers, resetForm]);

  const addSupplier = () => {
    setProductSuppliers([...productSuppliers, { supplierId: '', currentPrice: 0, stock: 0 }]);
  };

  const removeSupplier = (index: number) => {
    setProductSuppliers(productSuppliers.filter((_, i) => i !== index));
  };

  const updateSupplier = (index: number, field: string, value: string) => {
    const updated = [...productSuppliers];
    let parsedValue: string | number = value;
    
    // Si el campo es numérico, intentamos convertir pero permitimos el string vacío para la UX
    if (field === 'currentPrice' || field === 'stock') {
      if (value === '') {
        parsedValue = '';
      } else {
        parsedValue = field === 'currentPrice' ? parseFloat(value) : parseInt(value, 10);
      }
    }

    updated[index] = { ...updated[index], [field]: parsedValue } as typeof productSuppliers[0];
    setProductSuppliers(updated);
  };

  const totalValue = productSuppliers.reduce((sum, p) => {
    const price = typeof p.currentPrice === 'number' ? p.currentPrice : 0;
    const stock = typeof p.stock === 'number' ? p.stock : 0;
    return sum + (price * stock);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpieza de datos antes de validar/enviar
    const sanitizedSuppliers = productSuppliers.map(p => ({
      ...p,
      currentPrice: Number(p.currentPrice) || 0,
      stock: Number(p.stock) || 0
    }));

    if (sanitizedSuppliers.some(p => !p.supplierId || p.currentPrice <= 0)) {
      alert('Asegúrese de seleccionar un proveedor válido y un precio mayor a 0');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload: ProductPayload = { 
        sku, 
        name, 
        description, 
        suppliers: sanitizedSuppliers, 
        minStockThreshold: Number(minStockThreshold) || 0
      };

      if (editingProduct) {
        await productRepository.update(editingProduct.id, payload as unknown as Product);
      } else {
        await productRepository.create(payload as unknown as Product);
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      alert(`Error al ${editingProduct ? 'actualizar' : 'crear'} el producto. Verifique los datos.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingProduct ? 'Editar Activo' : 'Alta de Producto (SKU)'}
            </h2>
            <p className="text-xs text-slate-500">Valor de Transacción: <strong className="text-blue-600">${totalValue.toFixed(2)}</strong></p>
          </div>
          <button type="button" onClick={closeModal}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU</label>
              <input required value={sku} className="w-full border border-slate-300 rounded-lg p-2" onChange={e => setSku(e.target.value)} placeholder="Ej: TV-50-4K" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Comercial</label>
              <input required value={name} className="w-full border border-slate-300 rounded-lg p-2" onChange={e => setName(e.target.value)} placeholder="Televisor 50''" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
            <input value={description} className="w-full border border-slate-300 rounded-lg p-2" onChange={e => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Minimo stock</label>
            <input 
              type="number"
              value={minStockThreshold} 
              className="w-full border border-slate-300 rounded-lg p-2" 
              onChange={e => setMinStockThreshold(e.target.value === '' ? '' : parseInt(e.target.value, 10))} 
            />
          </div>
          
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-800">Asignación de Proveedores (Maestro) & Existencias</h4>
              <button type="button" onClick={addSupplier} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded font-semibold hover:bg-slate-200 border border-slate-200">+ Añadir Relación</button>
            </div>
            
            {productSuppliers.map((p, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <select 
                  required className="w-full sm:flex-1 bg-white border border-slate-300 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={p.supplierId} 
                  onChange={e => updateSupplier(index, 'supplierId', e.target.value)}
                >
                  <option value="" disabled>Seleccione Proveedor...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <div className="flex w-full sm:w-auto gap-2 items-center">
                  <div className="relative flex-1 sm:w-32 min-w-0">
                    <span className="absolute left-2 sm:left-3 top-2.5 sm:top-3 text-slate-400 text-sm">$</span>
                    <input 
                      required type="number" step="0.01" className="w-full bg-white border border-slate-300 rounded-lg py-2 px-2 pl-5 sm:p-2.5 sm:pl-7 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-0" 
                      value={p.currentPrice} onChange={e => updateSupplier(index, 'currentPrice', e.target.value)} placeholder="Precio"
                    />
                  </div>
                  <input 
                    required type="number" className="flex-1 sm:w-24 bg-white border border-slate-300 rounded-lg p-2 sm:p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-0" 
                    value={p.stock} onChange={e => updateSupplier(index, 'stock', e.target.value)} placeholder="Stock"
                  />
                  <button type="button" onClick={() => removeSupplier(index)} disabled={productSuppliers.length === 1} className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t flex justify-end gap-3">
             <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all border border-slate-200">Cancelar</button>
             <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
              {isSubmitting ? 'Procesando...' : (editingProduct ? 'Guardar Cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
