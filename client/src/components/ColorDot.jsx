// client/src/components/ColorDot.jsx
import React from 'react';

export default function ColorDot({ hex, border, size = 16, title }) {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    background: hex ?? 'transparent',
    display: 'inline-block',
    border: `1px solid ${border ?? '#d1d5db'}`,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
    verticalAlign: 'middle',
    marginRight: 6,
  };
  return <span style={style} title={title} aria-label={title} />;
}
