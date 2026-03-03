import React from 'react';
import { Clock } from 'lucide-react';

const HistoryTray = ({ history, onSelectImage }) => {
    // Always render to maintain layout properly

    return (
        <div className="h-28 bg-[#0f172a] border-t border-slate-700 flex items-center px-6 shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] z-30">
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-500 w-full">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide py-2 w-full">
                    {history.map((imageUrl, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectImage(imageUrl)}
                            className="relative h-[80px] w-[80px] rounded-xl overflow-hidden shadow-lg border-2 border-slate-700 hover:border-blue-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-blue-900/50 group shrink-0"
                        >
                            <img
                                src={imageUrl}
                                alt={`History ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/20 transition-colors" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryTray;
