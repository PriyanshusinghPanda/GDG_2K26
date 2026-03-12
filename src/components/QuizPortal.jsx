import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './QuizPortal.css';

const STORAGE_USER_KEY = 'studyportal_user';
const STORAGE_HISTORY_KEY = 'studyportal_quiz_history';
const STORAGE_SHARED_KEY = 'studyportal_shared_quizzes';
const STORAGE_PREFS_KEY = 'studyportal_quiz_prefs';
const STORAGE_REVIEW_KEY = 'studyportal_review_cards';
const STORAGE_CLASSROOM_KEY = 'studyportal_classrooms';
const STORAGE_SHARE_ATTEMPTS_KEY = 'studyportal_share_attempts';

const QUESTION_TYPES = ['mcq', 'true_false', 'fill_blank', 'flashcard', 'short_answer'];

const getToday = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const randomSeconds = () => Math.floor(Math.random() * 41) + 20;
const normalizeAnswer = (value) => String(value || '').trim().toLowerCase();
const formatDate = (dateValue) => new Date(dateValue).toLocaleDateString();
const buildCardId = (question, subject, idx) => `${subject}::${question.id || idx}::${normalizeAnswer(question.question)}`;

const computeNextReview = (card, rating) => {
  const easeByRating = { again: -0.2, hard: -0.05, good: 0.1, easy: 0.2 };
  const dayByRating = { again: 1, hard: 2, good: 4, easy: 7 };
  const prevEase = card.ease || 2.5;
  const nextEase = Math.max(1.3, prevEase + easeByRating[rating]);
  const prevInterval = card.intervalDays || 1;
  const nextInterval = rating === 'again'
    ? dayByRating[rating]
    : Math.max(dayByRating[rating], Math.round(prevInterval * nextEase));
  const due = new Date();
  due.setDate(due.getDate() + nextInterval);
  return {
    ...card,
    ease: Number(nextEase.toFixed(2)),
    intervalDays: nextInterval,
    dueDate: due.toISOString(),
    lastRating: rating,
    reviewCount: (card.reviewCount || 0) + 1
  };
};

const parseWithGeminiDocument = async (file, apiKey) => {
  const rawBytes = await file.arrayBuffer();
  const base64Data = btoa(
    Array.from(new Uint8Array(rawBytes))
      .map((byte) => String.fromCharCode(byte))
      .join('')
  );

  const prompt = `Extract study-ready content from this file and return ONLY JSON:
{
  "title": "string",
  "summary": "short paragraph",
  "headings": ["string"],
  "keyTerms": ["string"],
  "facts": ["string"]
}
Make it faithful to source text.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: file.type || 'application/octet-stream', data: base64Data } }
        ]
      }]
    })
  });

  const data = await response.json();
  const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleanJson);
};

export default function QuizPortal() {
  const [topic, setTopic] = useState('');
  const [sourceMode, setSourceMode] = useState('text');
  const [sourceUrl, setSourceUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [subject, setSubject] = useState('General');
  const [selectedTypes, setSelectedTypes] = useState(['mcq', 'true_false']);
  const [appState, setAppState] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptWrongQuestions, setAttemptWrongQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerSeed, setTimerSeed] = useState(randomSeconds());
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [activePanel, setActivePanel] = useState('studio');
  const [classrooms, setClassrooms] = useState([]);
  const [classroomCode, setClassroomCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [shareAttempts, setShareAttempts] = useState({});
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!import.meta.env.VITE_GEMINI_KEY) {
      console.warn('VITE_GEMINI_KEY is missing from environment variables');
    }
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);
    const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
    const savedPrefs = localStorage.getItem(STORAGE_PREFS_KEY);
    const savedReview = localStorage.getItem(STORAGE_REVIEW_KEY);
    const savedClassrooms = localStorage.getItem(STORAGE_CLASSROOM_KEY);
    const savedAttempts = localStorage.getItem(STORAGE_SHARE_ATTEMPTS_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedReview) {
      setReviewCards(JSON.parse(savedReview));
    }
    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    }
    if (savedAttempts) {
      setShareAttempts(JSON.parse(savedAttempts));
    }
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setDifficulty(prefs.difficulty || 'medium');
      setQuestionCount(prefs.questionCount || 5);
      setSubject(prefs.subject || 'General');
      setSelectedTypes(Array.isArray(prefs.selectedTypes) && prefs.selectedTypes.length ? prefs.selectedTypes : ['mcq']);
    }
  }, []);

  useEffect(() => {
    const prefs = { difficulty, questionCount, subject, selectedTypes };
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
  }, [difficulty, questionCount, subject, selectedTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEW_KEY, JSON.stringify(reviewCards));
  }, [reviewCards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CLASSROOM_KEY, JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SHARE_ATTEMPTS_KEY, JSON.stringify(shareAttempts));
  }, [shareAttempts]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_CLASSROOM_KEY && event.newValue) {
        setClassrooms(JSON.parse(event.newValue));
      }
      if (event.key === STORAGE_SHARE_ATTEMPTS_KEY && event.newValue) {
        setShareAttempts(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (appState !== 'quiz') return undefined;
    if (timeLeft <= 0) {
      handleAnswerClick('__timeout__');
      return undefined;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [appState, timeLeft]);

  useEffect(() => {
    const sharedId = searchParams.get('shared');
    if (!sharedId) return;
    const raw = localStorage.getItem(STORAGE_SHARED_KEY);
    if (!raw) return;
    const sharedStore = JSON.parse(raw);
    const sharedQuiz = sharedStore[sharedId];
    if (!sharedQuiz) return;
    setQuestions(sharedQuiz.questions || []);
    setSubject(sharedQuiz.subject || 'Shared Quiz');
    setScore(0);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setErrorMsg('');
    const seed = randomSeconds();
    setTimerSeed(seed);
    setTimeLeft(seed);
    setAppState('quiz');
  }, [searchParams]);

  useEffect(() => {
    const code = searchParams.get('classroom');
    if (!code) return;
    const room = classrooms.find((c) => c.code === code.toUpperCase());
    if (!room) return;
    setActiveClassroom(room);
    setClassroomCode(room.code);
    setActivePanel('classroom');
  }, [searchParams, classrooms]);

  const streak = useMemo(() => {
    if (!history.length) return 0;
    const days = [...new Set(history.map((item) => item.date))].sort().reverse();
    let count = 0;
    let cursor = new Date();
    for (let i = 0; i < days.length; i += 1) {
      const check = new Date(cursor);
      check.setDate(cursor.getDate() - i);
      if (days[i] === check.toISOString().slice(0, 10)) count += 1;
      else break;
    }
    return count;
  }, [history]);

  const dueReviewCards = useMemo(() => {
    const now = new Date();
    return reviewCards
      .filter((card) => new Date(card.dueDate) <= now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [reviewCards]);

  const weakTopicStats = useMemo(() => {
    const stats = {};
    const myAttempts = history.filter((item) => item.userEmail === user?.email);
    myAttempts.forEach((attempt) => {
      (attempt.wrongQuestions || []).forEach((q) => {
        const base = `${attempt.subject || 'General'} / ${q.type || 'mcq'}`;
        if (!stats[base]) {
          stats[base] = { topic: base, wrongCount: 0, totalSeen: 0 };
        }
        stats[base].wrongCount += 1;
      });
      (attempt.questions || []).forEach((q) => {
        const base = `${attempt.subject || 'General'} / ${q.type || 'mcq'}`;
        if (!stats[base]) {
          stats[base] = { topic: base, wrongCount: 0, totalSeen: 0 };
        }
        stats[base].totalSeen += 1;
      });
    });
    return Object.values(stats)
      .map((item) => ({ ...item, missRate: item.totalSeen ? (item.wrongCount / item.totalSeen) : 0 }))
      .sort((a, b) => b.missRate - a.missRate);
  }, [history, user]);

  const parseFileContent = async (file, apiKey) => {
    if (!file) return '';
    if (file.type.includes('text') || file.name.endsWith('.md')) {
      return file.text();
    }
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      const parsed = await parseWithGeminiDocument(file, apiKey);
      return `Title: ${parsed.title}
Summary: ${parsed.summary}
Headings: ${(parsed.headings || []).join(', ')}
Key Terms: ${(parsed.keyTerms || []).join(', ')}
Facts:
${(parsed.facts || []).map((fact, idx) => `${idx + 1}. ${fact}`).join('\n')}`;
    }
    return `Uploaded file: ${file.name}`;
  };

  const composeSourceText = async (apiKey) => {
    if (sourceMode === 'text') return topic.trim();
    if (sourceMode === 'url') return `Study from this source URL: ${sourceUrl.trim()}`;
    if (sourceMode === 'youtube') return `Study from this YouTube link and likely transcript context: ${sourceUrl.trim()}`;
    if (sourceMode === 'file') return parseFileContent(uploadedFile, apiKey);
    return topic.trim();
  };

  const generateQuiz = async (overrideQuestions = null) => {
    if (!user) {
      setErrorMsg('Sign in first to save and track your quizzes.');
      return;
    }
    if (!selectedTypes.length) {
      setErrorMsg('Select at least one question type.');
      return;
    }
    setErrorMsg('');
    setAppState('loading');
    const apiKey = import.meta.env.VITE_GEMINI_KEY;
    try {
      let parsedQuestions = overrideQuestions;
      if (!parsedQuestions) {
        const sourceText = await composeSourceText(apiKey);
        if (!sourceText) {
          setAppState('idle');
          setErrorMsg('Add notes, URL, or a file first.');
          return;
        }
        const prompt = `You are a quiz generator.
Create ${questionCount} ${difficulty} questions from this study source:
${sourceText}

Question types allowed: ${selectedTypes.join(', ')}.
Return ONLY valid JSON array.
Each item format:
{
  "id": "short-unique-id",
  "type": "mcq|true_false|fill_blank|flashcard|short_answer",
  "question": "string",
  "options": ["..."] (required only for mcq),
  "answer": "string"
}
For true_false answer must be exactly "True" or "False".
Keep language concise and student friendly.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
        const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedQuestions = JSON.parse(cleanJson);
        if (!Array.isArray(parsedQuestions) || !parsedQuestions.length) {
          throw new Error('Empty quiz response');
        }
      }

      setQuestions(parsedQuestions);
      setScore(0);
      setAnswers({});
      setCurrentQuestionIndex(0);
      const seed = randomSeconds();
      setTimerSeed(seed);
      setTimeLeft(seed);
      setAppState('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setErrorMsg('Failed to generate quiz. Check API key and try again.');
      setAppState('idle');
    }
  };

  const handleAnswerClick = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = normalizeAnswer(selectedOption) === normalizeAnswer(currentQuestion.answer);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id || currentQuestionIndex]: selectedOption }));
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setAttemptWrongQuestions((prev) => [...prev, currentQuestion]);
    }
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setTimeLeft(randomSeconds());
    } else {
      const finalScore = isCorrect ? score + 1 : score;
      saveQuizResult(isCorrect ? [] : [currentQuestion]);
      if (activePanel === 'classroom') {
        submitClassroomAttempt(finalScore);
      }
      const sharedId = searchParams.get('shared');
      if (sharedId) {
        recordShareAttempt(sharedId, finalScore, questions.length);
      }
      setAppState('results');
    }
  };

  const saveQuizResult = (lastWrongChunk = []) => {
    const allWrong = [...attemptWrongQuestions, ...lastWrongChunk];
    const record = {
      id: crypto.randomUUID(),
      userEmail: user.email,
      subject,
      sourceMode,
      difficulty,
      questionCount: questions.length,
      score,
      wrongQuestionIds: allWrong.map((q, idx) => q.id || `w-${idx}`),
      wrongQuestions: allWrong,
      questions,
      date: getToday(),
      createdAt: new Date().toISOString()
    };
    const nextHistory = [record, ...history];
    setHistory(nextHistory);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(nextHistory));

    const nextCards = [...reviewCards];
    questions.forEach((question, idx) => {
      const cardId = buildCardId(question, subject, idx);
      const existingIndex = nextCards.findIndex((card) => card.id === cardId);
      const wrong = allWrong.some((w) => buildCardId(w, subject, idx) === cardId);
      const seedCard = existingIndex >= 0 ? nextCards[existingIndex] : {
        id: cardId,
        subject,
        question,
        ease: 2.5,
        intervalDays: 1,
        dueDate: new Date().toISOString(),
        reviewCount: 0
      };
      const updated = computeNextReview(seedCard, wrong ? 'again' : 'good');
      if (existingIndex >= 0) nextCards[existingIndex] = updated;
      else nextCards.push(updated);
    });
    setReviewCards(nextCards);
  };

  const rateReviewCard = (cardId, rating) => {
    setReviewCards((prev) => prev.map((card) => (
      card.id === cardId ? computeNextReview(card, rating) : card
    )));
  };

  const startDueReviewSession = () => {
    if (!dueReviewCards.length) {
      setErrorMsg('No review cards due today.');
      return;
    }
    const reviewQuestions = dueReviewCards.slice(0, 10).map((card, idx) => ({
      ...card.question,
      id: `${card.id}::${idx}`
    }));
    setAttemptWrongQuestions([]);
    generateQuiz(reviewQuestions);
  };

  const startRetryWeakAreas = () => {
    const myAttempts = history.filter((item) => item.userEmail === user?.email);
    const latestWithWrong = myAttempts.find((item) => (item.wrongQuestions || []).length > 0);
    if (!latestWithWrong) {
      setErrorMsg('No weak-area questions found yet.');
      return;
    }
    setAttemptWrongQuestions([]);
    generateQuiz(latestWithWrong.wrongQuestions);
  };

  const startTopicFocusedRetry = () => {
    const topWeak = weakTopicStats[0];
    if (!topWeak) {
      setErrorMsg('No weak-topic data available yet.');
      return;
    }
    const [weakSubject, weakType] = topWeak.topic.split(' / ');
    const myAttempts = history.filter((item) => item.userEmail === user?.email && item.subject === weakSubject);
    const targeted = [];
    myAttempts.forEach((attempt) => {
      (attempt.wrongQuestions || []).forEach((q) => {
        if ((q.type || 'mcq') === weakType) targeted.push(q);
      });
    });
    if (!targeted.length) {
      setErrorMsg('Could not build a focused retry set yet.');
      return;
    }
    generateQuiz(targeted.slice(0, Math.max(5, questionCount)));
  };

  const signIn = () => {
    const email = window.prompt('Enter your Google email');
    if (!email) return;
    const newUser = {
      name: email.split('@')[0],
      email
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
  };

  const createShareLink = () => {
    const id = crypto.randomUUID();
    const raw = localStorage.getItem(STORAGE_SHARED_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[id] = {
      questions,
      subject,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_SHARED_KEY, JSON.stringify(store));
    const link = `${window.location.origin}/quiz?shared=${id}`;
    setShareLink(link);
  };

  const recordShareAttempt = (sharedId, finalScore, totalQuestions) => {
    const name = studentName || user?.name || 'Guest';
    const entry = {
      id: crypto.randomUUID(),
      name,
      score: finalScore,
      total: totalQuestions,
      at: new Date().toISOString()
    };
    setShareAttempts((prev) => {
      const existing = prev[sharedId] || [];
      return { ...prev, [sharedId]: [...existing, entry] };
    });
  };

  const duplicateSharedQuizToDashboard = () => {
    const sharedId = searchParams.get('shared');
    if (!sharedId) {
      setErrorMsg('Open a shared quiz first.');
      return;
    }
    const raw = localStorage.getItem(STORAGE_SHARED_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const sharedQuiz = store[sharedId];
    if (!sharedQuiz) {
      setErrorMsg('Shared quiz not found.');
      return;
    }
    const copied = {
      id: crypto.randomUUID(),
      userEmail: user?.email || 'guest@local',
      subject: `${sharedQuiz.subject || 'Shared Quiz'} (Copy)`,
      sourceMode: 'shared',
      difficulty: 'mixed',
      questionCount: (sharedQuiz.questions || []).length,
      score: 0,
      wrongQuestionIds: [],
      wrongQuestions: [],
      questions: sharedQuiz.questions || [],
      date: getToday(),
      createdAt: new Date().toISOString()
    };
    const nextHistory = [copied, ...history];
    setHistory(nextHistory);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(nextHistory));
    setErrorMsg('Shared quiz copied to your dashboard history.');
  };

  const createClassroom = () => {
    if (!questions.length) {
      setErrorMsg('Generate a quiz first, then create a classroom.');
      return;
    }
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const room = {
      code,
      teacher: user?.email || 'teacher@local',
      subject,
      questions,
      createdAt: new Date().toISOString(),
      attempts: []
    };
    setClassrooms((prev) => [room, ...prev]);
    setActiveClassroom(room);
    setClassroomCode(code);
  };

  const joinClassroom = () => {
    const room = classrooms.find((c) => c.code === classroomCode.trim().toUpperCase());
    if (!room) {
      setErrorMsg('Classroom code not found.');
      return;
    }
    setActiveClassroom(room);
    setQuestions(room.questions);
    setScore(0);
    setCurrentQuestionIndex(0);
    setAppState('quiz');
    setActivePanel('classroom');
  };

  const submitClassroomAttempt = (finalScore) => {
    if (!activeClassroom) return;
    const name = studentName || user?.name || 'Student';
    const entry = {
      id: crypto.randomUUID(),
      name,
      score: finalScore,
      total: questions.length,
      at: new Date().toISOString()
    };
    setClassrooms((prev) => prev.map((room) => (
      room.code === activeClassroom.code
        ? { ...room, attempts: [...room.attempts, entry] }
        : room
    )));
  };

  const exportClassroomCsv = () => {
    if (!activeClassroom) return;
    const room = classrooms.find((c) => c.code === activeClassroom.code) || activeClassroom;
    const header = 'name,score,total,time\n';
    const rows = (room.attempts || []).map((a) => `${a.name},${a.score},${a.total},${new Date(a.at).toISOString()}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classroom-${room.code}-report.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setErrorMsg('Share link copied.');
    } catch {
      setErrorMsg('Could not copy link. Copy manually.');
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setAnswers({});
    setAttemptWrongQuestions([]);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setTimeLeft(0);
    setAppState('idle');
  };

  if (appState === 'idle') {
    const userHistory = history.filter((item) => item.userEmail === user?.email);
    const sharedId = searchParams.get('shared');
    const leaderboard = sharedId ? (shareAttempts[sharedId] || []).slice().sort((a, b) => b.score - a.score) : [];
    return (
      <div className="quiz-container">
        <div className="auth-row">
          <h2>Quiz Studio</h2>
          {user ? (
            <button onClick={signOut} className="mini-btn">Sign out ({user.name})</button>
          ) : (
            <button onClick={signIn} className="mini-btn">Sign in with Google</button>
          )}
        </div>
        <div className="dashboard-grid">
          <div className="dash-item"><strong>{userHistory.length}</strong><span>Saved quizzes</span></div>
          <div className="dash-item"><strong>{streak}</strong><span>Day streak</span></div>
          <div className="dash-item"><strong>{Math.round((userHistory.reduce((acc, q) => acc + (q.score / q.questionCount) * 100, 0) / (userHistory.length || 1)) || 0)}%</strong><span>Avg score</span></div>
        </div>
        <div className="panel-row">
          {['studio', 'review', 'analytics', 'classroom', 'sharing'].map((panel) => (
            <button key={panel} className={activePanel === panel ? 'mode-btn active' : 'mode-btn'} onClick={() => setActivePanel(panel)}>
              {panel}
            </button>
          ))}
        </div>
        <input
          className="quiz-input"
          placeholder="Your display name (for share/classroom leaderboard)"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        {activePanel === 'studio' && (
          <>
        <div className="modes-row">
          {['text', 'url', 'youtube', 'file'].map((mode) => (
            <button key={mode} className={sourceMode === mode ? 'mode-btn active' : 'mode-btn'} onClick={() => setSourceMode(mode)}>
              {mode}
            </button>
          ))}
        </div>
        {sourceMode === 'text' && (
          <textarea
            placeholder="Paste notes..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="quiz-textarea"
          />
        )}
        {(sourceMode === 'url' || sourceMode === 'youtube') && (
          <input
            type="url"
            placeholder={sourceMode === 'youtube' ? 'Paste YouTube link' : 'Paste article URL'}
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="quiz-input"
          />
        )}
        {sourceMode === 'file' && (
          <input
            type="file"
            accept=".pdf,.txt,.md,image/*"
            onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
            className="quiz-input"
          />
        )}
        <div className="controls-row">
          <input className="quiz-input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject folder (e.g. Physics)" />
          <select className="quiz-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            className="quiz-input"
            type="number"
            min={3}
            max={20}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value) || 5)}
          />
        </div>
        <div className="types-grid">
          {QUESTION_TYPES.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => setSelectedTypes((prev) => (
                  prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                ))}
              />
              {type}
            </label>
          ))}
        </div>
        {!!errorMsg && <p className="error-text">{errorMsg}</p>}
        <button onClick={() => generateQuiz()} className="quiz-btn">Generate Quiz</button>
        <button onClick={startRetryWeakAreas} className="ghost-btn">Retry Weak Areas</button>
        <div className="history-list">
          {userHistory.slice(0, 4).map((item) => (
            <div key={item.id} className="history-item">
              <span>{item.subject}</span>
              <span>{item.score}/{item.questionCount}</span>
              <span>{formatDate(item.createdAt || item.date)}</span>
            </div>
          ))}
        </div>
          </>
        )}
        {activePanel === 'review' && (
          <div className="history-list">
            <div className="history-item">
              <span>Due Today</span>
              <span>{dueReviewCards.length} cards</span>
              <button onClick={startDueReviewSession} className="mini-btn">Start</button>
            </div>
            {dueReviewCards.slice(0, 8).map((card) => (
              <div key={card.id} className="history-item">
                <span>{card.subject}</span>
                <span>Ease {card.ease?.toFixed(2)}</span>
                <span className="ratings-inline">
                  <button onClick={() => rateReviewCard(card.id, 'again')} className="mini-btn">Again</button>
                  <button onClick={() => rateReviewCard(card.id, 'hard')} className="mini-btn">Hard</button>
                  <button onClick={() => rateReviewCard(card.id, 'good')} className="mini-btn">Good</button>
                  <button onClick={() => rateReviewCard(card.id, 'easy')} className="mini-btn">Easy</button>
                </span>
              </div>
            ))}
          </div>
        )}
        {activePanel === 'analytics' && (
          <div className="history-list">
            <button onClick={startTopicFocusedRetry} className="ghost-btn">Auto Retry Most-Missed Topic</button>
            {weakTopicStats.slice(0, 8).map((row) => (
              <div key={row.topic} className="history-item">
                <span>{row.topic}</span>
                <span>{Math.round(row.missRate * 100)}%</span>
                <span>{row.wrongCount}/{row.totalSeen}</span>
              </div>
            ))}
          </div>
        )}
        {activePanel === 'classroom' && (
          <div className="history-list">
            <button onClick={createClassroom} className="ghost-btn">Create Classroom From Current Quiz</button>
            <input className="quiz-input" value={classroomCode} onChange={(e) => setClassroomCode(e.target.value)} placeholder="Enter classroom code" />
            <button onClick={joinClassroom} className="quiz-btn">Join Classroom</button>
            {activeClassroom && (
              <div className="history-item">
                <span>Room {activeClassroom.code}</span>
                <span>{(classrooms.find((c) => c.code === activeClassroom.code)?.attempts || []).length} attempts</span>
                <button onClick={exportClassroomCsv} className="mini-btn">Export CSV</button>
              </div>
            )}
          </div>
        )}
        {activePanel === 'sharing' && (
          <div className="history-list">
            <button onClick={duplicateSharedQuizToDashboard} className="ghost-btn">Duplicate Shared Quiz To Dashboard</button>
            {sharedId ? (
              leaderboard.slice(0, 10).map((row) => (
                <div key={row.id} className="history-item">
                  <span>{row.name}</span>
                  <span>{row.score}/{row.total}</span>
                  <span>{formatDate(row.at)}</span>
                </div>
              ))
            ) : (
              <p>Create or open a shared quiz link to see leaderboard data.</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (appState === 'loading') {
    return (
      <div className="quiz-container text-center">
        <h2>Thinking...</h2>
        <div className="spinner"></div>
        <p>Gemini is reading your notes and creating questions.</p>
      </div>
    );
  }

  if (appState === 'quiz') {
    const currentQ = questions[currentQuestionIndex];
    const isMcq = currentQ.type === 'mcq';
    const isTrueFalse = currentQ.type === 'true_false';
    
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Score: {score}</span>
          <span className="timer-pill">Time: {timeLeft}s</span>
        </div>
        
        <h3 className="question-text">{currentQ.question}</h3>
        <div className="options-container">
          {isMcq && (currentQ.options || []).map((option, index) => (
            <button key={index} onClick={() => handleAnswerClick(option)} className="option-btn">{option}</button>
          ))}
          {isTrueFalse && (
            <>
              <button onClick={() => handleAnswerClick('True')} className="option-btn">True</button>
              <button onClick={() => handleAnswerClick('False')} className="option-btn">False</button>
            </>
          )}
          {!isMcq && !isTrueFalse && (
            <div>
              <input
                className="quiz-input"
                placeholder="Type your answer..."
                value={answers[currentQ.id || currentQuestionIndex] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQ.id || currentQuestionIndex]: e.target.value }))}
              />
              <button
                className="quiz-btn"
                onClick={() => handleAnswerClick(answers[currentQ.id || currentQuestionIndex] || '')}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (appState === 'results') {
    return (
      <div className="quiz-container text-center">
        <h2>Quiz Complete!</h2>
        <p className="score-text">You scored {score} out of {questions.length}</p>
        <p>Random timer was active ({timerSeed}s start, resets each question).</p>
        <button onClick={createShareLink} className="ghost-btn">Create Share Link</button>
        {shareLink && <p><a href={shareLink}>{shareLink}</a></p>}
        {shareLink && <button onClick={copyShareLink} className="ghost-btn">Copy Link</button>}
        <button onClick={resetQuiz} className="quiz-btn">Try Again</button>
      </div>
    );
  }

  return null;
}
