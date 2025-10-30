import { Bus, Train, Car, Bike, Bed, Map, RefreshCcw, IndianRupee, DollarSign, Clock, Download } from 'lucide-react';
import SectionCard from './SectionCard';

function currencySymbol(budget) {
  return String(budget).toString().includes('$') ? '$' : '₹';
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function ResultsPanel({ plan, onRegenerate, onDownload }) {
  if (!plan) return null;

  const curr = plan.currency === 'usd' ? '$' : '₹';

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionCard title="Top Attractions" icon={Map}
        footer={<div className="text-xs text-gray-500">Tip: Prioritize spots near each other to reduce travel time.</div>}
      >
        <div className="grid gap-3">
          {plan.attractions.map((a, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">{a.name}</div>
                  <div className="text-sm text-gray-600">{a.description}</div>
                  <div className="mt-1 text-xs text-gray-500">Best time: {a.bestTime}</div>
                </div>
                <div className="text-sm text-gray-700 whitespace-nowrap">Entry ~ {curr}{a.entryCost}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Getting Around" icon={Bus}
        footer={<div className="text-xs text-gray-500">Times and fares are estimates — check locally for live info.</div>}
      >
        <div className="grid gap-3">
          {plan.attractions.map((a, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4">
              <div className="font-medium text-gray-800 mb-2">{a.name}</div>
              <div className="grid grid-cols-2 gap-2">
                {a.transport.map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      {t.mode === 'Bus' && <Bus size={16} />}
                      {t.mode === 'Train' && <Train size={16} />}
                      {t.mode === 'Taxi' && <Car size={16} />}
                      {t.mode === 'Auto' && <Bike size={16} />}
                      <span>{t.mode}</span>
                    </div>
                    <div className="text-gray-600 flex items-center gap-3">
                      <span className="whitespace-nowrap">{curr}{t.fare}</span>
                      <span className="flex items-center gap-1 text-xs"><Clock size={12} />{t.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Stays within Budget" icon={Bed}
        footer={<div className="text-xs text-gray-500">Prices vary by season. Look for weekday deals to save more.</div>}
      >
        <div className="grid gap-3">
          {plan.hotels.map((h, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">{h.name}</div>
                  <div className="text-sm text-gray-600">{h.type} • {h.rating}★ • {h.location}</div>
                </div>
                <div className="text-right text-gray-700">
                  <div className="font-medium">{curr}{h.price}/night</div>
                  <div className="text-xs text-gray-500">Fits {h.capacity} people</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={`Trip Idea (${plan.days.length}-Day Plan)`} icon={Map}>
        <div className="space-y-4">
          {plan.days.map((d, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 p-4">
              <div className="font-semibold text-gray-800">Day {idx + 1}</div>
              <ul className="list-disc pl-5 text-sm text-gray-700 mt-1 space-y-1">
                {d.activities.map((ac, i) => (
                  <li key={i}>{ac}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="bg-white/80 backdrop-blur border border-white/50 rounded-2xl shadow-sm p-5 w-full">
          <div className="flex items-center gap-3 text-gray-800">
            <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
              {curr === '$' ? <DollarSign size={18} /> : <IndianRupee size={18} />}
            </div>
            <div>
              <div className="text-sm text-gray-500">Estimated Total (stay + local transport + sightseeing)</div>
              <div className="text-2xl font-bold">{curr}{numberWithCommas(plan.totalEstimated)}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={onRegenerate} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
            <RefreshCcw size={18} /> Regenerate Trip Plan
          </button>
          <button onClick={onDownload} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-black text-white w-full md:w-auto">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
