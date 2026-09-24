import React, { useState } from 'react';
import {
  ArrowLeft, Edit3, Trash2, Clock, Ruler, User, Phone,
  Shield, Calendar, FileText, Loader2, CheckCircle2, AlertCircle, Scissors, Eye
} from 'lucide-react';
import { GARMENT_FIELDS as SHARED_FIELDS, GARMENT_CATEGORIES as SHARED_CATEGORIES } from '@ss-mgmt/shared';
import { useAuth } from '../context/AuthContext';
import { addInstruction } from '../services/api';

const LOCAL_CATEGORIES = ['BLOUSE', 'CHUDI', 'SAREE', 'KURTI', 'LEHENGA', 'SALWAR', 'SHIRT', 'PANT', 'SUIT', 'CUSTOM'];
const GARMENT_CATEGORIES = SHARED_CATEGORIES || LOCAL_CATEGORIES;

// ---- Instruction Form ----
function InstructionForm({ customerId, selectedCategory, onSuccess }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await addInstruction(customerId, note.trim(), selectedCategory);
      if (res.success) {
        setFeedback({ type: 'success', msg: 'Instruction added successfully.' });
        setNote('');
        if (onSuccess) onSuccess();
      } else {
        setFeedback({ type: 'error', msg: res.error || 'Failed to add instruction.' });
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Failed to add instruction.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-3">
      <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
        <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
        Add Instruction
      </h4>
      <textarea
        id="instruction-input"
        rows={3}
        placeholder="Enter tailoring instruction..."
        value={note}
        onChange={e => setNote(e.target.value)}
        className="input-field resize-none text-xs sm:text-sm"
        style={{ resize: 'none' }}
      />
      {feedback && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium animate-slide-down"
          style={{
            background: feedback.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${feedback.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            color: feedback.type === 'success' ? '#15803D' : '#B91C1C'
          }}
        >
          {feedback.type === 'success'
            ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
          {feedback.msg}
        </div>
      )}
      <button
        id="add-instruction-submit"
        type="submit"
        disabled={loading || !note.trim()}
        className="btn-primary w-full sm:w-auto"
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><FileText className="w-4 h-4" /> Add Instruction</>}
      </button>
    </form>
  );
}

// ---- Measurement tile ----
function MeasurementTile({ label, value, unit }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl min-w-0" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 truncate" style={{ color: 'var(--gray-400)' }} title={label}>{label}</p>
      <p className="text-sm sm:text-base font-extrabold truncate" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
        {value ? `${value}${unit ? ' ' + unit : ''}` : '—'}
      </p>
    </div>
  );
}

export default function CustomerDetailPage({ customer, onDeleteCustomer, onNavigate, onRefresh }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isTailor = user?.role === 'STAFF' && user?.staffType === 'TAILOR';
  const isFullDetail = user?.role === 'STAFF' && user?.staffType === 'FULL_DETAIL';

  const existingCategories = Array.from(
    new Set((customer?.measurements || []).map(m => m.garmentType || m.garment_type))
  ).filter(Boolean);

  const availableCategories = Array.from(new Set([...existingCategories, ...GARMENT_CATEGORIES]));

  const [selectedCategory, setSelectedCategory] = useState(
    existingCategories.length > 0 ? existingCategories[0] : 'BLOUSE'
  );
  const [showHistory, setShowHistory] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!customer) {
    return (
      <div className="max-w-lg mx-auto p-8 sm:p-12 text-center card space-y-4 animate-fade-in">
        <p className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>Customer record not found.</p>
        <button onClick={() => onNavigate('DASHBOARD')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const categoryMeasurements = (customer.measurements || []).filter(
    m => (m.garmentType === selectedCategory || m.garment_type === selectedCategory)
  );
  const latestMeasurement = categoryMeasurements.find(m => m.isLatest || m.is_latest) || categoryMeasurements[0];
  const categoryFields = SHARED_FIELDS[selectedCategory] || [];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5 animate-fade-in">

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <button
          onClick={() => onNavigate('DASHBOARD')}
          className="inline-flex items-center gap-2 text-xs font-semibold transition-colors self-start"
          style={{ color: 'var(--gray-500)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-500)'}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {isAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="edit-customer-btn"
              onClick={() => onNavigate('EDIT_CUSTOMER')}
              className="btn-primary"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Customer
            </button>
            <button
              id="delete-customer-btn"
              onClick={() => setDeleteConfirm(true)}
              className="btn-danger"
              title="Delete Customer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {!isAdmin && (
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto"
            style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', color: 'var(--gray-500)' }}
          >
            {isTailor ? <Scissors className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {isTailor ? 'Tailor View' : 'Full Detail View'}
          </span>
        )}
      </div>

      {/* Customer Info Card */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-row items-center gap-3.5 sm:gap-5">
          {/* Avatar */}
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-extrabold shrink-0"
            style={{ background: 'var(--accent-primary)', boxShadow: '0 8px 20px rgba(79,70,229,0.2)' }}
          >
            {customer.fullName?.charAt(0)?.toUpperCase() || 'C'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-xl font-extrabold truncate" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
                {customer.fullName}
              </h2>
              <span
                className="text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shrink-0"
                style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', border: '1px solid rgba(79,70,229,0.15)' }}
              >
                {customer.customerCode || customer.customer_code}
              </span>
            </div>

            <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {/* Phone — only for Admin and Full Detail staff */}
              {(isAdmin || isFullDetail) && customer.phoneNumber && (
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: 'var(--gray-600)' }}>
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gray-400)' }} />
                  {customer.phoneNumber}
                </span>
              )}
              {customer.createdAt && (
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: 'var(--gray-500)' }}>
                  <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gray-400)' }} />
                  Registered {new Date(customer.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Measurements Card */}
      <div className="card overflow-hidden">
        {/* Category Tabs */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-4" style={{ borderBottom: '1px solid var(--gray-100)', background: 'var(--gray-25)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
              {availableCategories.map(cat => {
                const hasRecord = existingCategories.includes(cat);
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0"
                    style={{
                      background: isActive ? 'var(--accent-primary)' : hasRecord ? 'white' : 'var(--gray-50)',
                      color: isActive ? 'white' : hasRecord ? 'var(--accent-primary)' : 'var(--gray-400)',
                      border: `1.5px solid ${isActive ? 'var(--accent-primary)' : hasRecord ? 'rgba(79,70,229,0.3)' : 'var(--gray-200)'}`,
                      boxShadow: isActive ? '0 2px 8px rgba(79,70,229,0.2)' : 'none'
                    }}
                  >
                    {cat} {!hasRecord && <span style={{ opacity: 0.6 }}>+</span>}
                  </button>
                );
              })}
            </div>

            {existingCategories.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 self-start shrink-0"
                style={{
                  background: showHistory ? 'var(--accent-primary-light)' : 'var(--white)',
                  color: showHistory ? 'var(--accent-primary)' : 'var(--gray-500)',
                  border: `1px solid ${showHistory ? 'rgba(79,70,229,0.2)' : 'var(--gray-200)'}`
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {showHistory ? 'Hide History' : 'View History'}
              </button>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Measurements section header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
              <Ruler className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              {selectedCategory} Measurements
              {latestMeasurement && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                  v{latestMeasurement.version || 1}
                </span>
              )}
            </h3>
            {(isAdmin || isFullDetail) && latestMeasurement && (
              <span className="text-[11px]" style={{ color: 'var(--gray-400)' }}>
                Read Only for Staff
              </span>
            )}
          </div>

          {!latestMeasurement ? (
            <div className="py-8 sm:py-10 px-4 text-center rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
              <Ruler className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gray-300)' }} />
              <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--gray-500)' }}>
                No {selectedCategory} measurements recorded yet.
              </p>
              {isAdmin && (
                <button onClick={() => onNavigate('EDIT_CUSTOMER')} className="btn-primary mt-3">
                  <Edit3 className="w-3.5 h-3.5" /> Add Measurements
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5 sm:space-y-4">
              {/* Measurement Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                {categoryFields.length > 0 ? (
                  categoryFields.map(f => (
                    <MeasurementTile key={f.key} label={f.label} value={latestMeasurement.data[f.key]} unit={f.unit} />
                  ))
                ) : (
                  Object.entries(latestMeasurement.data || {}).map(([k, v]) => (
                    <MeasurementTile key={k} label={k} value={v} />
                  ))
                )}
              </div>

              {/* Notes */}
              {latestMeasurement.notes && (
                <div className="p-3.5 sm:p-4 rounded-xl" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gray-400)' }}>
                    <FileText className="w-3.5 h-3.5" /> Instructions & Notes
                  </p>
                  <p className="text-xs sm:text-sm whitespace-pre-line break-words" style={{ color: 'var(--gray-700)' }}>
                    {latestMeasurement.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {showHistory && categoryMeasurements.length > 0 && (
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--gray-100)' }}>
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--gray-500)' }}>
                <Clock className="w-3.5 h-3.5" /> Measurement History — {selectedCategory}
              </h4>
              {categoryMeasurements.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl gap-2"
                  style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}
                >
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold truncate block" style={{ color: 'var(--gray-700)' }}>Version {m.version || categoryMeasurements.length - idx}</span>
                    <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
                      {new Date(m.createdAt || m.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {(m.isLatest || m.is_latest) ? (
                    <span className="text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                      Current
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0" style={{ background: 'var(--gray-100)', color: 'var(--gray-400)' }}>
                      Archived
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instruction Form — Staff only */}
      {(isTailor || isFullDetail) && customer?.id && (
        <InstructionForm
          customerId={customer.id}
          selectedCategory={selectedCategory}
          onSuccess={onRefresh}
        />
      )}

      {/* Admin delete confirmation modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
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
                  Delete <strong style={{ color: 'var(--gray-800)' }}>{customer.fullName}</strong>? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 mt-5 sm:mt-6 pt-4" style={{ borderTop: '1px solid var(--gray-100)' }}>
              <button id="delete-cancel-modal" className="btn-secondary w-full sm:w-auto" onClick={() => setDeleteConfirm(false)}>Cancel</button>
              <button id="delete-confirm-modal" className="btn-danger w-full sm:w-auto" onClick={() => { onDeleteCustomer(customer.id, customer.fullName); setDeleteConfirm(false); }}>
                <Trash2 className="w-4 h-4" /> Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
