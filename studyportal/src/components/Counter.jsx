import { useState } from 'react';
import { Button } from 'gdg-ui';

// ✅ TASK: Build the "The Classic Counter"
// Goal: A label and two buttons (+ and -) using 'count' state.
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
       {/* 1. Build this together... */}
       <p style={{ color: '#94a3b8' }}>Counter Skeleton... ready for code!</p>
    </div>
  );
}
