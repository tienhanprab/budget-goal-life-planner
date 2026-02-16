import React, { useState } from 'react';
import { Sparkles, TrendingUp, Check } from 'lucide-react';

const GoalLifePlanner = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Motorcycle: Honda Genio', target: 1610, saved: 500, icon: '🏍️', color: 'emerald' },
    { id: 2, title: 'Credit Card: Tesco Lotus', target: 1265, saved: 300, icon: '💳', color: 'blue' },
    { id: 3, title: 'Emergency Fund', target: 6000, saved: 2000, icon: '🛡️', color: 'amber' },
    { id: 4, title: 'Savings', target: 100000, saved: 15000, icon: '💰', color: 'violet' },
    { id: 5, title: 'New Car: Toyota Yaris Cross', target: 18290, saved: 0, icon: '🚗', color: 'rose' },
    { id: 6, title: 'New Home', target: 450000, saved: 0, icon: '🏡', color: 'indigo' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [updateAmount, setUpdateAmount] = useState('');

  const formatCurrency = (amount) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  const calculateProgress = (saved, target) => Math.min(Math.round((saved / target) * 100), 100);

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overallProgress = calculateProgress(totalSaved, totalTarget);
  const goalsAchieved = goals.filter(g => g.saved >= g.target).length;

  const handleUpdateClick = (goal) => { setSelectedGoal(goal); setUpdateAmount(''); setShowModal(true); };
  const handleUpdateSave = () => {
    if (selectedGoal && updateAmount && !isNaN(updateAmount)) {
      const newAmount = parseFloat(updateAmount);
      setGoals(goals.map(g => g.id === selectedGoal.id ? { ...g, saved: Math.min(newAmount, g.target) } : g));
      setShowModal(false); setSelectedGoal(null); setUpdateAmount('');
    }
  };

  const getColorClasses = (color, type = 'bg') => {
    const map = {
      emerald: { bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-400 to-emerald-600' },
      blue: { bg: 'bg-blue-500', lightBg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-400 to-blue-600' },
      amber: { bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-400 to-amber-600' },
      violet: { bg: 'bg-violet-500', lightBg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-400 to-violet-600' },
      rose: { bg: 'bg-rose-500', lightBg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-400 to-rose-600' },
      indigo: { bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', gradient: 'from-indigo-400 to-indigo-600' }
    };
    return map[color]?.[type] || map.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 w-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@600;700&display=swap');
        .heading-font { font-family: 'Fraunces', serif; }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .card-enter { animation: scale-in 0.45s ease-out forwards; }
        .progress-bar { transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
        .shimmer-bg { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); background-size: 1000px 100%; animation: shimmer 2s infinite; }
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
      `}</style>

      {/* Full-width hero */}
      <header className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                <h1 className="heading-font text-4xl md:text-5xl font-bold tracking-tight">Goal Life Planner</h1>
              </div>
              <p className="mt-2 text-blue-100">Track your debts and savings progress with style ✨</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overall Progress */}
        <div className="mb-10 card-enter">
          <div className="w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="heading-font text-3xl font-bold text-gray-800 mb-1">Overall Progress</h2>
                <p className="text-gray-500">Your financial journey</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wide mb-2">Total Saved</p>
                <p className="text-3xl font-bold text-emerald-900">{formatCurrency(totalSaved)}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide mb-2">Total Target</p>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(totalTarget)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Progress</span>
                <span className="text-2xl font-bold heading-font bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{overallProgress}%</span>
              </div>
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full progress-bar" style={{ width: `${overallProgress}%` }}>
                  <div className="absolute inset-0 shimmer-bg"></div>
                </div>
              </div>
              <div className="flex items-center justify-center pt-2">
                <div className="bg-purple-100 rounded-full px-6 py-2 flex items-center space-x-2">
                  <Check className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-900 font-semibold">{goalsAchieved} / {goals.length} Goals Achieved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals grid */}
        <section className="mb-12">
          <h3 className="heading-font text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Financial Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, i) => {
              const progress = calculateProgress(goal.saved, goal.target);
              const remaining = goal.target - goal.saved;
              const isComplete = progress >= 100;
              return (
                <article key={goal.id} className={`w-full bg-white rounded-2xl shadow-lg p-0 overflow-hidden card-enter`} style={{ animationDelay: `${i * 80}ms`, border: isComplete ? '2px solid rgb(34,197,94)' : 'none' }}>
                  <div className={`${getColorClasses(goal.color, 'lightBg')} p-6 border-b ${getColorClasses(goal.color, 'border')}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{goal.icon}</div>
                      <div className={`${getColorClasses(goal.color, 'bg')} text-white px-3 py-1 rounded-full text-sm font-bold`}>{progress}%</div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">{goal.title}</h4>
                    <p className={`text-sm font-semibold ${getColorClasses(goal.color, 'text')}`}>Target: {formatCurrency(goal.target)}</p>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${getColorClasses(goal.color, 'gradient')} rounded-full`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-gray-600">Saved</span>
                      <span className="font-bold text-gray-900">{formatCurrency(goal.saved)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-bold text-gray-900">{formatCurrency(remaining)}</span>
                    </div>
                    <button onClick={() => handleUpdateClick(goal)} className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${getColorClasses(goal.color, 'gradient')}`}>Update Amount</button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl p-8 shadow-lg border border-purple-200">
            <p className="heading-font text-2xl md:text-3xl font-bold text-gray-800 mb-2">"Small steps everyday lead to big results."</p>
            <p className="text-4xl">🚀</p>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 text-2xl">×</button>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedGoal.icon}</div>
                <h3 className="heading-font text-2xl font-bold text-gray-800 mb-2">{selectedGoal.title}</h3>
                <p className="text-gray-600">Current: {formatCurrency(selectedGoal.saved)} / {formatCurrency(selectedGoal.target)}</p>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">New Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">฿</span>
                  <input type="number" value={updateAmount} onChange={(e) => setUpdateAmount(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200" placeholder="0" min="0" max={selectedGoal.target} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Cancel</button>
                <button onClick={handleUpdateSave} className={`flex-1 py-3 rounded-xl text-white bg-gradient-to-r ${getColorClasses(selectedGoal.color, 'gradient')}`}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalLifePlanner;