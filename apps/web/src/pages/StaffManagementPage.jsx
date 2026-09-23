import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Trash2, Loader2, AlertCircle, CheckCircle2,
  ChevronRight, X, Scissors, Eye
} from 'lucide-react';
import { fetchStaff, createStaff, removeStaff } from '../services/api';

function ConfirmModal({ staff, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#FEE2E2' }}>
            <Trash2 className="w-5 h-5" style={{ color: '#DC2626' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
              Remove Staff Member?
            </h3>
            <p className="text-sm mt-1.5" style={{ color: 'var(--gray-500)' }}>
              Are you sure you want to remove <strong style={{ color: 'var(--gray-800)' }}>{staff?.name}</strong>?
              They will no longer be able to log in.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4" style={{ borderTop: '1px solid var(--gray-100)' }}>
          <button id="confirm-cancel" className="btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            id="confirm-remove"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Remove Staff
          </button>
        </div>
      </div>
    </div>
  );
}

const STAFF_TYPE_OPTIONS = [
  { value: 'TAILOR', label: 'Tailor', description: 'View customer name and measurements only', icon: Scissors },
  { value: 'FULL_DETAIL', label: 'Full Detail Staff', description: 'View complete customer information', icon: Eye }
];

export default function StaffManagementPage({ onShowToast }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formType, setFormType] = useState('TAILOR');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Remove modal state
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const loadStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchStaff();
      if (res.success) {
        setStaffList(res.data.staff);
      } else {
        setError(res.error || 'Failed to load staff.');
      }
    } catch (err) {
      setError('Failed to load staff.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName.trim()) { setFormError('Name is required.'); return; }
    if (!formEmail.trim()) { setFormError('Email is required.'); return; }
    if (!formEmail.includes('@')) { setFormError('Please enter a valid email.'); return; }

    setFormLoading(true);
    try {
      const res = await createStaff({ name: formName.trim(), email: formEmail.trim(), staffType: formType });
      if (res.success) {
        setFormSuccess(`${res.data.name} added successfully! Default password: 123456`);
        setFormName('');
        setFormEmail('');
        setFormType('TAILOR');
        await loadStaff();
        setTimeout(() => setFormSuccess(''), 5000);
      } else {
        setFormError(res.error || 'Failed to add staff member.');
      }
    } catch (err) {
      setFormError('Failed to add staff member.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!removeTarget) return;
    setRemoveLoading(true);
    try {
      const res = await removeStaff(removeTarget.id);
      if (res.success) {
        onShowToast(`${removeTarget.name} has been removed.`);
        setRemoveTarget(null);
        await loadStaff();
      } else {
        onShowToast(`Error: ${res.error || 'Failed to remove staff.'}`);
        setRemoveTarget(null);
      }
    } catch {
      onShowToast('Error: Failed to remove staff.');
      setRemoveTarget(null);
    } finally {
      setRemoveLoading(false);
    }
  };

  const staffTypeLabel = (type) => {
    if (type === 'TAILOR') return { text: 'Tailor', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
    if (type === 'FULL_DETAIL') return { text: 'Full Detail', color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' };
    return { text: type, color: 'var(--gray-600)', bg: 'var(--gray-50)', border: 'var(--gray-200)' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
          Staff Management
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--gray-500)' }}>
          Add, view, and manage staff accounts. Default password for new staff is <strong>123456</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* === Add Staff Form === */}
        <div className="lg:col-span-2">
          <form onSubmit={handleAddStaff} className="card p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-primary-light)' }}>
                <UserPlus className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              </div>
              Add New Staff
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                Full Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="staff-name"
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--gray-700)' }}>
                Email Address <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="staff-email"
                type="email"
                placeholder="ravi@sstailors.com"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Staff Type */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--gray-700)' }}>
                Staff Type <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div className="space-y-2">
                {STAFF_TYPE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <label
                    key={value}
                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all"
                    style={{
                      border: `1.5px solid ${formType === value ? 'var(--accent-primary)' : 'var(--gray-200)'}`,
                      background: formType === value ? 'var(--accent-primary-light)' : 'var(--white)'
                    }}
                  >
                    <input
                      type="radio"
                      name="staffType"
                      value={value}
                      checked={formType === value}
                      onChange={() => setFormType(value)}
                      className="mt-0.5 shrink-0"
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" style={{ color: formType === value ? 'var(--accent-primary)' : 'var(--gray-500)' }} />
                        <span className="text-xs font-bold" style={{ color: formType === value ? 'var(--accent-primary)' : 'var(--gray-700)' }}>
                          {label}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--gray-500)' }}>{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Default Password Notice */}
            <div className="px-3 py-2.5 rounded-lg flex items-center gap-2" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
              <span className="text-xs" style={{ color: 'var(--gray-500)' }}>
                🔑 Default password will be set to <strong style={{ color: 'var(--gray-700)' }}>123456</strong>
              </span>
            </div>

            {/* Feedback */}
            {formError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg animate-slide-down" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: '#DC2626' }} />
                <span className="text-xs font-medium" style={{ color: '#B91C1C' }}>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg animate-slide-down" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#16A34A' }} />
                <span className="text-xs font-medium" style={{ color: '#15803D' }}>{formSuccess}</span>
              </div>
            )}

            <button
              id="add-staff-submit"
              type="submit"
              disabled={formLoading}
              className="btn-primary w-full justify-center"
            >
              {formLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
              ) : (
                <><UserPlus className="w-4 h-4" /> Add Staff Member</>
              )}
            </button>
          </form>
        </div>

        {/* === Staff List === */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--gray-100)' }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
                  Current Staff
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
                  {staffList.length} staff member{staffList.length !== 1 ? 's' : ''} registered
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)' }}>
                <Users className="w-4 h-4" style={{ color: 'var(--gray-400)' }} />
              </div>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center gap-3" style={{ color: 'var(--gray-400)' }}>
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-xs">Loading staff...</span>
              </div>
            ) : error ? (
              <div className="py-10 flex flex-col items-center gap-2" style={{ color: '#DC2626' }}>
                <AlertCircle className="w-5 h-5" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            ) : staffList.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2" style={{ color: 'var(--gray-400)' }}>
                <Users className="w-8 h-8" style={{ color: 'var(--gray-300)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--gray-500)' }}>No staff members yet</p>
                <p className="text-xs">Add your first staff member using the form.</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--gray-100)' }}>
                {staffList.map((s) => {
                  const typeInfo = staffTypeLabel(s.staffType);
                  return (
                    <div
                      key={s.id}
                      className="px-5 py-4 flex items-center justify-between gap-3 group transition-colors"
                      style={{ background: 'var(--white)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ background: 'var(--accent-primary)' }}
                        >
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--gray-800)' }}>{s.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--gray-400)' }}>{s.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ background: typeInfo.bg, color: typeInfo.color, border: `1px solid ${typeInfo.border}` }}
                        >
                          {typeInfo.text}
                        </span>

                        <button
                          id={`remove-staff-${s.id}`}
                          onClick={() => setRemoveTarget(s)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                          title="Remove staff member"
                          style={{ color: 'var(--gray-400)', background: 'transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gray-400)'; }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Remove Modal */}
      {removeTarget && (
        <ConfirmModal
          staff={removeTarget}
          onConfirm={handleConfirmRemove}
          onCancel={() => setRemoveTarget(null)}
          loading={removeLoading}
        />
      )}
    </div>
  );
}
