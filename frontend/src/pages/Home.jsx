import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Image as ImageIcon, Sparkles, TerminalSquare, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <Hexagon size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                            Kera Studio
                        </span>
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                        Platform Portal
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full relative z-10 flex flex-col items-center">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mb-16 animate-in slide-in-from-bottom-8 duration-700 fade-in relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
                        Pick your <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">Kera Model</span>
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl animate-in slide-in-from-bottom-12 duration-1000 fade-in delay-150">

                    {/* Image Classification Project Card */}
                    <button
                        onClick={() => navigate('/image-classifier')}
                        className="group flex flex-col text-left bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] w-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />

                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-inner">
                            <ImageIcon size={24} className="text-blue-400" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Image Classification</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                            Upload images and visually test your custom Keras neural networks using our interactive inference dashboard.
                        </p>

                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 mt-auto group-hover:translate-x-2 transition-transform">
                            Open Project <ArrowRight size={16} />
                        </div>
                    </button>

                    {/* NeRF Comparison Dashboard Project Card */}
                    <button
                        onClick={() => navigate('/nerf-dashboard')}
                        className="group flex flex-col text-left bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] w-full relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />

                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-inner">
                            <Sparkles size={24} className="text-indigo-400" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">NeRF Comparison</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                            Analyze hyperparameter configurations and compare final 3D render outputs side-by-side.
                        </p>

                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 mt-auto group-hover:translate-x-2 transition-transform">
                            Open Project <ArrowRight size={16} />
                        </div>
                    </button>

                    {/* Coming Soon Card 2 */}
                    <div className="flex flex-col bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 relative overflow-hidden opacity-60">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
                            <TerminalSquare size={24} className="text-slate-500" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-300 mb-2">Data Analytics</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                            A future workspace for visualizing dataset distributions and training metrics.
                        </p>

                        <div className="inline-flex items-center justify-center self-start px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-slate-400 border border-slate-700">
                            Coming Soon
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Home;
