// QuizPortal.jsx — A pre-built component that uses Gemini API to generate a quiz from notes
import { useState, useEffect } from 'react';
import './QuizPortal.css';

export default function QuizPortal() {
  // State for the text input
  const [topic, setTopic] = useState('');
  
  // State to track the current phase: 'idle', 'loading', 'quiz', 'results'
  const [appState, setAppState] = useState('idle');
  
  // State to store the generated questions
  const [questions, setQuestions] = useState([]);
  
  // State to track which question the user is currently answering
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State to keep score
  const [score, setScore] = useState(0);

  // Check for Gemini API key on mount to demonstrate useEffect
  useEffect(() => {
    if (!import.meta.env.VITE_GEMINI_KEY) {
      console.warn('VITE_GEMINI_KEY is missing from environment variables');
    }
  }, []);

  // Function to handle fetching questions from the Gemini API
  const generateQuiz = async () => {
    // If input is empty, do not proceed
    if (!topic.trim()) return;
    
    // Change state to loading to show a spinner to the user
    setAppState('loading');
    
    // Get the API key from Vite environment variables
    const apiKey = import.meta.env.VITE_GEMINI_KEY;
    
    // Define the exact prompt for Gemini
    const prompt = `Generate 5 multiple choice questions based on this topic or text: ${topic}. Return only a JSON array in this format: [{"question": "string", "options": ["string", "string", "string", "string"], "answer": "string"}]`;

    try {
      // Send a POST request to the Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      // Parse the JSON response from the fetch call
      const data = await response.json();
      
      // Extract the text content from Gemini's response structure
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Clean up the text response by removing markdown blocks if present
      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Convert the string into an actual JavaScript array of objects
      const parsedQuestions = JSON.parse(cleanJson);
      
      // Save the freshly generated questions into state
      setQuestions(parsedQuestions);
      
      // Reset score and question index for a new game
      setScore(0);
      setCurrentQuestionIndex(0);
      
      // Change the state to start the quiz!
      setAppState('quiz');
      
    } catch (error) {
      // If there's an error, log it and return to the idle screen
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Check API key and console.');
      setAppState('idle');
    }
  };

  // Function to handle an option click
  const handleAnswerClick = (selectedOption) => {
    // Check if the selected option matches the correct answer
    const isCorrect = selectedOption === questions[currentQuestionIndex].answer;
    
    // Add 1 to the score if correct
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Calculate the next question index
    const nextQuestion = currentQuestionIndex + 1;
    
    // If there are more questions, go to the next one
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      // Otherwise, we are done! Show the results screen.
      setAppState('results');
    }
  };

  // Function to reset everything and start over
  const resetQuiz = () => {
    setTopic('');
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setAppState('idle');
  };

  // Render the initial input screen
  if (appState === 'idle') {
    return (
      <div className="quiz-container">
        <h2>Generate a Quiz</h2>
        <p>Paste your notes or type a topic below:</p>
        <textarea 
          placeholder="e.g. Photosynthesis, variables in JavaScript, etc."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="quiz-textarea"
        />
        <button onClick={generateQuiz} className="quiz-btn">Generate Questions</button>
      </div>
    );
  }

  // Render a loading spinner screen
  if (appState === 'loading') {
    return (
      <div className="quiz-container text-center">
        <h2>Thinking...</h2>
        <div className="spinner"></div>
        <p>Gemini is reading your notes and creating questions.</p>
      </div>
    );
  }

  // Render the quiz question screen
  if (appState === 'quiz') {
    // Get the data for the current question
    const currentQ = questions[currentQuestionIndex];
    
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        
        <h3 className="question-text">{currentQ.question}</h3>
        
        <div className="options-container">
          {/* Map through the options array to render buttons */}
          {currentQ.options.map((option, index) => (
            <button 
              /* The key prop is required by React to identify which items have changed, been added or removed */
              key={index} 
              onClick={() => handleAnswerClick(option)}
              className="option-btn"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Render the final results screen
  if (appState === 'results') {
    return (
      <div className="quiz-container text-center">
        <h2>Quiz Complete!</h2>
        <p className="score-text">You scored {score} out of {questions.length}</p>
        <button onClick={resetQuiz} className="quiz-btn">Try Again</button>
      </div>
    );
  }

  // Fallback return just in case
  return null;
}
