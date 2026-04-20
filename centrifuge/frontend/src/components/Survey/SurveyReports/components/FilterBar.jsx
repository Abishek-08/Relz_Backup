import React, { useEffect, useMemo, useState } from 'react';
import { Filter, X, AlertCircle } from 'lucide-react';

export default function FilterBar({ value, onChange, primaryColor = '#27235c', disabled = false, helperText = '', error = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const minTo = useMemo(() => (value.from ? value.from : ''), [value.from]);

  useEffect(() => {
    if (value.from && value.to && new Date(value.to) < new Date(value.from)) {
      onChange({ ...value, to: value.from });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.from]);

  const change = (patch) => onChange({ ...value, ...patch });

  const Input = ({ label, date, onDate, min }) => (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="date"
        value={date || ''}
        min={min || ''}
        onChange={(e) => onDate(e.target.value)}
        className={`border rounded px-2 py-1 text-sm cursor-pointer ${disabled ? 'bg-gray-100 text-gray-400 border-gray-200' : 'border-gray-300'}`}
        disabled={disabled}
      />
    </div>
  );

  const Filters = (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        label="From"
        date={value.from || ''}
        onDate={(v) => change({ from: v })}
      />
      <Input
        label="To"
        date={value.to || ''}
        onDate={(v) => change({ to: v })}
        min={minTo}
      />
      <button
        onClick={() => onChange({ from: '', to: '' })}
        className={`text-sm px-3 py-1 rounded border bg-white cursor-pointer hover:bg-gray-50 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ color: primaryColor, borderColor: primaryColor }}
        disabled={disabled}
        title="Clear filters"
      >
        Clear
      </button>
    </div>
  );

  const Helper = helperText ? (
    <div className={`mt-2 flex items-center gap-2 text-xs ${error ? 'text-red-600' : 'text-gray-600'}`}>
      <AlertCircle size={14} />
      <span>{helperText}</span>
    </div>
  ) : null;

  return (
    <>
      <div className="hidden md:block mt-3">
        {Filters}
        {Helper}
      </div>

      <div className="md:hidden mt-3">
        <button
          onClick={() => setMobileOpen(true)}
          className={`w-full text-sm px-3 py-2 border rounded-md bg-white flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors ${disabled ? 'opacity-70' : ''}`}
          style={{ borderColor: primaryColor, color: primaryColor }}
        >
          <Filter size={16} /> Filters
        </button>
        {Helper}
        {mobileOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl p-4 shadow-xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Filters</h3>
                <button onClick={() => setMobileOpen(false)} className="text-gray-600 text-sm cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-3">{Filters}</div>
              {Helper}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
