// src/components/ReportHeader.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

export default React.memo(function ReportHeader({ color = '#27235c' }) {
  return (
    <div className="rounded-xl p-0">
      <div className="flex items-center gap-3 text-gray-900">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
          <BarChart3 size={20} className="text-gray-800" />
        </div>
        <div>
          <h1 className="text-base md:text-lg font-semibold leading-tight">Survey Reports</h1>
          <p className="text-xs text-gray-600">Aggregated insights &amp; individual submissions</p>
        </div>
      </div>
    </div>
  );
});