
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { petsApi, favoritesApi } from '../services/api';

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
  shelter_name?: string;
}

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      try {
        const data = await petsApi.getById(id);
        setPet(data.pet);
      } catch (err) {
        console.error('加载宠物详情失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  // 检查是否已收藏
  useEffect(() => {
    const checkFav = async () => {
      try {
        const data = await favoritesApi.list();
        const favIds = (data.favorites || []).map((f: any) => f.pet_id);
        setIsFavorited(favIds.includes(id));
      } catch { }
    };
    if (id) checkFav();
  }, [id]);

  const toggleFavorite = async () => {
    if (!id || favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorited) {
        await favoritesApi.remove(id);
        setIsFavorited(false);
      } else {
        await favoritesApi.add(id);
        setIsFavorited(true);
      }
    } catch (err: any) {
      console.error('收藏操作失败:', err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-slate-500">加载中...</span>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-slate-900 gap-4">
        <span className="material-icons-round text-6xl text-slate-300">pets</span>
        <p className="text-slate-500">宠物信息不存在</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold">返回</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900 animate-fade-in pb-32 overflow-y-auto no-scrollbar relative">
      {/* Header Image */}
      <div className="relative h-[450px] w-full shrink-0">
        <img
          alt={pet.name}
          className="w-full h-full object-cover"
          src={pet.image_url}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all"
          >
            <span className="material-icons-round text-2xl">chevron_left</span>
          </button>
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-all"
          >
            <span className={`material-icons-round ${isFavorited ? 'text-rose-500' : 'text-white'}`}>
              {isFavorited ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
          <div className="w-2 h-2 rounded-full bg-white/50"></div>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 bg-white dark:bg-slate-900 -mt-8 rounded-t-3xl relative px-6 pt-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{pet.name}</h1>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {pet.is_vaccinated && (
              <div className="bg-primary/20 text-green-700 dark:text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                <span className="material-icons text-xs mr-1">verified</span>
                已接种疫苗
              </div>
            )}
            {pet.is_neutered && (
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center">
                <span className="material-icons text-xs mr-1">content_cut</span>
                已绝育
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8">
          <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-24 flex flex-col items-center border border-slate-100 dark:border-slate-700">
            <span className="text-primary font-bold text-lg leading-tight">{pet.age}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">年龄</span>
          </div>
          <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-24 flex flex-col items-center border border-slate-100 dark:border-slate-700">
            <span className="text-primary font-bold text-lg leading-tight">{pet.gender}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">性别</span>
          </div>
          <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-24 flex flex-col items-center border border-slate-100 dark:border-slate-700">
            <span className="text-primary font-bold text-lg leading-tight">{pet.weight}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">体重</span>
          </div>
          <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-24 flex flex-col items-center border border-slate-100 dark:border-slate-700">
            <span className="text-primary font-bold text-lg leading-tight truncate w-full text-center">{pet.breed}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs">品种</span>
          </div>
        </div>

        {/* Institution Info */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-8 flex items-center justify-between border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <img
              alt="Shelter staff"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              src="https://picsum.photos/seed/staff/100/100"
            />
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tight">发布机构</p>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white">{pet.shelter_name || '阳光爪爪救助站'}</h4>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
            <span className="material-icons-round text-xl">chat_bubble</span>
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">关于 {pet.name.split(' ')[0]}</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            {pet.description}
          </p>
          {pet.tags && pet.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {pet.tags.map(tag => (
                <span key={tag} className="bg-primary/10 text-green-700 dark:text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Health */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">健康与医疗</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="material-icons-round text-primary text-lg">medical_services</span>
              <span>{pet.is_vaccinated ? '所有疫苗接种均已更新至最新状态' : '疫苗接种尚未完成'}</span>
            </div>
            {pet.is_neutered && (
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="material-icons-round text-primary text-lg">sanitizer</span>
                <span>已完成绝育手术</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 z-50">
        <button
          onClick={() => navigate(`/apply/${pet.id}`)}
          className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-icons-round">pets</span>
          申请领养
        </button>
      </div>
    </div>
  );
};

export default PetDetailPage;
