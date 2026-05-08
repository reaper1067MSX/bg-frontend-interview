'use client';
import React, { useState, useEffect } from 'react';
import { useSupplierStore } from '@/store/useSupplierStore';
import { X, Trash2 } from 'lucide-react';

export const SupplierFormModal = () => {
  const { isModalOpen, closeModal, suppliers, fetchSuppliers, createSupplier, deleteSupplier, error } = useSupplierStore();
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliers();
    }
  }, [isModalOpen, fetchSuppliers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createSupplier(name, contactInfo);
      setName('');
      setContactInfo('');
    } catch (err) {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm('¿Seguro que desea eliminar este proveedor del Maestro?')) {
      try {
        await deleteSupplier(id);
      } catch (err) {
        // Error handled by store
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col my-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Maestro de Proveedores</h2>
          <button type="button" onClick={closeModal}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 shadow-sm shadow-red-100">
              <div className="bg-red-500 rounded-full p-1 mt-0.5">
                <X className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-red-800">No se pudo realizar la acción</h5>
                <p className="text-xs text-red-600 mt-0.5 font-medium">{error}</p>
              </div>
              <button 
                onClick={() => useSupplierStore.setState({ error: null })}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-4 w-full">
            <h4 className="text-sm font-bold text-blue-800">Registrar Nuevo Proveedor</h4>
            <div className="flex flex-col md:flex-row gap-3 w-full">
              <input 
                required 
                value={name} 
                className="w-full md:flex-1 bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-0" 
                onChange={e => setName(e.target.value)} 
                placeholder="Nombre del Proveedor" 
              />
              <input 
                value={contactInfo} 
                className="w-full md:flex-1 bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-0" 
                onChange={e => setContactInfo(e.target.value)} 
                placeholder="Info Contacto (Opcional)" 
              />
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 text-sm transition-colors disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? '...' : 'Añadir Proveedor'}
              </button>
            </div>
          </form>

          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Lista Activa de Proveedores</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-600">Nombre</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{s.name}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400 italic">No hay proveedores registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
