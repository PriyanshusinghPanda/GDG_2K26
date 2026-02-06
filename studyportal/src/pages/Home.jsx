import { useState } from 'react';

// 🏠 HOME PAGE — LIVE BUILD STARTER
export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      {/* ✅ TASK 1: Build a Hero component here! */}
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem' }}>Welcome to StudyPortal</h1>
        <p style={{ color: '#94a3b8' }}>Generate quizzes in seconds. Ready to start?</p>
      </div>
      
      {/* ✅ TASK 2: Add a Button component from our library! */}
      <div style={{ textAlign: 'center' }}>
         <button style={{ padding: '0.8rem 2rem' }}>Get Started (Coming Soon)</button>
      </div>
    </div>
  );
}

// Sub-component: StateDemo
function StateDemo() {
  return (
    <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>This is React State!</h2>
      <p>I only appear when 'showDemo' is true. That's conditional rendering.</p>
    </div>
  );
}
