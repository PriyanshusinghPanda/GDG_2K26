import { useState } from 'react';
import { Button } from 'gdg-ui';

// ✅ TASK: Build the "The Light Switch"
// Goal: A circle that changes color and a button that toggles state.
export default function LightSwitch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
       {/* 3. Build this together... */}
       <p style={{ color: '#94a3b8' }}>LightSwitch Skeleton... ready for code!</p>
    </div>
  );
}
