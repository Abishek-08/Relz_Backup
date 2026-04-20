import React from 'react';
import * as Icons from 'lucide-react';

export default function EmptyState({ title = 'No data', subtitle = 'Try adjusting filters.', icon = 'Info', big = false }) {
  const IconComp = Icons[icon] || Icons.Info;
  return (
    <div className={`bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-center mx-auto ${big ? 'py-16' : 'py-10'}`}>
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
        <IconComp size={22} />
      </div>
      <div className="mt-3 text-gray-900 font-semibold text-xl">{title}</div>
      <div className="text-gray-600 text-sm mt-1">{subtitle}</div>
    </div>
  );
}