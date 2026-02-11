'use client';

import React from 'react';

export default function SearchInput({ value, onChange, placeholder = "Chercher un patient", className }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={className}
    />
  );
}