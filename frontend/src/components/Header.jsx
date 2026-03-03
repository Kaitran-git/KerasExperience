import React from 'react';
import { Menu, User, Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ activeModel, toggleSidebar }) => {
    return (
        <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mr-2 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium hidden sm:block">Back to Portal</span>
                    </Link>

                    <div className="h-6 w-px bg-slate-700 hidden sm:block" />

                    <h1 className="text-xl font-semibold text-white truncate hidden sm:block">
                        Image Classification
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Active Model Badge */}
                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 shadow-inner hidden sm:flex">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                        <span className="text-sm font-medium text-slate-300">
                            Active: <span className="text-blue-400">{activeModel}</span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
