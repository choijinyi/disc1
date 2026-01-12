
import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import TestScreen from './components/TestScreen';
import ResultsScreen from './components/ResultsScreen';
import type { Answers, Scores } from './types';
import { questions } from './constants';

type AppStep = 'start' | 'test' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('start');
  const [scores, setScores] = useState<Scores | null>(null);

  const handleStart = useCallback(() => {
    setStep('test');
  }, []);

  const handleSubmit = useCallback((finalAnswers: Answers) => {
    const totalScores: Scores = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(finalAnswers).forEach(answer => {
      totalScores.D += answer.D || 0;
      totalScores.I += answer.I || 0;
      totalScores.S += answer.S || 0;
      totalScores.C += answer.C || 0;
    });
    setScores(totalScores);
    setStep('results');
  }, []);
  
  const handleReset = useCallback(() => {
    setScores(null);
    setStep('start');
  }, []);

  const renderStep = () => {
    switch (step) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'test':
        return <TestScreen questions={questions} onSubmit={handleSubmit} />;
      case 'results':
        return scores ? <ResultsScreen scores={scores} onReset={handleReset} /> : <div className="text-center p-8">결과를 불러오는 중 오류가 발생했습니다.</div>;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default App;
