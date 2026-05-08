'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSupplierStore } from '@/store/useSupplierStore';
import { ProductPivotTable } from '@/components/features/ProductPivotTable';
import { Card } from '@/components/ui/InventoryUI';
import { Package, RefreshCw, LogOut, Plus, Users } from 'lucide-react';
import { ProductFormModal } from '@/components/features/ProductFormModal';
import { SupplierFormModal } from '@/components/features/SupplierFormModal';

export default function InventoryPage() {
  const { products, isLoading, fetchProducts, error, openModal } = useProductStore();
  const { openModal: openSupplierModal } = useSupplierStore();
  const { isAuthenticated, checkAuth, logout, username } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated && !localStorage.getItem('auth_token')) {
      router.push('/login');
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, fetchProducts, checkAuth, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <ProductFormModal />
      <SupplierFormModal />
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center lg:text-left w-full lg:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 md:gap-3">
              <Package className="text-blue-600 w-8 h-8 sm:w-auto sm:h-auto" />
              <span>Banco Guayaquil <span className="hidden sm:inline">Inventory</span></span>
            </h1>
            <p className="text-slate-500 mt-2 md:mt-1 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider font-semibold">
              Sistema de Gestión Multiproveedor v2.0
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-4 md:gap-6 w-full lg:w-auto">
            <div className="text-right hidden lg:block">
              <p className="text-xs text-slate-400">Usuario activo</p>
              <p className="text-sm font-bold text-slate-700">{username}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button 
                onClick={() => openSupplierModal()}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg hover:bg-slate-200 font-semibold border border-slate-200 text-sm transition-colors"
              >
                <Users className="w-4 h-4" /> Proveedores
              </button>
              <button 
                onClick={() => openModal()}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 font-semibold text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Registrar Activo
              </button>
            </div>
            
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
            
            <div className="flex justify-center gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-100 sm:border-0">
              <button 
                onClick={() => fetchProducts()}
                disabled={isLoading}
                title="Refrescar datos"
                className="p-3 sm:p-2 rounded-full bg-slate-100 sm:bg-transparent hover:bg-slate-200 sm:hover:bg-slate-100 transition-colors disabled:opacity-50 text-slate-600 sm:text-slate-500"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-3 sm:p-2 rounded-full bg-red-50 sm:bg-transparent hover:bg-red-100 sm:hover:bg-red-50 text-red-600 sm:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded shadow-sm flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        <Card title="Inventario Global de Activos">
          {isLoading && products.length === 0 ? (
            <div className="flex justify-center py-20 italic text-slate-400">
              Cargando catálogo de productos...
            </div>
          ) : (
            <ProductPivotTable products={products} />
          )}
        </Card>
        
        <footer className="text-center text-slate-400 text-xs py-10">
          Clean Architecture + .NET 10 + NextJS | Banco Guayaquil Challenge 2026
        </footer>
      </div>
    </main>
  );
}
