import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('denied');

  return (
    <div className="fixed top-4 sm:top-20 inset-x-4 sm:inset-x-auto sm:right-5 z-50 flex justify-center sm:justify-end pointer-events-none animate-slide-down">
      <div
        className="pointer-events-auto px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium w-full max-w-sm"
        style={{
          background: isError ? '#FEF2F2' : '#F0FDF4',
          border: `1px solid ${isError ? '#FECACA' : '#BBF7D0'}`,
          color: isError ? '#DC2626' : '#16A34A',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: isError ? '#FEE2E2' : '#DCFCE7' }}
        >
          {isError
            ? <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
            : <CheckCircle2 className="w-4 h-4" style={{ color: '#16A34A' }} />
          }
        </div>
        <span className="text-xs font-medium leading-snug break-words flex-1" style={{ color: isError ? '#B91C1C' : '#15803D' }}>
          {message}
        </span>
      </div>
    </div>
  );
}
