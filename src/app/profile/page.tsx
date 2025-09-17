'use client';

import { useEffect, useState } from 'react';
import SectionWrapper from '@/components/SectionWrapper';

type Theme = 'light' | 'dark' | 'system';

type UserPreferences = {
  displayName: string;
  email: string;
  avatarDataUrl: string | null;
  bio: string;
  dietType: 'veg' | 'non-veg' | 'egg';
  dietaryRestrictions: string[];
  allergens: string[];
  dislikedIngredients: string[];
  preferredCuisines: string[];
  defaultServings: number;
  units: 'metric' | 'imperial';
  notifications: { weeklyPlan: boolean; newRecipe: boolean; priceAlerts: boolean };
  theme: Theme;
  maxCookTime: number | null;
};

const STORAGE_KEY = 'cookmate-user-preferences';

const DEFAULTS: UserPreferences = {
  displayName: '',
  email: '',
  avatarDataUrl: null,
  bio: '',
  dietType: 'veg',
  dietaryRestrictions: [],
  allergens: [],
  dislikedIngredients: [],
  preferredCuisines: [],
  defaultServings: 2,
  units: 'metric',
  notifications: { weeklyPlan: true, newRecipe: true, priceAlerts: false },
  theme: 'system',
  maxCookTime: null,
};

export default function ProfilePage() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const [shoppingCount, setShoppingCount] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ id: number; title: string; date: string }>>([]);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) });

      // Derive stats
      const favRaw = localStorage.getItem('cookmate-favorites');
      if (favRaw) {
        try { setFavoritesCount((JSON.parse(favRaw) || []).length || 0); } catch {}
      }
      const shopRaw = localStorage.getItem('cookmate-shopping-list');
      if (shopRaw) {
        try { setShoppingCount((JSON.parse(shopRaw) || []).length || 0); } catch {}
      }
      const histRaw = localStorage.getItem('cookmate-cooking-history'); // expect: [{id,title,date}]
      if (histRaw) {
        try { setHistory(JSON.parse(histRaw) || []); } catch {}
      }
    } catch (e) {
      console.error('Load prefs failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => setPrefs((p) => ({ ...p, [key]: value }));
  const parseCsv = (v: string) => Array.from(new Set(v.split(',').map(s => s.trim()).filter(Boolean)));
  const joinCsv = (arr: string[]) => arr.join(', ');

  const onAvatarChange = (file?: File | null) => {
    if (!file) return update('avatarDataUrl', null);
    const reader = new FileReader();
    reader.onload = () => {
      update('avatarDataUrl', (reader.result as string) || null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-t-lg"><h2 className="text-lg font-semibold text-white">Profile</h2></div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
              {prefs.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={prefs.avatarDataUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
              )}
            </div>
            <label className="text-sm">
              <span className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-black rounded cursor-pointer border border-gray-300">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatarChange(e.target.files?.[0])} />
            </label>
            {prefs.avatarDataUrl && (
              <button onClick={() => update('avatarDataUrl', null)} className="text-xs text-red-600 hover:underline">Remove</button>
            )}
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input type="text" value={prefs.displayName} onChange={(e) => update('displayName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={prefs.email} onChange={(e) => update('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black" placeholder="you@example.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={prefs.bio} onChange={(e) => update('bio', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F84C8] text-black" placeholder="Tell us about your cooking style..." />
            </div>
            <div className="md:col-span-2">
              <button onClick={() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
                alert('Profile saved successfully!');
              }} className="px-4 py-2 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] text-white rounded-lg hover:opacity-90 transition-opacity">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-t-lg"><h2 className="text-lg font-semibold text-white">Quick Access</h2></div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => (window.location.href = '/favorites')} className="p-4 rounded-lg border border-purple-200 hover:shadow-sm text-left">
            <div className="text-sm text-gray-500">Saved Recipes</div>
            <div className="text-2xl font-bold text-[#8F84C8]">{favoritesCount}</div>
          </button>
          <button onClick={() => (window.location.href = '/shopping-list')} className="p-4 rounded-lg border border-purple-200 hover:shadow-sm text-left">
            <div className="text-sm text-gray-500">Grocery Items</div>
            <div className="text-2xl font-bold text-[#8F84C8]">{shoppingCount}</div>
          </button>
          <div className="p-4 rounded-lg border border-purple-200 text-left">
            <div className="text-sm text-gray-500">Cooked Recipes</div>
            <div className="text-2xl font-bold text-[#8F84C8]">{history.length}</div>
          </div>
          <button onClick={() => (window.location.href = '/meal-plan')} className="p-4 rounded-lg border border-purple-200 hover:shadow-sm text-left">
            <div className="text-sm text-gray-500">Meal Plans</div>
            <div className="text-2xl font-bold text-[#8F84C8]">—</div>
          </button>
        </div>
      </div>

      {/* Cooking History & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-t-lg"><h2 className="text-lg font-semibold text-white">Cooking History</h2></div>
          <div className="p-4">
            {history.length === 0 ? (
              <div className="text-gray-600">No cooking history yet. Explore recipes and start cooking!
                <div className="mt-3"><button onClick={() => (window.location.href = '/search')} className="px-3 py-2 bg-gradient-to-r from-[#8F84C8] to-[#5A4A8B] text-white rounded-lg">Discover Recipes</button></div>
              </div>
            ) : (
              <ul className="space-y-2">
                {history.slice(0, 5).map((h) => (
                  <li key={`${h.id}-${h.date}`} className="flex justify-between text-sm">
                    <span className="text-gray-800">{h.title}</span>
                    <span className="text-gray-500">{new Date(h.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#A39BDE] to-[#5A4A8B] rounded-t-lg"><h2 className="text-lg font-semibold text-white">Achievements</h2></div>
          <div className="p-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-sm border ${history.length >= 1 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>Cooked 1</span>
            <span className={`px-3 py-1 rounded-full text-sm border ${history.length >= 5 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>Cooked 5</span>
            <span className={`px-3 py-1 rounded-full text-sm border ${history.length >= 10 ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>Cooked 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}