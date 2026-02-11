
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../services/api';

interface FavPet {
    id: string;
    pet_id: string;
    pets: {
        id: string;
        name: string;
        breed: string;
        age: string;
        image_url: string;
        gender: string;
    } | null;
}

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<FavPet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await favoritesApi.list();
                setFavorites(data.favorites || []);
            } catch {
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemoveFav = async (petId: string) => {
        try {
            await favoritesApi.remove(petId);
            setFavorites(prev => prev.filter(f => f.pet_id !== petId));
        } catch (err) {
            console.error('取消收藏失败:', err);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-background-light dark:bg-background-dark animate-fade-in pb-20 overflow-y-auto no-scrollbar">
            <header className="px-6 pt-12 pb-4 sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">我的收藏</h1>
                    <span className="text-sm text-slate-400 font-medium">{favorites.length} 只宠物</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">你心仪的小伙伴都在这里</p>
            </header>

            <main className="flex-1 px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-slate-400">加载中...</span>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="material-icons-round text-4xl text-primary/40">favorite_border</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">还没有收藏任何宠物</p>
                        <button
                            onClick={() => navigate('/discover')}
                            className="bg-primary text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <span className="material-icons-round text-xl">pets</span>
                            去发现宠物
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {favorites.map((fav) => (
                            <div
                                key={fav.id}
                                className="bg-white dark:bg-emerald-900/10 rounded-2xl overflow-hidden shadow-sm border border-slate-50 dark:border-emerald-900/30 group cursor-pointer active:scale-[0.97] transition-all"
                            >
                                <div
                                    className="h-40 relative"
                                    onClick={() => navigate(`/pet/${fav.pet_id}`)}
                                >
                                    <img
                                        alt={fav.pets?.name || '宠物'}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        src={fav.pets?.image_url || 'https://picsum.photos/seed/fav/200/200'}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFav(fav.pet_id);
                                        }}
                                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-rose-500 shadow-sm hover:bg-white transition-colors active:scale-90"
                                    >
                                        <span className="material-icons-round text-[18px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-3" onClick={() => navigate(`/pet/${fav.pet_id}`)}>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                        {fav.pets?.name?.split(' ')[0] || '宠物'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        {fav.pets?.breed} • {fav.pets?.age}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;
