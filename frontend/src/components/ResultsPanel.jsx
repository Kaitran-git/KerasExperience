import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const ResultsPanel = ({ isPredicting, results, activeModel }) => {
    if (isPredicting) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 animate-pulse">
                <Loader2 size={48} className="animate-spin text-blue-500" />
                <p className="text-lg font-medium tracking-wide">Analyzing Image...</p>
                <p className="text-sm text-slate-500">Using {activeModel} neural network</p>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                <AlertCircle size={32} className="text-slate-600 mb-2" />
                <p className="text-center font-medium">No Image Analyzed</p>
                <p className="text-sm text-center text-slate-600 px-4">
                    Upload an image and click 'Predict Class' to see results here.
                </p>
            </div>
        );
    }

    // Assuming results is an array of { label: string, confidence: number }
    const topResult = results[0];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 slide-in-from-bottom-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mb-6 shadow-lg shadow-blue-900/10 flex flex-col items-center justify-center">
                <span className="text-slate-400 text-sm font-medium tracking-wide uppercase mb-1">Top Match</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent tracking-tight">
                    {topResult.label}
                </span>
            </div>

            <div className="space-y-6 flex-1">
                <h4 className="text-slate-400 font-medium text-sm flex items-center justify-between">
                    <span>Class Probabilities</span>
                    <span>Confidence %</span>
                </h4>

                {results.map((result, index) => (
                    <div key={index} className="space-y-2 group">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-200 group-hover:text-white transition-colors">
                                {result.label}
                            </span>
                            <span className="text-blue-400 font-bold">
                                {result.confidence}% <span className="text-slate-500 font-normal ml-1">({result.raw_score})</span>
                            </span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out relative"
                                style={{ width: `${result.confidence}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-500 tracking-wide uppercase">
                    Model Confidence Threshold: 85%
                </p>
            </div>
        </div>
    );
};

export default ResultsPanel;
