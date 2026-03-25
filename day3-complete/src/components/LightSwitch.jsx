import { useState } from 'react';
import { Button } from 'gdg-ui';

export default function LightSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        borderRadius: '50%', 
        background: isOn ? 'yellow' : '#334155',
        boxShadow: isOn ? '0 0 40px yellow' : 'none',
        margin: '1rem auto' 
      }} />
      <Button onClick={() => setIsOn(!isOn)} style={{ width: '100%', marginTop: '1rem' }}>
        {isOn ? 'Turn OFF' : 'Turn ON'}
      </Button>
    </div>
  );
}
