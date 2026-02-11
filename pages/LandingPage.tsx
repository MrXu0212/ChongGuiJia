
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IMAGES, COLORS } from '../constants';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoggedIn } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 如果已登录，重定向到发现页
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/discover', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    if (!isLoginMode && password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email, password);
        navigate('/discover');
      } else {
        await register(email, password, nickname || undefined);
        // 如果注册后没有自动登录（需要邮箱验证），显示提示
        if (!isLoggedIn) {
          setSuccessMsg('注册成功！请前往邮箱点击验证链接，然后再登录');
          setIsLoginMode(true);
        } else {
          navigate('/discover');
        }
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        <img
          alt="Human hand holding a pet paw"
          className="w-full h-full object-cover"
          src={IMAGES.pawHero}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col px-8 pb-6 -mt-12 z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            欢迎来到宠归家
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm tracking-wide">
            给流浪的小生命一个温暖的家
          </p>
        </div>

        {/* 登录/注册表单 */}
        <div className="space-y-3">
          {/* 切换标签 */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 mb-2">
            <button
              onClick={() => { setIsLoginMode(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLoginMode
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400'
                }`}
            >
              登录
            </button>
            <button
              onClick={() => { setIsLoginMode(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLoginMode
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400'
                }`}
            >
              注册
            </button>
          </div>

          {/* 注册时显示昵称 */}
          {!isLoginMode && (
            <div className="relative">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">person</span>
              <input
                type="text"
                placeholder="昵称（选填）"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
            </div>
          )}

          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">email</span>
            <input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>

          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xl">lock</span>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
              <span className="material-icons-round text-base">error_outline</span>
              {error}
            </div>
          )}

          {/* 成功提示（如注册后需邮箱验证） */}
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2">
              <span className="material-icons-round text-base">check_circle</span>
              {successMsg}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full hover:opacity-90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 bg-primary"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-icons-round text-xl">
                  {isLoginMode ? 'login' : 'person_add'}
                </span>
                {isLoginMode ? '登录' : '注册'}
              </>
            )}
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-auto pt-4">
          <div className="flex flex-col items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                className="w-4 h-4 rounded text-primary focus:ring-primary border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
                type="checkbox"
                defaultChecked
              />
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                我已阅读并同意 <a className="text-primary hover:text-primary/80" href="#">用户协议</a> 和 <a className="text-primary hover:text-primary/80" href="#">隐私政策</a>
              </span>
            </label>
            <button className="text-xs text-zinc-400 dark:text-zinc-500 font-medium hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              遇到问题？联系客服
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Blur Elements */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-20 -left-10 w-32 h-32 bg-orange-400/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default LandingPage;
