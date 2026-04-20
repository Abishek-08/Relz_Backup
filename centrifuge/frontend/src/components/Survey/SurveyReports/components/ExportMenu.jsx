// src/components/ExportMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  exportAggregatedCSV, exportAggregatedExcel, exportAggregatedPDF,
  exportIndividualCSV, exportIndividualExcel, exportIndividualPDF
} from '../../../../services/Services';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '../../../../utils/useToast';

export default function ExportMenu({ view, eventId, dateRange, disabled = false }) {
  const [open, setOpen] = useState(false);
  const [loadingKey, setLoadingKey] = useState('');
  const { success, error } = useToast();
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const run = async (key, fn) => {
    try {
      setLoadingKey(key);
      const filename = await fn();
      success(`Exported ${filename}`);
    } catch (e) {
      error('Export failed');
    } finally {
      setLoadingKey('');
      setOpen(false);
    }
  };

  const items = [
    { label: 'CSV',   key: 'csv',   action: () => view === 'aggregated' ? exportAggregatedCSV(eventId, dateRange)    : exportIndividualCSV(eventId) },
    { label: 'Excel', key: 'excel', action: () => view === 'aggregated' ? exportAggregatedExcel(eventId, dateRange) : exportIndividualExcel(eventId) },
    { label: 'PDF',   key: 'pdf',   action: () => view === 'aggregated' ? exportAggregatedPDF(eventId, dateRange)   : exportIndividualPDF(eventId) },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => !disabled && setOpen(s => !s)}
        disabled={disabled}
        className={`px-3 py-1 text-sm border rounded-md transition flex items-center gap-2 ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-200 cursor-pointer'}`}
        title={disabled ? 'Nothing to export' : 'Export'}
      >
        <Download size={16} /> Export
      </button>
      {!disabled && open && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow border rounded-md z-10">
          <div className="px-3 py-2 text-xs text-gray-500">
            Export <strong className="capitalize">{view}</strong>
          </div>
          <div className="border-t">
            {items.map((it) => {
              const busy = loadingKey === it.key;
              return (
                <button
                  key={it.key}
                  disabled={!!loadingKey}
                  onClick={() => run(it.key, it.action)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 focus:bg-gray-50 transition ${busy ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}