"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Code, GraduationCap, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', path: '/' },
    { icon: GraduationCap, label: 'ENGLISH', path: '/course/English' },
    { icon: BookOpen, label: 'POLISH', path: '/course/Polish' },
    { icon: Code, label: 'PYTHON', path: '/course/Python' },
    { icon: Settings, label: 'SETTINGS', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-6 flex flex-col">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black tracking-tighter text-primary">LINGUAFLOW</h1>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest">LEARNING SYSTEM</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
              location.pathname === item.path 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
        <p className="text-xs text-slate-500 mb-1">PROGRESS</p>
        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;