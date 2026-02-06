import { useState } from 'react';

// ✅ TASK: Build the "Dynamic Styling" component
// Goal: A box that changes its background color based on button clicks.
export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');
  
  return (
    <div>
       {/* 4. Build this together... */}
       <p style={{ color: '#94a3b8' }}>ColorPicker Skeleton... ready for code!</p>
    </div>
  );
}