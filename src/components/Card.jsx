// Card.jsx — reusable component to display info cards with emoji
import './Card.css';

// The Card component receives "title", "description", and "emoji" via props
function Card({ title, description, emoji }) {
  return (
    <div className="card">
      <h3 className="card-title">{emoji} {title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
}

export default Card;
