import { useState } from 'react';
import { Input } from 'gdg-ui';

export default function TextInput() {
  const [text, setText] = useState('');

  return (
    <div>
      <Input 
        placeholder="Type something..." 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <p style={{ color: '#94a3b8' }}>Preview: <span style={{ color: 'white' }}>{text || 'Waiting for input...'}</span></p>
    </div>
  );
}
