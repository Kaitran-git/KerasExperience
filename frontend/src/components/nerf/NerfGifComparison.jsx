import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';

const NerfGifComparison = ({ models, onBack }) => {
    if (!models || models.length !== 2) return null;

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 bg-emerald-900/10 p-4 rounded-2xl border border-emerald-500/20 shadow-lg">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-emerald-400 hover:text-white bg-slate-900/50 hover:bg-emerald-600/30 px-4 py-2 rounded-xl transition-all border border-emerald-500/20"
                >
                    <ArrowLeft size={16} />
                    Back to Grid
                </button>

                <div className="text-center font-bold text-lg text-slate-300 flex items-center gap-4">
                    <span className="text-white px-3 py-1 bg-slate-800 rounded-lg">{models[0].model_name}</span>
                    <span className="text-emerald-400">vs</span>
                    <span className="text-white px-3 py-1 bg-slate-800 rounded-lg">{models[1].model_name}</span>
                </div>

                <div className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    Training GIF Comparison
                </div>
            </div>

            {/* Stacked Rows: Wide GIF + Compact Info on Right */}
            <div className="flex flex-col gap-8 flex-1 w-full">
                {models.map((model, idx) => (
                    <div key={model.id} className="flex flex-row bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl drop-shadow-[0_0_20px_rgba(16,185,129,0.07)]">

                        {/* Left: Wide GIF */}
                        <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a] min-h-[260px]">
                            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-full text-xs font-bold text-white tracking-widest uppercase shadow-lg">
                                {model.model_name}
                            </div>

                            {/* Fallback */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-900 font-mono z-0 text-xs">
                                <Play size={32} className="mb-3 text-slate-700" />
                                <span>{model.gif_path}</span>
                            </div>

                            <img
                                src={model.gif_path}
                                alt={`Training – ${model.model_name}`}
                                className="w-full h-full object-contain relative z-10 opacity-90"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>

                        {/* Right: Compact Info Panel */}
                        <div className="w-56 shrink-0 flex flex-col justify-center p-4 border-l border-slate-800 bg-slate-900/40">
                            <h3 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-800">{model.model_name}</h3>

                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col bg-slate-900 p-2.5 rounded-lg border border-slate-700/50">
                                    <span className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mb-0.5">Samples</span>
                                    <span className="text-white font-mono text-xs">{model.num_samples}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900 p-2.5 rounded-lg border border-slate-700/50">
                                    <span className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mb-0.5">Dimensions</span>
                                    <span className="text-white font-mono text-xs">{model.pos_encode_dims}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900 p-2.5 rounded-lg border border-slate-700/50">
                                    <span className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mb-0.5">Epochs</span>
                                    <span className="text-white font-mono text-xs">{model.epochs}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900 p-2.5 rounded-lg border border-slate-700/50">
                                    <span className="text-slate-500 text-[9px] font-semibold uppercase tracking-wider mb-0.5">Real Time</span>
                                    <span className="text-indigo-400 font-mono text-xs">{model.training_time}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NerfGifComparison;
