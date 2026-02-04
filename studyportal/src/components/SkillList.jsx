import { useState } from 'react';
import { Badge, Input, Button } from 'gdg-ui';

// ✅ TASK: Build the "Learning List"
// Goal: An input to add new items to an array (State with Arrays).
export default function SkillList() {
  const [items, setItems] = useState(['HTML', 'CSS', 'JS']);
  const [text, setText] = useState('');

  return (
    <div>
       {/* 5. Build this together... */}
       <p style={{ color: '#94a3b8' }}>SkillList Skeleton... ready for code!</p>
    </div>
  );
}
