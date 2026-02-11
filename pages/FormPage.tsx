
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IMAGES } from '../constants';
import { applicationsApi } from '../services/api';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId?: string }>();

  // 表单状态管理
  const [housingType, setHousingType] = useState('apartment');
  const [experience, setExperience] = useState('beginner');
  const [familyMembers, setFamilyMembers] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!petId) {
      setError('缺少宠物信息，请从宠物详情页申请');
      return;
    }
    if (!familyMembers.trim()) {
      setError('请填写家庭成员信息');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await applicationsApi.submit({
        pet_id: petId,
        housing_type: housingType === 'apartment' ? '公寓/楼房' : '别墅/独栋',
        experience: experience === 'beginner' ? '初次养宠' : '经验丰富',
        family_members: familyMembers,
        work_schedule: workSchedule
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 提交成功页面
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background-light dark:bg-background-dark animate-fade-in px-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-icons-round text-primary text-5xl">check_circle</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">申请已提交！</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8">
          我们会尽快审核您的领养申请，请留意消息通知。
        </p>
        <button
          onClick={() => navigate('/discover')}
          className="w-full bg-primary text-slate-900 font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          返回首页
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="w-full mt-3 text-primary font-bold py-4 rounded-2xl border-2 border-primary/20 active:scale-95 transition-all"
        >
          查看我的申请
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-fade-in relative pb-32 overflow-y-auto no-scrollbar">
      <header className="px-6 pt-12 pb-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-icons-round text-2xl">arrow_back_ios_new</span>
          </button>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">领养申请</span>
          <button onClick={() => navigate('/discover')} className="p-2 -mr-2 text-slate-400">
            <span className="material-icons-round text-2xl">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-full rounded-full transition-all duration-700 ease-out"></div>
        </div>

        <div className="mt-2">
          <h1 className="text-2xl font-bold tracking-tight">向我们介绍您的家庭</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">这有助于我们为您匹配最适合的宠物伙伴。</p>
        </div>
      </header>

      <section className="flex-1 px-6 py-4 space-y-8">
        {/* Housing */}
        <div className="space-y-4">
          <label className="text-sm font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">居住环境</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all group overflow-hidden">
              <input
                checked={housingType === 'apartment'}
                onChange={() => setHousingType('apartment')}
                className="hidden peer" name="housing" type="radio"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              <span className="material-icons-round text-3xl mb-2 text-slate-400 peer-checked:text-primary transition-colors">apartment</span>
              <span className="text-sm font-semibold">公寓/楼房</span>
            </label>
            <label className="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all group overflow-hidden">
              <input
                checked={housingType === 'house'}
                onChange={() => setHousingType('house')}
                className="hidden peer" name="housing" type="radio"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              <span className="material-icons-round text-3xl mb-2 text-slate-400 peer-checked:text-primary transition-colors">home</span>
              <span className="text-sm font-semibold">别墅/独栋</span>
            </label>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <label className="text-sm font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">养宠经验</label>
          <div className="space-y-3">
            <label className="flex items-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all relative overflow-hidden">
              <input
                checked={experience === 'beginner'}
                onChange={() => setExperience('beginner')}
                className="hidden peer" name="experience" type="radio"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <span className="material-icons-round">sentiment_satisfied_alt</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">初次养宠</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">我已经准备好学习如何照顾它了！</div>
              </div>
              <span className="material-icons-round text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
            </label>
            <label className="flex items-center p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer transition-all relative overflow-hidden">
              <input
                checked={experience === 'experienced'}
                onChange={() => setExperience('experienced')}
                className="hidden peer" name="experience" type="radio"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                <span className="material-icons-round">pets</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">经验丰富</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">我以前养过宠物，有相关经验</div>
              </div>
              <span className="material-icons-round text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
            </label>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <label className="text-sm font-bold tracking-wider text-slate-500 dark:text-slate-400 flex justify-between uppercase">
            <span>家庭成员</span>
            <span className="text-xs font-normal lowercase">(包括成人与儿童)</span>
          </label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">groups</span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary transition-all text-sm"
              placeholder="例如：2位成人，1位儿童"
              type="text"
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">工作时间</label>
          <div className="relative">
            <span className="material-icons-round absolute left-4 top-4 text-slate-400">schedule</span>
            <textarea
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-primary focus:border-primary transition-all text-sm resize-none"
              placeholder="请告知我们宠物每天独处的大约时长..."
              rows={3}
              value={workSchedule}
              onChange={(e) => setWorkSchedule(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
            <span className="material-icons-round text-base">error_outline</span>
            {error}
          </div>
        )}

        {/* Decorative Quote */}
        <div className="rounded-2xl overflow-hidden relative group h-40 shadow-sm border border-slate-100 dark:border-slate-800">
          <img
            alt="Dog in house"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            src={IMAGES.goldenForm}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <p className="text-white text-xs italic">"迎接新成员回家，是美好旅程的开始。"</p>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 w-full max-w-md p-6 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 z-50">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-[1] py-4 rounded-2xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:opacity-90 active:scale-95 transition-all"
          >
            返回
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-[2] py-4 rounded-2xl font-bold bg-primary text-slate-900 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                提交领养申请
                <span className="material-icons-round text-xl">pets</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default FormPage;
