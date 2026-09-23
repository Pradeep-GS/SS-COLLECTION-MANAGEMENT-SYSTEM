import React, { useState } from 'react';
import { ArrowLeft, Save, User, Phone, Tag, FileText, Ruler, Loader2 } from 'lucide-react';
import { GARMENT_FIELDS as SHARED_FIELDS, GARMENT_CATEGORIES as SHARED_CATEGORIES } from '@ss-mgmt/shared';

const LOCAL_CATEGORIES = ['BLOUSE', 'CHUDI', 'SAREE', 'KURTI', 'LEHENGA', 'SALWAR', 'SHIRT', 'PANT', 'SUIT', 'CUSTOM'];
const GARMENT_CATEGORIES = SHARED_CATEGORIES || LOCAL_CATEGORIES;

export default function AddCustomerPage({ onAddCustomer, onNavigate }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('BLOUSE');
  const [measurementInput, setMeasurementInput] = useState({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;
    setLoading(true);
    try {
      await onAddCustomer({
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
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('DASHBOARD')}
          className="inline-flex items-center gap-2 text-xs font-semibold transition-colors"
          style={{ color: 'var(--gray-500)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-500)'}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="text-right">
          <h2 className="text-base font-bold" style={{ color: 'var(--gray-900)', fontFamily: 'var(--font-heading)' }}>
            Register New Customer
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--gray-400)' }}>
            Save customer details and measurements
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Section 1: Customer Details */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-primary)' }}>1</div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
              Customer Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gray-600)' }}>
                <User className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Full Name *
              </label>
              <input
                id="customer-fullname"
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--gray-600)' }}>
                <Phone className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> Phone Number *
              </label>
              <input
                id="customer-phone"
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Garment Type */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: '#7C3AED' }}>2</div>
            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
              <Tag className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} /> Garment Type
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {GARMENT_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => { setCategory(cat); setMeasurementInput({}); }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
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
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: '#16A34A' }}>3</div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
                {category} Measurements
              </h3>
            </div>
            <Ruler className="w-4 h-4" style={{ color: '#16A34A' }} />
          </div>

          {fieldsForCategory.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {fieldsForCategory.map(field => (
                <div key={field.key}>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: 'var(--gray-500)' }}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={measurementInput[field.key] || ''}
                      onChange={e => setMeasurementInput({ ...measurementInput, [field.key]: e.target.value })}
                      className="input-field pr-9"
                      style={{ fontSize: '0.8125rem' }}
                    />
                    {field.unit && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase" style={{ color: 'var(--gray-400)' }}>
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
        <div className="card p-6 space-y-3">
          <label className="block text-sm font-bold flex items-center gap-2" style={{ color: 'var(--gray-700)', fontFamily: 'var(--font-heading)' }}>
            <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            Tailoring Notes
          </label>
          <textarea
            id="customer-notes"
            rows={3}
            placeholder="e.g. Deep back neck, extra 2-inch side margin, piping..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="input-field"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 py-2">
          <button type="button" onClick={() => onNavigate('DASHBOARD')} className="btn-secondary">
            Cancel
          </button>
          <button id="save-customer-btn" type="submit" disabled={loading} className="btn-primary">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Customer</>}
          </button>
        </div>
      </form>
    </div>
  );
}
