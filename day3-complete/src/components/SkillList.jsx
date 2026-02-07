import { useState } from 'react';
import { Badge, Input, Button } from 'gdg-ui';

export default function SkillList() {
  const [items, setItems] = useState(['HTML', 'CSS', 'JS']);
  const [text, setText] = useState('');

  const handleAddItem = () => {
    if (text) {
        setItems([...items, text]);
        setText('');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
          <Input placeholder="New skill..." value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={handleAddItem}>Add</Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {items.map((item, i) => (
          <Badge key={i}>{item}</Badge>
        ))}
      </div>
    </div>
  );
}
