import { useState } from 'react';
import { Button, Input } from 'gdg-ui';

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setUser(name);
  };

  return (
    <div>
      {!user ? (
        <form onSubmit={handleRegister}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" style={{ width: '100%' }}>Register now</Button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <h3>Success! 🎉</h3>
          <p>Welcome to the bootcamp, {user}!</p>
        </div>
      )}
    </div>
  );
}
