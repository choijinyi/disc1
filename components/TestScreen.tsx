
import React, { useState, useMemo, useCallback } from 'react';
import type { Question, Answers, Answer, DISCType } from '../types';
import { ALL_SCORES } from '../types';

interface QuestionRowProps {
  question: Question;
  questionIndex: number;
  onAnswerChange: (index: number, answer: Answer) => void;
  initialAnswer: Answer;
}

const QuestionRow: React.FC<QuestionRowProps> = ({ question, questionIndex, onAnswerChange, initialAnswer }) => {
  const [currentAnswer, setCurrentAnswer] = useState<Answer>(initialAnswer);

  const handleScoreSelect = (type: DISCType, score: number) => {
    const newAnswer = { ...currentAnswer };
    
    // 만약 이미 다른 항목에 해당 점수가 부여되어 있다면 그 항목의 점수를 초기화 (중복 방지)
    (Object.keys(newAnswer) as DISCType[]).forEach(key => {
        if (newAnswer[key] === score) {
            newAnswer[key] = undefined;
        }
    });

    // 현재 클릭한 항목에 점수 부여. 이미 같은 점수를 눌렀다면 해제.
    if (currentAnswer[type] === score) {
        newAnswer[type] = undefined;
    } else {
        newAnswer[type] = score;
    }

    setCurrentAnswer(newAnswer);
    onAnswerChange(questionIndex, newAnswer);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
      <div className="flex items-center mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm mr-3">
            {questionIndex + 1}
        </span>
        <h3 className="text-xl font-bold text-slate-800">{question.category}</h3>
      </div>
      
      <div className="space-y-4">
        {(Object.keys(question.options) as DISCType[]).map((type) => (
          <div key={type} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-200 transition-colors group">
            <span className="text-slate-700 font-medium mb-3 sm:mb-0 group-hover:text-blue-700 transition-colors">
                {question.options[type]}
            </span>
            <div className="flex items-center space-x-2">
              {ALL_SCORES.map(score => (
                <button
                  key={score}
                  onClick={() => handleScoreSelect(type, score)}
                  className={`
                    w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200
                    ${currentAnswer[type] === score 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-400 hover:text-blue-500'}
                  `}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="text-xs text-slate-400 italic">
            * 각 문장에 1~4점 사이의 점수를 겹치지 않게 클릭해주세요.
        </div>
      </div>
    </div>
  );
};


interface TestScreenProps {
  questions: Question[];
  onSubmit: (answers: Answers) => void;
}

const TestScreen: React.FC<TestScreenProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<Answers>({});
  
  const handleAnswerChange = useCallback((index: number, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [index]: answer }));
  }, []);

  const allAnswered = useMemo(() => {
    if (Object.keys(answers).length !== questions.length) return false;
    return Object.values(answers).every(answer => {
      const scores = Object.values(answer).filter(s => typeof s === 'number' && s > 0);
      return scores.length === 4 && new Set(scores).size === 4;
    });
  }, [answers, questions.length]);
  
  const progress = useMemo(() => {
    const answeredCount = Object.values(answers).filter(answer => 
        Object.values(answer).filter(s => typeof s === 'number' && s > 0).length === 4
    ).length;
    return (answeredCount / questions.length) * 100;
  }, [answers, questions.length]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-20">
        <header className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-sm py-6 mb-8 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">DISC 행동유형 검사</h1>
                    <p className="text-sm text-slate-500">40문항 중 {Math.round(progress/100 * questions.length)}개 완료</p>
                </div>
                <div className="flex-1 max-w-xs">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-blue-600 h-3 rounded-full shadow-sm shadow-blue-200" style={{ width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                </div>
            </div>
        </header>

        <div className="space-y-4">
            {questions.map((q, index) => (
                <QuestionRow 
                key={index}
                question={q}
                questionIndex={index}
                onAnswerChange={handleAnswerChange}
                initialAnswer={answers[index] || {}}
                />
            ))}
        </div>

        <div className="mt-12 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
            {!allAnswered && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-pulse">
                    아직 응답하지 않은 문항이 있습니다. 모든 문항에 점수를 부여해주세요.
                </div>
            )}
            <button
                onClick={() => onSubmit(answers)}
                disabled={!allAnswered}
                className="w-full sm:w-auto px-16 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl disabled:bg-slate-300 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
                분석 결과 확인하기
            </button>
        </div>
    </div>
  );
};

export default TestScreen;
