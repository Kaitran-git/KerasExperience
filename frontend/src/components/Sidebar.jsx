import React, { useRef, useState } from 'react';
import { Layers, Activity, Cpu, Hexagon, X, UploadCloud, ChevronDown, ChevronUp } from 'lucide-react';

// Static accuracy metrics per epoch checkpoint
const epochAccuracy = {
    'Kera-03': { acc: 0.8220, val_acc: 0.4956 },
    'Kera-10': { acc: 0.9304, val_acc: 0.8901 },
    'Kera-20': { acc: 0.9621, val_acc: 0.9479 },
    'Kera-30': { acc: 0.9749, val_acc: 0.9522 },
    'Kera-40': { acc: 0.9797, val_acc: 0.8991 },
    'Kera-50': { acc: 0.9861, val_acc: 0.9599 },
};

const Sidebar = ({ activeModel, setActiveModel, isOpen, setIsOpen, availableModels, fetchModels }) => {
    const fileInputRef = useRef(null);
    const [expandedModels, setExpandedModels] = useState(new Set());

    const toggleExpand = (e, modelId) => {
        e.stopPropagation();
        setExpandedModels(prev => {
            const next = new Set(prev);
            next.has(modelId) ? next.delete(modelId) : next.add(modelId);
            return next;
        });
    };

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case 'Activity': return Activity;
            case 'Cpu': return Cpu;
            default: return Layers;
        }
    };

    const models = (availableModels || []).map(m => ({ ...m, icon: getIconComponent(m.icon) }));

    const handleModelUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/models', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const newModel = await response.json();
                if (fetchModels) await fetchModels();
                setActiveModel(newModel.id);
            } else {
                console.error("Failed to upload model");
            }
        } catch (error) {
            console.error("Error uploading model", error);
        }
    };

    const uploadButton = (
        <div>
            <input
                type="file"
                accept=".keras"
                className="hidden"
                ref={fileInputRef}
                onChange={handleModelUpload}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent mt-4 border-dashed !border-slate-700 hover:!border-blue-500"
            >
                <UploadCloud size={18} />
                <span className="font-medium">Upload .keras Model</span>
            </button>
        </div>
    );

    const sidebarContent = (
        <div className="h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 flex flex-col hidden lg:flex">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                    <Hexagon size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Image Classification
                </span>
            </div>

            <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
                    Select Model
                </p>
                <div className="space-y-2">
                    {models.map((model) => {
                        const Icon = model.icon;
                        const isActive = activeModel === model.id;
                        const hasAccData = !!epochAccuracy[model.name];
                        const accData = epochAccuracy[model.name];
                        const isExpanded = expandedModels.has(model.id);

                        return (
                            <div key={model.id}>
                                <button
                                    onClick={() => setActiveModel(model.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                        : 'hover:bg-slate-800 hover:text-white border border-transparent'
                                        }`}
                                >
                                    <Icon size={18} className={`${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`} />
                                    <span className="font-medium flex-1 text-left">{model.name}</span>
                                    {hasAccData && (
                                        <span
                                            onClick={(e) => toggleExpand(e, model.id)}
                                            className="ml-auto text-slate-500 hover:text-blue-400 transition-colors p-0.5 rounded"
                                        >
                                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                                        </span>
                                    )}
                                    {isActive && !hasAccData && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                    )}
                                </button>
                                {isExpanded && accData && (
                                    <div className="mx-2 mb-1 grid grid-cols-2 gap-1 text-[10px] font-mono px-2 pb-2">
                                        <div className="bg-slate-800/80 rounded px-2 py-1.5 flex flex-col">
                                            <span className="text-slate-500 uppercase text-[8px] tracking-wide leading-none mb-0.5">acc</span>
                                            <span className="text-emerald-400">{accData.acc.toFixed(4)}</span>
                                        </div>
                                        <div className="bg-slate-800/80 rounded px-2 py-1.5 flex flex-col">
                                            <span className="text-slate-500 uppercase text-[8px] tracking-wide leading-none mb-0.5">val_acc</span>
                                            <span className="text-cyan-400">{accData.val_acc.toFixed(4)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {uploadButton}
                </div>
            </div>

        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            {sidebarContent}

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="relative w-64 bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        {/* Mobile content wrapper reusing desktop content layout */}
                        <div className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                                    <Hexagon size={20} className="text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">
                                    Image Classification
                                </span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-4 py-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Select Model</p>
                            <div className="space-y-2">
                                {models.map((model) => {
                                    const Icon = model.icon;
                                    const isActive = activeModel === model.id;
                                    return (
                                        <button
                                            key={model.id}
                                            onClick={() => {
                                                setActiveModel(model.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <Icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-500'} />
                                                <span className="font-medium">{model.name}</span>
                                            </div>
                                            <AccBadge modelName={model.name} />
                                        </button>
                                    );
                                })}
                                {uploadButton}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
