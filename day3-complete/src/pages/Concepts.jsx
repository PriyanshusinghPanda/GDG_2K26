import { Container, Grid, Card } from 'gdg-ui';
import Counter from '../components/Counter';
import TextInput from '../components/TextInput';
import LightSwitch from '../components/LightSwitch';
import ColorPicker from '../components/ColorPicker';
import SkillList from '../components/SkillList';
import RegistrationForm from '../components/RegistrationForm';

export default function Concepts() {
  return (
    <Container style={{ padding: '4rem 0' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Concept Sandbox</h1>
      
      <Grid>
        <Card title="1. The Classic Counter" emoji="🔢">
          <Counter />
        </Card>

        <Card title="2. Live Text Input" emoji="✍️">
          <TextInput />
        </Card>

        <Card title="3. The Light Switch" emoji="💡">
          <LightSwitch />
        </Card>

        <Card title="4. Dynamic Styling" emoji="🎨">
          <ColorPicker />
        </Card>

        <Card title="5. Learning List" emoji="🚀">
          <SkillList />
        </Card>

        <Card title="6. Join the Bootcamp" emoji="⚡">
          <RegistrationForm />
        </Card>
      </Grid>
    </Container>
  );
}
