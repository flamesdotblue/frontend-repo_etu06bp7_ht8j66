import { useState } from 'react';
import { MapPin, Wallet, Users, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlannerChat({ onComplete }) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [people, setPeople] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Enter your location (e.g., Varkala)' },
  ]);

  function next(value) {
    const newMsgs = [...messages, { role: 'user', text: value }];
    setMessages(newMsgs);

    if (step === 0) {
      setStep(1);
      setTimeout(() => {
        setMessages((m) => [...m, { role: 'ai', text: 'Enter your travel budget (₹ or $)' }]);
      }, 300);
    } else if (step === 1) {
      setStep(2);
      setTimeout(() => {
        setMessages((m) => [...m, { role: 'ai', text: 'How many people are travelling?' }]);
      }, 300);
    } else {
      // done
      onComplete({ location, budget: Number(String(budget).replace(/[^0-9.]/g, '')) || 0, people: Number(people) || 1 });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (step === 0 && location.trim()) return next(location.trim());
    if (step === 1 && String(budget).trim()) return next(String(budget).trim());
    if (step === 2 && String(people).trim()) return next(String(people).trim());
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/70 backdrop-blur border border-white/50 rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`${m.role === 'ai' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'} px-4 py-2 rounded-2xl max-w-[80%]`}>{m.text}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                <div className="shrink-0 p-2 rounded-xl bg-gray-100 text-gray-700"><MapPin size={20} /></div>
                <input
                  autoFocus
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Varkala, Kochi, Ooty..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl">
                  <Send size={18} />
                </button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                <div className="shrink-0 p-2 rounded-xl bg-gray-100 text-gray-700"><Wallet size={20} /></div>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="₹30000 or $400"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl">
                  <Send size={18} />
                </button>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                <div className="shrink-0 p-2 rounded-xl bg-gray-100 text-gray-700"><Users size={20} /></div>
                <input
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="2"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl">
                  <Send size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
