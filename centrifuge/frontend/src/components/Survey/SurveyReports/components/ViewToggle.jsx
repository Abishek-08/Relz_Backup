import React from 'react';

export default function ViewToggle({ value, onChange, primaryColor = '#27235c' }) {
  const isAgg = value === 'aggregated';

  return (
    <div
      role="tablist"
      aria-label="View toggle"
      className="relative inline-flex items-center select-none rounded-full border border-gray-300 bg-white shadow-sm"
      style={{ width: 220, height: 36 }}
    >
      {/* Sliding knob */}
      <div
        className="absolute top-0.5 bottom-0.5 rounded-full transition-all duration-200"
        style={{
          width: '50%',
          left: isAgg ? '0.5%' : '49.5%',
          background: primaryColor,
        }}
      />
      {/* Buttons */}
      <button
        role="tab"
        aria-selected={isAgg}
        onClick={() => onChange('aggregated')}
        className={`relative z-10 w-1/2 h-full text-sm font-medium transition-colors ${
          isAgg ? 'text-white' : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        Insights
      </button>
      <button
        role="tab"
        aria-selected={!isAgg}
        onClick={() => onChange('individual')}
        className={`relative z-10 w-1/2 h-full text-sm font-medium transition-colors ${
          !isAgg ? 'text-white' : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        Submissions
      </button>
    </div>
  );
}