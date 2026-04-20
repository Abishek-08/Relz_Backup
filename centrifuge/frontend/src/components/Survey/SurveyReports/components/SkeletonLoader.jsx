import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded mt-2" />
          <div className="h-48 w-full bg-gray-100 rounded mt-4" />
        </div>
      ))}
    </div>
  );
}
