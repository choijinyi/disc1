
import React, { useMemo, useRef, useState } from 'react';
import type { Scores, DISCType } from '../types';
import { profiles, discDescriptions } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsScreenProps {
  scores: Scores;
  onReset: () => void;
}

declare const html2canvas: any;
declare namespace jspdf {
  class jsPDF {
    constructor(options?: any);
    addImage(imageData: string | HTMLCanvasElement, format: string, x: number, y: number, width: number, height: number, alias?: string, compression?: string, rotation?: number): this;
    save(filename: string): this;
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      }
    };
  }
}

const COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6'];

const ResultsScreen: React.FC<ResultsScreenProps> = ({ scores, onReset }) => {
  const { profile, highestTypes } = useMemo(() => {
    const sortedScores = (Object.keys(scores) as DISCType[]).sort((a, b) => scores[b] - scores[a]);
    const key3 = sortedScores.slice(0, 3).join('');
    const key2 = sortedScores.slice(0, 2).join('');
    const key1 = sortedScores[0];
    const foundProfile = profiles[key3] || profiles[key2] || profiles[key1] || { name: '결과를 찾을 수 없음' };
    
    return { profile: foundProfile, highestTypes: sortedScores.slice(0, 2) };
  }, [scores]);

  const chartData = useMemo(() => {
    return [
      { name: 'D', value: scores.D, fullName: '주도형' },
      { name: 'I', value: scores.I, fullName: '사교형' },
      { name: 'S', value: scores.S, fullName: '안정형' },
      { name: 'C', value: scores.C, fullName: '신중형' },
    ];
  }, [scores]);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!resultsRef.current || isDownloading) return;

    const elementToCapture = resultsRef.current;
    const buttonsContainer = elementToCapture.querySelector('#result-buttons') as HTMLElement | null;

    setIsDownloading(true);

    if (buttonsContainer) {
        buttonsContainer.style.visibility = 'hidden';
    }

    try {
        const canvas = await html2canvas(elementToCapture, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let imageWidth = pdfWidth;
        let imageHeight = imageWidth / ratio;
        
        if (imageHeight > pdfHeight) {
            imageHeight = pdfHeight;
            imageWidth = imageHeight * ratio;
        }

        const x = (pdfWidth - imageWidth) / 2;
        const y = 0;

        pdf.addImage(imgData, 'PNG', x, y, imageWidth, imageHeight);
        pdf.save(`DISC_Result_Report.pdf`);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("PDF를 생성하는 데 실패했습니다.");
    } finally {
        if (buttonsContainer) {
            buttonsContainer.style.visibility = 'visible';
        }
        setIsDownloading(false);
    }
  };

  return (
    <div ref={resultsRef} className="p-6 sm:p-10 bg-white rounded-3xl shadow-2xl animate-fade-in-up">
      <div className="flex flex-col items-center mb-10 border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-extrabold text-slate-400 mb-2 uppercase tracking-widest">DISC Analysis Report</h1>
        <div className="flex items-center space-x-3 mt-4">
            <p className="text-2xl font-bold text-slate-800">
                <span className="text-blue-600">당신</span>의 행동 유형 프로파일
            </p>
        </div>
        <p className="text-5xl font-black text-slate-900 mt-6 bg-blue-50 px-8 py-4 rounded-2xl border-2 border-blue-100 shadow-inner">
            {profile.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
            행동 유형 그래프
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 60]} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              {chartData.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">{item.name}</span>
                      <span className="text-lg font-bold" style={{color: COLORS[idx]}}>{item.value}</span>
                  </div>
              ))}
          </div>
        </div>
        
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
           <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
             <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
             주요 유형별 상세 특징
           </h2>
           <div className="space-y-8">
                {highestTypes.map((type, idx) => (
                    <div key={type} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: COLORS[['D','I','S','C'].indexOf(type)]}}></span>
                            {discDescriptions[type].title}
                        </h3>
                        <ul className="space-y-2">
                            {discDescriptions[type].points.map((point, index) => (
                                <li key={index} className="flex items-start text-slate-600 text-sm leading-relaxed">
                                    <span className="text-blue-500 mr-2 mt-1">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
           </div>
        </div>
      </div>
      
      <div id="result-buttons" className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full sm:w-auto px-12 py-5 bg-blue-600 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isDownloading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                준비 중...
            </>
          ) : '리포트 PDF 저장하기'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-12 py-5 bg-slate-800 text-white font-bold text-lg rounded-full hover:bg-slate-900 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          새로운 검사 시작
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
