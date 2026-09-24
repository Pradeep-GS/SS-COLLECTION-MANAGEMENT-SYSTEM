import React, { useState } from 'react';
import { ArrowLeft, Save, Shield, Ruler, User, Phone, Tag, FileText, Loader2 } from 'lucide-react';
import { GARMENT_FIELDS as SHARED_FIELDS, GARMENT_CATEGORIES as SHARED_CATEGORIES } from '@ss-mgmt/shared';
import { useAuth } from '../context/AuthContext';

const LOCAL_CATEGORIES = ['BLOUSE', 'CHUDI', 'SAREE', 'KURTI', 'LEHENGA', 'SALWAR', 'SHIRT', 'PANT', 'SUIT', 'CUSTOM'];
const GARMENT_CATEGORIES = SHARED_CATEGORIES || LOCAL_CATEGORIES;

export default function EditCustomerPage({ customer, onUpdateCustomer, onNavigate }) {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(customer?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(customer?.phoneNumber || '');
  const [category, setCategory] = useState('BLOUSE');
  const [loading, setLoading] = useState(false);

  const existingCategoryMeasurement = (customer?.measurements || []).find(
    m => (m.garmentType === 'BLOUSE' || m.garment_type === 'BLOUSE') && (m.isLatest !== false && m.is_latest !== false)
  );

  const [measurementInput, setMeasurementInput] = useState(existingCategoryMeasurement?.data || {});
  const [notes, setNotes] = useState(existingCategoryMeasurement?.notes || '');

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto p-10 card text-center space-y-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <Shield className="w-7 h-7" style={{ color: '#D97706' }} />
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--gray-800)', fontFamily: 'var(--font-heading)' }}>
          Admin Permission Required
        </h3>
        <p className="text-sm" style={{ color: 'var(--gray-500)' }}>
          Only Admin users can edit customer records and measurements.
        </p>
        <button onClick={() => onNavigate('DASHBOARD')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCategorySwitch = (newCat) => {
    setCategory(newCat);
    const existing = (customer?.measurements || []).find(
      m => (m.garmentType === newCat || m.garment_type === newCat) && (m.isLatest !== false && m.is_latest !== false)
    );
    setMeasurementInput(existing?.data || {});
    setNotes(existing?.notes || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) {
      alert('Customer name and phone number cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await onUpdateCustomer(customer.id, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        garmentType: category,
        measurementData: measurementInput,
        notes: notes.trim()
      });
    } finally {
      setLoading(false);
    }
  };

  const fieldsForCategory = SHARED_FIELDS[category] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <button
          onClick={() => onNavigate('VIEW_CUSTOMER')}
          className="inline-flex items-center gap-2 text-xs font-semibold transition-colors self-start"
          style={{ color: 'var(--gray-500)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-500)'}
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </button>
        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold self-start sm:self-auto"
          style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}
        >
          <Shield className="w-3.5 h-3.5" /> Admin Edit Mode
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        {/* Section 1: Customer Details */}
        <div className="card p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--accent-primary)' }}>1</div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>Customer Details</h3>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--gray-400)' }}>
                Editing: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{customer?.customerCode || customer?.customer_code}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gray-600)' }}>
                <User className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Full Name *
              </label>
              <input
                id="edit-fullname"
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gray-600)' }}>
                <Phone className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Phone Number *
              </label>
              <input
                id="edit-phone"
                type="text"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Garment Type */}
        <div className="card p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: '#7C3AED' }}>2</div>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
              <Tag className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} /> Garment Type to Modify
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {GARMENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySwitch(cat)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0"
                style={{
                  background: category === cat ? 'var(--accent-primary)' : 'var(--gray-50)',
                  color: category === cat ? 'white' : 'var(--gray-500)',
                  border: `1.5px solid ${category === cat ? 'var(--accent-primary)' : 'var(--gray-200)'}`,
                  boxShadow: category === cat ? '0 2px 8px rgba(79,70,229,0.2)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Measurements */}
        <div className="card p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: '#16A34A' }}>3</div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
                {category} Fields
              </h3>
            </div>
            <Ruler className="w-4 h-4" style={{ color: '#16A34A' }} />
          </div>

          {fieldsForCategory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
              {fieldsForCategory.map(field => (
                <div key={field.key} className="min-w-0">
                  <label className="block text-[10px] sm:text-[11px] font-semibold mb-1 truncate" style={{ color: 'var(--gray-500)' }} title={field.label}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={measurementInput[field.key] || ''}
                      placeholder={field.placeholder}
                      onChange={e => setMeasurementInput({ ...measurementInput, [field.key]: e.target.value })}
                      className="input-field pr-8 sm:pr-9 text-xs sm:text-sm"
                    />
                    {field.unit && (
                      <span className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-bold uppercase pointer-events-none" style={{ color: 'var(--gray-400)' }}>
                        {field.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--gray-400)' }}>No predefined fields for this garment type.</p>
          )}
        </div>

        {/* Section 4: Notes */}
        <div className="card p-4 sm:p-6 space-y-3">
          <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
            <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Tailor Notes
          </label>
          <textarea
            id="edit-notes"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="input-field"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 py-1">
          <button type="button" onClick={() => onNavigate('VIEW_CUSTOMER')} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button id="save-edit-btn" type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}
