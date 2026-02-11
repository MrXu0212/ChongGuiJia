
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'discover', label: '首页', icon: 'home', activeIcon: 'home', path: '/discover' },
    { id: 'favorite', label: '收藏', icon: 'favorite_border', activeIcon: 'favorite', path: '/favorites' },
    { id: 'message', label: '消息', icon: 'chat_bubble_outline', activeIcon: 'chat_bubble', path: '/message' },
    { id: 'profile', label: '我的', icon: 'person_outline', activeIcon: 'person', path: '/profile' },
  ];

  const getIsActive = (tab: typeof tabs[0]) => {
    return location.pathname === tab.path;
  };

  return (
    <nav className="h-20 bg-white/90 dark:bg-[#1a2b16]/90 backdrop-blur-lg border-t border-slate-100 dark:border-white/5 px-8 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive = getIsActive(tab);

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 transition-all duration-200 relative ${isActive ? 'text-primary' : 'text-slate-400'
              }`}
          >
            <span className="material-icons-round">
              {isActive ? tab.activeIcon : tab.icon}
            </span>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {tab.label}
            </span>
            {tab.id === 'message' && !isActive && (
              <span className="absolute -top-0.5 right-0 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-zinc-950"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
