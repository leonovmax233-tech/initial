"use client";

import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { User, Moon, Sun, Monitor, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore';

const Settings = () => {
  const { stats } = useLearningStore();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">SETTINGS</h1>
        <p className="text-slate-500 text-lg mt-2">Керуйте своїм профілем та налаштуваннями навчання.</p>
      </header>

      <div className="space-y-8">
        {/* Account Section */}
        <Card className="p-8 rounded-3xl shadow-lg border-none bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Профіль</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Ім'я користувача</label>
              <Input placeholder="Ваше ім'я" defaultValue="Student" className="rounded-xl py-6" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500">Email</label>
              <Input placeholder="email@example.com" className="rounded-xl py-6" />
            </div>
          </div>
          <Button className="mt-8 rounded-xl px-8">Зберегти зміни</Button>
        </Card>

        {/* Theme Section */}
        <Card className="p-8 rounded-3xl shadow-lg border-none bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <Monitor className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Зовнішній вигляд</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl border-2">
              <Sun className="w-6 h-6" /> Світла
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2 rounded-2xl border-2">
              <Moon className="w-6 h-6" /> Темна
            </Button>
            <Button variant="default" className="h-24 flex-col gap-2 rounded-2xl">
              <Monitor className="w-6 h-6" /> Системна
            </Button>
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card className="p-8 rounded-3xl shadow-lg border-none bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-green-100 rounded-2xl text-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Навчання</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Пріоритет складних слів</p>
                <p className="text-sm text-slate-500">Частіше показувати слова, в яких ви помилялися.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Звукові ефекти</p>
                <p className="text-sm text-slate-500">Відтворювати звуки при правильних відповідях.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;