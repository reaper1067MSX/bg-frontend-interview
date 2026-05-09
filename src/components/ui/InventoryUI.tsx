import React from 'react';

export const Card = ({ children, title }: { children: React.ReactNode; title?: string }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
    {title && (
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
}

export const Button = ({ children, onClick, variant = 'primary' }: ButtonProps) => {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
  };
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg transition-colors font-medium ${styles[variant]}`}>
      {children}
    </button>
  );
};
