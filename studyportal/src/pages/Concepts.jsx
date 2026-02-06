import { Container, Grid, Card } from 'gdg-ui';

// 🟦 SESSION GOAL: We will build these one-by-one in the src/components folder!
import Counter from '../components/Counter';
import TextInput from '../components/TextInput';
import LightSwitch from '../components/LightSwitch';
import ColorPicker from '../components/ColorPicker';
import SkillList from '../components/SkillList';
import RegistrationForm from '../components/RegistrationForm';

export default function Concepts() {
  return (
    <div style={{ padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Concept Sandbox</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* ✅ TASK: Build these 6 boxes! */}
        <div style={{ padding: '1.5rem', border: '1px solid #334155', borderRadius: '12px' }}>
          <h3>1. Counter</h3>
          <Counter />
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #334155', borderRadius: '12px' }}>
          <h3>2. Text Input</h3>
          <TextInput />
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #334155', borderRadius: '12px' }}>
          <h3>3. Light Switch</h3>
          <LightSwitch />
        </div>
        
        {/* ... students will add more boxes here */}
      </div>
    </div>
  );
}
