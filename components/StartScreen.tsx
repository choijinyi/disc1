
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center p-8 sm:p-12 bg-white rounded-3xl shadow-2xl animate-fade-in-up transition-transform transform hover:scale-[1.01] duration-300 w-full max-w-2xl">
        <div className="mb-6 inline-flex p-4 bg-blue-50 rounded-full">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">DISC 행동유형 평가</h1>
        <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
          자신의 성격과 행동 양식을 분석하여 더 나은 소통과 관계를 맺을 수 있는 인사이트를 얻어보세요. 별도의 가입 없이 바로 시작하실 수 있습니다.
        </p>

        <button
          onClick={onStart}
          className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white font-bold text-xl rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl"
        >
          검사 시작하기
        </button>
      </div>
      
      <div className="mt-8 text-slate-400 text-sm">
        &copy; 2024 DISC Personality Assessment Center
      </div>
    </div>
  );
};

export default StartScreen;
