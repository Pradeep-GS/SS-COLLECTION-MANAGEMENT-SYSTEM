import React, { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, ChevronRight, Trash2, Edit3,
  Calendar, Shield, Scissors, Eye, LayoutDashboard, Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchStaff } from '../services/api';

function ConfirmDeleteModal({ customerName, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box p-5 sm:p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FEE2E2' }}>
            <Trash2 className="w-5 h-5" style={{ color: '#DC2626' }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
              Delete Customer?
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--gray-500)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--gray-800)' }}>{customerName}</strong>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 mt-5 sm:mt-6 pt-4" style={{ borderTop: '1px solid var(--gray-100)' }}>
          <button id="delete-cancel" className="btn-secondary w-full sm:w-auto" onClick={onCancel}>Cancel</button>
          <button id="delete-confirm" className="btn-danger w-full sm:w-auto" onClick={onConfirm}>
            <Trash2 className="w-4 h-4" /> Delete Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({ customers, onDeleteCustomer, onSelectCustomer, onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [staffCount, setStaffCount] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchStaff().then(res => {
        if (res.success) setStaffCount(res.data.total);
        else setStaffCount(0);
      }).catch(() => setStaffCount(0));
    }
  }, [isAdmin]);

  const filteredCustomers = customers
    .filter(c => {
      const q = searchQuery.toLowerCase();
      return (
        c.fullName?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q) ||
        c.customerCode?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 50);

  const handleDeleteClick = (e, id, name) => {
    e.stopPropagation();
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDeleteCustomer(deleteTarget.id, deleteTarget.name);
    setDeleteTarget(null);
  };

  // Staff type label
  const staffTypeLabel = user?.staffType === 'TAILOR' ? 'Tailor' : user?.staffType === 'FULL_DETAIL' ? 'Full Detail Staff' : null;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">

      {/* Stats Row — Admin only */}
      {isAdmin && (
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
          {/* Total Customers */}
          <div className="card card-hover p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>Total Customers</p>
              <p className="text-2xl sm:text-3xl font-extrabold mt-0.5 sm:mt-1" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
                {customers.length}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-primary-light)' }}>
              <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
            </div>
          </div>

          {/* Total Staff */}
          <div className="card card-hover p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>Staff Members</p>
              <p className="text-2xl sm:text-3xl font-extrabold mt-0.5 sm:mt-1" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
                {staffCount === null ? '—' : staffCount}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#F0FDF4' }}>
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#16A34A' }} />
            </div>
          </div>

          {/* Showing */}
          <div className="card card-hover p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gray-400)' }}>Showing</p>
              <p className="text-2xl sm:text-3xl font-extrabold mt-0.5 sm:mt-1" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
                {filteredCustomers.length}
              </p>
              <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>of {customers.length} records</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FFFBEB' }}>
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#D97706' }} />
            </div>
          </div>
        </div>
      )}

      {/* Staff greeting (non-admin) */}
      {!isAdmin && (
        <div className="card p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--accent-primary-light)' }}>
            {user?.staffType === 'TAILOR' ? (
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
            ) : (
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--accent-primary)' }} />
            )}
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
              Welcome, {user?.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--gray-500)' }}>
              {staffTypeLabel} — {customers.length} customer{customers.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      )}

      {/* Search & Header */}
      <div className="card p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--gray-400)' }} />
          <input
            id="customer-search"
            type="text"
            placeholder="Search by name, phone, or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        {isAdmin && (
          <button
            id="dashboard-add-customer"
            onClick={() => onNavigate('ADD_CUSTOMER')}
            className="btn-primary w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        )}
      </div>

      {/* Customer Table */}
      <div className="card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-25)' }}>
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--gray-500)' }}>
            Customer Records
          </h2>
          <span className="text-xs font-medium" style={{ color: 'var(--gray-400)' }}>
            {filteredCustomers.length} result{filteredCustomers.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="py-12 sm:py-16 px-4 flex flex-col items-center gap-3 text-center">
            <Users className="w-10 h-10" style={{ color: 'var(--gray-300)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--gray-500)' }}>
              {searchQuery ? `No results for "${searchQuery}"` : 'No customers yet'}
            </p>
            {!searchQuery && isAdmin && (
              <button onClick={() => onNavigate('ADD_CUSTOMER')} className="btn-primary mt-1">
                <UserPlus className="w-4 h-4" /> Add First Customer
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredCustomers.map((c, idx) => (
              <div
                key={c.id}
                id={`customer-row-${c.id}`}
                onClick={() => onSelectCustomer(c.id, 'VIEW_CUSTOMER')}
                className="flex items-center px-3 sm:px-5 py-3 sm:py-3.5 cursor-pointer transition-colors group"
                style={{
                  borderBottom: idx < filteredCustomers.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  background: 'var(--white)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shrink-0 mr-2.5 sm:mr-3"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  {c.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Name + Code + Phone */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--gray-800)' }}>{c.fullName}</span>
                    <span
                      className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0"
                      style={{ background: 'var(--gray-100)', color: 'var(--gray-500)', border: '1px solid var(--gray-200)' }}
                    >
                      {c.customerCode}
                    </span>
                  </div>
                  {c.phoneNumber && (
                    <p className="text-[11px] sm:text-xs mt-0.5 truncate" style={{ color: 'var(--gray-400)' }}>{c.phoneNumber}</p>
                  )}
                </div>

                {/* Date + Actions */}
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <div className="hidden md:flex items-center gap-1 text-xs" style={{ color: 'var(--gray-400)' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button
                        id={`edit-customer-${c.id}`}
                        onClick={e => { e.stopPropagation(); onSelectCustomer(c.id, 'EDIT_CUSTOMER'); }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all"
                        title="Edit Customer"
                        style={{ color: 'var(--gray-400)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-primary-light)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-customer-${c.id}`}
                        onClick={e => handleDeleteClick(e, c.id, c.fullName)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all"
                        title="Delete Customer"
                        style={{ color: 'var(--gray-400)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 shrink-0" style={{ color: 'var(--gray-300)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          customerName={deleteTarget.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
