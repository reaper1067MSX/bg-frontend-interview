'use client';
import React, {useState} from 'react';
import {Product} from '@/types/inventory';
import {useProductStore} from '@/store/useProductStore';
import {AlertTriangle, Edit2, Trash2} from 'lucide-react';
import {productRepository} from '@/repositories/productRepository';

export const ProductPivotTable = ({products}: { products: Product[] }) => {
    const {updateStock, fetchProducts, openModal} = useProductStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newStock, setNewStock] = useState<number>(0);

    const allSuppliers = Array.from(
        new Set(products.flatMap(p => (p.suppliers || []).map(prov => prov.supplierName)))
    ).sort();

    const handleUpdate = async (providerId: string) => {
        await updateStock(providerId, newStock);
        setEditingId(null);
    };

    const handleDelete = async (productId: string) => {
        if (confirm('¿Está seguro de eliminar este producto y todos sus proveedores?')) {
            try {
                await productRepository.delete(productId);
                fetchProducts();
            } catch (e) {
                alert('Error al eliminar');
            }
        }
    };

    return (
        <>
            {/* VISTA MOBILE: Lista de Tarjetas Verticales */}
            <div className="block md:hidden space-y-4">
                {products.map(product => {
                    const totalValue = (product.suppliers || []).reduce((sum, p) => sum + (p.currentPrice * p.stock), 0);
                    const isCritical = product.totalStock < (product.minStockThreshold ?? 0);

                    return (
                        <div key={product.id}
                             className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Header de la Tarjeta */}
                            <div
                                className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{product.name}</h3>
                                    <p className="text-xs text-blue-600 font-mono mt-1">{product.sku}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => openModal(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                                        <Edit2 className="w-4 h-4"/>
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors">
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>

                            {/* Resumen Global */}
                            <div className="px-5 py-3 flex justify-between items-center border-b border-slate-100">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Stock
                                        Total</p>
                                    {isCritical? (
                                            <div className="flex items-center gap-1.5 text-red-600 animate-pulse">
                                              <AlertTriangle className="w-4 h-4" />
                                              <p className="text-lg font-black">{product.totalStock} <span className="text-xs font-bold uppercase">Crítico</span></p>
                                            </div>
                                    ):(<p className="text-lg font-bold text-slate-800">{product.totalStock} <span
                                        className="text-xs font-normal text-slate-500">uds.</span></p>)}

                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Valor
                                        Total</p>
                                    <p className="text-lg font-bold text-slate-800 font-mono">${totalValue.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Lista de Proveedores */}
                            <div className="divide-y divide-slate-100">
                                {(product.suppliers || []).map(prov => {
                                    const provValue = prov.currentPrice * prov.stock;

                                    return (
                                        <div key={prov.id}
                                             className="p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                            <div>
                                                <p className="font-semibold text-slate-700 text-sm">{prov.supplierName}</p>
                                                <p className="text-blue-600 font-mono text-xs font-bold mt-0.5">${prov.currentPrice.toFixed(2)}<span
                                                    className="text-slate-400 font-sans font-normal">/u</span></p>
                                            </div>

                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-right">
                                                    <p className="text-slate-600 text-sm"><span
                                                        className="font-bold text-slate-800">{prov.stock}</span> <span
                                                        className="text-xs text-slate-400">uds.</span> | <span
                                                        className="font-mono text-xs font-semibold">${provValue.toFixed(2)}</span>
                                                    </p>
                                                </div>

                                                {editingId === prov.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            className="w-16 px-2 py-1 border border-blue-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                                            defaultValue={prov.stock}
                                                            onChange={(e) => setNewStock(parseInt(e.target.value))}
                                                        />
                                                        <button onClick={() => handleUpdate(prov.id)}
                                                                className="text-white bg-green-500 px-2 py-1 rounded text-xs font-bold">OK
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(prov.id);
                                                            setNewStock(prov.stock);
                                                        }}
                                                        className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                                    >
                                                        Editar Stock
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* VISTA DESKTOP: Tabla Pivot original */}
            <div className="hidden md:block overflow-x-auto w-full pb-4">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                        <th className="px-6 py-3 whitespace-nowrap">Producto / SKU</th>
                        {allSuppliers.map(s => (
                            <th key={s} className="px-6 py-3 whitespace-nowrap min-w-[200px] text-center">{s}</th>
                        ))}
                        <th className="px-6 py-3 text-right whitespace-nowrap">Stock Total</th>
                        <th className="px-6 py-3 text-right whitespace-nowrap">Valor Total (USD)</th>
                        <th className="px-6 py-3 text-center whitespace-nowrap">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {products.map(product => {
                        const totalValue = (product.suppliers || []).reduce((sum, p) => sum + (p.currentPrice * p.stock), 0);

                        return (
                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-semibold text-slate-800">{product.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">SKU: {product.sku}</div>
                                </td>
                                {allSuppliers.map(supplier => {
                                    const prov = (product.suppliers || []).find(p => p.supplierName === supplier);
                                    const provValue = prov ? prov.currentPrice * prov.stock : 0;

                                    return (
                                        <td key={supplier} className="px-6 py-4 text-sm text-slate-600 align-top">
                                            {prov ? (
                                                <div
                                                    className="mx-auto flex flex-col bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm w-max min-w-[150px] max-w-[220px] hover:border-blue-300 transition-colors">
                                                    <div
                                                        className="flex flex-col gap-1 border-b border-slate-100 pb-3 mb-3">
                                                        <span
                                                            className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Precio Unitario</span>
                                                        <span
                                                            className="font-mono text-blue-600 font-bold text-lg leading-none">${prov.currentPrice.toFixed(2)}</span>

                                                        <div
                                                            className="flex items-center justify-between mt-2 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                                                            <span
                                                                className="text-[10px] text-slate-500 font-bold uppercase">Val Total</span>
                                                            <span
                                                                className="font-bold text-slate-700 font-mono text-xs">${provValue.toFixed(2)}</span>
                                                        </div>
                                                    </div>

                                                    {editingId === prov.id ? (
                                                        <div className="flex flex-col gap-2">
                                                            <span
                                                                className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Actualizar Stock</span>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    className="w-full px-2 py-1.5 border border-blue-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                                    defaultValue={prov.stock}
                                                                    onChange={(e) => setNewStock(parseInt(e.target.value))}
                                                                />
                                                                <button onClick={() => handleUpdate(prov.id)}
                                                                        className="text-white bg-green-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">OK
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between group">
                                                            <div className="flex flex-col">
                                                                <span
                                                                    className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Stock</span>
                                                                <span
                                                                    className="text-slate-800 font-bold text-sm">{prov.stock}
                                                                    <span
                                                                        className="text-xs font-normal text-slate-500">uds.</span></span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingId(prov.id);
                                                                    setNewStock(prov.stock);
                                                                }}
                                                                className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg shadow-sm"
                                                                title="Actualizar Existencias"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5"/>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : <span
                                                className="text-slate-300 italic block text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No suministra</span>}
                                        </td>
                                    );
                                })}
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    {product.totalStock < (product.minStockThreshold ?? 0) ? (
                                        <div className="flex items-center justify-end gap-2 animate-pulse">
                                            <AlertTriangle className="w-4 h-4 text-red-500"/>
                                            <span
                                                className="px-2 py-1 rounded text-xs font-black bg-red-100 text-red-700 border border-red-200 shadow-sm">
                                            {product.totalStock} uds. (CRÍTICO)
                                          </span>
                                        </div>
                                        ) : (
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.totalStock > 10 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                          {product.totalStock} uds.
                                      </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-700 whitespace-nowrap">
                                    ${totalValue.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Editar Producto y Precios"
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                            title="Eliminar Producto"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
