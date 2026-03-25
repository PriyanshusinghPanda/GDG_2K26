import { useState } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');

  return (
    <div>
      <div style={{ 
        padding: '1rem', 
        borderRadius: '12px', 
        background: color, 
        textAlign: 'center',
        color: 'white',
        fontWeight: 700 
      }}>
        I change color!
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
        <div onClick={() => setColor('#ef4444')} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ef4444', cursor: 'pointer' }} />
        <div onClick={() => setColor('#22c55e')} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#22c55e', cursor: 'pointer' }} />
        <div onClick={() => setColor('#3b82f6')} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#3b82f6', cursor: 'pointer' }} />
      </div>
    </div>
  );
}
