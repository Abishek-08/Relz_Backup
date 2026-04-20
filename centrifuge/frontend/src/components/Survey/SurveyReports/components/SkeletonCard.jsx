import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[460px]">
      <div className="p-4 border-b bg-gray-50 animate-pulse">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded mt-2" />
      </div>
      <div className="p-4 animate-pulse">
        <div className="h-56 w-full bg-gray-100 rounded" />
        <div className="h-8 w-32 bg-gray-100 rounded mt-4" />
      </div>
    </div>
  );
}