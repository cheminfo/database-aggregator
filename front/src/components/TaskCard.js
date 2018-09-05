import React from 'react';

export default function TaskCard({ children }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-auto px-6 py-4 mb-6">
      {children}
    </div>
  );
}
