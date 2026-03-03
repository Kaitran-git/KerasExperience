import React from 'react';
import { CheckCircle2, Circle, Activity, Box, Clock, BarChart2 } from 'lucide-react';

const NerfGrid = ({ models, selectedModels, onToggleSelection }) => {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Training Runs Overview</h2>
                <p className="text-slate-400">
                    Select two models below to compare their final rendered MP4s side-by-side.
                    The cards display the live training progress (.gif) and critical hyperparameters.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {models.map(model => {
                    const isSelected = selectedModels.includes(model.id);
                    const isDisabled = !isSelected && selectedModels.length >= 2;

                    return (
                        <div
                            key={model.id}
                            onClick={() => !isDisabled && onToggleSelection(model.id)}
                            className={`
                relative flex flex-col bg-slate-900/60 border-2 rounded-2xl overflow-hidden transition-all duration-300
                ${isSelected
                                    ? 'border-indigo-500 shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)] transform -translate-y-1'
                                    : isDisabled
                                        ? 'border-slate-800 opacity-50 cursor-not-allowed'
                                        : 'border-slate-800 hover:border-slate-600 cursor-pointer hover:-translate-y-1'}
              `}
                        >
                            {/* Selection Indicator */}
                            <div className="absolute top-4 left-4 z-20 bg-slate-900/80 rounded-full p-1 backdrop-blur-md border border-slate-700">
                                {isSelected ? (
                                    <CheckCircle2 size={24} className="text-indigo-400" />
                                ) : (
                                    <Circle size={24} className="text-slate-600" />
                                )}
                            </div>

                            {/* Top Section: Video & Stats */}
                            <div className="flex flex-col md:flex-row border-b border-slate-800 relative z-10 bg-slate-900/30">
                                {/* Final Render MP4 */}
                                <div className="md:w-1/2 relative flex items-center justify-center bg-black border-r border-slate-800 min-h-[300px]">
                                    <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur text-[10px] font-mono text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-900 shadow-xl">final render</div>
                                    <video
                                        src={model.mp4_path}
                                        muted
                                        loop
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                </div>

                                {/* Metadata Pane */}
                                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                    <h3 className="text-3xl font-extrabold text-white mb-8">{model.model_name}</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Box size={14} /> Samples
                                            </div>
                                            <div className="text-xl font-mono text-slate-200">{model.num_samples}</div>
                                        </div>

                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Activity size={14} /> Position Dimensions
                                            </div>
                                            <div className="text-xl font-mono text-slate-200">{model.pos_encode_dims}</div>
                                        </div>

                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Clock size={14} /> Epochs
                                            </div>
                                            <div className="text-xl font-mono text-slate-200">{model.epochs}</div>
                                        </div>

                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Clock size={14} /> Time
                                            </div>
                                            <div className="text-xl font-mono text-indigo-300">{model.training_time}</div>
                                        </div>

                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <BarChart2 size={14} /> PSNR
                                            </div>
                                            <div className="text-xl font-mono text-cyan-300">
                                                {model.psnr != null ? `${model.psnr} dB` : '—'}
                                            </div>
                                        </div>

                                        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 shadow-inner">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <BarChart2 size={14} /> Val PSNR
                                            </div>
                                            <div className="text-xl font-mono text-cyan-300">
                                                {model.val_psnr != null ? (
                                                    <>
                                                        {model.val_psnr} dB
                                                        {model.psnr != null && (
                                                            <span className="text-xs ml-2 text-slate-400 font-normal">
                                                                ({(model.val_psnr - model.psnr).toFixed(2)})
                                                            </span>
                                                        )}
                                                    </>
                                                ) : '—'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section: Training GIF */}
                            <div className="w-full relative flex items-center justify-center bg-[#0a0a0a] min-h-[250px] p-6">
                                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur text-[10px] font-mono text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl">training progress</div>
                                <img
                                    src={model.gif_path}
                                    alt="Training progress"
                                    className="w-full max-h-[500px] object-contain opacity-90 rounded-lg shadow-2xl"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NerfGrid;
