import React, { useRef, useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

const NerfComparison = ({ models, onBack }) => {
    if (!models || models.length !== 2) return null;

    const videoRefs = [useRef(null), useRef(null)];
    const [playing, setPlaying] = useState([true, true]);

    const toggleAll = () => {
        const allPlaying = playing.every(Boolean);
        videoRefs.forEach((ref) => {
            const video = ref.current;
            if (!video) return;
            if (allPlaying) video.pause();
            else video.play();
        });
        setPlaying(allPlaying ? [false, false] : [true, true]);
    };

    const restartAll = () => {
        videoRefs.forEach((ref) => {
            const video = ref.current;
            if (!video) return;
            video.currentTime = 0;
            video.play();
        });
        setPlaying([true, true]);
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">

            {/* Compare Header */}
            <div className="flex items-center justify-between mb-8 bg-indigo-900/10 p-4 rounded-2xl border border-indigo-500/20 shadow-lg">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-indigo-400 hover:text-white bg-slate-900/50 hover:bg-indigo-600/30 px-4 py-2 rounded-xl transition-all border border-indigo-500/20"
                >
                    <ArrowLeft size={16} />
                    Back to Grid
                </button>

                <div className="text-center font-bold text-lg text-slate-300 flex items-center gap-4">
                    <span className="text-white px-3 py-1 bg-slate-800 rounded-lg">{models[0].model_name}</span>
                    <span className="text-indigo-400">vs</span>
                    <span className="text-white px-3 py-1 bg-slate-800 rounded-lg">{models[1].model_name}</span>
                </div>

                {/* Header Right: Controls */}
                <div className="flex items-center gap-3">
                    {/* Restart Both */}
                    <button
                        onClick={restartAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-semibold text-sm
                            bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                    >
                        <RotateCcw size={15} />
                        Restart Both
                    </button>

                    {/* Pause / Play Both */}
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-semibold text-sm
                            bg-slate-800 border-slate-700 text-slate-300 hover:bg-indigo-600/30 hover:text-white hover:border-indigo-500"
                    >
                        {playing.every(Boolean) ? <Pause size={16} /> : <Play size={16} />}
                        {playing.every(Boolean) ? 'Pause Both' : 'Play Both'}
                    </button>
                </div>
            </div>

            {/* Split Screen Video with Stats Underneath */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 w-full max-w-7xl mx-auto">
                {models.map((model, idx) => (
                    <div key={model.id} className="flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl drop-shadow-[0_0_20px_rgba(79,70,229,0.1)]">

                        {/* Top: Final Render MP4 */}
                        <div className="w-full relative flex items-center justify-center bg-black min-h-[400px]">
                            {/* Top Left Tag */}
                            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-full text-xs font-bold text-white tracking-widest uppercase shadow-lg">
                                {model.model_name}
                            </div>

                            {/* Fallback for missing file */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-900 shadow-inner font-mono z-0 text-xs">
                                <Play size={32} className="mb-3 text-slate-700" />
                                <span>{model.mp4_path}</span>
                            </div>
                            <video
                                ref={videoRefs[idx]}
                                src={model.mp4_path}
                                className="w-full h-full object-contain relative z-10"
                                autoPlay
                                loop
                                muted
                                playsInline
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>

                        {/* Bottom: Model Information */}
                        <div className="p-6 lg:p-8 flex flex-col">
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">{model.model_name}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Samples</span>
                                    <span className="text-white font-mono text-xl">{model.num_samples}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Dimensions</span>
                                    <span className="text-white font-mono text-xl">{model.pos_encode_dims}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Epochs</span>
                                    <span className="text-white font-mono text-xl">{model.epochs}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Training Time</span>
                                    <span className="text-indigo-400 font-mono text-xl">{model.training_time}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">PSNR</span>
                                    <span className="text-cyan-400 font-mono text-xl">{model.psnr != null ? `${model.psnr} dB` : '—'}</span>
                                </div>
                                <div className="flex flex-col bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                    <span className="text-slate-500 text-xs font-semibold uppercase mb-1">Val PSNR</span>
                                    <span className="text-cyan-400 font-mono text-xl">
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
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NerfComparison;
