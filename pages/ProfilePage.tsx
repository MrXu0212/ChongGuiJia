
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { applicationsApi, favoritesApi } from '../services/api';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appData = await applicationsApi.getMine();
        setApplications(appData.applications || []);
      } catch { }
      setLoadingApps(false);

      try {
        const favData = await favoritesApi.list();
        setFavorites(favData.favorites || []);
      } catch { }
      setLoadingFavs(false);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const latestApp = applications.length > 0 ? applications[0] : null;

  const getStatusSteps = (status: string) => {
    const steps = [
      { label: '已申请', active: true, current: status === '待审核' },
      { label: '审核中', active: ['审核中', '线下面试', '已通过'].includes(status), current: status === '审核中' },
      { label: '线下面试', active: ['线下面试', '已通过'].includes(status), current: status === '线下面试' },
      { label: '成功领养', active: status === '已通过', current: status === '已通过' },
    ];
    return steps;
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background-light dark:bg-background-dark animate-fade-in relative pb-20 overflow-y-auto no-scrollbar">
      <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tight">个人中心</h1>
          <div className="flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-emerald-900/30 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-800 active:scale-90 transition-transform">
              <span className="material-icons-round text-slate-600 dark:text-emerald-400">settings</span>
            </button>
          </div>
        </div>
      </div>

      <main className="px-5 space-y-8 pb-10">
        {/* User Header */}
        <section className="flex flex-col items-center pt-4">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-emerald-900 shadow-xl overflow-hidden">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={user?.avatar_url || IMAGES.userAvatar}
              />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary w-8 h-8 rounded-full border-4 border-white dark:border-background-dark flex items-center justify-center cursor-pointer shadow-md active:scale-110 transition-transform">
              <span className="material-icons-round text-white text-[16px]">edit</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold">{user?.nickname || '用户'}</h2>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            <div className="mt-2 inline-block px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary font-bold text-xs rounded-full">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) + '加入' : '新用户'}
            </div>
          </div>
        </section>

        {/* Application Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">申请进度</h3>
            <span className="text-primary text-sm font-bold cursor-pointer">查看全部 ({applications.length})</span>
          </div>
          <div className="bg-white dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-50 dark:border-emerald-900/30 shadow-sm space-y-4">
            {loadingApps ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : latestApp ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      alt={latestApp.pets?.name || '宠物'}
                      className="w-full h-full object-cover"
                      src={latestApp.pets?.image_url || 'https://picsum.photos/seed/pet/100/100'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base">{latestApp.pets?.name || '未知'}</h4>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[11px] font-bold rounded">
                        {latestApp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {latestApp.pets?.breed} • {latestApp.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {getStatusSteps(latestApp.status).map((step, idx, arr) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-3 h-3 rounded-full transition-all duration-500 ${step.active ? 'bg-primary' : 'bg-slate-200 dark:bg-emerald-900'
                          } ${step.current ? 'ring-4 ring-primary/20' : ''}`}></div>
                        <span className={`text-[10px] mt-1 font-medium ${step.current ? 'font-bold text-primary' : 'text-slate-400'
                          }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className={`h-[2px] flex-1 mb-4 transition-all duration-500 ${step.active && arr[idx + 1].active ? 'bg-primary' : 'bg-slate-200 dark:bg-emerald-900'
                          }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-50 dark:border-emerald-900/20 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">
                    申请时间: {new Date(latestApp.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-bold">
                    总申请 ({applications.length})
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-4 gap-2">
                <span className="material-icons-round text-3xl text-slate-200">description</span>
                <p className="text-sm text-slate-400">暂无领养申请</p>
                <button
                  onClick={() => navigate('/discover')}
                  className="text-primary text-sm font-bold mt-1"
                >
                  去发现宠物 →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Favorites */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">我的收藏 ({favorites.length})</h3>
            <span className="text-primary text-sm font-bold cursor-pointer">全部</span>
          </div>
          {loadingFavs ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {favorites.slice(0, 4).map((fav: any) => (
                <div
                  key={fav.id}
                  onClick={() => navigate(`/pet/${fav.pet_id}`)}
                  className="bg-white dark:bg-emerald-900/10 rounded-2xl overflow-hidden shadow-sm border border-emerald-50 dark:border-emerald-900/30 group cursor-pointer active:scale-95 transition-all"
                >
                  <div className="h-32 relative">
                    <img
                      alt={fav.pets?.name || '宠物'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={fav.pets?.image_url || 'https://picsum.photos/seed/fav/200/200'}
                    />
                    <button className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-rose-500 shadow-sm">
                      <span className="material-icons-round text-[18px]">favorite</span>
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fav.pets?.name?.split(' ')[0] || '宠物'}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{fav.pets?.breed} • {fav.pets?.age}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-emerald-900/10 rounded-2xl p-8 border border-emerald-50 dark:border-emerald-900/30 flex flex-col items-center gap-2">
              <span className="material-icons-round text-3xl text-slate-200">favorite_border</span>
              <p className="text-sm text-slate-400">还未收藏任何宠物</p>
            </div>
          )}
        </section>

        {/* Account Settings */}
        <section className="space-y-3 pb-8">
          <h3 className="text-lg font-bold mb-4">账户设置</h3>
          <div className="bg-white dark:bg-emerald-900/10 rounded-2xl border border-emerald-50 dark:border-emerald-900/30 shadow-sm overflow-hidden divide-y divide-emerald-50 dark:divide-emerald-900/30">
            {[
              { label: '消息通知', icon: 'notifications', color: 'bg-blue-100 text-blue-600' },
              { label: '隐私与数据', icon: 'security', color: 'bg-purple-100 text-purple-600' },
              { label: '帮助与反馈', icon: 'help_outline', color: 'bg-orange-100 text-orange-600' }
            ].map(item => (
              <button key={item.label} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-emerald-900/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}>
                    <span className="material-icons-round text-[20px]">{item.icon}</span>
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
                </div>
                <span className="material-icons-round text-slate-400">chevron_right</span>
              </button>
            ))}
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 text-rose-500 font-bold border-2 border-rose-50 dark:border-rose-900/20 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
        >
          退出登录
        </button>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-50">
        <button
          onClick={() => navigate('/apply')}
          className="bg-primary text-slate-900 font-bold px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 group"
        >
          <span className="material-icons-round group-hover:rotate-90 transition-transform">add_circle</span>
          <span>发布领养</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
