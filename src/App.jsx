import { useMemo, useRef, useState } from 'react';
import HeroSpline from './components/HeroSpline';
import PlannerChat from './components/PlannerChat';
import ResultsPanel from './components/ResultsPanel';

function randomPick(arr, count) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < count) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

const CITY_DATA = {
  varkala: {
    attractions: [
      { name: 'Varkala Cliff & Beach', description: 'Iconic cliffside beach with cafes and sunsets', bestTime: 'Sunset', entryCost: 0 },
      { name: 'Janardanaswamy Temple', description: 'Ancient temple near the beach', bestTime: 'Morning', entryCost: 50 },
      { name: 'Kappil Lake', description: 'Backwaters meeting the sea, serene views', bestTime: 'Evening', entryCost: 0 },
      { name: 'Anjengo Fort', description: 'Historic fort with lighthouse views', bestTime: 'Evening', entryCost: 25 },
    ],
  },
  kochi: {
    attractions: [
      { name: 'Fort Kochi', description: 'Chinese fishing nets, colonial lanes, art cafes', bestTime: 'Evening', entryCost: 0 },
      { name: 'Mattancherry Palace', description: 'Kerala murals and royal artefacts', bestTime: 'Morning', entryCost: 60 },
      { name: 'Jew Town & Synagogue', description: 'Antique shops and heritage walk', bestTime: 'Morning', entryCost: 70 },
      { name: 'Marine Drive', description: 'Harbour-side promenade', bestTime: 'Sunset', entryCost: 0 },
    ],
  },
  ooty: {
    attractions: [
      { name: 'Ooty Lake', description: 'Boating and lakeside strolls', bestTime: 'Evening', entryCost: 30 },
      { name: 'Botanical Gardens', description: 'Vast gardens with rare flora', bestTime: 'Morning', entryCost: 50 },
      { name: 'Doddabetta Peak', description: 'Panoramic views of the Nilgiris', bestTime: 'Morning', entryCost: 20 },
      { name: 'Tea Museum', description: 'Learn tea making and tasting', bestTime: 'Afternoon', entryCost: 50 },
    ],
  },
};

function buildTransportOptions(avgDistanceKm) {
  // rough fares in INR per attraction ride
  const timeBase = Math.max(10, Math.round(avgDistanceKm * 6));
  return [
    { mode: 'Bus', fare: Math.round(15 + avgDistanceKm * 2), time: `${timeBase + 10}-${timeBase + 25}m` },
    { mode: 'Train', fare: Math.round(30 + avgDistanceKm * 3), time: `${timeBase}-${timeBase + 15}m` },
    { mode: 'Taxi', fare: Math.round(120 + avgDistanceKm * 20), time: `${timeBase - 5}-${timeBase + 10}m` },
    { mode: 'Auto', fare: Math.round(60 + avgDistanceKm * 10), time: `${timeBase}-${timeBase + 10}m` },
  ];
}

function deriveCurrency(budget) {
  return String(budget).includes('$') ? 'usd' : 'inr';
}

function inrAmount(budget, currency) {
  const num = Number(String(budget).replace(/[^0-9.]/g, '')) || 0;
  if (currency === 'usd') return Math.round(num * 83); // rough conversion
  return num;
}

function generatePlan({ location, budget, people }) {
  const cityKey = String(location).trim().toLowerCase();
  const base = CITY_DATA[cityKey] || {
    attractions: [
      { name: `${location} Central Park`, description: 'City green space and walking paths', bestTime: 'Evening', entryCost: 0 },
      { name: `${location} Museum`, description: 'Local history and culture', bestTime: 'Morning', entryCost: 100 },
      { name: `${location} Market`, description: 'Street food and souvenirs', bestTime: 'Evening', entryCost: 0 },
      { name: `${location} Viewpoint`, description: 'City skyline panorama', bestTime: 'Sunset', entryCost: 20 },
    ],
  };

  const currency = deriveCurrency(budget);
  const totalBudgetInr = inrAmount(budget, currency);

  const attractions = randomPick(base.attractions, 3 + Math.floor(Math.random() * 1));
  const withTransport = attractions.map((a) => ({
    ...a,
    transport: buildTransportOptions(4 + Math.random() * 6),
  }));

  // stays: allocate 40-60% budget to stay for 2 nights
  const stayBudget = Math.max(800, Math.round(totalBudgetInr * 0.5));
  const perNightTarget = Math.round(stayBudget / 2);
  const hotelBase = [
    { name: 'Seaview Inn', type: 'Hotel', rating: 4.2, location: 'Central', capacity: Math.max(2, people) },
    { name: 'Palm Breeze Stays', type: 'Homestay', rating: 4.5, location: 'Beachside', capacity: Math.max(2, people) },
    { name: 'City Comfort Rooms', type: 'Hotel', rating: 4.0, location: 'Downtown', capacity: Math.max(2, people) },
  ];
  const hotels = hotelBase.map((h, i) => ({
    ...h,
    price: Math.max(600, Math.round(perNightTarget * (0.7 + i * 0.15) / Math.max(1, Math.ceil(people / 2))))
  }));

  const days = [
    { activities: [
      `Arrive in ${location} and check-in`,
      `Visit ${withTransport[0].name}`,
      `Sunset at ${withTransport[0].name.split(' ')[0]} area`,
    ] },
    { activities: [
      `Morning at ${withTransport[1]?.name || attractions[0].name}`,
      `Local food crawl near market`,
      `Evening stroll along popular promenade`,
    ] },
  ];
  if (totalBudgetInr > 25000 || withTransport.length > 3) {
    days.push({ activities: [
      `Day trip to ${withTransport[2]?.name || withTransport[0].name}`,
      'Cafe hopping and shopping',
      'Relaxed dinner and pack-up',
    ]});
  }

  // rough totals
  const stayCost = hotels[0].price * (days.length - 1); // nights = days - 1
  const localTransport = withTransport.reduce((s, a) => s + a.transport[0].fare * 2, 0);
  const sightseeing = withTransport.reduce((s, a) => s + a.entryCost, 0);
  const totalEstimated = Math.round(stayCost + localTransport + sightseeing);

  return {
    city: location,
    currency,
    attractions: withTransport,
    hotels,
    days,
    totalEstimated,
  };
}

export default function App() {
  const [plan, setPlan] = useState(null);
  const [input, setInput] = useState(null);
  const printRef = useRef(null);

  function handleComplete(data) {
    setInput(data);
    setPlan(generatePlan(data));
  }

  function handleRegenerate() {
    if (input) setPlan(generatePlan(input));
  }

  function handleDownload() {
    // Use browser print to PDF for simplicity
    window.print();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <HeroSpline />

        <div className="mt-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">Plan your trip</h2>
            <p className="text-white/70 text-sm md:text-base">Chat your inputs and get a personalized itinerary with attractions, transport, stays and a trip idea.</p>
          </div>
          <PlannerChat onComplete={handleComplete} />
        </div>

        <div className="mt-10" ref={printRef}>
          {plan && (
            <ResultsPanel plan={plan} onRegenerate={handleRegenerate} onDownload={handleDownload} />
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-white/50">
          Region-ready: Start with Indian cities like Varkala, Kochi, Ooty. More coming soon.
        </footer>
      </div>
    </div>
  );
}
