-- =============================================
-- 宠归家 (PawsConnect) Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中执行此脚本
-- =============================================

-- 1. 用户资料表 (与 Supabase Auth 关联)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT DEFAULT '新用户',
  avatar_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 宠物信息表
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('公', '母')),
  weight TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '狗狗',
  is_vaccinated BOOLEAN DEFAULT FALSE,
  is_neutered BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  shelter_name TEXT DEFAULT '阳光爪爪救助站',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 领养申请表
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  housing_type TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  family_members TEXT DEFAULT '',
  work_schedule TEXT DEFAULT '',
  status TEXT DEFAULT '待审核' CHECK (status IN ('待审核', '审核中', '线下面试', '已通过', '已拒绝')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, pet_id)
);

-- 5. 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  sender_name TEXT NOT NULL,
  sender_avatar TEXT DEFAULT '',
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (行级安全) 策略
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles: 任何人可读，本人可改
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- pets: 任何人可读，登录用户可增
CREATE POLICY "pets_select" ON pets FOR SELECT USING (true);
CREATE POLICY "pets_insert" ON pets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- applications: 本人可读可增
CREATE POLICY "applications_select" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "applications_insert" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- favorites: 本人可读可增可删
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- messages: 收发双方可读，登录用户可发
CREATE POLICY "messages_select" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert" ON messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- 自动创建 profile 的触发器
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', '新用户'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 种子数据: 插入示例宠物
-- =============================================
INSERT INTO pets (name, breed, age, gender, weight, image_url, description, category, is_vaccinated, is_neutered, tags, shelter_name) VALUES
(
  '布鲁 (Blue)',
  '边境牧羊犬',
  '2 岁',
  '公',
  '18kg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBkvn3a8GOUDdE_N_zhV6Yx9Wc5J37aNba0fZ7ZFaMqxek_2WIRSI7gfXBkS_UQi8eJBhtF5vm1yMVCVPaKBDkNeOBiX5k-irweLCbPjDZflZvriMsjFGh6XxVVJR3GUknAZWx0ueaiBRClwraErrOjExCLDcouKz-SOUtHejDQePTe2-CJgU4t-I4QIrstHQYkrPZ3nMMs9oY28Sw1xgKgq4WUsqgZpcCtyRt88Dw8colhKGyXsvoDo77kY11lWhUWB_-ipOjrbIA',
  '布鲁是一只非常聪明的边牧，它已经掌握了基本的服从指令，非常适合有户外活动习惯的家庭。',
  '狗狗',
  TRUE,
  TRUE,
  ARRAY['对儿童友好', '活泼', '聪明'],
  '阳光爪爪救助站'
),
(
  '大白 (Dabai)',
  '拉布拉多',
  '4 个月',
  '母',
  '12kg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBA_i2f-s6lL9PsDSu1K9mmW-cbz71bvRwhXxg285ubHag3FyOaSHLF-IZuN_OevC7b7HEgsd5rlrnW-AO65xfKRQPN3oCOQZVNQ3deX-PkqXGyz0S_Bt5z492VMkjF0ATd1_PHHWaDzkzih8rFGQrOSPjJaKJexWC3FhkCNRCfYQUdaUarmMkPPkMLx2_z40MPKRxPZdP8nhDEjhMF8fw85as_9OLxFnNMpOzuONp_LLOp4BkiYFyZJYsqzJhd6simuVz9mwngbWc',
  '大白还是个宝宝，非常温顺，喜欢和人呆在一起。',
  '狗狗',
  FALSE,
  FALSE,
  ARRAY['温顺', '粘人'],
  '阳光爪爪救助站'
),
(
  '巴迪 (Buddy)',
  '金毛寻回犬',
  '2 岁',
  '公',
  '32kg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB7aanf2acIeGpDI_waiioYctAIQdW5c3o5GPKKa2xf2e99REHzuBCZ-wedApSu4iu5Y83hWBMOUlbv29vixteR5n9_5StM27JUraRdlFGqKf36NC8JJymH2tMZdE5pr2-qCZBiJg_4Km5ANSLRwYMtT5kDz-CjHI_zzmcTrgV2TlyAagloFup92hr8FpwKiGHrRgRhEJcWHaDo40chgwW2KRPQT4paOV3R1wqZq3ud-4MgjPqVafQld3wegmoLqKzk_TSOvlUJ6GM',
  '巴迪是一个充满快乐的小家伙，它最喜欢在阳光下睡午觉，或者玩捡球游戏直到你的胳膊累得动不了为止！',
  '狗狗',
  TRUE,
  TRUE,
  ARRAY['对儿童友好', '已接种疫苗', '定点如厕训练'],
  '阳光爪爪救助站'
),
(
  '咪咪 (Mimi)',
  '英国短毛猫',
  '1 岁',
  '母',
  '4kg',
  'https://picsum.photos/seed/cat1/400/400',
  '咪咪是一只优雅的英短，性格温顺安静，适合公寓家庭。',
  '猫咪',
  TRUE,
  TRUE,
  ARRAY['安静', '温顺', '适合公寓'],
  '阳光爪爪救助站'
),
(
  '小花 (Xiaohua)',
  '中华田园猫',
  '8 个月',
  '母',
  '3kg',
  'https://picsum.photos/seed/cat2/400/400',
  '小花活泼好动，喜欢玩耍，是个捉老鼠的小能手。',
  '猫咪',
  TRUE,
  FALSE,
  ARRAY['活泼', '好奇心强'],
  '阳光爪爪救助站'
),
(
  '雪球 (Snowball)',
  '垂耳兔',
  '6 个月',
  '公',
  '1.5kg',
  'https://picsum.photos/seed/rabbit1/400/400',
  '雪球毛茸茸的非常可爱，喜欢被抚摸，适合有小朋友的家庭。',
  '小兔子',
  TRUE,
  FALSE,
  ARRAY['可爱', '亲人', '对儿童友好'],
  '阳光爪爪救助站'
);
