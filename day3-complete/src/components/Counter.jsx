import { useState } from 'react';
import { Button } from 'gdg-ui';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
      <Button onClick={() => setCount(count - 1)} style={{ padding: '0.5rem 1rem' }}>-</Button>
      <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{count}</span>
      <Button onClick={() => setCount(count + 1)} style={{ padding: '0.5rem 1rem' }}>+</Button>
    </div>
  );
}
