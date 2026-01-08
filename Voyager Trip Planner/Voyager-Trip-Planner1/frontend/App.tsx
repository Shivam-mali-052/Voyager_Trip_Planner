
import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  Users, 
  Calendar, 
  Wallet, 
  CloudSun, 
  Hotel as HotelIcon, 
  Utensils, 
  Compass,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Star,
  Zap,
  X,
  ExternalLink,
  CheckCircle2,
  Navigation,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import { PlannerFormData, PlannerResults, TravelerType, Hotel } from './types';
// In a real environment, this would call /api/plan. 
// For this environment, we import the service directly to ensure functionality.
import { fetchTripPlan } from '../backend/plannerService';

const StatCard = ({ icon: Icon, label, value, subValue, trend }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 transition-all hover:translate-y-[-4px] hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">
        <Icon size={22} className="text-slate-600" />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend === 'up' ? 'Within' : 'Over'}
        </span>
      )}
    </div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
    {subValue && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subValue}</p>}
  </div>
);

const SectionHeader = ({ title, icon: Icon, colorClass = "text-blue-600" }: { title: string, icon: any, colorClass?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className={`p-2.5 rounded-xl bg-opacity-10 ${colorClass.replace('text', 'bg')}`}>
      <Icon size={20} className={colorClass} />
    </div>
    <h2 className="text-2xl font-black text-slate-800 tracking-tight font-heading">{title}</h2>
  </div>
);

const InputField = ({ label, icon: Icon, children }: any) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      <Icon size={12} className="text-slate-300" />
      {label}
    </label>
    {children}
  </div>
);

const HotelDetailModal = ({ hotel, onClose }: { hotel: Hotel, onClose: () => void }) => {
  const handleDirectionsClick = () => {
    const encodedAddress = encodeURIComponent(hotel.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="relative p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex-shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200/50 transition-colors text-slate-400">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">Verified Provider</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star size={16} fill="currentColor" /> {hotel.rating} Rating
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-heading pr-12">{hotel.name}</h2>
          <div className="flex items-start gap-2 text-slate-500 mt-3 font-medium text-sm">
            <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p>{hotel.address}</p>
          </div>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">Overview</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{hotel.description}</p>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {hotel.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:border-blue-200">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-bold text-slate-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <div className="p-6 bg-slate-900 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Live Quote</p>
                <p className="text-3xl font-black text-white">₹{hotel.pricePerNight.toLocaleString()}<span className="text-sm text-slate-400 font-bold ml-1">/ night</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button onClick={handleDirectionsClick} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 border border-white/10">
                  Get Route <Navigation size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<PlannerFormData>({ 
    budget: 80000, 
    location: '', 
    people: 2, 
    days: 4, 
    travelerType: TravelerType.BUDGET 
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlannerResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'budget' || name === 'people' || name === 'days' ? Number(value) : value 
    }));
  };

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location) { 
      setError("Where is your soul headed?"); 
      return; 
    }
    setLoading(true); 
    setError(null);
    try {
      // Direct call for the sake of this interactive preview
      const data = await fetchTripPlan(formData);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "An unexpected connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const moneyStatus = results ? (formData.budget - results.totalEstimatedCost) : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {selectedHotel && <HotelDetailModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />}
      
      <aside className="w-full md:w-[400px] lg:w-[440px] bg-white p-8 border-r border-slate-200/60 sticky top-0 md:h-screen overflow-y-auto z-20 flex flex-col shadow-xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-blue-600 p-3 rounded-[1.25rem] shadow-lg shadow-blue-500/30">
            <Plane className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">Voyager</h1>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest -mt-1">Real-Time Planner</p>
          </div>
        </div>

        <form onSubmit={handlePlanTrip} className="space-y-6 flex-1">
          <InputField label="Destination" icon={MapPin}>
            <div className="relative group">
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="City or Region" 
                className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold outline-none" 
                required 
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </InputField>

          <InputField label="Max Budget (INR)" icon={Wallet}>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
              <input 
                type="number" 
                name="budget" 
                value={formData.budget} 
                onChange={handleInputChange} 
                className="w-full bg-slate-50 pl-10 pr-6 py-4 rounded-2xl border border-slate-200 focus:bg-white transition-all font-black text-lg outline-none" 
                required 
              />
            </div>
          </InputField>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Group" icon={Users}>
              <input type="number" name="people" value={formData.people} onChange={handleInputChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 transition-all font-bold outline-none" required />
            </InputField>
            <InputField label="Nights" icon={Calendar}>
              <input type="number" name="days" value={formData.days} onChange={handleInputChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 transition-all font-bold outline-none" required />
            </InputField>
          </div>

          <InputField label="Traveler Style" icon={Zap}>
            <select name="travelerType" value={formData.travelerType} onChange={handleInputChange} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200 appearance-none cursor-pointer font-bold outline-none">
              <option value={TravelerType.BUDGET}>Comfort Budget</option>
              <option value={TravelerType.POOR}>Backpacker</option>
              <option value={TravelerType.LUXURY}>High-End Luxury</option>
            </select>
          </InputField>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <><span className="text-lg font-heading tracking-tight">Craft Itinerary</span><ChevronRight size={20} /></>}
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar relative">
        {!results && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in duration-1000">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <Compass size={80} className="relative text-blue-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 font-heading tracking-tight">Adventure Awaits.</h2>
            <p className="text-slate-500 text-lg max-w-lg font-medium">Input your destination and budget to generate a verified, real-time itinerary.</p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Consulting Live Data...</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 animate-pulse">Checking Rates • Weather • Local Insights</p>
          </div>
        )}

        {error && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <AlertCircle className="text-rose-500 mb-6" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Something went wrong</h2>
            <p className="text-slate-500 mt-2">{error}</p>
            <button onClick={() => setError(null)} className="mt-6 text-blue-600 font-bold underline">Try again</button>
          </div>
        )}

        {results && !loading && (
          <div className="space-y-12 pb-32 animate-in slide-in-from-bottom-12 duration-700">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 font-heading tracking-tight">Journey to {formData.location}</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Verified Data-Driven Insights</p>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                <CloudSun size={24} className="text-blue-500" />
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{results.weather.temp}°C</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{results.weather.condition}</p>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Wallet} label="Estimated Total" value={`₹${results.totalEstimatedCost.toLocaleString()}`} trend={results.totalEstimatedCost <= formData.budget ? 'up' : 'down'} />
              <StatCard icon={Users} label="Per Person" value={`₹${Math.round(results.totalEstimatedCost / formData.people).toLocaleString()}`} subValue="Total stay duration" />
              <StatCard icon={Compass} label="Budget Status" value={moneyStatus >= 0 ? `+₹${moneyStatus.toLocaleString()}` : `-₹${Math.abs(moneyStatus).toLocaleString()}`} subValue={moneyStatus >= 0 ? "Under allocation" : "Over allocation"} />
              <StatCard icon={Zap} label="Daily Goal" value={`₹${Math.round(results.budgetBreakdown.perPersonPerDay).toLocaleString()}`} subValue="Avg per day/person" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-16">
                <SectionHeader title="Verified Stays" icon={HotelIcon} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.hotels.map((hotel, idx) => (
                    <div key={idx} className="group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col">
                      <div className="flex justify-between items-start mb-5">
                        <h4 className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors leading-tight">{hotel.name}</h4>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 text-[11px] px-3 py-1.5 rounded-full font-black">
                          <Star size={12} fill="currentColor" /> {hotel.rating}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-8 leading-relaxed line-clamp-2 font-medium">{hotel.description}</p>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Per Night Est.</p>
                          <p className="text-2xl font-black text-slate-900">₹{hotel.pricePerNight.toLocaleString()}</p>
                        </div>
                        <button onClick={() => setSelectedHotel(hotel)} className="bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-900 p-4 rounded-2xl transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <SectionHeader title="Live Experiences" icon={Compass} colorClass="text-indigo-600" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.activities.map((act, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-xl bg-slate-50">{act.type}</span>
                        <p className="font-black text-indigo-600">₹{act.cost.toLocaleString()}</p>
                      </div>
                      <h4 className="font-black text-slate-900 text-xl mb-3">{act.name}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white">
                  <h3 className="text-xl font-black mb-8 font-heading flex items-center gap-3"><TrendingUp className="text-blue-400" /> Allocation Map</h3>
                  <div className="space-y-10">
                    {[
                      { l: 'Accommodation', v: results.budgetBreakdown.stay, c: 'bg-blue-500', w: '55%' },
                      { l: 'Food & Dining', v: results.budgetBreakdown.food, c: 'bg-emerald-400', w: '25%' },
                      { l: 'Activities', v: results.budgetBreakdown.activities, c: 'bg-amber-400', w: '20%' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>{item.l}</span><span>₹{item.v.toLocaleString()}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.c}`} style={{ width: item.w }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl">
                  <SectionHeader title="Gastronomy" icon={Utensils} colorClass="text-emerald-600" />
                  <div className="space-y-4">
                    {results.foodSuggestions.map((food, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] transition-all hover:translate-x-1">
                        <div className="w-10 h-10 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 font-black text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm font-black text-slate-700">{food}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
