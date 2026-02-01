// Quiz.jsx — Page component that renders the pre-built QuizPortal
import { useEffect } from 'react';
import QuizPortal from '../components/QuizPortal';

function Quiz() {
  // useEffect to set document title on mount
  useEffect(() => {
    document.title = "Quiz | StudyPortal";
  }, []);

  return (
    <div>
      <QuizPortal />
    </div>
  );
}

export default Quiz;
