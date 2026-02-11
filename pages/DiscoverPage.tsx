
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { petsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  image_url: string;
  description: string;
  category: string;
  is_vaccinated: boolean;
  is_neutered: boolean;
  tags: string[];
}

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = [
    { name: '全部', icon: 'apps', emoji: '🌟' },
    { name: '狗狗', icon: 'pets', emoji: '🐶' },
    { name: '猫咪', icon: 'pets', emoji: '🐱' },
    { name: '小兔子', icon: 'pets', emoji: '🐰' },
    { name: '小鸟', icon: 'pets', emoji: '🐦' },
    { name: '其他', icon: 'more_horiz', emoji: '' },
  ];

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const params: { category?: string; search?: string } = {};
      if (activeCategory !== '全部') {
        params.category = activeCategory;
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      const data = await petsApi.list(params);
      setPets(data.pets || []);
    } catch (err) {
      console.error('加载宠物数据失败:', err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // 搜索防抖
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in pb-20 overflow-y-auto no-scrollbar">
      <header className="px-6 pt-12 pb-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">发现宠物</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">寻找你最合拍的新伙伴</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden shadow-sm cursor-pointer" onClick={() => navigate('/profile')}>
            <img
              alt="User profile"
              className="w-full h-full object-cover rounded-full"
              src={user?.avatar_url || IMAGES.userAvatar}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-slate-100"
              placeholder="搜索宠物名称、品种..."
              type="text"
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <button
            onClick={() => fetchPets()}
            className="bg-secondary text-white p-4 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-icons-round">tune</span>
          </button>
        </div>

        {/* Banner Card */}
        <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-8 bg-secondary/10 group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-transparent z-10"></div>
          <div className="relative z-20 p-6 flex flex-col justify-center h-full max-w-[65%]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">收养代替购买，拯救一个小生命</h2>
            <p className="text-sm mt-2 text-slate-700 dark:text-slate-200">本周有{pets.length}+新伙伴在等你！</p>
          </div>
          <img
            alt="Happy dog"
            className="absolute right-0 top-0 h-full w-1/2 object-cover transition-transform duration-500 group-hover:scale-110"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBA9mwsDfPqEHK4a4MQaSuR6ueexFgvuaW43rZZ4zci03pzerr4u2y4RzLsNb9jBzGFrDiwbRn2TJ4hD0CpYfV3svxBx-_-tV34hzWqQUEU2ddvgYCCEl3Ba58ftTzPqDBDZBwVzF9Tv3gWHBnLLibCw6d6l9mai6xYI1159iUUbmpOacm1NS7ebIE-Q4NUa2K5l9jp-yGxXSLDJLWSKi58rPlr9fB3gRVUTcXRKzuSeA49HccUw057p0S9xGrdRqxvEdUHl2Eihyk"
          />
        </div>
      </header>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex justify-between items-center px-6 mb-4">
          <h3 className="font-bold text-lg">宠物分类</h3>
        </div>
        <div className="flex overflow-x-auto gap-4 px-6 no-scrollbar pb-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeCategory === cat.name
                ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                : 'bg-white dark:bg-slate-800 text-slate-400 shadow-sm'
                }`}>
                {cat.emoji ? (
                  <span className="text-3xl">{cat.emoji}</span>
                ) : (
                  <span className="material-icons-round text-3xl">{cat.icon}</span>
                )}
              </div>
              <span className={`text-sm ${activeCategory === cat.name ? 'font-bold text-secondary' : 'font-medium text-slate-500'}`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="px-6 flex-1 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">为你推荐</h3>
          <span className="text-slate-400 text-sm">共有 {pets.length} 只宠物</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-slate-400">加载中...</span>
          </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className="material-icons-round text-6xl text-slate-200 dark:text-slate-700">pets</span>
            <span className="text-sm text-slate-400">暂无宠物数据</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => navigate(`/pet/${pet.id}`)}
                className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700/50 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img alt={pet.name} className="w-full h-full object-cover" src={pet.image_url} />
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                    <span className="material-icons-round text-sm">favorite_border</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 pb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">{pet.name.split(' ')[0]}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{pet.age} • {pet.gender}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DiscoverPage;
