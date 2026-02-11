
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { messagesApi } from '../services/api';

interface Chat {
  id: string;
  sender_name: string;
  sender_avatar: string;
  last_message: string;
  time: string;
  unread: number;
}

// 示例消息数据（当 API 没有数据时使用）
const DEMO_CHATS: Chat[] = [
  {
    id: '1',
    sender_name: '巴迪 (Buddy)',
    sender_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGYEnjibkybhPYnuWRT4KNEmjUkr1AA2Kwp6O0OaM1mGMoUSbSA5B6aB-6zQaf40KecjVOdEu63vx8Jb6Fr5CELNt4_IM5rb74xvVgC7qxgH1sYAa1q05qPtaeBeFVh_soqVSlq9ZjR43neX0jWLhCCI6pfZAgiYDS5m0F3cEXjglD57B-aoN1678rFb4uUajzjDTJREaL-TpqLHIguKbBSz2aGNFnGseE7TRpWhtlCQDN4jkuvRQmbVy-lugeQEsm4QVr2CeDhpk',
    last_message: '你好，巴迪还在等领养吗？我很想带它回家...',
    time: '10:15',
    unread: 1,
  },
  {
    id: '2',
    sender_name: '露娜 (Luna)',
    sender_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBM4iJ-enBAd13aCBF6fAXEls77CDw6Moy7UJXT0nATNvb_nunzx_3RerQRhRQ1ghaJt7pOnTSuhLFIOxcWzFdsSPV3x036wdJ5qnzqRQYjgXtaZnV0cs7m0Q3P3ndjuKO6uigl__xawiy9wAMXTtVt8JpBrCilQuRMmq1l26jrBvqW-4ivgjnaeDuY0kRoafVjAZ-n71KeAGMa59HIUpyl3qn8WRUEsXmMlMeVzWD852e-nxM2-LixQC0R8dfGp89CuN1KUrW3iJo',
    last_message: '疫苗接种记录已经为您准备好了，请查收。',
    time: '昨天',
    unread: 0,
  },
  {
    id: '3',
    sender_name: '阳光爪爪救助站',
    sender_avatar: 'https://picsum.photos/seed/shelter/100/100',
    last_message: '感谢您的爱心捐赠，收据已发送。',
    time: '星期二',
    unread: 0,
  },
  {
    id: '4',
    sender_name: '麦克斯 (Max)',
    sender_avatar: 'https://picsum.photos/seed/max/100/100',
    last_message: '他今天刚刚打完疫苗！状态非常好。',
    time: '周一',
    unread: 0,
  },
  {
    id: '5',
    sender_name: '克洛弗 (Clover)',
    sender_avatar: 'https://picsum.photos/seed/clover/100/100',
    last_message: '领养审核已经通过，期待您的正式到访。',
    time: '1月20日',
    unread: 0,
  }
];

const MessagePage: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await messagesApi.list();
        if (data.chats && data.chats.length > 0) {
          setChats(data.chats.map((chat: any) => ({
            id: chat.id,
            sender_name: chat.sender_name,
            sender_avatar: chat.sender_avatar || 'https://picsum.photos/seed/user/100/100',
            last_message: chat.last_message,
            time: new Date(chat.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
            unread: chat.unread || 0,
          })));
        } else {
          // 使用示例数据
          setChats(DEMO_CHATS);
        }
      } catch {
        // API 失败时使用示例数据
        setChats(DEMO_CHATS);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a2b16] animate-fade-in relative overflow-hidden">
      <header className="px-6 pt-12 pb-4 space-y-4 bg-white dark:bg-[#1a2b16] sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">消息中心</h1>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-white/10 active:scale-90 transition-transform">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">settings</span>
          </button>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            className="w-full h-11 pl-12 pr-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 placeholder-slate-400"
            placeholder="搜索联系人或宠物姓名"
            type="text"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 no-scrollbar pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="py-4 flex items-center gap-4 active:bg-slate-50 dark:active:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    alt={chat.sender_name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                    src={chat.sender_avatar}
                  />
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-[#1a2b16] rounded-full flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold">{chat.unread}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-base truncate text-slate-900 dark:text-white">{chat.sender_name}</h3>
                    <span className={`text-[11px] ${chat.unread > 0 ? 'text-primary font-bold' : 'text-slate-400 font-medium'}`}>
                      {chat.time}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                    {chat.last_message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Decorative Blur Elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
};

export default MessagePage;
