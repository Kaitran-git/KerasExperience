import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlayCircle, ImagePlay, XCircle, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import NerfGrid from '../components/nerf/NerfGrid';
import NerfComparison from '../components/nerf/NerfComparison';
import NerfGifComparison from '../components/nerf/NerfGifComparison';

const NerfDashboard = () => {
    const [models, setModels] = useState([]);
    const [selectedModels, setSelectedModels] = useState([]);
    const [compareMode, setCompareMode] = useState(null); // null | 'mp4' | 'gif'
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/nerf_data/nerf_models.json')
            .then(res => res.json())
            .then(data => {
                setModels(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load NeRF Data", err);
                setIsLoading(false);
            });
    }, []);

    const toggleModelSelection = (modelId) => {
        setSelectedModels(prev => {
            if (prev.includes(modelId)) return prev.filter(id => id !== modelId);
            if (prev.length < 2) return [...prev, modelId];
            return [prev[0], modelId];
        });
    };

    const deselectAll = () => setSelectedModels([]);

    const activeModelObjects = models.filter(m => selectedModels.includes(m.id));
    const canCompare = selectedModels.length === 2;
    const isCompareMode = compareMode !== null;

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col font-sans">

            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
                <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium">Back to Portal</span>
                        </Link>

                        <div className="h-6 w-px bg-slate-700" />

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                                <Box size={18} className="text-indigo-400" />
                            </div>
                            <h1 className="text-xl font-semibold text-white truncate">
                                NeRF Model Comparison
                            </h1>
                        </div>
                    </div>

                    {/* Header Action Buttons */}
                    {!isCompareMode && selectedModels.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">
                                {selectedModels.length}/2 Selected
                            </span>

                            {/* Deselect All */}
                            <button
                                onClick={deselectAll}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-slate-700 bg-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
                            >
                                <XCircle size={15} />
                                Deselect All
                            </button>

                            {/* Compare GIFs */}
                            <button
                                onClick={() => canCompare && setCompareMode('gif')}
                                disabled={!canCompare}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm border
                                    bg-emerald-700/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-400
                                    disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                            >
                                <ImagePlay size={15} />
                                Compare GIFs
                            </button>

                            {/* Compare MP4 Renders */}
                            <button
                                onClick={() => canCompare && setCompareMode('mp4')}
                                disabled={!canCompare}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-5 py-2 rounded-lg font-medium transition-all text-sm shadow-[0_0_15px_rgba(79,70,229,0.2)] disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                <PlayCircle size={15} />
                                Compare MP4 Renders
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-slate-500 animate-pulse">
                        Loading NeRF Database...
                    </div>
                ) : compareMode === 'mp4' ? (
                    <NerfComparison
                        models={activeModelObjects}
                        onBack={() => setCompareMode(null)}
                    />
                ) : compareMode === 'gif' ? (
                    <NerfGifComparison
                        models={activeModelObjects}
                        onBack={() => setCompareMode(null)}
                    />
                ) : (
                    <NerfGrid
                        models={models}
                        selectedModels={selectedModels}
                        onToggleSelection={toggleModelSelection}
                    />
                )}
            </main>

        </div>
    );
};

export default NerfDashboard;
